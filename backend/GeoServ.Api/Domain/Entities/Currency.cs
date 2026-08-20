namespace GeoServ.Api.Domain.Entities;

public class Currency
{
    public Guid Id { get; set; }
    
    public string Code { get; set; } = null!; // ej. ARS, USD, CLP
    public string Symbol { get; set; } = null!; // ej. $, U$D
    public string Name { get; set; } = null!; // ej. Peso Argentino, Dólar Estadounidense
    
    public bool IsActive { get; set; } = true;
}
