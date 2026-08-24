namespace GeoServ.Api.Domain.Entities;

public class FinancialAccount
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty; // Ej: "Caja Fuerte", "Banco Galicia ARS"
    public string AccountNumber { get; set; } = string.Empty;
    public string AccountType { get; set; } = string.Empty; // Ej: "Cash", "BankAccount", "DigitalWallet"
    
    public Guid CurrencyId { get; set; }
    public Currency Currency { get; set; } = null!;

    public bool IsActive { get; set; } = true;
}
