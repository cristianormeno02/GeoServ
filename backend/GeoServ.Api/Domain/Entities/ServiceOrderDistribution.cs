namespace GeoServ.Api.Domain.Entities;

public class ServiceOrderDistribution
{
    public Guid Id { get; set; }
    
    public Guid ServiceOrderId { get; set; }
    public ServiceOrder ServiceOrder { get; set; } = null!;
    
    public Guid DistributionConceptId { get; set; }
    public DistributionConcept DistributionConcept { get; set; } = null!;
    
    public decimal Percentage { get; set; }
    public decimal ExpectedAmount { get; set; }
    public decimal ActualAmount { get; set; }
    public int OrderIndex { get; set; } = 0;
}
