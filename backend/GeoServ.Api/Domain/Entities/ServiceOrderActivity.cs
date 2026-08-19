using GeoServ.Api.Domain.Enums;

namespace GeoServ.Api.Domain.Entities;

public class ServiceOrderActivity
{
    public Guid Id { get; set; }
    
    public Guid ServiceOrderId { get; set; }
    public ServiceOrder ServiceOrder { get; set; } = null!;
    
    public string ShortDetail { get; set; } = null!;
    public string? LongDetail { get; set; }
    
    public ActivityState State { get; set; } = ActivityState.Pendiente;
    
    // De 1 a 100
    public int ProgressPercentage { get; set; } = 0;
}
