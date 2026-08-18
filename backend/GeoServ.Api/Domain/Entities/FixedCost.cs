namespace GeoServ.Api.Domain.Entities;

public class FixedCost
{
    public Guid Id { get; set; }
    public string Description { get; set; } = string.Empty;
    public decimal Amount { get; set; }
    public DateTime Date { get; set; }
    
    public Guid CategoryId { get; set; }
    public FixedCostCategory Category { get; set; } = null!;
}
