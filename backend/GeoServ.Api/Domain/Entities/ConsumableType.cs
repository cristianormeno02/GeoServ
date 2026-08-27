namespace GeoServ.Api.Domain.Entities;

public class ConsumableType
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    
    public ICollection<ConsumableClass> ConsumableClasses { get; set; } = new List<ConsumableClass>();
}
