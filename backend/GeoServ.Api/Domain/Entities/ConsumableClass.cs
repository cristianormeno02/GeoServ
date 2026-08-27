namespace GeoServ.Api.Domain.Entities;

public class ConsumableClass
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    
    public Guid ConsumableTypeId { get; set; }
    public ConsumableType ConsumableType { get; set; } = null!;
    
    public ICollection<Consumable> Consumables { get; set; } = new List<Consumable>();
}
