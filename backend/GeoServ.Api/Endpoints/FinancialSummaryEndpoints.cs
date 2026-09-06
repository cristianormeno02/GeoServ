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
                    c.Status,
                    ClientName = c.ReceivedFromClient != null ? c.ReceivedFromClient.CompanyName : null,
                    c.Observations
                })
                .ToListAsync();

            return Results.Ok(new { accounts = accountSummaries, checks });
        })
        .WithName("GetFinancialSummary")
        .WithOpenApi();
    }
}
