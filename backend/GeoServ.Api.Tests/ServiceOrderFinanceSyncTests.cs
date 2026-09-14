using GeoServ.Api.Domain.Entities;
using GeoServ.Api.Domain.Enums;
using GeoServ.Api.Endpoints;
using GeoServ.Api.Infrastructure.Data;
using GeoServ.Api.Infrastructure.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;
using Xunit;

namespace GeoServ.Api.Tests;

public class ServiceOrderFinanceSyncTests
{
    private GeoServDbContext CreateInMemoryContext()
    {
        var options = new DbContextOptionsBuilder<GeoServDbContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;

        return new GeoServDbContext(options);
    }

    private async Task SetCollectedAmountModeAsync(GeoServDbContext context, string mode)
    {
        var empresa = new Empresa { Id = Guid.NewGuid(), Nombre = "Empresa Test" };
        context.Empresas.Add(empresa);
        await context.SaveChangesAsync();

        var configService = new EmpresaConfiguracionService(context);
        await configService.SetValueAsync("os_collected_amount_mode", mode, "string", null, "Órdenes de Servicio");
    }

    private async Task<(ServiceOrderStatus entregada, ServiceOrderStatus cobrada)> SeedStatusesAsync(GeoServDbContext context)
    {
        var entregada = new ServiceOrderStatus { Id = Guid.NewGuid(), Name = "Entregada" };
        var cobrada = new ServiceOrderStatus { Id = Guid.NewGuid(), Name = "Cobrada" };
        context.ServiceOrderStatuses.AddRange(entregada, cobrada);
        await context.SaveChangesAsync();
        return (entregada, cobrada);
    }

    private async Task<ServiceOrder> SeedOrderAsync(GeoServDbContext context, ServiceOrderStatus status, decimal totalAmount, decimal collectedAmount = 0)
    {
        var order = new ServiceOrder
        {
            Id = Guid.NewGuid(),
            OrderNumber = $"OS-{Guid.NewGuid().ToString()[..6]}",
            StatusId = status.Id,
            Status = status,
            TotalAmount = totalAmount,
            CollectedAmount = collectedAmount,
            CreatedAt = DateTime.UtcNow
        };
        context.ServiceOrders.Add(order);
        await context.SaveChangesAsync();
        return order;
    }

    private async Task<(FinancialAccount account, MovementCategory incomeCategory, MovementCategory directCostCategory)> SeedFinanceCatalogsAsync(GeoServDbContext context)
    {
        var account = new FinancialAccount { Id = Guid.NewGuid(), Name = "Caja", AccountNumber = "001", AccountType = "Cash", CurrencyId = Guid.NewGuid(), IsActive = true };
        var incomeCategory = new MovementCategory { Id = Guid.NewGuid(), Name = "Cobro de OS", IsIncome = true, IsActive = true, LinkedSourceType = MovementSourceType.ServiceOrderIncome };
        var directCostCategory = new MovementCategory { Id = Guid.NewGuid(), Name = "Pago de Costo Directo", IsIncome = false, IsActive = true, LinkedSourceType = MovementSourceType.DirectCost };
        context.FinancialAccounts.Add(account);
        context.MovementCategories.AddRange(incomeCategory, directCostCategory);

        var user = new User { Id = Guid.NewGuid(), Email = "user@geoserv.com", Name = "Usuario", PasswordHash = "hash" };
        context.Users.Add(user);

        await context.SaveChangesAsync();
        return (account, incomeCategory, directCostCategory);
    }

    // --- Cobros (Ingresos) ---

