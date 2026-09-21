using System.Security.Cryptography;
using System.Text;
using GeoServ.Api.Domain.Entities;
using GeoServ.Api.Infrastructure.Data;
using GeoServ.Api.Infrastructure.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace GeoServ.Api.Endpoints;

public static class PasswordRecoveryEndpoints
{
    public static readonly TimeSpan TokenLifetime = TimeSpan.FromMinutes(30);
    public const int MinPasswordLength = 6;
    public const string NeutralMessage = "Si el correo existe, se enviarán las instrucciones.";

    public static void MapPasswordRecoveryEndpoints(this IEndpointRouteBuilder app)
    {
        app.MapPost("/api/auth/recover-password", RecoverAsync)
            .WithName("RecoverPassword")
            .WithOpenApi();

        app.MapPost("/api/auth/reset-password", ResetAsync)
            .WithName("ResetPassword")
            .WithOpenApi();
    }

    public static async Task<IResult> RecoverAsync(
        RecoverPasswordRequest request,
        GeoServDbContext context,
        IMailerService mailer,
        IEmailQueue emailQueue,
        IPasswordRecoveryRateLimiter limiter,
        HttpContext httpContext,
        ILogger<RecoverPasswordRequest> logger)
    {
        var email = (request.Email ?? string.Empty).Trim().ToLowerInvariant();
        if (string.IsNullOrEmpty(email))
        {
            return TypedResults.Problem(detail: "El correo es requerido.", statusCode: StatusCodes.Status400BadRequest);
        }

        var ip = httpContext.Connection.RemoteIpAddress?.ToString() ?? "unknown";
        if (!limiter.TryAcquire(ip, email, out var retryAfter))
        {
            httpContext.Response.Headers["Retry-After"] = Math.Ceiling(retryAfter.TotalSeconds).ToString("0");
            return TypedResults.Problem(detail: "Demasiados intentos. Intenta nuevamente más tarde.", statusCode: StatusCodes.Status429TooManyRequests);
        }

        var user = await context.Users.FirstOrDefaultAsync(u => u.Email.ToLower() == email && u.IsActive);
        if (user == null)
        {
            // Respuesta idéntica para no revelar si el correo existe (el detalle solo queda en el log del servidor)
            logger.LogInformation("Recuperación de contraseña: no existe un usuario activo con el correo {Email}", email);
            return TypedResults.Ok(new { message = NeutralMessage });
        }

        var now = DateTime.UtcNow;

        var previous = await context.PasswordResetTokens
            .Where(t => t.UserId == user.Id && t.UsedAt == null)
            .ToListAsync();
        foreach (var t in previous)
        {
            t.UsedAt = now;
        }

        var rawToken = GenerateToken();
        context.PasswordResetTokens.Add(new PasswordResetToken
        {
            Id = Guid.NewGuid(),
            UserId = user.Id,
            TokenHash = HashToken(rawToken),
            CreatedAt = now,
            ExpiresAt = now.Add(TokenLifetime)
        });
        await context.SaveChangesAsync();

        try
        {
            // El SMTP se resuelve aquí (depende del tenant de la solicitud) pero el envío ocurre en segundo plano
            var message = await mailer.PreparePasswordRecoveryEmailAsync(user.Email, rawToken);
            emailQueue.Enqueue(message);
            logger.LogInformation("Recuperación de contraseña: correo encolado para {Email}", email);
        }
        catch (Exception ex)
        {
            // No se informa al cliente para no revelar la existencia del correo
            logger.LogError(ex, "Error preparando correo de recuperación de contraseña");
        }

        return TypedResults.Ok(new { message = NeutralMessage });
    }

    public static async Task<IResult> ResetAsync(ResetPasswordRequest request, GeoServDbContext context)
    {
        if (string.IsNullOrWhiteSpace(request.Token))
        {
            return InvalidLink();
        }

        if (string.IsNullOrEmpty(request.NewPassword) || request.NewPassword.Length < MinPasswordLength)
        {
            return TypedResults.Problem(
                detail: $"La contraseña debe tener al menos {MinPasswordLength} caracteres.",
                statusCode: StatusCodes.Status400BadRequest);
        }

        var hash = HashToken(request.Token.Trim());
        var now = DateTime.UtcNow;

        var token = await context.PasswordResetTokens
            .Include(t => t.User)
            .FirstOrDefaultAsync(t => t.TokenHash == hash);

        if (token == null || token.UsedAt != null || token.ExpiresAt <= now || !token.User.IsActive)
        {
            return InvalidLink();
        }

        token.User.PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.NewPassword);
        token.User.RefreshToken = null;
        token.User.RefreshTokenExpiryTime = null;
        token.UsedAt = now;
        await context.SaveChangesAsync();

        return TypedResults.Ok(new { message = "Contraseña actualizada con éxito." });
    }

    public static string HashToken(string token)
    {
        return Convert.ToHexString(SHA256.HashData(Encoding.UTF8.GetBytes(token))).ToLowerInvariant();
    }

    private static string GenerateToken()
    {
        return Convert.ToBase64String(RandomNumberGenerator.GetBytes(32))
            .Replace('+', '-').Replace('/', '_').TrimEnd('=');
    }

    private static IResult InvalidLink() =>
        TypedResults.Problem(detail: "El enlace es inválido o ha expirado.", statusCode: StatusCodes.Status400BadRequest);
}
