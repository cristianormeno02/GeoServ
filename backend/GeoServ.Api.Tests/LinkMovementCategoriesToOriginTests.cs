using GeoServ.Api.Domain.Entities;
using GeoServ.Api.Domain.Enums;
using GeoServ.Api.Endpoints;
using GeoServ.Api.Infrastructure.Data;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;
using Xunit;

namespace GeoServ.Api.Tests;

public class LinkMovementCategoriesToOriginTests
{
    private GeoServDbContext CreateInMemoryContext()
    {
        var options = new DbContextOptionsBuilder<GeoServDbContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;

        return new GeoServDbContext(options);
    }

    private async Task<(FinancialAccount account, MovementCategory categoriaLinkeada, MovementCategory categoriaSinVinculo)> SeedBaseAsync(GeoServDbContext context, bool isIncome, MovementSourceType? linkedSourceType)
    {
        var account = new FinancialAccount { Id = Guid.NewGuid(), Name = "Caja", AccountNumber = "001", AccountType = "Cash", CurrencyId = Guid.NewGuid(), IsActive = true };
        var categoriaLinkeada = new MovementCategory { Id = Guid.NewGuid(), Name = "Categoría vinculada", IsIncome = isIncome, IsActive = true, LinkedSourceType = linkedSourceType };
        var categoriaSinVinculo = new MovementCategory { Id = Guid.NewGuid(), Name = "Categoría sin vínculo", IsIncome = isIncome, IsActive = true, LinkedSourceType = null };
        context.FinancialAccounts.Add(account);
        context.MovementCategories.AddRange(categoriaLinkeada, categoriaSinVinculo);
        await context.SaveChangesAsync();
        return (account, categoriaLinkeada, categoriaSinVinculo);
    }

    private async Task<FixedCostItem> SeedFixedCostItemAsync(GeoServDbContext context, bool isRecurring, params (DateTime dueDate, decimal amount, bool isPaid)[] payments)
    {
        var category = new FixedCostCategory { Id = Guid.NewGuid(), Name = "Alquileres" };
        var item = new FixedCostItem
        {
            Id = Guid.NewGuid(),
            Name = "Alquiler Galpón",
            CategoryId = category.Id,
            Category = category,
            IsRecurring = isRecurring,
            Payments = payments.Select(p => new FixedCostPayment
            {
                Id = Guid.NewGuid(),
                DueDate = p.dueDate,
                Amount = p.amount,
                IsPaid = p.isPaid
            }).ToList()
        };
        context.FixedCostCategories.Add(category);
        context.FixedCostItems.Add(item);
        await context.SaveChangesAsync();
        return item;
    }

    // --- Coherencia categoría/origen (MovementCategoryEndpoints.ValidateLinkedSourceTypeCoherence) ---

    [Fact]
    public void ValidateLinkedSourceTypeCoherence_IngresoConServiceOrderIncome_EsValido()
    {
        var error = MovementCategoryEndpoints.ValidateLinkedSourceTypeCoherence(true, MovementSourceType.ServiceOrderIncome);
        Assert.Null(error);
    }

    [Fact]
    public void ValidateLinkedSourceTypeCoherence_IngresoConAssetPurchase_RetornaError()
    {
        var error = MovementCategoryEndpoints.ValidateLinkedSourceTypeCoherence(true, MovementSourceType.AssetPurchase);
        Assert.NotNull(error);
    }

    [Fact]
    public void ValidateLinkedSourceTypeCoherence_EgresoConFixedCostPayment_EsValido()
    {
        var error = MovementCategoryEndpoints.ValidateLinkedSourceTypeCoherence(false, MovementSourceType.FixedCostPayment);
        Assert.Null(error);
    }

    [Fact]
    public void ValidateLinkedSourceTypeCoherence_EgresoConServiceOrderIncome_RetornaError()
    {
        var error = MovementCategoryEndpoints.ValidateLinkedSourceTypeCoherence(false, MovementSourceType.ServiceOrderIncome);
        Assert.NotNull(error);
    }

    [Fact]
    public void ValidateLinkedSourceTypeCoherence_SinVinculo_EsValidoParaIngresoYEgreso()
    {
        Assert.Null(MovementCategoryEndpoints.ValidateLinkedSourceTypeCoherence(true, null));
        Assert.Null(MovementCategoryEndpoints.ValidateLinkedSourceTypeCoherence(false, null));
    }

    // --- Validación de coherencia al crear/editar movimientos ---

