using GeoServ.Api.Domain.Entities;
using GeoServ.Api.Endpoints;
using GeoServ.Api.Infrastructure.Data;
using GeoServ.Api.Infrastructure.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging.Abstractions;
using Xunit;

namespace GeoServ.Api.Tests;

public class PasswordRecoveryTests
{
    private class FakeMailer : IMailerService
    {
        public List<(string Email, string Token)> Sent { get; } = new();
        public bool ShouldFail { get; set; }

        public Task<EmailMessage> PreparePasswordRecoveryEmailAsync(string toEmail, string resetToken)
        {
            if (ShouldFail) throw new InvalidOperationException("SMTP incompleto");
            Sent.Add((toEmail, resetToken));
            return Task.FromResult(new EmailMessage("smtp.test", 587, "u", "p", "from@test", toEmail, "Asunto", "<p>Hola</p>"));
        }
    }

    private class FakeQueue : IEmailQueue
    {
        public List<EmailMessage> Enqueued { get; } = new();
        public void Enqueue(EmailMessage email) => Enqueued.Add(email);
    }

    private class FakeSender : IEmailSender
    {
        public List<EmailMessage> Delivered { get; } = new();
        public bool ShouldFail { get; set; }

        public Task SendAsync(EmailMessage email, CancellationToken cancellationToken)
        {
            if (ShouldFail) throw new Exception("Conexión SMTP bloqueada");
            Delivered.Add(email);
            return Task.CompletedTask;
        }
    }

    private class FakeConfigService : IEmpresaConfiguracionService
    {
        public Dictionary<string, string> Smtp { get; set; } = new();
        public Task<string?> GetValueAsync(string key) => Task.FromResult<string?>(null);
        public Task SetValueAsync(string key, string value, string valueType = "string", string? description = null, string group = "General") => Task.CompletedTask;
        public Task<Dictionary<string, string>> GetSmtpConfigAsync() => Task.FromResult(Smtp);
    }

    private class FakeAppConfig : Microsoft.Extensions.Configuration.IConfiguration
    {
        private readonly Dictionary<string, string?> _values = new();
        public string? this[string key] { get => _values.GetValueOrDefault(key); set => _values[key] = value; }
        public IEnumerable<Microsoft.Extensions.Configuration.IConfigurationSection> GetChildren() => Enumerable.Empty<Microsoft.Extensions.Configuration.IConfigurationSection>();
        public Microsoft.Extensions.Primitives.IChangeToken GetReloadToken() => throw new NotSupportedException();
        public Microsoft.Extensions.Configuration.IConfigurationSection GetSection(string key) => throw new NotSupportedException();
    }

    private class CapturingHandler : HttpMessageHandler
    {
        public HttpRequestMessage? Request { get; private set; }
        public string? Body { get; private set; }
        public System.Net.HttpStatusCode Status { get; set; } = System.Net.HttpStatusCode.Created;
        public string ResponseBody { get; set; } = "{\"messageId\":\"x\"}";

        protected override async Task<HttpResponseMessage> SendAsync(HttpRequestMessage request, CancellationToken cancellationToken)
        {
            Request = request;
            Body = request.Content == null ? null : await request.Content.ReadAsStringAsync(cancellationToken);
            return new HttpResponseMessage(Status) { Content = new StringContent(ResponseBody) };
        }
    }

    private class FakeTenantService : ITenantService
    {
        public string GetTenantId() => "geocobre";
        public string GetConnectionString() => "";
    }

    private class FakeLimiter : IPasswordRecoveryRateLimiter
    {
        public bool Allow { get; set; } = true;

        public bool TryAcquire(string ip, string email, out TimeSpan retryAfter)
        {
            retryAfter = Allow ? TimeSpan.Zero : TimeSpan.FromMinutes(10);
            return Allow;
        }
    }

    private class FakeTime : TimeProvider
    {
        public DateTimeOffset Now { get; set; } = new(2026, 9, 20, 12, 0, 0, TimeSpan.Zero);
        public override DateTimeOffset GetUtcNow() => Now;
    }

    private GeoServDbContext CreateContext()
    {
        var options = new DbContextOptionsBuilder<GeoServDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;
        return new GeoServDbContext(options);
    }

