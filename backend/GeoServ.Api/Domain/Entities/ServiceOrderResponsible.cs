namespace GeoServ.Api.Domain.Entities;

public class ServiceOrderResponsible
{
    public Guid ServiceOrderId { get; set; }
    public ServiceOrder ServiceOrder { get; set; } = null!;

    public Guid ResponsibleId { get; set; }
    public Responsible Responsible { get; set; } = null!;
}
