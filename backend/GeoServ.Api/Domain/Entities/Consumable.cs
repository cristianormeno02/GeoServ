namespace GeoServ.Api.Domain.Entities;

public class Consumable
{
    public Guid Id { get; set; }
    public DateTime PurchaseDate { get; set; }
    
    public Guid ConsumableClassId { get; set; }
    public ConsumableClass ConsumableClass { get; set; } = null!;
    
    public string Description { get; set; } = string.Empty;
    public decimal Quantity { get; set; }
    
    public Guid UnitId { get; set; }
    public Unit Unit { get; set; } = null!;
    
    public decimal UnitCost { get; set; }
    public decimal TotalCost { get; set; }
    
    public Guid? ProviderId { get; set; }
    public Provider? Provider { get; set; }
    
    public string? Observation { get; set; }
}
