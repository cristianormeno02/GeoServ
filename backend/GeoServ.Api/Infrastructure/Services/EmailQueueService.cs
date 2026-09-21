using System.Threading.Channels;

namespace GeoServ.Api.Infrastructure.Services;

public interface IEmailQueue
{
    /// <summary>Encola un correo para envío en segundo plano y retorna de inmediato.</summary>
    void Enqueue(EmailMessage email);
}

/// <summary>
/// Cola en memoria procesada por un servicio en segundo plano. Los errores de envío se registran
/// en el log (con host y puerto, sin credenciales) y no afectan a la solicitud que encoló el correo.
/// </summary>
public class EmailQueueService : BackgroundService, IEmailQueue
{
    private readonly Channel<EmailMessage> _channel = Channel.CreateUnbounded<EmailMessage>();
    private readonly IEmailSender _sender;
    private readonly ILogger<EmailQueueService> _logger;

    public EmailQueueService(IEmailSender sender, ILogger<EmailQueueService> logger)
    {
        _sender = sender;
        _logger = logger;
    }

    public void Enqueue(EmailMessage email)
    {
        _channel.Writer.TryWrite(email);
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        await foreach (var email in _channel.Reader.ReadAllAsync(stoppingToken))
        {
            await ProcessAsync(email, stoppingToken);
        }
    }

    /// <summary>Envía un correo capturando cualquier error. Expuesto para pruebas.</summary>
    public async Task ProcessAsync(EmailMessage email, CancellationToken cancellationToken)
    {
        try
        {
            await _sender.SendAsync(email, cancellationToken);
            _logger.LogInformation("Correo '{Subject}' enviado a {To} vía {Host}:{Port}", email.Subject, email.To, email.Host, email.Port);
        }
        catch (OperationCanceledException) when (cancellationToken.IsCancellationRequested)
        {
            throw;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error enviando correo '{Subject}' a {To} vía {Host}:{Port}", email.Subject, email.To, email.Host, email.Port);
        }
    }
}
