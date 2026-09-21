namespace GeoServ.Api.Domain.Entities;

/// <summary>
/// Token de restablecimiento de contraseña de un solo uso. Solo se persiste el hash del token.
/// </summary>
public class PasswordResetToken
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public User User { get; set; } = null!;
    public string TokenHash { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public DateTime ExpiresAt { get; set; }
    public DateTime? UsedAt { get; set; }
}
