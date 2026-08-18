namespace GeoServ.Api.Domain.Entities;

public class ServiceOrder
{
    public Guid Id { get; set; }
    public Guid ClientId { get; set; }
    public Client Client { get; set; } = null!;
    
    public Guid ServiceTypeId { get; set; }
    public ServiceType ServiceType { get; set; } = null!;
    
    public Guid StatusId { get; set; }
    public ServiceOrderStatus Status { get; set; } = null!;
    
    public string? Description { get; set; }
    
    // Información Financiera
    public decimal BudgetedAmount { get; set; }
    public decimal Discount { get; set; }
    public decimal TotalAmount { get; set; }
    
    // Regla de Distribución (Porcentajes)
    public decimal ExpensePercentage { get; set; } = 33.33m;
    public decimal CapitalizationPercentage { get; set; } = 33.33m;
    public decimal FeePercentage { get; set; } = 33.33m;
    
    // Fechas de Control
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public DateTime? StartDate { get; set; }
    public DateTime? EstimatedDeliveryDate { get; set; }
    public DateTime? PaidAt { get; set; }
    public DateTime? CanceledAt { get; set; }
    
    // Navegación
    public RevenueDistribution? RevenueDistribution { get; set; }
    public ICollection<DirectCost> DirectCosts { get; set; } = new List<DirectCost>();
}
