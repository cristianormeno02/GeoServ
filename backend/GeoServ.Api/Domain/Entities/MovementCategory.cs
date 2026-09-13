using GeoServ.Api.Domain.Enums;

namespace GeoServ.Api.Domain.Entities;

public class MovementCategory
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public bool IsIncome { get; set; } // true = Ingreso, false = Egreso
    public bool IsActive { get; set; } = true;

    // Categorías reservadas por el sistema (ej. Transferencia Interna): no editables ni eliminables por el usuario
    public bool IsSystemDefault { get; set; } = false;

    // Tipo de origen polimórfico con el que se vincula esta categoría (null = sin vínculo / Manual).
    // Ingreso: solo null o ServiceOrderIncome. Egreso: solo null, AssetPurchase, FixedCostPayment o DirectCost.
    public MovementSourceType? LinkedSourceType { get; set; }
}
