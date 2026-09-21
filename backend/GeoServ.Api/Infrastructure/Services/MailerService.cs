using MailKit.Net.Smtp;
using MailKit.Security;
using MimeKit;

namespace GeoServ.Api.Infrastructure.Services;

/// <summary>
/// Correo listo para enviar con toda la configuración SMTP ya resuelta,
/// de modo que el envío no dependa de la solicitud HTTP ni del tenant actual.
/// </summary>
public record EmailMessage(
    string Host,
    int Port,
    string User,
    string Password,
    string From,
    string To,
    string Subject,
    string HtmlBody);

public interface IMailerService
{
    /// <summary>
    /// Arma el correo de recuperación leyendo la configuración SMTP del tenant actual. No realiza el envío.
    /// </summary>
    Task<EmailMessage> PreparePasswordRecoveryEmailAsync(string toEmail, string resetToken);
}

public class MailerService : IMailerService
{
    private readonly IEmpresaConfiguracionService _configService;
    private readonly ITenantService _tenantService;
    private readonly IConfiguration _configuration;

    public MailerService(IEmpresaConfiguracionService configService, ITenantService tenantService, IConfiguration configuration)
    {
        _configService = configService;
        _tenantService = tenantService;
        _configuration = configuration;
    }

    /// <summary>
    /// Construye el enlace de restablecimiento. <paramref name="baseUrl"/> puede incluir el marcador {tenant}
    /// (ej. https://{tenant}.geoserv.com). El tenant siempre se envía además como parámetro de consulta.
    /// </summary>
    public static string BuildResetUrl(string? baseUrl, string tenant, string token)
    {
        var root = string.IsNullOrWhiteSpace(baseUrl) ? "http://localhost:4200" : baseUrl.Trim();
        root = root.Replace("{tenant}", Uri.EscapeDataString(tenant)).TrimEnd('/');
        return $"{root}/reset-password?tenant={Uri.EscapeDataString(tenant)}&token={Uri.EscapeDataString(token)}";
    }

    public async Task<EmailMessage> PreparePasswordRecoveryEmailAsync(string toEmail, string resetToken)
    {
        var config = await _configService.GetSmtpConfigAsync();

        var missing = new[] { "smtp_host", "smtp_port", "smtp_user", "smtp_password", "smtp_from" }
            .Where(k => !config.ContainsKey(k) || string.IsNullOrWhiteSpace(config[k]))
            .ToList();
        if (missing.Count > 0)
        {
            throw new InvalidOperationException(
                $"La configuración SMTP del tenant '{_tenantService.GetTenantId()}' está incompleta. Faltan: {string.Join(", ", missing)}.");
        }

        if (!int.TryParse(config["smtp_port"], out var port)) port = 587;

        var resetUrl = BuildResetUrl(_configuration["App:FrontendBaseUrl"], _tenantService.GetTenantId(), resetToken);

        var body = $"""
            <p>Recibimos una solicitud para restablecer tu contraseña.</p>
            <p><a href="{resetUrl}">Restablecer contraseña</a></p>
            <p>Si el botón no funciona, copia y pega este enlace en tu navegador:<br>{resetUrl}</p>
            <p>El enlace es válido por 30 minutos y solo puede usarse una vez.</p>
            <p>Si no fuiste tú, ignora este mensaje: tu contraseña no cambiará.</p>
            """;

        return new EmailMessage(
            config["smtp_host"], port, config["smtp_user"], config["smtp_password"], config["smtp_from"],
            toEmail, "Recuperación de Contraseña", body);
    }
}

public interface IEmailSender
{
    Task SendAsync(EmailMessage email, CancellationToken cancellationToken);
}

/// <summary>Envía correos por SMTP con MailKit. No depende de servicios con alcance de solicitud.</summary>
public class SmtpEmailSender : IEmailSender
{
    public async Task SendAsync(EmailMessage email, CancellationToken cancellationToken)
    {
        var message = new MimeMessage();
        message.From.Add(new MailboxAddress("GeoServ", email.From));
        message.To.Add(new MailboxAddress("", email.To));
        message.Subject = email.Subject;
        message.Body = new TextPart("html") { Text = email.HtmlBody };

        using var client = new SmtpClient { Timeout = 15000 };
        using var cts = CancellationTokenSource.CreateLinkedTokenSource(cancellationToken);
        cts.CancelAfter(TimeSpan.FromSeconds(30));

        await client.ConnectAsync(email.Host, email.Port, SecureSocketOptions.Auto, cts.Token);
        await client.AuthenticateAsync(email.User, email.Password, cts.Token);
        await client.SendAsync(message, cts.Token);
        await client.DisconnectAsync(true, cts.Token);
    }
}
