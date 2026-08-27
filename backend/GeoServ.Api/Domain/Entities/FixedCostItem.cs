namespace GeoServ.Api.Domain.Entities;

public class FixedCostItem
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    
    public Guid CategoryId { get; set; }
    public FixedCostCategory Category { get; set; } = null!;
    
    public Guid? ProviderId { get; set; }
    public Provider? Provider { get; set; }
    
    public decimal InitialAmount { get; set; }
    public bool IsRecurring { get; set; }
    
    public string? Observation { get; set; }
    
    public ICollection<FixedCostPayment> Payments { get; set; } = new List<FixedCostPayment>();
}
