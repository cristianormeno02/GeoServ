using GeoServ.Api.Domain.Entities;
using GeoServ.Api.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace GeoServ.Api.Endpoints;

public static class FinancialAccountEndpoints
{
    public static void MapFinancialAccountEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/financial-accounts").RequireAuthorization();

        // 1. Get all accounts
        group.MapGet("/", async (GeoServDbContext context) =>
        {
            var accounts = await context.FinancialAccounts
                .Include(f => f.Currency)
                .OrderBy(f => f.Name)
                .Select(f => new
                {
                    f.Id,
                    f.Name,
                    f.AccountNumber,
                    f.AccountType,
                    f.CurrencyId,
                    CurrencyName = f.Currency.Name,
                    f.IsActive
                })
                .ToListAsync();

            return Results.Ok(accounts);
        })
        .WithName("GetFinancialAccounts")
        .WithOpenApi();

        // 2. Create account
        group.MapPost("/", async (CreateFinancialAccountRequest request, GeoServDbContext context) =>
        {
            var account = new FinancialAccount
            {
                Id = Guid.NewGuid(),
                Name = request.Name,
                AccountNumber = request.AccountNumber,
                AccountType = request.AccountType,
                CurrencyId = request.CurrencyId,
                IsActive = request.IsActive
            };

            context.FinancialAccounts.Add(account);
            await context.SaveChangesAsync();

            return Results.Created($"/api/financial-accounts/{account.Id}", account);
        })
        .WithName("CreateFinancialAccount")
        .WithOpenApi();

        // 3. Update account
        group.MapPut("/{id:guid}", async (Guid id, UpdateFinancialAccountRequest request, GeoServDbContext context) =>
        {
            var account = await context.FinancialAccounts.FindAsync(id);
            if (account is null) return Results.NotFound();

            account.Name = request.Name;
            account.AccountNumber = request.AccountNumber;
            account.AccountType = request.AccountType;
            account.CurrencyId = request.CurrencyId;
            account.IsActive = request.IsActive;

            await context.SaveChangesAsync();
            return Results.NoContent();
        })
        .WithName("UpdateFinancialAccount")
        .WithOpenApi();

        // 4. Delete account
        group.MapDelete("/{id:guid}", async (Guid id, GeoServDbContext context) =>
        {
            var account = await context.FinancialAccounts.FindAsync(id);
            if (account is null) return Results.NotFound();

            context.FinancialAccounts.Remove(account);
            await context.SaveChangesAsync();
            return Results.NoContent();
        })
        .WithName("DeleteFinancialAccount")
        .WithOpenApi();
    }
}

public class CreateFinancialAccountRequest
{
    public string Name { get; set; } = string.Empty;
    public string AccountNumber { get; set; } = string.Empty;
    public string AccountType { get; set; } = string.Empty;
    public Guid CurrencyId { get; set; }
    public bool IsActive { get; set; } = true;
}

public class UpdateFinancialAccountRequest
{
    public string Name { get; set; } = string.Empty;
    public string AccountNumber { get; set; } = string.Empty;
    public string AccountType { get; set; } = string.Empty;
    public Guid CurrencyId { get; set; }
    public bool IsActive { get; set; } = true;
}
