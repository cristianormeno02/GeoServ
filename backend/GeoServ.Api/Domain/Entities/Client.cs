namespace GeoServ.Api.Domain.Entities;

public class Client
{
    public Guid Id { get; set; }
    public Guid? UserId { get; set; }
    public User? User { get; set; }
    public string CompanyName { get; set; } = string.Empty;
    
    public Guid? CompanyTypeId { get; set; }
    public CompanyType? CompanyType { get; set; }
    
    public string TaxId { get; set; } = string.Empty;
    public string ContactEmail { get; set; } = string.Empty;
    public string ContactPhone { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    
    public ICollection<ServiceOrder> ServiceOrders { get; set; } = new List<ServiceOrder>();
}