    [Fact]
    public async Task CreateMovementAsync_CategoriaVinculadaConSourceTypeDistinto_RetornaBadRequest()
    {
        using var context = CreateInMemoryContext();
        var (account, categoriaLinkeada, _) = await SeedBaseAsync(context, isIncome: false, MovementSourceType.AssetPurchase);

        var request = new CreateMovementRequest(false, categoriaLinkeada.Id, 1000m, DateTime.UtcNow.Date, "desc", account.Id, null, MovementSourceType.DirectCost, Guid.NewGuid().ToString(), null, null);
        var result = await AccountingMovementEndpoints.CreateMovementAsync(request, Guid.NewGuid(), context);

        var badRequest = Assert.IsAssignableFrom<IStatusCodeHttpResult>(result);
        Assert.Equal(400, badRequest.StatusCode);
        Assert.Empty(await context.AccountingMovements.ToListAsync());
    }

    [Fact]
    public async Task CreateMovementAsync_CategoriaVinculadaSinSourceId_RetornaBadRequest()
    {
        using var context = CreateInMemoryContext();
        var (account, categoriaLinkeada, _) = await SeedBaseAsync(context, isIncome: false, MovementSourceType.AssetPurchase);

        var request = new CreateMovementRequest(false, categoriaLinkeada.Id, 1000m, DateTime.UtcNow.Date, "desc", account.Id, null, MovementSourceType.AssetPurchase, null, null, null);
        var result = await AccountingMovementEndpoints.CreateMovementAsync(request, Guid.NewGuid(), context);

        var badRequest = Assert.IsAssignableFrom<IStatusCodeHttpResult>(result);
        Assert.Equal(400, badRequest.StatusCode);
        Assert.Empty(await context.AccountingMovements.ToListAsync());
    }

    [Fact]
    public async Task CreateMovementAsync_CategoriaVinculadaConSourceTypeYSourceIdCoincidentes_CreaMovimiento()
    {
        using var context = CreateInMemoryContext();
        var (account, categoriaLinkeada, _) = await SeedBaseAsync(context, isIncome: false, MovementSourceType.AssetPurchase);
        var asset = new Asset { Id = Guid.NewGuid(), Name = "Camioneta" };
        context.Assets.Add(asset);
        await context.SaveChangesAsync();

        var request = new CreateMovementRequest(false, categoriaLinkeada.Id, 1000m, DateTime.UtcNow.Date, "desc", account.Id, null, MovementSourceType.AssetPurchase, asset.Id.ToString(), null, null);
        var result = await AccountingMovementEndpoints.CreateMovementAsync(request, Guid.NewGuid(), context);

        var created = Assert.IsAssignableFrom<IStatusCodeHttpResult>(result);
        Assert.Equal(201, created.StatusCode);
        var movement = Assert.Single(await context.AccountingMovements.ToListAsync());
        Assert.Equal(asset.Id, movement.AssetId);
    }

    [Fact]
    public async Task CreateMovementAsync_CategoriaSinVinculo_AceptaSourceTypeManual()
    {
        using var context = CreateInMemoryContext();
        var (account, _, categoriaSinVinculo) = await SeedBaseAsync(context, isIncome: false, null);

        var request = new CreateMovementRequest(false, categoriaSinVinculo.Id, 1000m, DateTime.UtcNow.Date, "desc", account.Id, null, MovementSourceType.Manual, null, null, null);
        var result = await AccountingMovementEndpoints.CreateMovementAsync(request, Guid.NewGuid(), context);

        var created = Assert.IsAssignableFrom<IStatusCodeHttpResult>(result);
        Assert.Equal(201, created.StatusCode);
    }