    [Fact]
    public async Task CreateMovementAsync_ModoManual_NoAlteraCollectedAmount()
    {
        using var context = CreateInMemoryContext();
        await SetCollectedAmountModeAsync(context, "Manual");
        var (entregada, _) = await SeedStatusesAsync(context);
        var order = await SeedOrderAsync(context, entregada, 100000m);
        var (account, incomeCategory, _) = await SeedFinanceCatalogsAsync(context);

        var request = new CreateMovementRequest(true, incomeCategory.Id, 100000m, DateTime.UtcNow.Date, "Cobro total", account.Id, null, MovementSourceType.ServiceOrderIncome, order.Id.ToString(), null, null);
        var result = await AccountingMovementEndpoints.CreateMovementAsync(request, Guid.NewGuid(), context);
        Assert.IsAssignableFrom<IStatusCodeHttpResult>(result);

        var reloaded = await context.ServiceOrders.AsNoTracking().FirstAsync(o => o.Id == order.Id);
        Assert.Equal(0m, reloaded.CollectedAmount);
        Assert.Equal(entregada.Id, reloaded.StatusId);
    }

    [Fact]
    public async Task CreateMovementAsync_ModoAutomatico_CobroCompletaTotalOrdenEntregada_TransicionaACobradaYRegistraHitos()
    {
        using var context = CreateInMemoryContext();
        await SetCollectedAmountModeAsync(context, "Automatic");
        var (entregada, cobrada) = await SeedStatusesAsync(context);
        var order = await SeedOrderAsync(context, entregada, 100000m);
        var (account, incomeCategory, _) = await SeedFinanceCatalogsAsync(context);
        var userId = Guid.NewGuid();
        context.Users.Add(new User { Id = userId, Email = "u2@geoserv.com", Name = "U2", PasswordHash = "h" });
        await context.SaveChangesAsync();

        var request = new CreateMovementRequest(true, incomeCategory.Id, 100000m, DateTime.UtcNow.Date, "Cobro total", account.Id, null, MovementSourceType.ServiceOrderIncome, order.Id.ToString(), null, null);
        var result = await AccountingMovementEndpoints.CreateMovementAsync(request, userId, context);
        Assert.IsAssignableFrom<IStatusCodeHttpResult>(result);

        var reloaded = await context.ServiceOrders.Include(o => o.Observations).AsNoTracking().FirstAsync(o => o.Id == order.Id);
        Assert.Equal(100000m, reloaded.CollectedAmount);
        Assert.Equal(cobrada.Id, reloaded.StatusId);
        Assert.NotNull(reloaded.CollectionDate);
        Assert.All(reloaded.Observations, o => Assert.Equal("Hito Clave", o.ObservationType));
        Assert.Contains(reloaded.Observations, o => o.Text.Contains("Se registró un cobro"));
        Assert.Contains(reloaded.Observations, o => o.Text.Contains("marcada automáticamente como Cobrada"));
    }

    [Fact]
    public async Task DeleteMovementAsync_ModoAutomatico_EliminarCobroRevierteDeCobradaAEntregada()
    {
        using var context = CreateInMemoryContext();
        await SetCollectedAmountModeAsync(context, "Automatic");
        var (entregada, cobrada) = await SeedStatusesAsync(context);
        var order = await SeedOrderAsync(context, entregada, 100000m);
        var (account, incomeCategory, _) = await SeedFinanceCatalogsAsync(context);

        var createRequest = new CreateMovementRequest(true, incomeCategory.Id, 100000m, DateTime.UtcNow.Date, "Cobro total", account.Id, null, MovementSourceType.ServiceOrderIncome, order.Id.ToString(), null, null);
        await AccountingMovementEndpoints.CreateMovementAsync(createRequest, Guid.NewGuid(), context);

        var movement = await context.AccountingMovements.FirstAsync();
        var orderAfterCreate = await context.ServiceOrders.AsNoTracking().FirstAsync(o => o.Id == order.Id);
        Assert.Equal(cobrada.Id, orderAfterCreate.StatusId);

        var deleteResult = await AccountingMovementEndpoints.DeleteMovementAsync(movement.Id, context, Guid.NewGuid());
        Assert.IsType<NoContent>(deleteResult);

        var orderAfterDelete = await context.ServiceOrders.Include(o => o.Observations).AsNoTracking().FirstAsync(o => o.Id == order.Id);
        Assert.Equal(0m, orderAfterDelete.CollectedAmount);
        Assert.Equal(entregada.Id, orderAfterDelete.StatusId);
        Assert.Null(orderAfterDelete.CollectionDate);
        Assert.Contains(orderAfterDelete.Observations, o => o.Text.Contains("revertida automáticamente a estado Entregada"));
    }

