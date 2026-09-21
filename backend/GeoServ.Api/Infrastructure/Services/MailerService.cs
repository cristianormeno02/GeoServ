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

        var resetUrl = BuildResetUrl(_configuration["App:FrontendBaseUrl"], _tenantService.GetTenantId(), resetToken);

        message.Body = new TextPart("html")
        {
            Text = $"""
                <p>Recibimos una solicitud para restablecer tu contraseña.</p>
                <p><a href="{resetUrl}">Restablecer contraseña</a></p>
                <p>Si el botón no funciona, copia y pega este enlace en tu navegador:<br>{resetUrl}</p>
                <p>El enlace es válido por 30 minutos y solo puede usarse una vez.</p>
                <p>Si no fuiste tú, ignora este mensaje: tu contraseña no cambiará.</p>
                """
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