    private async Task<User> SeedUserAsync(GeoServDbContext context, string email = "user@geoserv.com", bool active = true)
    {
        var user = new User
        {
            Id = Guid.NewGuid(),
            Name = "Usuario",
            Email = email,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("ClaveAntigua1"),
            IsActive = active,
            RefreshToken = "refresh-vigente",
            RefreshTokenExpiryTime = DateTime.UtcNow.AddDays(7),
            CreatedAt = DateTime.UtcNow
        };
        context.Users.Add(user);
        await context.SaveChangesAsync();
        return user;
    }

    private static void AssertOk(IResult result)
    {
        var status = Assert.IsAssignableFrom<IStatusCodeHttpResult>(result);
        Assert.Equal(StatusCodes.Status200OK, status.StatusCode);
    }

    private FakeQueue _queue = new();

    private Task<IResult> Recover(string email, GeoServDbContext context, FakeMailer mailer, FakeLimiter? limiter = null, HttpContext? http = null)
        => PasswordRecoveryEndpoints.RecoverAsync(
            new RecoverPasswordRequest { Email = email },
            context, mailer, _queue, limiter ?? new FakeLimiter(), http ?? new DefaultHttpContext(),
            NullLogger<RecoverPasswordRequest>.Instance);

    // ---------- recover-password ----------

    [Fact]
    public async Task Recover_ExistingUser_StoresOnlyHashAndSendsEmail()
    {
        using var context = CreateContext();
        var user = await SeedUserAsync(context);
        var mailer = new FakeMailer();

        var result = await Recover("USER@geoserv.com ", context, mailer);

        AssertOk(result);
        var sent = Assert.Single(mailer.Sent);
        Assert.Equal("user@geoserv.com", sent.Email);
        Assert.Equal("user@geoserv.com", Assert.Single(_queue.Enqueued).To);

        var stored = await context.PasswordResetTokens.SingleAsync();
        Assert.Equal(user.Id, stored.UserId);
        Assert.NotEqual(sent.Token, stored.TokenHash);
        Assert.Equal(PasswordRecoveryEndpoints.HashToken(sent.Token), stored.TokenHash);
        Assert.Null(stored.UsedAt);
        Assert.InRange(stored.ExpiresAt, DateTime.UtcNow.AddMinutes(29), DateTime.UtcNow.AddMinutes(31));
    }

    [Fact]
    public async Task Recover_UnknownEmail_ReturnsSameNeutralResponse_WithoutSideEffects()
    {
        using var context = CreateContext();
        await SeedUserAsync(context);
        var mailer = new FakeMailer();

        var known = await Recover("user@geoserv.com", context, mailer);
        var unknown = await Recover("nadie@geoserv.com", context, mailer);

        Assert.Equal(known.GetType(), unknown.GetType());
        Assert.Single(mailer.Sent);
        Assert.Equal(1, await context.PasswordResetTokens.CountAsync());
    }

    [Fact]
    public async Task Recover_InactiveUser_DoesNotSendEmail()
    {
        using var context = CreateContext();
        await SeedUserAsync(context, active: false);
        var mailer = new FakeMailer();

        await Recover("user@geoserv.com", context, mailer);

        Assert.Empty(mailer.Sent);
        Assert.Empty(_queue.Enqueued);
        Assert.Empty(context.PasswordResetTokens);
    }

    [Fact]
    public async Task Recover_SecondRequest_InvalidatesPreviousToken()
    {
        using var context = CreateContext();
        await SeedUserAsync(context);
        var mailer = new FakeMailer();

        await Recover("user@geoserv.com", context, mailer);
        await Recover("user@geoserv.com", context, mailer);

        var first = await PasswordRecoveryEndpoints.ResetAsync(
            new ResetPasswordRequest { Token = mailer.Sent[0].Token, NewPassword = "NuevaClave1" }, context);
        var problem = Assert.IsType<ProblemHttpResult>(first);
        Assert.Equal(StatusCodes.Status400BadRequest, problem.StatusCode);

        var second = await PasswordRecoveryEndpoints.ResetAsync(
            new ResetPasswordRequest { Token = mailer.Sent[1].Token, NewPassword = "NuevaClave1" }, context);
        AssertOk(second);
    }

    [Fact]
    public async Task Recover_MailFailure_StillReturnsNeutralResponse()
    {
        using var context = CreateContext();
        await SeedUserAsync(context);
        var mailer = new FakeMailer { ShouldFail = true };

        var result = await Recover("user@geoserv.com", context, mailer);

        AssertOk(result);
        Assert.Empty(_queue.Enqueued);
    }

