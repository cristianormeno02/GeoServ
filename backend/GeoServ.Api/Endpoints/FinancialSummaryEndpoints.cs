using GeoServ.Api.Domain.Entities;
using GeoServ.Api.Domain.Enums;
using GeoServ.Api.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace GeoServ.Api.Endpoints;

public static class FinancialSummaryEndpoints
{
    public static void MapFinancialSummaryEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/financial-summary").RequireAuthorization();

        group.MapGet("/", async (GeoServDbContext context) =>
        {
            var accountSummaries = await context.FinancialAccounts
                .Include(f => f.Currency)
                .Select(f => new
                {
                    f.Id,
                    f.Name,
                    f.AccountNumber,
                    f.AccountType,
                    f.CurrencyId,
                    CurrencyName = f.Currency.Name,
                    f.IsActive,
                    Balance = context.AccountingMovements
                        .Where(m => m.FinancialAccountId == f.Id)
                        .Sum(m => m.IsIncome ? m.Amount : -m.Amount)
                })
                .ToListAsync();

            var checks = await context.Checks
                .Include(c => c.ReceivedFromClient)
                .Select(c => new
                {
                    c.Id,
                    c.CheckNumber,
                    c.BankName,
                    c.IssuerName,
                    c.Amount,
                    c.IssueDate,
                    c.DueDate,
                    Status = (int)c.Status,
                    ClientName = c.ReceivedFromClient != null ? c.ReceivedFromClient.CompanyName : null,
                    c.Observations
                })
                .ToListAsync();

            var inPortfolio = checks.Where(c => c.Status == (int)CheckStatus.InPortfolio).ToList();
            var deposited = checks.Where(c => c.Status == (int)CheckStatus.Deposited).ToList();
            var accredited = checks.Where(c => c.Status == (int)CheckStatus.Accredited).ToList();
            var rejected = checks.Where(c => c.Status == (int)CheckStatus.Rejected).ToList();

            var quickSummary = new
            {
                totalAccounts = accountSummaries.Count,
                activeAccounts = accountSummaries.Count(a => a.IsActive),
                totalConsolidatedBalance = accountSummaries.Sum(a => a.Balance),
                checksInPortfolio = new { count = inPortfolio.Count, totalAmount = inPortfolio.Sum(c => c.Amount) },
                checksDeposited = new { count = deposited.Count, totalAmount = deposited.Sum(c => c.Amount) },
                checksAccredited = new { count = accredited.Count, totalAmount = accredited.Sum(c => c.Amount) },
                checksRejected = new { count = rejected.Count, totalAmount = rejected.Sum(c => c.Amount) }
            };

            return Results.Ok(new 
            { 
                accounts = accountSummaries, 
                checks,
                quickSummary
            });
        })
        .WithName("GetFinancialSummary")
        .WithOpenApi();
    }
}
