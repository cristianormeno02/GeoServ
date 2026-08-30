using System;
using GeoServ.Api.Domain.Enums;

namespace GeoServ.Api.Domain.Entities;

public class AccountingMovementDetail
{
    public Guid Id { get; set; }
    public bool IsIncome { get; set; }
    public decimal Amount { get; set; }
    public DateTime Date { get; set; }
    public string Description { get; set; } = string.Empty;
    public string SourceType { get; set; } = string.Empty;
    public string? SourceId { get; set; }
    public Guid FinancialAccountId { get; set; }
    
    // Details
    public string? ServiceOrderNumber { get; set; }
    public string? DirectCostDescription { get; set; }
    public string? AssetName { get; set; }
    public string? FixedCostPaymentDescription { get; set; }
}
