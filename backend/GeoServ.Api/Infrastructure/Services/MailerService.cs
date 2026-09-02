using MailKit.Net.Smtp;
using MimeKit;
using GeoServ.Api.Infrastructure.Services;

namespace GeoServ.Api.Infrastructure.Services;

public interface IMailerService
{
    Task SendPasswordRecoveryEmailAsync(string toEmail, string resetToken);
}

public class MailerService : IMailerService
{
    private readonly IEmpresaConfiguracionService _configService;

    public MailerService(IEmpresaConfiguracionService configService)
    {
        _configService = configService;
    }

    public async Task SendPasswordRecoveryEmailAsync(string toEmail, string resetToken)
    {
        var config = await _configService.GetSmtpConfigAsync();
        
        if (!config.TryGetValue("smtp_host", out var host) ||
            !config.TryGetValue("smtp_port", out var portStr) ||
            !config.TryGetValue("smtp_user", out var user) ||
            !config.TryGetValue("smtp_password", out var password) ||
            !config.TryGetValue("smtp_from", out var from))
        {
            throw new Exception("La configuración SMTP no está completa.");
        }

        if (!int.TryParse(portStr, out int port)) port = 587;

        var message = new MimeMessage();
        message.From.Add(new MailboxAddress("GeoServ", from));
        message.To.Add(new MailboxAddress("", toEmail));
        message.Subject = "Recuperación de Contraseña";

        var resetUrl = $"http://localhost:4200/reset-password?token={resetToken}";
        
        message.Body = new TextPart("html")
        {
            Text = $"<p>Has solicitado restablecer tu contraseña.</p><p>Haz clic en el siguiente enlace:</p><p><a href='{resetUrl}'>{resetUrl}</a></p>"
        };

        using var client = new SmtpClient();
        client.Timeout = 10000; // 10 segundos de timeout para no bloquear la app
        
        using var cts = new CancellationTokenSource(TimeSpan.FromSeconds(15));
        
        await client.ConnectAsync(host, port, MailKit.Security.SecureSocketOptions.Auto, cts.Token);
        await client.AuthenticateAsync(user, password, cts.Token);
        await client.SendAsync(message, cts.Token);
        await client.DisconnectAsync(true, cts.Token);
    }
}

