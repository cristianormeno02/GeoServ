namespace GeoServ.Api.Domain.Entities;

public class ServiceOrderDocument
{
    public Guid Id { get; set; }
    
    public Guid ServiceOrderId { get; set; }
    public ServiceOrder ServiceOrder { get; set; } = null!;
    
    public string FileName { get; set; } = null!;
    public string FilePath { get; set; } = null!;
    public string? ContentType { get; set; }
    
    public bool IsVisibleToClient { get; set; } = false;
    
    public DateTime UploadedAt { get; set; } = DateTime.UtcNow;
    
    public Guid? UploadedById { get; set; }
    public User? UploadedBy { get; set; }
}
