namespace GeoServ.Api.Domain.Entities;

public class AccountingMovement
{
    public Guid Id { get; set; }
    public bool IsIncome { get; set; } // true = Ingreso, false = Egreso
    public decimal Amount { get; set; }
    public DateTime Date { get; set; }
    public string Description { get; set; } = string.Empty;
    
    public Guid? ServiceOrderId { get; set; }
    public ServiceOrder? ServiceOrder { get; set; }
    
    public Guid RegisteredByUserId { get; set; }
    public User RegisteredByUser { get; set; } = null!;
}
