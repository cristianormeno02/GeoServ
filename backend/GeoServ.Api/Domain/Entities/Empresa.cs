namespace GeoServ.Api.Domain.Entities;

public class Empresa
{
    public Guid Id { get; set; }
    public string Nombre { get; set; } = string.Empty;
    public string Correo { get; set; } = string.Empty;
    public string Telefono { get; set; } = string.Empty;
    public string Direccion { get; set; } = string.Empty;
    public string LogoSvg { get; set; } = string.Empty;
    public string TaxId { get; set; } = string.Empty;
    
    // El subdominio identifica la empresa desde la URL (ej. "geocobre")
    public string Subdominio { get; set; } = string.Empty;
}
