using GeoServ.Api.Domain.Enums;

namespace GeoServ.Api.Domain.Entities;

public class ServiceOrder
{
    public Guid Id { get; set; }
    
    public string OrderNumber { get; set; } = null!;
    
    public Guid ClientId { get; set; }
    public Client Client { get; set; } = null!;
    
    public Guid? ProjectId { get; set; }
    public Project? Project { get; set; }
    
    public Guid ServiceTypeId { get; set; }
    public ServiceType ServiceType { get; set; } = null!;
    
    public Guid StatusId { get; set; }
    public ServiceOrderStatus Status { get; set; } = null!;
    
    public ServiceOrderPriority Priority { get; set; } = ServiceOrderPriority.Media;
    
    public string? Description { get; set; }
    public string? BudgetedTasksDetail { get; set; }
    
    // Información Financiera
    public Guid CurrencyId { get; set; }
    public Currency Currency { get; set; } = null!;
    public decimal? ForeignAmount { get; set; }
    public decimal? ExchangeRateAtBudget { get; set; }
    public decimal? ExchangeRateAtCollection { get; set; }
    
    public decimal BudgetedAmount { get; set; }
    public decimal Discount { get; set; }
    public decimal TotalAmount { get; set; }
    public decimal CollectedAmount { get; set; }
    
    // Fechas de Control
    public DateTime? RequestDate { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    
    public DateTime? EstimatedStartDate { get; set; }
    public DateTime? EstimatedEndDate { get; set; }
    
    public DateTime? ActualStartDate { get; set; }
    public DateTime? ActualEndDate { get; set; }
    
    public DateTime? CollectionDate { get; set; }
    public DateTime? CanceledAt { get; set; }
    
    // Navegación
    public ICollection<DirectCost> DirectCosts { get; set; } = new List<DirectCost>();
    public ICollection<ServiceOrderResponsible> Responsibles { get; set; } = new List<ServiceOrderResponsible>();
    public ICollection<ServiceOrderActivity> Activities { get; set; } = new List<ServiceOrderActivity>();
    public ICollection<ServiceOrderDistribution> Distributions { get; set; } = new List<ServiceOrderDistribution>();
    public ICollection<ServiceOrderDocument> Documents { get; set; } = new List<ServiceOrderDocument>();
    public ICollection<ServiceOrderObservation> Observations { get; set; } = new List<ServiceOrderObservation>();
}
