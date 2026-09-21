using GeoServ.Api.Domain.Entities;
using GeoServ.Api.Domain.Enums;
using GeoServ.Api.Infrastructure.Data;
using GeoServ.Api.Infrastructure.Services;
using Microsoft.EntityFrameworkCore;

namespace GeoServ.Api.Tests;

public class AlertCenterServiceTests
{
    private static GeoServDbContext CreateInMemoryContext()
    {
        var options = new DbContextOptionsBuilder<GeoServDbContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;

        return new GeoServDbContext(options);
    }

    [Fact]
    public async Task GetAlertsAsync_ShouldReturn_ActionableAlerts_ForCoreRules()
    {
        using var context = CreateInMemoryContext();
        var today = DateTime.UtcNow.Date;
        var service = new AlertCenterService(context);

        var statusIniciada = new ServiceOrderStatus { Id = Guid.NewGuid(), Name = "Iniciada" };
        var statusEntregada = new ServiceOrderStatus { Id = Guid.NewGuid(), Name = "Entregada" };
        var client = new Client { Id = Guid.NewGuid(), CompanyName = "Acme" };
        var serviceType = new ServiceType { Id = Guid.NewGuid(), Name = "Topografia" };
        var currency = new Currency { Id = Guid.NewGuid(), Code = "ARS", Symbol = "$", Name = "Peso" };
        var unit = new Unit { Id = Guid.NewGuid(), Name = "u" };
        var consumableClass = new ConsumableClass
        {
            Id = Guid.NewGuid(),
            Name = "General",
            ConsumableType = new ConsumableType { Id = Guid.NewGuid(), Name = "Materiales" }
        };
        var category = new FixedCostCategory { Id = Guid.NewGuid(), Name = "Servicios" };
        var fixedCostItem = new FixedCostItem { Id = Guid.NewGuid(), Name = "Internet", Category = category };

        context.AddRange(statusIniciada, statusEntregada, client, serviceType, currency, unit, consumableClass, category, fixedCostItem);

        context.ServiceOrders.AddRange(
            new ServiceOrder
            {
                Id = Guid.NewGuid(),
                OrderNumber = "OS-001",
                Client = client,
                ServiceType = serviceType,
                Currency = currency,
                Status = statusIniciada,
                EstimatedEndDate = today.AddDays(2),
                TotalAmount = 1000m,
                CreatedAt = today,
                UpdatedAt = today
            },
            new ServiceOrder
            {
                Id = Guid.NewGuid(),
                OrderNumber = "OS-002",
                Client = client,
                ServiceType = serviceType,
                Currency = currency,
                Status = statusEntregada,
                ActualEndDate = today.AddDays(-10),
                TotalAmount = 2000m,
                CollectedAmount = 500m,
                CreatedAt = today.AddDays(-20),
                UpdatedAt = today.AddDays(-10)
            });

        var consumable = new Consumable
        {
            Id = Guid.NewGuid(),
            Description = "Estacas",
            ConsumableClass = consumableClass,
            Unit = unit,
            MinimumStock = 10m
        };
        consumable.InventoryMovements.Add(new InventoryMovement
        {
            Id = Guid.NewGuid(),
            Consumable = consumable,
            Cantidad = 3m,
            Fecha = today
        });
        context.Consumables.Add(consumable);

        context.Checks.Add(new Check
        {
            Id = Guid.NewGuid(),
            CheckNumber = "CH-001",
            BankName = "Banco",
            Amount = 100m,
            DueDate = today.AddDays(3),
            Status = CheckStatus.InPortfolio
        });

        context.FixedCostPayments.Add(new FixedCostPayment
        {
            Id = Guid.NewGuid(),
            FixedCostItem = fixedCostItem,
            Amount = 300m,
            DueDate = today.AddDays(-1),
            IsPaid = false
        });

        await context.SaveChangesAsync();

        var result = await service.GetAlertsAsync(new AlertCenterQuery(null, null, null, null), userId: null);

        Assert.Contains(result.Items, a => a.Type == "ServiceOrderDueSoon");
        Assert.Contains(result.Items, a => a.Type == "ServiceOrderUncollected" && a.Amount == 1500m);
        Assert.Contains(result.Items, a => a.Type == "LowStock");
        Assert.Contains(result.Items, a => a.Type == "CheckDueSoon");
        Assert.Contains(result.Items, a => a.Type == "FixedCostPending" && a.Priority == AlertPriorities.Critical);
        Assert.True(result.Summary.ActionableCount >= 5);
    }

    [Fact]
    public async Task UpdateStateAsync_ShouldRemoveResolvedAlert_FromDefaultListing()
    {
        using var context = CreateInMemoryContext();
        var today = DateTime.UtcNow.Date;
        var userId = Guid.NewGuid();
        var service = new AlertCenterService(context);

        var statusEntregada = new ServiceOrderStatus { Id = Guid.NewGuid(), Name = "Entregada" };
        var client = new Client { Id = Guid.NewGuid(), CompanyName = "Acme" };
        var serviceType = new ServiceType { Id = Guid.NewGuid(), Name = "Topografia" };
        var currency = new Currency { Id = Guid.NewGuid(), Code = "ARS", Symbol = "$", Name = "Peso" };
        var order = new ServiceOrder
        {
            Id = Guid.NewGuid(),
            OrderNumber = "OS-010",
            Client = client,
            ServiceType = serviceType,
            Currency = currency,
            Status = statusEntregada,
            ActualEndDate = today,
            TotalAmount = 1000m,
            CollectedAmount = 0m,
            CreatedAt = today,
            UpdatedAt = today
        };

        context.AddRange(statusEntregada, client, serviceType, currency, order);
        await context.SaveChangesAsync();

        var before = await service.GetAlertsAsync(new AlertCenterQuery(null, null, null, null), userId);
        var alert = Assert.Single(before.Items.Where(a => a.Type == "ServiceOrderUncollected"));

        await service.UpdateStateAsync(alert.Id, new UpdateAlertStateRequest(AlertStates.Resolved, null), userId);

        var afterDefault = await service.GetAlertsAsync(new AlertCenterQuery(null, null, null, null), userId);
        Assert.DoesNotContain(afterDefault.Items, a => a.Id == alert.Id);

        var afterResolved = await service.GetAlertsAsync(new AlertCenterQuery(null, null, AlertStates.Resolved, null), userId);
        Assert.Contains(afterResolved.Items, a => a.Id == alert.Id);
    }
}