    // --- Costos Directos vía Movimiento ---

    [Fact]
    public async Task CreateMovementAsync_CostoDirectoViaMovimiento_CategoriaNoAsignable_RetornaBadRequest()
    {
        using var context = CreateInMemoryContext();
        var (entregada, _) = await SeedStatusesAsync(context);
        var order = await SeedOrderAsync(context, entregada, 100000m);
        var (account, _, directCostCategory) = await SeedFinanceCatalogsAsync(context);
        var dcCategory = new DirectCostCategory { Id = Guid.NewGuid(), Name = "Combustible", IsActive = true, IsAssignableViaMovement = false };
        context.DirectCostCategories.Add(dcCategory);
        await context.SaveChangesAsync();

        var request = new CreateMovementRequest(false, directCostCategory.Id, 15000m, DateTime.UtcNow.Date, "Nafta", account.Id, null, MovementSourceType.DirectCost, order.Id.ToString(), null, null, dcCategory.Id);
        var result = await AccountingMovementEndpoints.CreateMovementAsync(request, Guid.NewGuid(), context);

        var badRequest = Assert.IsAssignableFrom<IStatusCodeHttpResult>(result);
        Assert.Equal(400, badRequest.StatusCode);
        Assert.Empty(await context.AccountingMovements.ToListAsync());
    }

    [Fact]
    public async Task CreateMovementAsync_CostoDirectoViaMovimiento_CreaFilaNuevaSinAdoptarFilaManual()
    {
        using var context = CreateInMemoryContext();
        var (entregada, _) = await SeedStatusesAsync(context);
        var order = await SeedOrderAsync(context, entregada, 100000m);
        var (account, _, directCostCategory) = await SeedFinanceCatalogsAsync(context);
        var dcCategory = new DirectCostCategory { Id = Guid.NewGuid(), Name = "Combustible", IsActive = true, IsAssignableViaMovement = true };
        context.DirectCostCategories.Add(dcCategory);
        var user = await context.Users.FirstAsync();

        // Fila manual preexistente en la misma categoría/orden: no debe ser tocada ni adoptada.
        var manualRow = new DirectCost
        {
            Id = Guid.NewGuid(),
            ServiceOrderId = order.Id,
            CategoryId = dcCategory.Id,
            Description = "Combustible cargado a mano",
            Quantity = 50,
            UnitPrice = 1000,
            TotalAmount = 50000,
            Date = DateTime.UtcNow.Date,
            Status = "Pendiente",
            IsFromMovement = false,
            RegisteredByUserId = user.Id
        };
        context.DirectCosts.Add(manualRow);
        await context.SaveChangesAsync();

        var request = new CreateMovementRequest(false, directCostCategory.Id, 15000m, DateTime.UtcNow.Date, "Nafta", account.Id, null, MovementSourceType.DirectCost, order.Id.ToString(), null, null, dcCategory.Id);
        var result = await AccountingMovementEndpoints.CreateMovementAsync(request, user.Id, context);
        Assert.IsAssignableFrom<IStatusCodeHttpResult>(result);

        var manualReloaded = await context.DirectCosts.AsNoTracking().FirstAsync(d => d.Id == manualRow.Id);
        Assert.Equal(50000, manualReloaded.TotalAmount); // intacta

        var autoRow = await context.DirectCosts.AsNoTracking().FirstAsync(d => d.IsFromMovement);
        Assert.Equal(15000m, autoRow.TotalAmount);
        Assert.Equal(15000m, autoRow.UnitPrice);
        Assert.Equal(1, autoRow.Quantity);
        Assert.Equal("Pagado", autoRow.Status);

        var movement = await context.AccountingMovements.FirstAsync();
        Assert.Equal(autoRow.Id, movement.DirectCostId);

        var orderObs = await context.ServiceOrderObservations.Where(o => o.ServiceOrderId == order.Id).ToListAsync();
        Assert.Contains(orderObs, o => o.Text.Contains("Se registró un pago de costo directo"));
    }

