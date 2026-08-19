namespace GeoServ.Api.Domain.Entities;

public class DistributionConcept
{
    public Guid Id { get; set; }
    public string Name { get; set; } = null!;
    public bool IsActive { get; set; } = true;
    
    public ICollection<ServiceOrderDistribution> ServiceOrderDistributions { get; set; } = new List<ServiceOrderDistribution>();
}
