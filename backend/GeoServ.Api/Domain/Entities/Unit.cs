namespace GeoServ.Api.Domain.Entities;

public class Unit
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public bool IsActive { get; set; } = true;
}
