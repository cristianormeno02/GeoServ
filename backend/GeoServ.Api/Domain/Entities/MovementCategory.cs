namespace GeoServ.Api.Domain.Entities;

public class MovementCategory
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public bool IsIncome { get; set; } // true = Ingreso, false = Egreso
    public bool IsActive { get; set; } = true;
}
