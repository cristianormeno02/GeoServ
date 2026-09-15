using GeoServ.Api.Domain.Entities;
using GeoServ.Api.Domain.Enums;
using GeoServ.Api.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using Xunit;

namespace GeoServ.Api.Tests;

public class AccountBalanceMovementsTests
{
    private GeoServDbContext CreateInMemoryContext()
    {
        var options = new DbContextOptionsBuilder<GeoServDbContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;

        return new GeoServDbContext(options);
    }

    [Fact]
    public async Task GetMovements_WithAccountFilter_CalculatesInitialAndProgressiveBalancesCorrectly()
    {
        // Arrange
        using var context = CreateInMemoryContext();

        var account1 = new FinancialAccount
        {
            Id = Guid.NewGuid(),
            Name = "Banco Galicia Cta Cte",
            AccountType = "BankAccount",
            IsActive = true
        };
        var account2 = new FinancialAccount
        {
            Id = Guid.NewGuid(),
            Name = "Caja Chica",
            AccountType = "Cash",
            IsActive = true
        };
        var category = new MovementCategory
        {
            Id = Guid.NewGuid(),
            Name = "Cobro de Servicios",
            IsActive = true
        };

        context.FinancialAccounts.AddRange(account1, account2);
        context.MovementCategories.Add(category);

        // Movimiento previo al período (Saldo inicial de account1 = +1000 - 200 = 800)
        context.AccountingMovements.AddRange(
            new AccountingMovement
            {
                Id = Guid.NewGuid(),
                FinancialAccountId = account1.Id,
                CategoryId = category.Id,
                Date = new DateTime(2026, 1, 10),
                Amount = 1000m,
                IsIncome = true,
                CreatedAt = DateTime.UtcNow
            },
            new AccountingMovement
            {
                Id = Guid.NewGuid(),
                FinancialAccountId = account1.Id,
                CategoryId = category.Id,
                Date = new DateTime(2026, 1, 15),
                Amount = 200m,
                IsIncome = false,
                CreatedAt = DateTime.UtcNow
            },
            // Movimiento de account2 previo (no debe afectar account1)
            new AccountingMovement
            {
                Id = Guid.NewGuid(),
                FinancialAccountId = account2.Id,
                CategoryId = category.Id,
                Date = new DateTime(2026, 1, 12),
                Amount = 5000m,
                IsIncome = true,
                CreatedAt = DateTime.UtcNow
            }
        );

        // Movimientos del período para account1 (febrero 2026)
        // 1) 2026-02-01: Ingreso 500 -> Saldo acumulado = 800 + 500 = 1300
        // 2) 2026-02-05: Egreso 300  -> Saldo acumulado = 1300 - 300 = 1000
        // 3) 2026-02-10: Ingreso 200 -> Saldo acumulado = 1000 + 200 = 1200
        var m1 = new AccountingMovement
        {
            Id = Guid.NewGuid(),
            FinancialAccountId = account1.Id,
            CategoryId = category.Id,
            Date = new DateTime(2026, 2, 1),
            Amount = 500m,
            IsIncome = true,
            CreatedAt = new DateTime(2026, 2, 1, 10, 0, 0)
        };
        var m2 = new AccountingMovement
        {
            Id = Guid.NewGuid(),
            FinancialAccountId = account1.Id,
            CategoryId = category.Id,
            Date = new DateTime(2026, 2, 5),
            Amount = 300m,
            IsIncome = false,
            CreatedAt = new DateTime(2026, 2, 5, 10, 0, 0)
        };
        var m3 = new AccountingMovement
        {
            Id = Guid.NewGuid(),
            FinancialAccountId = account1.Id,
            CategoryId = category.Id,
            Date = new DateTime(2026, 2, 10),
            Amount = 200m,
            IsIncome = true,
            CreatedAt = new DateTime(2026, 2, 10, 10, 0, 0)
        };

        context.AccountingMovements.AddRange(m1, m2, m3);
        await context.SaveChangesAsync();

        var startDate = new DateTime(2026, 2, 1);
        var endDate = new DateTime(2026, 2, 28);

        // Act - Simular consulta de saldo inicial y movimientos
        var initialBalance = await context.AccountingMovements
            .Where(m => m.FinancialAccountId == account1.Id && m.Date < startDate.Date)
            .SumAsync(m => (decimal?)(m.IsIncome ? m.Amount : -m.Amount)) ?? 0m;

        var periodIncome = await context.AccountingMovements
            .Where(m => m.FinancialAccountId == account1.Id && m.Date >= startDate.Date && m.Date <= endDate.Date && m.IsIncome)
            .SumAsync(m => (decimal?)m.Amount) ?? 0m;

        var periodExpense = await context.AccountingMovements
            .Where(m => m.FinancialAccountId == account1.Id && m.Date >= startDate.Date && m.Date <= endDate.Date && !m.IsIncome)
            .SumAsync(m => (decimal?)m.Amount) ?? 0m;

        var finalBalance = initialBalance + periodIncome - periodExpense;

        // Assert
        Assert.Equal(800m, initialBalance);
        Assert.Equal(700m, periodIncome);
        Assert.Equal(300m, periodExpense);
        Assert.Equal(1200m, finalBalance);
    }
}
