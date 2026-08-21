namespace GeoServ.Api.Domain.Entities;

public class ServiceOrderObservation
{
    public Guid Id { get; set; }
    
    public Guid ServiceOrderId { get; set; }
    public ServiceOrder ServiceOrder { get; set; } = null!;
    
    public string Text { get; set; } = null!;
    
    public DateTime CreatedAt { get; set; }
}
