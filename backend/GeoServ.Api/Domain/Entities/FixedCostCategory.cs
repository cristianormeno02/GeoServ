namespace GeoServ.Api.Domain.Entities;

public class FixedCostCategory
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    
    public ICollection<FixedCost> FixedCosts { get; set; } = new List<FixedCost>();
}
