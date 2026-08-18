namespace GeoServ.Api.Domain.Entities;

public class DirectCost
{
    public Guid Id { get; set; }
    
    public Guid ServiceOrderId { get; set; }
    public ServiceOrder ServiceOrder { get; set; } = null!;
    
    public string Description { get; set; } = string.Empty;
    public decimal Amount { get; set; }
    public DateTime Date { get; set; }
    
    public Guid RegisteredByUserId { get; set; }
    public User RegisteredByUser { get; set; } = null!;
}
