namespace GeoServ.Api.Domain.Entities;

public class Project
{
    public Guid Id { get; set; }
    public string Name { get; set; } = null!;
    public string? Description { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    // Geolocalización
    public decimal? Latitud { get; set; }
    public decimal? Longitud { get; set; }

    // Relaciones
    public ICollection<ServiceOrder> ServiceOrders { get; set; } = new List<ServiceOrder>();
}
