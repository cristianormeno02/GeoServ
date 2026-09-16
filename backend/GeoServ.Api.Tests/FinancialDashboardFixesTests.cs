using GeoServ.Api.Domain.Entities;
using GeoServ.Api.Domain.Enums;
using GeoServ.Api.Endpoints;
using GeoServ.Api.Infrastructure.Data;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Text.Json;
using Xunit;

namespace GeoServ.Api.Tests;

public class FinancialDashboardFixesTests
{
    private GeoServDbContext CreateInMemoryContext()
    {
        var options = new DbContextOptionsBuilder<GeoServDbContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;

        return new GeoServDbContext(options);
    }

    [Fact]
    public async Task GetMonthlyCoverageReportAsync_MesesDiscontinuos_Retorna12MesesContiguosSinSaltearYConArrastre()
    {
        using var context = CreateInMemoryContext();
        var now = DateTime.UtcNow;
        var threeMonthsAgo = now.AddMonths(-3);
        var currentMonth = now;

        var currency = new Currency { Id = Guid.NewGuid(), Name = "Pesos", Symbol = "$", Code = "ARS" };
        var account = new FinancialAccount { Id = Guid.NewGuid(), Name = "Banco", AccountNumber = "001", AccountType = "BankAccount", CurrencyId = currency.Id, IsActive = true };
        var category = new MovementCategory { Id = Guid.NewGuid(), Name = "Ventas", IsIncome = true };
        context.Currencies.Add(currency);
        context.FinancialAccounts.Add(account);
        context.MovementCategories.Add(category);

        // Movimiento hace 3 meses: Ingreso de 100.000
        context.AccountingMovements.Add(new AccountingMovement
        {
            Id = Guid.NewGuid(),
            IsIncome = true,
            CategoryId = category.Id,
            Amount = 100000m,
            Date = new DateTime(threeMonthsAgo.Year, threeMonthsAgo.Month, 10),
            Description = "Cobro hace 3 meses",
            FinancialAccountId = account.Id,
            SourceType = MovementSourceType.ServiceOrderIncome
        });

        // Movimiento este mes: Ingreso de 50.000
        context.AccountingMovements.Add(new AccountingMovement
        {
            Id = Guid.NewGuid(),
            IsIncome = true,
            CategoryId = category.Id,
            Amount = 50000m,
            Date = new DateTime(currentMonth.Year, currentMonth.Month, 1),
            Description = "Cobro este mes",
            FinancialAccountId = account.Id,
            SourceType = MovementSourceType.ServiceOrderIncome
        });

        await context.SaveChangesAsync();

        var result = await FinancialDashboardEndpoints.GetMonthlyCoverageReportAsync(12, context);

        var okResult = Assert.IsAssignableFrom<IStatusCodeHttpResult>(result);
        Assert.Equal(200, okResult.StatusCode);

        var valueResult = Assert.IsAssignableFrom<IValueHttpResult>(result);
        var jsonOptions = new JsonSerializerOptions { PropertyNamingPolicy = JsonNamingPolicy.CamelCase };
        var json = JsonSerializer.Serialize(valueResult.Value, jsonOptions);
        using var doc = JsonDocument.Parse(json);
        var root = doc.RootElement;
        Assert.Equal(JsonValueKind.Array, root.ValueKind);
        Assert.Equal(12, root.GetArrayLength());

        var items = root.EnumerateArray().ToList();

        // Verificar que los 12 períodos son estrictamente consecutivos mes a mes hasta el actual
        for (int i = 0; i < 12; i++)
        {
            var expectedPeriodo = now.AddMonths(-(11 - i)).ToString("yyyy-MM");
            var item = items[i];
            Assert.Equal(expectedPeriodo, item.GetProperty("periodo").GetString());
        }

        // El mes hace 2 meses (-2) no tuvo movimientos: ingresos = 0, saldo acumulado = 100.000
        var periodMinus2 = items[12 - 1 - 2];
        Assert.Equal(0m, periodMinus2.GetProperty("ingresos").GetDecimal());
        Assert.Equal(100000m, periodMinus2.GetProperty("saldoAcumulado").GetDecimal());

        // El mes hace 1 mes (-1) tampoco tuvo movimientos: ingresos = 0, saldo acumulado = 100.000
        var periodMinus1 = items[12 - 1 - 1];
        Assert.Equal(0m, periodMinus1.GetProperty("ingresos").GetDecimal());
        Assert.Equal(100000m, periodMinus1.GetProperty("saldoAcumulado").GetDecimal());

        // El mes actual (-0) tuvo 50.000: saldo acumulado = 150.000
        var periodCurrent = items[12 - 1];
        Assert.Equal(50000m, periodCurrent.GetProperty("ingresos").GetDecimal());
        Assert.Equal(150000m, periodCurrent.GetProperty("saldoAcumulado").GetDecimal());
    }