    [Fact]
    public async Task UpdateMovementAsync_MovimientoHistoricoConCategoriaSinVinculoConfigurado_PermiteGuardarSinError()
    {
        // Reproduce el caso señalado en la revisión: un movimiento ya tiene SourceType != Manual,
        // pero su categoría (creada antes de esta funcionalidad) todavía tiene LinkedSourceType = null.
        // Reenviar los mismos valores en un PUT no debe rechazarse con 400.
        using var context = CreateInMemoryContext();
        var (account, _, categoriaSinVinculo) = await SeedBaseAsync(context, isIncome: false, null);
        var asset = new Asset { Id = Guid.NewGuid(), Name = "Camioneta" };
        context.Assets.Add(asset);
        await context.SaveChangesAsync();

        var historico = new AccountingMovement
        {
            Id = Guid.NewGuid(),
            IsIncome = false,
            CategoryId = categoriaSinVinculo.Id,
            Amount = 5000m,
            Date = DateTime.UtcNow.Date,
            Description = "Compra histórica",
            FinancialAccountId = account.Id,
            SourceType = MovementSourceType.AssetPurchase,
            SourceId = asset.Id.ToString(),
            AssetId = asset.Id,
            RegisteredByUserId = Guid.NewGuid()
        };
        context.AccountingMovements.Add(historico);
        await context.SaveChangesAsync();

        var request = new UpdateMovementRequest(
            historico.IsIncome, historico.CategoryId, 6000m, historico.Date, historico.Description, historico.FinancialAccountId, null,
            SourceType: historico.SourceType, SourceId: historico.SourceId);

        var result = await AccountingMovementEndpoints.UpdateMovementAsync(historico.Id, request, context);

        Assert.IsType<NoContent>(result);
        var updated = await context.AccountingMovements.FindAsync(historico.Id);
        Assert.Equal(6000m, updated!.Amount);
        Assert.Equal(asset.Id, updated.AssetId);
    }

    // --- Ciclo de vida de FixedCostPaymentId ---

    [Fact]
    public async Task CreateMovementAsync_ConFixedCostPaymentPendiente_LoMarcaComoPagado()
    {
        using var context = CreateInMemoryContext();
        var (account, categoriaLinkeada, _) = await SeedBaseAsync(context, isIncome: false, MovementSourceType.FixedCostPayment);
        var item = await SeedFixedCostItemAsync(context, isRecurring: true, (DateTime.UtcNow.Date, 1000m, false));
        var payment = item.Payments.First();
        var paymentMethod = new PaymentMethod { Id = Guid.NewGuid(), Name = "Efectivo" };
        context.PaymentMethods.Add(paymentMethod);
        await context.SaveChangesAsync();

        var request = new CreateMovementRequest(false, categoriaLinkeada.Id, payment.Amount, DateTime.UtcNow.Date, "Pago vencimiento", account.Id, paymentMethod.Id, MovementSourceType.FixedCostPayment, payment.Id.ToString(), null, null);
        var result = await AccountingMovementEndpoints.CreateMovementAsync(request, Guid.NewGuid(), context);

        Assert.IsAssignableFrom<IStatusCodeHttpResult>(result);
        var updatedPayment = await context.FixedCostPayments.FindAsync(payment.Id);
        Assert.True(updatedPayment!.IsPaid);
        Assert.Equal(DateTime.UtcNow.Date, updatedPayment.PaymentDate);
        Assert.Equal(paymentMethod.Id, updatedPayment.PaymentMethodId);

        var movement = Assert.Single(await context.AccountingMovements.ToListAsync());
        Assert.Equal(payment.Id, movement.FixedCostPaymentId);
    }

    [Fact]
    public async Task CreateMovementAsync_ConFixedCostPaymentYaPagado_RetornaBadRequestYNoCreaMovimiento()
    {
        using var context = CreateInMemoryContext();
        var (account, categoriaLinkeada, _) = await SeedBaseAsync(context, isIncome: false, MovementSourceType.FixedCostPayment);
        var item = await SeedFixedCostItemAsync(context, isRecurring: false, (DateTime.UtcNow.Date, 1000m, true));
        var payment = item.Payments.First();

        var request = new CreateMovementRequest(false, categoriaLinkeada.Id, payment.Amount, DateTime.UtcNow.Date, "Pago duplicado", account.Id, null, MovementSourceType.FixedCostPayment, payment.Id.ToString(), null, null);
        var result = await AccountingMovementEndpoints.CreateMovementAsync(request, Guid.NewGuid(), context);

        var badRequest = Assert.IsAssignableFrom<IStatusCodeHttpResult>(result);
        Assert.Equal(400, badRequest.StatusCode);
        Assert.Empty(await context.AccountingMovements.ToListAsync());
    }