    [Fact]
    public async Task Recover_RateLimited_Returns429WithRetryAfter()
    {
        using var context = CreateContext();
        await SeedUserAsync(context);
        var mailer = new FakeMailer();
        var http = new DefaultHttpContext();

        var result = await Recover("user@geoserv.com", context, mailer, new FakeLimiter { Allow = false }, http);

        var problem = Assert.IsType<ProblemHttpResult>(result);
        Assert.Equal(StatusCodes.Status429TooManyRequests, problem.StatusCode);
        Assert.Equal("600", http.Response.Headers["Retry-After"].ToString());
        Assert.Empty(mailer.Sent);
    }

    [Fact]
    public async Task Recover_EmptyEmail_Returns400()
    {
        using var context = CreateContext();
        var result = await Recover("  ", context, new FakeMailer());

        var problem = Assert.IsType<ProblemHttpResult>(result);
        Assert.Equal(StatusCodes.Status400BadRequest, problem.StatusCode);
    }

    // ---------- reset-password ----------

    private async Task<(User user, string token)> IssueTokenAsync(GeoServDbContext context, TimeSpan? lifetime = null)
    {
        var user = await SeedUserAsync(context);
        var raw = Guid.NewGuid().ToString("N");
        context.PasswordResetTokens.Add(new PasswordResetToken
        {
            Id = Guid.NewGuid(),
            UserId = user.Id,
            TokenHash = PasswordRecoveryEndpoints.HashToken(raw),
            CreatedAt = DateTime.UtcNow,
            ExpiresAt = DateTime.UtcNow.Add(lifetime ?? TimeSpan.FromMinutes(30))
        });
        await context.SaveChangesAsync();
        return (user, raw);
    }

    [Fact]
    public async Task Reset_ValidToken_ChangesPassword_MarksUsed_AndRevokesRefreshToken()
    {
        using var context = CreateContext();
        var (user, token) = await IssueTokenAsync(context);

        var result = await PasswordRecoveryEndpoints.ResetAsync(
            new ResetPasswordRequest { Token = token, NewPassword = "NuevaClave1" }, context);

        AssertOk(result);
        var updated = await context.Users.SingleAsync(u => u.Id == user.Id);
        Assert.True(BCrypt.Net.BCrypt.Verify("NuevaClave1", updated.PasswordHash));
        Assert.Null(updated.RefreshToken);
        Assert.NotNull((await context.PasswordResetTokens.SingleAsync()).UsedAt);
    }

    [Fact]
    public async Task Reset_ReusedToken_Returns400_AndKeepsPassword()
    {
        using var context = CreateContext();
        var (user, token) = await IssueTokenAsync(context);
        await PasswordRecoveryEndpoints.ResetAsync(new ResetPasswordRequest { Token = token, NewPassword = "NuevaClave1" }, context);

        var result = await PasswordRecoveryEndpoints.ResetAsync(
            new ResetPasswordRequest { Token = token, NewPassword = "OtraClave99" }, context);

        var problem = Assert.IsType<ProblemHttpResult>(result);
        Assert.Equal(StatusCodes.Status400BadRequest, problem.StatusCode);
        var updated = await context.Users.SingleAsync(u => u.Id == user.Id);
        Assert.True(BCrypt.Net.BCrypt.Verify("NuevaClave1", updated.PasswordHash));
    }

    [Fact]
    public async Task Reset_ExpiredToken_Returns400_AndKeepsPassword()
    {
        using var context = CreateContext();
        var (user, token) = await IssueTokenAsync(context, TimeSpan.FromMinutes(-1));

        var result = await PasswordRecoveryEndpoints.ResetAsync(
            new ResetPasswordRequest { Token = token, NewPassword = "NuevaClave1" }, context);

        var problem = Assert.IsType<ProblemHttpResult>(result);
        Assert.Equal(StatusCodes.Status400BadRequest, problem.StatusCode);
        var updated = await context.Users.SingleAsync(u => u.Id == user.Id);
        Assert.True(BCrypt.Net.BCrypt.Verify("ClaveAntigua1", updated.PasswordHash));
    }

    [Fact]
    public async Task Reset_UnknownToken_Returns400()
    {
        using var context = CreateContext();
        await SeedUserAsync(context);

        var result = await PasswordRecoveryEndpoints.ResetAsync(
            new ResetPasswordRequest { Token = "inventado", NewPassword = "NuevaClave1" }, context);

        var problem = Assert.IsType<ProblemHttpResult>(result);
        Assert.Equal(StatusCodes.Status400BadRequest, problem.StatusCode);
    }

