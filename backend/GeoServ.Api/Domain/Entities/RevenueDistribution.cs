namespace GeoServ.Api.Domain.Entities;

public class RevenueDistribution
{
    public Guid Id { get; set; }
    public Guid ServiceOrderId { get; set; }
    public ServiceOrder ServiceOrder { get; set; } = null!;
    
    public decimal CalculatedExpenseAmount { get; set; }
    public decimal CalculatedCapitalizationAmount { get; set; }
    public decimal CalculatedFeeAmount { get; set; }
    
    public decimal ActualCapitalizationAmount { get; set; }
    public decimal ActualFeePaidAmount { get; set; }
    
    public DateTime DistributionDate { get; set; }
}
