namespace GeoServ.Api.Domain.Entities;

public class ServiceOrderStatus
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty; // Alta, Presupuestada, Aprobada, Iniciada, Entregada, Cobrada, Cancelada
    public string? Description { get; set; }
    public int OrderIndex { get; set; }
    
    // Navegación
    public ICollection<ServiceOrder> ServiceOrders { get; set; } = new List<ServiceOrder>();
}
