namespace GeoServ.Api.Domain.Entities;

public class Responsible
{
    public Guid Id { get; set; }
    
    public Guid ServiceOrderId { get; set; }
    public ServiceOrder ServiceOrder { get; set; } = null!;
    
    public string Name { get; set; } = null!;
    public string? Position { get; set; }
    public string? Title { get; set; }
    public string? Specialties { get; set; }

    // Relación opcional con el sistema de usuarios
    public Guid? UserId { get; set; }
    public User? User { get; set; }
}
