using GeoServ.Api.Domain.Entities;
using GeoServ.Api.Domain.Enums;
using GeoServ.Api.Endpoints;
using GeoServ.Api.Infrastructure.Data;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;
using Xunit;

namespace GeoServ.Api.Tests;

public class MovementFutureDateValidationTests
{
    private GeoServDbContext CreateInMemoryContext()
    {
        var options = new DbContextOptionsBuilder<GeoServDbContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;

        return new GeoServDbContext(options);
    }

    private (FinancialAccount account, MovementCategory category) SeedAccountAndCategory(GeoServDbContext context)
    {
        var currency = new Currency { Id = Guid.NewGuid(), Name = "Pesos", Symbol = "$", Code = "ARS" };
        var account = new FinancialAccount { Id = Guid.NewGuid(), Name = "Caja Principal", AccountNumber = "001", AccountType = "Cash", CurrencyId = currency.Id, IsActive = true };
        var category = new MovementCategory { Id = Guid.NewGuid(), Name = "Varios", IsIncome = false };
        context.Currencies.Add(currency);
        context.FinancialAccounts.Add(account);
        context.MovementCategories.Add(category);
        context.SaveChanges();
        return (account, category);
    }

    [Fact]
    public async Task CreateMovementAsync_FechaFutura_RetornaBadRequest()
    {
        using var context = CreateInMemoryContext();
        var (account, category) = SeedAccountAndCategory(context);
        var futureDate = DateTime.UtcNow.Date.AddDays(1);

        var request = new CreateMovementRequest(
            IsIncome: false,
            CategoryId: category.Id,
            Amount: 1000m,
            Date: futureDate,
            Description: "Movimiento futuro",
            FinancialAccountId: account.Id,
            PaymentMethodId: null,
            SourceType: MovementSourceType.Manual,
            SourceId: null,
            CheckId: null,
            ResponsibleId: null
        );

        var result = await AccountingMovementEndpoints.CreateMovementAsync(request, Guid.NewGuid(), context);

        var badRequest = Assert.IsAssignableFrom<IStatusCodeHttpResult>(result);
        Assert.Equal(400, badRequest.StatusCode);
    }

    [Fact]
    public async Task UpdateMovementAsync_FechaFutura_RetornaBadRequest()
    {
        using var context = CreateInMemoryContext();
        var (account, category) = SeedAccountAndCategory(context);
        var initialDate = DateTime.UtcNow.Date.AddDays(-1);

        var movement = new AccountingMovement
        {
            Id = Guid.NewGuid(),
            IsIncome = false,
            CategoryId = category.Id,
            Amount = 1000m,
            Date = initialDate,
            Description = "Movimiento inicial",
            FinancialAccountId = account.Id,
            SourceType = MovementSourceType.Manual
        };
        context.AccountingMovements.Add(movement);
        await context.SaveChangesAsync();

        var futureDate = DateTime.UtcNow.Date.AddDays(1);
        var updateRequest = new UpdateMovementRequest(
            IsIncome: false,
            CategoryId: category.Id,
            Amount: 1200m,
            Date: futureDate,
            Description: "Movimiento editado futuro",
            FinancialAccountId: account.Id,
            PaymentMethodId: null,
            SourceType: MovementSourceType.Manual
        );

        var result = await AccountingMovementEndpoints.UpdateMovementAsync(movement.Id, updateRequest, context);

        var badRequest = Assert.IsAssignableFrom<IStatusCodeHttpResult>(result);
        Assert.Equal(400, badRequest.StatusCode);
    }

    [Fact]
    public async Task CreateTransferAsync_FechaFutura_RetornaBadRequest()
    {
        using var context = CreateInMemoryContext();
        var (account1, _) = SeedAccountAndCategory(context);
        var account2 = new FinancialAccount { Id = Guid.NewGuid(), Name = "Banco Galicia", AccountNumber = "002", AccountType = "BankAccount", CurrencyId = account1.CurrencyId, IsActive = true };
        context.FinancialAccounts.Add(account2);
        await context.SaveChangesAsync();

        var futureDate = DateTime.UtcNow.Date.AddDays(2);
        var request = new CreateTransferRequest(account1.Id, account2.Id, 500m, futureDate, "Transferencia futura");

        var result = await AccountingMovementEndpoints.CreateTransferAsync(request, Guid.NewGuid(), context);

        var badRequest = Assert.IsAssignableFrom<IStatusCodeHttpResult>(result);
        Assert.Equal(400, badRequest.StatusCode);
    }

    [Fact]
    public async Task CreateMovementAsync_FechaHoy_EsExitoso()
    {
        using var context = CreateInMemoryContext();
        var (account, category) = SeedAccountAndCategory(context);
        var today = DateTime.UtcNow.Date;

        var request = new CreateMovementRequest(
            IsIncome: false,
            CategoryId: category.Id,
            Amount: 1000m,
            Date: today,
            Description: "Movimiento de hoy",
            FinancialAccountId: account.Id,
            PaymentMethodId: null,
            SourceType: MovementSourceType.Manual,
            SourceId: null,
            CheckId: null,
            ResponsibleId: null
        );

        var result = await AccountingMovementEndpoints.CreateMovementAsync(request, Guid.NewGuid(), context);

        var created = Assert.IsAssignableFrom<IStatusCodeHttpResult>(result);
        Assert.Equal(201, created.StatusCode);
    }
}
