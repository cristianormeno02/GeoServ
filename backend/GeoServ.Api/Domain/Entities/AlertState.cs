namespace GeoServ.Api.Domain.Entities;

public class AlertState
{
    public Guid Id { get; set; }
    public string AlertKey { get; set; } = string.Empty;
    public Guid? UserId { get; set; }
    public User? User { get; set; }
    public string State { get; set; } = "Read";
    public DateTime? SnoozedUntil { get; set; }
    public DateTime? ResolvedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}