    [Fact]
    public async Task CreateMovementAsync_CostoDirectoViaMovimiento_SegundoMovimientoConsolidaEnLaMismaFila()
    {
        using var context = CreateInMemoryContext();
        var (entregada, _) = await SeedStatusesAsync(context);
        var order = await SeedOrderAsync(context, entregada, 100000m);
        var (account, _, directCostCategory) = await SeedFinanceCatalogsAsync(context);
        var dcCategory = new DirectCostCategory { Id = Guid.NewGuid(), Name = "Combustible", IsActive = true, IsAssignableViaMovement = true };
        context.DirectCostCategories.Add(dcCategory);
        await context.SaveChangesAsync();
        var user = await context.Users.FirstAsync();

        var request1 = new CreateMovementRequest(false, directCostCategory.Id, 15000m, DateTime.UtcNow.Date, "Nafta 1", account.Id, null, MovementSourceType.DirectCost, order.Id.ToString(), null, null, dcCategory.Id);
        await AccountingMovementEndpoints.CreateMovementAsync(request1, user.Id, context);

        var request2 = new CreateMovementRequest(false, directCostCategory.Id, 10000m, DateTime.UtcNow.Date.AddDays(1), "Nafta 2", account.Id, null, MovementSourceType.DirectCost, order.Id.ToString(), null, null, dcCategory.Id);
        await AccountingMovementEndpoints.CreateMovementAsync(request2, user.Id, context);

        var rows = await context.DirectCosts.Where(d => d.IsFromMovement).ToListAsync();
        var row = Assert.Single(rows);
        Assert.Equal(25000m, row.TotalAmount);
        Assert.Equal(25000m, row.UnitPrice);

        var movements = await context.AccountingMovements.ToListAsync();
        Assert.All(movements, m => Assert.Equal(row.Id, m.DirectCostId));
    }

    [Fact]
    public async Task DeleteMovementAsync_CostoDirectoViaMovimiento_EliminaFilaSiQuedaEnCero()
    {
        using var context = CreateInMemoryContext();
        var (entregada, _) = await SeedStatusesAsync(context);
        var order = await SeedOrderAsync(context, entregada, 100000m);
        var (account, _, directCostCategory) = await SeedFinanceCatalogsAsync(context);
        var dcCategory = new DirectCostCategory { Id = Guid.NewGuid(), Name = "Combustible", IsActive = true, IsAssignableViaMovement = true };
        context.DirectCostCategories.Add(dcCategory);
        await context.SaveChangesAsync();
        var user = await context.Users.FirstAsync();

        var request = new CreateMovementRequest(false, directCostCategory.Id, 15000m, DateTime.UtcNow.Date, "Nafta", account.Id, null, MovementSourceType.DirectCost, order.Id.ToString(), null, null, dcCategory.Id);
        await AccountingMovementEndpoints.CreateMovementAsync(request, user.Id, context);

        var movement = await context.AccountingMovements.FirstAsync();
        var rowId = movement.DirectCostId!.Value;

        var deleteResult = await AccountingMovementEndpoints.DeleteMovementAsync(movement.Id, context, user.Id);
        Assert.IsType<NoContent>(deleteResult);

        Assert.Null(await context.DirectCosts.FindAsync(rowId));
        var obs = await context.ServiceOrderObservations.Where(o => o.ServiceOrderId == order.Id).ToListAsync();
        Assert.Contains(obs, o => o.Text.Contains("eliminó el costo directo"));
    }
}