    [Fact]
    public async Task UpdateMovementAsync_ReasignaFixedCostPayment_RevierteAnteriorYMarcaNuevo()
    {
        using var context = CreateInMemoryContext();
        var (account, categoriaLinkeada, _) = await SeedBaseAsync(context, isIncome: false, MovementSourceType.FixedCostPayment);
        var item = await SeedFixedCostItemAsync(context, isRecurring: true,
            (DateTime.UtcNow.Date, 1000m, false),
            (DateTime.UtcNow.Date.AddMonths(1), 1000m, false));
        var paymentA = item.Payments.First();
        var paymentB = item.Payments.Last();

        var createRequest = new CreateMovementRequest(false, categoriaLinkeada.Id, paymentA.Amount, DateTime.UtcNow.Date, "Pago A", account.Id, null, MovementSourceType.FixedCostPayment, paymentA.Id.ToString(), null, null);
        var createResult = await AccountingMovementEndpoints.CreateMovementAsync(createRequest, Guid.NewGuid(), context);
        Assert.IsAssignableFrom<IStatusCodeHttpResult>(createResult);
        var movement = await context.AccountingMovements.FirstAsync();

        var updateRequest = new UpdateMovementRequest(
            movement.IsIncome, movement.CategoryId, movement.Amount, movement.Date, movement.Description, movement.FinancialAccountId, null,
            SourceType: MovementSourceType.FixedCostPayment, SourceId: paymentB.Id.ToString());

        var updateResult = await AccountingMovementEndpoints.UpdateMovementAsync(movement.Id, updateRequest, context);
        Assert.IsType<NoContent>(updateResult);

        var reloadedA = await context.FixedCostPayments.FindAsync(paymentA.Id);
        var reloadedB = await context.FixedCostPayments.FindAsync(paymentB.Id);
        Assert.False(reloadedA!.IsPaid);
        Assert.Null(reloadedA.PaymentDate);
        Assert.True(reloadedB!.IsPaid);

        var reloadedMovement = await context.AccountingMovements.FindAsync(movement.Id);
        Assert.Equal(paymentB.Id, reloadedMovement!.FixedCostPaymentId);
    }

    [Fact]
    public async Task UpdateMovementAsync_MismoFixedCostPaymentPeroCambiaFechaYMedioPago_SincronizaSinAlterarIsPaid()
    {
        using var context = CreateInMemoryContext();
        var (account, categoriaLinkeada, _) = await SeedBaseAsync(context, isIncome: false, MovementSourceType.FixedCostPayment);
        var item = await SeedFixedCostItemAsync(context, isRecurring: false, (DateTime.UtcNow.Date, 1000m, false));
        var payment = item.Payments.First();
        var metodoOriginal = new PaymentMethod { Id = Guid.NewGuid(), Name = "Efectivo" };
        var metodoNuevo = new PaymentMethod { Id = Guid.NewGuid(), Name = "Transferencia" };
        context.PaymentMethods.AddRange(metodoOriginal, metodoNuevo);
        await context.SaveChangesAsync();

        var createRequest = new CreateMovementRequest(false, categoriaLinkeada.Id, payment.Amount, DateTime.UtcNow.Date, "Pago", account.Id, metodoOriginal.Id, MovementSourceType.FixedCostPayment, payment.Id.ToString(), null, null);
        await AccountingMovementEndpoints.CreateMovementAsync(createRequest, Guid.NewGuid(), context);
        var movement = await context.AccountingMovements.FirstAsync();

        var nuevaFecha = DateTime.UtcNow.Date.AddDays(2);
        var updateRequest = new UpdateMovementRequest(
            movement.IsIncome, movement.CategoryId, movement.Amount, nuevaFecha, movement.Description, movement.FinancialAccountId, metodoNuevo.Id,
            SourceType: MovementSourceType.FixedCostPayment, SourceId: payment.Id.ToString());

        var updateResult = await AccountingMovementEndpoints.UpdateMovementAsync(movement.Id, updateRequest, context);
        Assert.IsType<NoContent>(updateResult);

        var reloadedPayment = await context.FixedCostPayments.FindAsync(payment.Id);
        Assert.True(reloadedPayment!.IsPaid); // no se reprocesó, sigue pagado
        Assert.Equal(nuevaFecha, reloadedPayment.PaymentDate); // pero se sincronizó
        Assert.Equal(metodoNuevo.Id, reloadedPayment.PaymentMethodId);
    }

    [Fact]
    public async Task DeleteMovementAsync_ConFixedCostPaymentAsignado_RevierteVencimientoAPendiente()
    {
        using var context = CreateInMemoryContext();
        var (account, categoriaLinkeada, _) = await SeedBaseAsync(context, isIncome: false, MovementSourceType.FixedCostPayment);
        var item = await SeedFixedCostItemAsync(context, isRecurring: false, (DateTime.UtcNow.Date, 1000m, false));
        var payment = item.Payments.First();

        var createRequest = new CreateMovementRequest(false, categoriaLinkeada.Id, payment.Amount, DateTime.UtcNow.Date, "Pago", account.Id, null, MovementSourceType.FixedCostPayment, payment.Id.ToString(), null, null);
        await AccountingMovementEndpoints.CreateMovementAsync(createRequest, Guid.NewGuid(), context);
        var movement = await context.AccountingMovements.FirstAsync();

        var deleteResult = await AccountingMovementEndpoints.DeleteMovementAsync(movement.Id, context);
        Assert.IsType<NoContent>(deleteResult);

        var reloadedPayment = await context.FixedCostPayments.FindAsync(payment.Id);
        Assert.False(reloadedPayment!.IsPaid);
        Assert.Null(reloadedPayment.PaymentDate);
        Assert.Null(reloadedPayment.PaymentMethodId);
    }

