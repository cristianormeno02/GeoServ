namespace GeoServ.Api.Domain.Entities;

public class Asset
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty; // Ej: "Estación Total Leica X"
    public string Description { get; set; } = string.Empty;
    public decimal PurchasePrice { get; set; }
    public DateTime PurchaseDate { get; set; }
    
    public int UsefulLifeMonths { get; set; }
    
    public Guid? ProviderId { get; set; }
    public Provider? Provider { get; set; }
}