    [Fact]
    public async Task Reset_ShortPassword_Returns400_AndDoesNotConsumeToken()
    {
        using var context = CreateContext();
        var (_, token) = await IssueTokenAsync(context);

        var result = await PasswordRecoveryEndpoints.ResetAsync(
            new ResetPasswordRequest { Token = token, NewPassword = "123" }, context);

        var problem = Assert.IsType<ProblemHttpResult>(result);
        Assert.Equal(StatusCodes.Status400BadRequest, problem.StatusCode);
        Assert.Null((await context.PasswordResetTokens.SingleAsync()).UsedAt);
    }

    // ---------- cola de correo en segundo plano ----------

    private static EmailMessage SampleEmail() =>
        new("smtp.test", 587, "u", "p", "from@test", "to@test", "Asunto", "<p>Hola</p>");

    [Fact]
    public async Task EmailQueue_ProcessAsync_DeliversEmailThroughSender()
    {
        var sender = new FakeSender();
        var queue = new EmailQueueService(sender, NullLogger<EmailQueueService>.Instance);

        await queue.ProcessAsync(SampleEmail(), CancellationToken.None);

        Assert.Single(sender.Delivered);
    }

    [Fact]
    public async Task EmailQueue_ProcessAsync_SwallowsSenderErrors()
    {
        var sender = new FakeSender { ShouldFail = true };
        var queue = new EmailQueueService(sender, NullLogger<EmailQueueService>.Instance);

        var ex = await Record.ExceptionAsync(() => queue.ProcessAsync(SampleEmail(), CancellationToken.None));

        Assert.Null(ex);
    }

    [Fact]
    public async Task EmailQueue_BackgroundLoop_SendsEnqueuedEmailsAndSurvivesFailures()
    {
        var sender = new FakeSender { ShouldFail = true };
        var queue = new EmailQueueService(sender, NullLogger<EmailQueueService>.Instance);
        using var cts = new CancellationTokenSource();

        await queue.StartAsync(cts.Token);
        queue.Enqueue(SampleEmail());           // falla, pero no debe detener el ciclo
        sender.ShouldFail = false;
        queue.Enqueue(SampleEmail());

        for (var i = 0; i < 50 && sender.Delivered.Count == 0; i++) await Task.Delay(50);
        await queue.StopAsync(CancellationToken.None);

        Assert.NotEmpty(sender.Delivered);
    }

    // ---------- preparación del correo ----------

    [Fact]
    public async Task Mailer_Prepare_ThrowsWithMissingKeysWhenSmtpIncomplete()
    {
        var config = new FakeConfigService { Smtp = new() { ["smtp_host"] = "smtp.gmail.com" } };
        var mailer = new MailerService(config, new FakeTenantService(), new FakeAppConfig());

        var ex = await Assert.ThrowsAsync<InvalidOperationException>(() => mailer.PreparePasswordRecoveryEmailAsync("a@b.com", "tok"));

        Assert.Contains("smtp_port", ex.Message);
        Assert.Contains("geocobre", ex.Message);
        Assert.DoesNotContain("smtp_host", ex.Message);
    }

    [Fact]
    public async Task Mailer_Prepare_BuildsMessageWithTenantLink()
    {
        var config = new FakeConfigService
        {
            Smtp = new()
            {
                ["smtp_host"] = "smtp.gmail.com", ["smtp_port"] = "587", ["smtp_user"] = "u",
                ["smtp_password"] = "p", ["smtp_from"] = "noreply@geoserv.com"
            }
        };
        var appConfig = new FakeAppConfig { ["App:FrontendBaseUrl"] = "https://{tenant}.geoserv.com" };
        var mailer = new MailerService(config, new FakeTenantService(), appConfig);

        var email = await mailer.PreparePasswordRecoveryEmailAsync("a@b.com", "tok");

        Assert.Equal("smtp.gmail.com", email.Host);
        Assert.Equal(587, email.Port);
        Assert.Equal("a@b.com", email.To);
        Assert.Contains("https://geocobre.geoserv.com/reset-password?tenant=geocobre&token=tok", email.HtmlBody);
    }

    // ---------- Brevo (API HTTP) ----------

