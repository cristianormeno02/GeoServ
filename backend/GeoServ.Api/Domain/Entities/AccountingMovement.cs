using GeoServ.Api.Domain.Enums;

namespace GeoServ.Api.Domain.Entities;

public class AccountingMovement
{
    public Guid Id { get; set; }
    public bool IsIncome { get; set; } // true = Ingreso, false = Egreso
    
    public Guid CategoryId { get; set; }
    public MovementCategory Category { get; set; } = null!;
    public decimal Amount { get; set; }
    public DateTime Date { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public string Description { get; set; } = string.Empty;

    // --- ¿De dónde sale o a dónde entra la plata? ---
    public Guid FinancialAccountId { get; set; }
    public FinancialAccount FinancialAccount { get; set; } = null!;

    // --- ¿Cómo se pagó/cobró? ---
    public Guid? PaymentMethodId { get; set; }
    public PaymentMethod? PaymentMethod { get; set; }

    // --- REFERENCIAS CRUZADAS (Generalmente solo 1 tendrá valor) ---

    // 1. Cobros
    public Guid? ServiceOrderId { get; set; }
    public ServiceOrder? ServiceOrder { get; set; }

    // 2. Gastos
    public Guid? FixedCostId { get; set; }
    public FixedCost? FixedCost { get; set; }

    public Guid? DirectCostId { get; set; }
    public DirectCost? DirectCost { get; set; }

    // 3. Patrimonio
    public Guid? AssetId { get; set; }
    public Asset? Asset { get; set; }

    // 4. Cheques
    public Guid? CheckId { get; set; }
    public Check? Check { get; set; }

    // 5. Honorarios
    public Guid? ResponsibleId { get; set; }
    public Responsible? Responsible { get; set; }

    // -------------------------------------------------------------

    public Guid RegisteredByUserId { get; set; }
    public User RegisteredByUser { get; set; } = null!;
}
