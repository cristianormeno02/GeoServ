using GeoServ.Api.Domain.Entities;
using GeoServ.Api.Domain.Enums;
using GeoServ.Api.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using Xunit;

namespace GeoServ.Api.Tests;

public class DirectCostAndMovementTests
{
    private GeoServDbContext CreateInMemoryContext()
    {
        var options = new DbContextOptionsBuilder<GeoServDbContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;

        return new GeoServDbContext(options);
    }

    [Fact]
    public async Task GetAllDirectCosts_ShouldReturnCosts_WithServiceOrderAndCategoryDetails()
    {
        // Arrange
        using var context = CreateInMemoryContext();

        var client = new Client
        {
            Id = Guid.NewGuid(),
            CompanyName = "Cliente Test"
        };
        var status = new ServiceOrderStatus
        {
            Id = Guid.NewGuid(),
            Name = "Iniciada"
        };
        var order = new ServiceOrder
        {
            Id = Guid.NewGuid(),
            OrderNumber = "00000100",
            Description = "Orden de prueba",
            ClientId = client.Id,
            Client = client,
            StatusId = status.Id,
            Status = status
        };
        var category = new DirectCostCategory
        {
            Id = Guid.NewGuid(),
            Name = "Materiales"
        };
        var provider = new Provider
        {
            Id = Guid.NewGuid(),
            Name = "Proveedor Central"
        };
        var user = new User
        {
            Id = Guid.NewGuid(),
            Email = "admin@geoserv.com",
            Name = "admin",
            PasswordHash = "hash"
        };

        var cost1 = new DirectCost
        {
            Id = Guid.NewGuid(),
            ServiceOrderId = order.Id,
            ServiceOrder = order,
            CategoryId = category.Id,
            Category = category,
            ProviderId = provider.Id,
            Provider = provider,
            Description = "Varillas de acero",
            TotalAmount = 50000m,
            Date = DateTime.UtcNow.AddDays(-1),
            RegisteredByUserId = user.Id,
            RegisteredByUser = user
        };

        var cost2 = new DirectCost
        {
            Id = Guid.NewGuid(),
            ServiceOrderId = order.Id,
            ServiceOrder = order,
            CategoryId = category.Id,
            Category = category,
            Description = "Cemento",
            TotalAmount = 25000m,
            Date = DateTime.UtcNow,
            RegisteredByUserId = user.Id,
            RegisteredByUser = user
        };

        context.Users.Add(user);
        context.Clients.Add(client);
        context.ServiceOrderStatuses.Add(status);
        context.ServiceOrders.Add(order);
        context.DirectCostCategories.Add(category);
        context.Providers.Add(provider);
        context.DirectCosts.AddRange(cost1, cost2);
        await context.SaveChangesAsync();

        // Act - Query as mapped in GET /api/direct-costs
        var results = await context.DirectCosts
            .Include(c => c.ServiceOrder)
            .Include(c => c.Category)
            .Include(c => c.Provider)
            .OrderByDescending(c => c.Date)
            .Select(c => new
            {
                c.Id,
                c.Description,
                c.TotalAmount,
                c.Date,
                c.Status,
                c.ServiceOrderId,
                ServiceOrderNumber = c.ServiceOrder != null ? c.ServiceOrder.OrderNumber : null,
                CategoryName = c.Category != null ? c.Category.Name : null,
                ProviderName = c.Provider != null ? c.Provider.Name : null
            })
            .ToListAsync();

        // Assert
        Assert.Equal(2, results.Count);
        Assert.Equal(cost2.Id, results[0].Id); // más reciente primero
        Assert.Equal("00000100", results[0].ServiceOrderNumber);
        Assert.Equal("Materiales", results[0].CategoryName);
        Assert.Equal("Proveedor Central", results[1].ProviderName);
    }

    [Fact]
    public async Task AccountingMovement_WhenCreatedWithDirectCostSource_ShouldLinkDirectCostId()
    {
        // Arrange
        using var context = CreateInMemoryContext();

        var directCostId = Guid.NewGuid();
        var accountId = Guid.NewGuid();
        var categoryId = Guid.NewGuid();
        var userId = Guid.NewGuid();

        var sourceType = MovementSourceType.DirectCost;
        var sourceId = directCostId.ToString();

        Guid? serviceOrderId = null;
        Guid? assignedDirectCostId = null;
        Guid? fixedCostId = null;
        Guid? assetId = null;

        if (Guid.TryParse(sourceId, out var parsedGuid))
        {
            if (sourceType == MovementSourceType.ServiceOrderIncome) serviceOrderId = parsedGuid;
            else if (sourceType == MovementSourceType.DirectCost) assignedDirectCostId = parsedGuid;
            else if (sourceType == MovementSourceType.FixedCostPayment) fixedCostId = parsedGuid;
            else if (sourceType == MovementSourceType.AssetPurchase) assetId = parsedGuid;
        }

        var movement = new AccountingMovement
        {
            Id = Guid.NewGuid(),
            IsIncome = false,
            CategoryId = categoryId,
            Amount = 15000m,
            Date = DateTime.UtcNow,
            Description = "Pago de costo directo",
            FinancialAccountId = accountId,
            RegisteredByUserId = userId,
            SourceType = sourceType,
            SourceId = sourceId,
            DirectCostId = assignedDirectCostId,
            ServiceOrderId = serviceOrderId,
            FixedCostId = fixedCostId,
            AssetId = assetId
        };

        context.AccountingMovements.Add(movement);
        await context.SaveChangesAsync();

        // Assert
        var savedMovement = await context.AccountingMovements.FindAsync(movement.Id);
        Assert.NotNull(savedMovement);
        Assert.Equal(MovementSourceType.DirectCost, savedMovement.SourceType);
        Assert.Equal(sourceId, savedMovement.SourceId);
        Assert.Equal(directCostId, savedMovement.DirectCostId);
    }
}
