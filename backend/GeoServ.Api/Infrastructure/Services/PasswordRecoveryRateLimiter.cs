using System.Collections.Concurrent;

namespace GeoServ.Api.Infrastructure.Services;

public interface IPasswordRecoveryRateLimiter
{
    /// <summary>
    /// Registra un intento de recuperación. Devuelve false si se excedió el límite por IP o por correo.
    /// </summary>
    bool TryAcquire(string ip, string email, out TimeSpan retryAfter);
}

/// <summary>
/// Limitador de ventana fija en memoria: 5 solicitudes por IP y 3 por correo cada 15 minutos.
/// </summary>
public class PasswordRecoveryRateLimiter : IPasswordRecoveryRateLimiter
{
    public static readonly TimeSpan Window = TimeSpan.FromMinutes(15);
    public const int MaxPerIp = 5;
    public const int MaxPerEmail = 3;

    private readonly TimeProvider _time;
    private readonly ConcurrentDictionary<string, (DateTimeOffset WindowStart, int Count)> _entries = new();
    private readonly object _lock = new();

    public PasswordRecoveryRateLimiter(TimeProvider? time = null)
    {
        _time = time ?? TimeProvider.System;
    }

    public bool TryAcquire(string ip, string email, out TimeSpan retryAfter)
    {
        lock (_lock)
        {
            var now = _time.GetUtcNow();
            Purge(now);

            var ipKey = "ip:" + ip;
            var emailKey = "email:" + email.ToLowerInvariant();

            var ipRetry = RetryAfter(ipKey, MaxPerIp, now);
            var emailRetry = RetryAfter(emailKey, MaxPerEmail, now);
            if (ipRetry > TimeSpan.Zero || emailRetry > TimeSpan.Zero)
            {
                retryAfter = ipRetry > emailRetry ? ipRetry : emailRetry;
                return false;
            }

            Increment(ipKey, now);
            Increment(emailKey, now);
            retryAfter = TimeSpan.Zero;
            return true;
        }
    }

    private TimeSpan RetryAfter(string key, int max, DateTimeOffset now)
    {
        if (_entries.TryGetValue(key, out var entry) && entry.Count >= max)
        {
            return entry.WindowStart + Window - now;
        }
        return TimeSpan.Zero;
    }

    private void Increment(string key, DateTimeOffset now)
    {
        _entries.AddOrUpdate(key, (now, 1), (_, e) => (e.WindowStart, e.Count + 1));
    }

    private void Purge(DateTimeOffset now)
    {
        foreach (var kv in _entries)
        {
            if (kv.Value.WindowStart + Window <= now)
            {
                _entries.TryRemove(kv.Key, out _);
            }
        }
    }
}
