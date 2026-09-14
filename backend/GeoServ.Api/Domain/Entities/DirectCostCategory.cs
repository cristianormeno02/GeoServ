namespace GeoServ.Api.Domain.Entities;

public class DirectCostCategory
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public bool IsActive { get; set; } = true;

    // Habilita esta categoría para ser seleccionada al registrar un movimiento contable de egreso
    // que impute automáticamente un costo directo a una Orden de Servicio.
    public bool IsAssignableViaMovement { get; set; } = false;
}
