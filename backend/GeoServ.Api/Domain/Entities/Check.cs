using GeoServ.Api.Domain.Enums;

namespace GeoServ.Api.Domain.Entities;

public class Check
{
    public Guid Id { get; set; }
    public string CheckNumber { get; set; } = string.Empty;
    public string BankName { get; set; } = string.Empty;
    public string IssuerName { get; set; } = string.Empty;
    public decimal Amount { get; set; }
    
    public DateTime IssueDate { get; set; }
    public DateTime DueDate { get; set; }
    
    public CheckStatus Status { get; set; } = CheckStatus.InPortfolio;

    public Guid? ReceivedFromClientId { get; set; }
    public Client? ReceivedFromClient { get; set; }
    
    public string? Observations { get; set; }
}
