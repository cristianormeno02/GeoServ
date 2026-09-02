namespace GeoServ.Api.Domain.Entities;

public class EmpresaConfiguracion
{
    public Guid Id { get; set; }
    public Guid EmpresaId { get; set; }
    public string Key { get; set; } = string.Empty;
    public string Value { get; set; } = string.Empty;
    public string ValueType { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string Group { get; set; } = "General";

    public virtual Empresa? Empresa { get; set; }
}
