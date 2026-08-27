namespace GeoServ.Api.Domain.Entities;

public class FixedCostPayment
{
    public Guid Id { get; set; }
    
    public Guid FixedCostItemId { get; set; }
    public FixedCostItem FixedCostItem { get; set; } = null!;
    
    public DateTime DueDate { get; set; }
    public decimal Amount { get; set; }
    
    public bool IsPaid { get; set; }
    public DateTime? PaymentDate { get; set; }
    
    public Guid? PaymentMethodId { get; set; }
    public PaymentMethod? PaymentMethod { get; set; }
    
    public string? ReceiptNumber { get; set; }
}
