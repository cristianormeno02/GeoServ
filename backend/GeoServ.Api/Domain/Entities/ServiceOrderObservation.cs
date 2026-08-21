namespace GeoServ.Api.Domain.Entities;

public class ServiceOrderObservation
{
    public Guid Id { get; set; }
    
    public Guid ServiceOrderId { get; set; }
    public ServiceOrder ServiceOrder { get; set; } = null!;
    
    public string Text { get; set; } = null!;
    
    public string ObservationType { get; set; } = null!;
    
    public Guid UserId { get; set; }
    public User User { get; set; } = null!;
    
    public DateTime CreatedAt { get; set; }
}