    [Fact]
    public async Task GetServiceOrdersProfitabilityAsync_SoloOrdenesCobradas_ExcluyeOtrasYCalculaConCollectedAmount()
    {
        using var context = CreateInMemoryContext();

        var client = new Client { Id = Guid.NewGuid(), CompanyName = "Cliente Test" };
        var serviceType = new ServiceType { Id = Guid.NewGuid(), Name = "Topografía" };
        var currency = new Currency { Id = Guid.NewGuid(), Name = "Pesos", Symbol = "$", Code = "ARS" };

        var statusIniciada = new ServiceOrderStatus { Id = Guid.NewGuid(), Name = "Iniciada" };
        var statusEntregada = new ServiceOrderStatus { Id = Guid.NewGuid(), Name = "Entregada" };
        var statusCobrada = new ServiceOrderStatus { Id = Guid.NewGuid(), Name = "Cobrada" };
        var statusCancelada = new ServiceOrderStatus { Id = Guid.NewGuid(), Name = "Cancelada" };

        context.Clients.Add(client);
        context.ServiceTypes.Add(serviceType);
        context.Currencies.Add(currency);
        context.ServiceOrderStatuses.AddRange(statusIniciada, statusEntregada, statusCobrada, statusCancelada);

        // 1. Orden Iniciada (sin cobrar) -> NO debe incluirse
        var orderIniciada = new ServiceOrder
        {
            Id = Guid.NewGuid(),
            OrderNumber = "OS-INICIADA",
            ClientId = client.Id,
            ServiceTypeId = serviceType.Id,
            StatusId = statusIniciada.Id,
            CurrencyId = currency.Id,
            TotalAmount = 500000m,
            CollectedAmount = 0m,
            CreatedAt = DateTime.UtcNow.AddDays(-10)
        };

        // 2. Orden Entregada (sin cobrar) -> NO debe incluirse
        var orderEntregada = new ServiceOrder
        {
            Id = Guid.NewGuid(),
            OrderNumber = "OS-ENTREGADA",
            ClientId = client.Id,
            ServiceTypeId = serviceType.Id,
            StatusId = statusEntregada.Id,
            CurrencyId = currency.Id,
            TotalAmount = 800000m,
            CollectedAmount = 0m,
            CreatedAt = DateTime.UtcNow.AddDays(-8)
        };

        // 3. Orden Cobrada A -> DEBE incluirse
        var orderCobradaA = new ServiceOrder
        {
            Id = Guid.NewGuid(),
            OrderNumber = "OS-COBRADA-A",
            ClientId = client.Id,
            ServiceTypeId = serviceType.Id,
            StatusId = statusCobrada.Id,
            CurrencyId = currency.Id,
            TotalAmount = 1000000m,
            CollectedAmount = 1000000m,
            CollectionDate = DateTime.UtcNow.AddDays(-3),
            CreatedAt = DateTime.UtcNow.AddDays(-20)
        };
        orderCobradaA.DirectCosts.Add(new DirectCost
        {
            Id = Guid.NewGuid(),
            ServiceOrderId = orderCobradaA.Id,
            TotalAmount = 300000m,
            UnitPrice = 300000m,
            Quantity = 1,
            Description = "Materiales"
        });

        // 4. Orden Cobrada B -> DEBE incluirse
        var orderCobradaB = new ServiceOrder
        {
            Id = Guid.NewGuid(),
            OrderNumber = "OS-COBRADA-B",
            ClientId = client.Id,
            ServiceTypeId = serviceType.Id,
            StatusId = statusCobrada.Id,
            CurrencyId = currency.Id,
            TotalAmount = 400000m,
            CollectedAmount = 400000m,
            CollectionDate = DateTime.UtcNow.AddDays(-2),
            CreatedAt = DateTime.UtcNow.AddDays(-15)
        };
        orderCobradaB.DirectCosts.Add(new DirectCost
        {
            Id = Guid.NewGuid(),
            ServiceOrderId = orderCobradaB.Id,
            TotalAmount = 200000m,
            UnitPrice = 200000m,
            Quantity = 1,
            Description = "Combustible"
        });

        context.ServiceOrders.AddRange(orderIniciada, orderEntregada, orderCobradaA, orderCobradaB);
        await context.SaveChangesAsync();

        var result = await FinancialDashboardEndpoints.GetServiceOrdersProfitabilityAsync(null, null, context);

        var okResult = Assert.IsAssignableFrom<IStatusCodeHttpResult>(result);
        Assert.Equal(200, okResult.StatusCode);

        var valueResult = Assert.IsAssignableFrom<IValueHttpResult>(result);
        var jsonOptions = new JsonSerializerOptions { PropertyNamingPolicy = JsonNamingPolicy.CamelCase };
        var json = JsonSerializer.Serialize(valueResult.Value, jsonOptions);
        using var doc = JsonDocument.Parse(json);
        var root = doc.RootElement;

        // Solo 2 órdenes deben ser analizadas (las 2 cobradas)
        Assert.Equal(2, root.GetProperty("totalAnalyzed").GetInt32());

        var topOrders = root.GetProperty("topOrders").EnumerateArray().ToList();
        Assert.Equal(2, topOrders.Count);

        // La más rentable debe ser OS-COBRADA-A con ganancia 700.000 y margen 70%
        Assert.Equal("OS-COBRADA-A", topOrders[0].GetProperty("orderNumber").GetString());
        Assert.Equal(1000000m, topOrders[0].GetProperty("income").GetDecimal());
        Assert.Equal(300000m, topOrders[0].GetProperty("directCosts").GetDecimal());
        Assert.Equal(700000m, topOrders[0].GetProperty("profit").GetDecimal());
        Assert.Equal(70.0, topOrders[0].GetProperty("marginPercentage").GetDouble());

        // La segunda debe ser OS-COBRADA-B con ganancia 200.000 y margen 50%
        Assert.Equal("OS-COBRADA-B", topOrders[1].GetProperty("orderNumber").GetString());
        Assert.Equal(400000m, topOrders[1].GetProperty("income").GetDecimal());
        Assert.Equal(200000m, topOrders[1].GetProperty("directCosts").GetDecimal());
        Assert.Equal(200000m, topOrders[1].GetProperty("profit").GetDecimal());
        Assert.Equal(50.0, topOrders[1].GetProperty("marginPercentage").GetDouble());
    }
}
