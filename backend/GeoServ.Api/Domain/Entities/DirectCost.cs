namespace GeoServ.Api.Domain.Entities;

public class DirectCost
{
    public Guid Id { get; set; }
    
    public Guid ServiceOrderId { get; set; }
    public ServiceOrder ServiceOrder { get; set; } = null!;
    
    public Guid CategoryId { get; set; }
    public DirectCostCategory Category { get; set; } = null!;

    public Guid? ProviderId { get; set; }
    public Provider? Provider { get; set; }

    public string Description { get; set; } = string.Empty;
    
    public decimal Quantity { get; set; }
    
    public Guid? UnitId { get; set; }
    public Unit? Unit { get; set; }

    public decimal UnitPrice { get; set; }
    public decimal TotalAmount { get; set; }
    
    public DateTime Date { get; set; }
    
    public Guid? PaidById { get; set; }
    public Responsible? PaidBy { get; set; }

    public Guid? PaymentMethodId { get; set; }
    public PaymentMethod? PaymentMethod { get; set; }

    public string Status { get; set; } = "Pendiente";
    public string? Observations { get; set; }
    
    public Guid RegisteredByUserId { get; set; }
    public User RegisteredByUser { get; set; } = null!;
}