    // --- SourceReference (listado y detalle) ---

    [Fact]
    public void BuildSourceReference_ParaFixedCostPayment_IncluyeNombreDeGastoFijoYFechaDeVencimiento()
    {
        var dueDate = new DateTime(2026, 10, 15);
        var fixedCostItem = new FixedCostItem { Id = Guid.NewGuid(), Name = "Alquiler Galpón" };
        var payment = new FixedCostPayment { Id = Guid.NewGuid(), FixedCostItemId = fixedCostItem.Id, FixedCostItem = fixedCostItem, DueDate = dueDate, Amount = 1000m };
        var movement = new AccountingMovement
        {
            Id = Guid.NewGuid(),
            SourceType = MovementSourceType.FixedCostPayment,
            FixedCostPaymentId = payment.Id,
            FixedCostPayment = payment
        };

        var reference = AccountingMovementEndpoints.BuildSourceReference(movement);

        Assert.Equal("Alquiler Galpón - Venc. 15/10/2026", reference);
    }

    [Fact]
    public async Task GetMovementByIdAsync_ParaDirectCostConOrdenDeServicio_RetornaServiceOrderNumber()
    {
        using var context = CreateInMemoryContext();
        var (account, categoriaLinkeada, _) = await SeedBaseAsync(context, false, MovementSourceType.DirectCost);
        var user = new User { Id = Guid.NewGuid(), Email = "test@geoserv.com", Name = "tester", PasswordHash = "hash" };
        var client = new Client { Id = Guid.NewGuid(), CompanyName = "Cliente Test" };
        var status = new ServiceOrderStatus { Id = Guid.NewGuid(), Name = "Iniciada" };
        var serviceOrder = new ServiceOrder
        {
            Id = Guid.NewGuid(),
            OrderNumber = "OS-2026-0099",
            Description = "Servicio Topográfico",
            ClientId = client.Id,
            Client = client,
            StatusId = status.Id,
            Status = status
        };
        var directCostCategory = new DirectCostCategory { Id = Guid.NewGuid(), Name = "Canon Secretaria" };
        var directCost = new DirectCost
        {
            Id = Guid.NewGuid(),
            ServiceOrderId = serviceOrder.Id,
            ServiceOrder = serviceOrder,
            CategoryId = directCostCategory.Id,
            Category = directCostCategory,
            Description = "Canon Secretaria Mes Marzo",
            TotalAmount = 150000m,
            RegisteredByUserId = user.Id,
            RegisteredByUser = user
        };
        var movement = new AccountingMovement
        {
            Id = Guid.NewGuid(),
            IsIncome = false,
            CategoryId = categoriaLinkeada.Id,
            Category = categoriaLinkeada,
            FinancialAccountId = account.Id,
            FinancialAccount = account,
            Amount = 150000m,
            Date = DateTime.UtcNow,
            SourceType = MovementSourceType.DirectCost,
            DirectCostId = directCost.Id,
            DirectCost = directCost
        };

        context.Users.Add(user);
        context.Clients.Add(client);
        context.ServiceOrderStatuses.Add(status);
        context.ServiceOrders.Add(serviceOrder);
        context.DirectCostCategories.Add(directCostCategory);
        context.DirectCosts.Add(directCost);
        context.AccountingMovements.Add(movement);
        await context.SaveChangesAsync();

        var result = await AccountingMovementEndpoints.GetMovementByIdAsync(movement.Id, context);

        var okResult = Assert.IsAssignableFrom<IStatusCodeHttpResult>(result);
        Assert.Equal(StatusCodes.Status200OK, okResult.StatusCode);

        var value = result.GetType().GetProperty("Value")?.GetValue(result);
        Assert.NotNull(value);
        var orderNumber = value.GetType().GetProperty("ServiceOrderNumber")?.GetValue(value);
        Assert.Equal("OS-2026-0099", orderNumber);
    }
}
