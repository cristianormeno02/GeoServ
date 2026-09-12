using GeoServ.Api.Domain.Entities;
using GeoServ.Api.Domain.Enums;
using GeoServ.Api.Endpoints;
using GeoServ.Api.Infrastructure.Data;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;
using Xunit;

namespace GeoServ.Api.Tests;

public class FinancialDashboardKpiExclusionTests
{
    private GeoServDbContext CreateInMemoryContext()
    {
        var options = new DbContextOptionsBuilder<GeoServDbContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;

        return new GeoServDbContext(options);
    }

    [Fact]
    public async Task IncomeAndExpenseCurrentMonth_ExcludeInternalTransfers_ButAccountBalanceIncludesThem()
    {
        // Arrange: dos cuentas, una Transferencia Interna entre ellas, y un ingreso/egreso "real" del mes.
        using var context = CreateInMemoryContext();
        var currencyId = Guid.NewGuid();
        var caja = new FinancialAccount { Id = Guid.NewGuid(), Name = "Caja", AccountNumber = "001", AccountType = "Cash", CurrencyId = currencyId, IsActive = true };
        var banco = new FinancialAccount { Id = Guid.NewGuid(), Name = "Banco", AccountNumber = "002", AccountType = "BankAccount", CurrencyId = currencyId, IsActive = true };
        context.FinancialAccounts.AddRange(caja, banco);
        await context.SaveChangesAsync();

        var today = DateTime.UtcNow.Date;

        // Transferencia Interna de $500.000 entre Caja y Banco (no debe inflar los KPIs brutos)
        var transferResult = await AccountingMovementEndpoints.CreateTransferAsync(
            new CreateTransferRequest(caja.Id, banco.Id, 500000m, today, null),
            Guid.NewGuid(),
            context);
        Assert.IsAssignableFrom<IStatusCodeHttpResult>(transferResult);

        // Ingreso "real" de $1.000.000 (cobro de OS) en Banco
        context.AccountingMovements.Add(new AccountingMovement
        {
            Id = Guid.NewGuid(),
            IsIncome = true,
            CategoryId = Guid.NewGuid(),
            Amount = 1000000m,
            Date = today,
            Description = "Cobro de orden de servicio",
            FinancialAccountId = banco.Id,
            SourceType = MovementSourceType.ServiceOrderIncome,
            RegisteredByUserId = Guid.NewGuid()
        });

        // Egreso "real" de $600.000 (costo directo) en Caja
        context.AccountingMovements.Add(new AccountingMovement
        {
            Id = Guid.NewGuid(),
            IsIncome = false,
            CategoryId = Guid.NewGuid(),
            Amount = 600000m,
            Date = today,
            Description = "Pago de costo directo",
            FinancialAccountId = caja.Id,
            SourceType = MovementSourceType.DirectCost,
            RegisteredByUserId = Guid.NewGuid()
        });
        await context.SaveChangesAsync();

        // Act: se replican exactamente los mismos filtros que /api/dashboard/financial/kpis
        // (FinancialDashboardEndpoints.cs) para incomeCurrentMonth y expensesCurrentMonth.
        var incomeCurrentMonth = await context.AccountingMovements
            .Where(m => m.IsIncome && m.SourceType != MovementSourceType.InternalTransfer && m.Date.Month == today.Month && m.Date.Year == today.Year)
            .SumAsync(m => (decimal?)m.Amount) ?? 0;

        var expensesCurrentMonth = await context.AccountingMovements
            .Where(m => !m.IsIncome && m.SourceType != MovementSourceType.InternalTransfer && m.Date.Month == today.Month && m.Date.Year == today.Year)
            .SumAsync(m => (decimal?)m.Amount) ?? 0;

        // Assert: los KPIs brutos NO incluyen la transferencia
        Assert.Equal(1000000m, incomeCurrentMonth);
        Assert.Equal(600000m, expensesCurrentMonth);

        // Assert: el saldo por cuenta SÍ incluye la transferencia (misma fórmula que FinancialSummaryEndpoints / KPIs por cuenta)
        var allMovements = await context.AccountingMovements.ToListAsync();
        var cajaBalance = allMovements.Where(m => m.FinancialAccountId == caja.Id).Sum(m => m.IsIncome ? m.Amount : -m.Amount);
        var bancoBalance = allMovements.Where(m => m.FinancialAccountId == banco.Id).Sum(m => m.IsIncome ? m.Amount : -m.Amount);

        Assert.Equal(-500000m - 600000m, cajaBalance); // -500k por la transferencia saliente, -600k por el egreso real
        Assert.Equal(500000m + 1000000m, bancoBalance); // +500k por la transferencia entrante, +1.000.000 por el ingreso real
    }
}
