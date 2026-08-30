using System;
using GeoServ.Api.Domain.Enums;

namespace GeoServ.Api.Domain.Entities;

public class InventoryMovement
{
    public Guid Id { get; set; }
    
    public Guid ConsumableId { get; set; }
    public Consumable Consumable { get; set; } = null!;
    
    public decimal Cantidad { get; set; }
    
    public InventoryMovementType MovementType { get; set; }
    
    public Guid? ServiceOrderId { get; set; }
    public ServiceOrder? ServiceOrder { get; set; }
    
    public string? Motivo { get; set; }
    public DateTime Fecha { get; set; } = DateTime.UtcNow;
    
    public Guid UserId { get; set; }
    public User User { get; set; } = null!;

    public void Validate()
    {
        if (MovementType == InventoryMovementType.UsoEnOS && ServiceOrderId == null)
            throw new InvalidOperationException("Se requiere una Orden de Servicio para un movimiento de Uso en OS.");

        if ((MovementType == InventoryMovementType.AjustePositivo || MovementType == InventoryMovementType.AjusteNegativo) 
            && string.IsNullOrWhiteSpace(Motivo))
            throw new InvalidOperationException("Se requiere un Motivo para ajustes de inventario.");
    }
}