    [Fact]
    public async Task Brevo_Send_PostsExpectedRequest()
    {
        var handler = new CapturingHandler();
        var sender = new BrevoEmailSender(new FakeAppConfig { ["Brevo:ApiKey"] = "clave-secreta" }, handler);

        await sender.SendAsync(SampleEmail(), CancellationToken.None);

        Assert.Equal(HttpMethod.Post, handler.Request!.Method);
        Assert.Equal(BrevoEmailSender.Endpoint, handler.Request.RequestUri!.ToString());
        Assert.Equal("clave-secreta", handler.Request.Headers.GetValues("api-key").Single());
        Assert.Contains("\"email\":\"from@test\"", handler.Body);
        Assert.Contains("\"email\":\"to@test\"", handler.Body);
        Assert.Contains("\"subject\":\"Asunto\"", handler.Body);
    }

    [Fact]
    public async Task Brevo_Send_ThrowsWithApiErrorDetail_WithoutLeakingApiKey()
    {
        var handler = new CapturingHandler { Status = System.Net.HttpStatusCode.BadRequest, ResponseBody = "{\"message\":\"sender not valid\"}" };
        var sender = new BrevoEmailSender(new FakeAppConfig { ["Brevo:ApiKey"] = "clave-secreta" }, handler);

        var ex = await Assert.ThrowsAsync<HttpRequestException>(() => sender.SendAsync(SampleEmail(), CancellationToken.None));

        Assert.Contains("400", ex.Message);
        Assert.Contains("sender not valid", ex.Message);
        Assert.DoesNotContain("clave-secreta", ex.Message);
    }

    [Fact]
    public void ConfiguredSender_UsesBrevo_OnlyWhenApiKeyIsPresent()
    {
        Assert.True(ConfiguredEmailSender.UsesBrevo(new FakeAppConfig { ["Brevo:ApiKey"] = "k" }));
        Assert.False(ConfiguredEmailSender.UsesBrevo(new FakeAppConfig()));
        Assert.False(ConfiguredEmailSender.UsesBrevo(new FakeAppConfig { ["Brevo:ApiKey"] = "  " }));
    }

    [Fact]
    public async Task Mailer_Prepare_WithBrevo_OnlyRequiresSmtpFrom()
    {
        var config = new FakeConfigService { Smtp = new() { ["smtp_from"] = "cristianormeno@gmail.com" } };
        var mailer = new MailerService(config, new FakeTenantService(), new FakeAppConfig { ["Brevo:ApiKey"] = "k" });

        var email = await mailer.PreparePasswordRecoveryEmailAsync("a@b.com", "tok");

        Assert.Equal("cristianormeno@gmail.com", email.From);
        Assert.Equal("a@b.com", email.To);
    }

    // ---------- rate limiter ----------

    [Fact]
    public void RateLimiter_BlocksAfterEmailLimit_AndReleasesAfterWindow()
    {
        var time = new FakeTime();
        var limiter = new PasswordRecoveryRateLimiter(time);

        for (var i = 0; i < PasswordRecoveryRateLimiter.MaxPerEmail; i++)
            Assert.True(limiter.TryAcquire("1.1.1.1", "a@b.com", out _));

        Assert.False(limiter.TryAcquire("1.1.1.1", "A@b.com", out var retry));
        Assert.True(retry > TimeSpan.Zero);

        time.Now += PasswordRecoveryRateLimiter.Window + TimeSpan.FromSeconds(1);
        Assert.True(limiter.TryAcquire("1.1.1.1", "a@b.com", out _));
    }

    [Fact]
    public void RateLimiter_BlocksAfterIpLimit_AcrossDifferentEmails()
    {
        var limiter = new PasswordRecoveryRateLimiter(new FakeTime());

        for (var i = 0; i < PasswordRecoveryRateLimiter.MaxPerIp; i++)
            Assert.True(limiter.TryAcquire("2.2.2.2", $"u{i}@b.com", out _));

        Assert.False(limiter.TryAcquire("2.2.2.2", "otro@b.com", out _));
        Assert.True(limiter.TryAcquire("3.3.3.3", "otro@b.com", out _));
    }

    // ---------- enlace del correo ----------

    [Theory]
    [InlineData("https://{tenant}.geoserv.com", "geocobre", "abc", "https://geocobre.geoserv.com/reset-password?tenant=geocobre&token=abc")]
    [InlineData("http://localhost:4200/", "geocobre", "a b", "http://localhost:4200/reset-password?tenant=geocobre&token=a%20b")]
    [InlineData(null, "geocobre", "abc", "http://localhost:4200/reset-password?tenant=geocobre&token=abc")]
    public void BuildResetUrl_UsesBaseUrlAndTenant(string? baseUrl, string tenant, string token, string expected)
    {
        Assert.Equal(expected, MailerService.BuildResetUrl(baseUrl, tenant, token));
    }
}
