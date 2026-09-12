using GeoServ.Api.Domain.Entities;
using GeoServ.Api.Domain.Enums;
using GeoServ.Api.Endpoints;
using GeoServ.Api.Infrastructure.Data;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;
using Xunit;

namespace GeoServ.Api.Tests;

public class InternalTransferTests
{
    private GeoServDbContext CreateInMemoryContext()
    {
        var options = new DbContextOptionsBuilder<GeoServDbContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;

        return new GeoServDbContext(options);
    }

    private (FinancialAccount caja, FinancialAccount banco) SeedAccounts(GeoServDbContext context, Guid? currencyIdCaja = null, Guid? currencyIdBanco = null, bool bancoActivo = true)
    {
        var currencyArs = Guid.NewGuid();
        var caja = new FinancialAccount { Id = Guid.NewGuid(), Name = "Caja", AccountNumber = "001", AccountType = "Cash", CurrencyId = currencyIdCaja ?? currencyArs, IsActive = true };
        var banco = new FinancialAccount { Id = Guid.NewGuid(), Name = "Banco", AccountNumber = "002", AccountType = "BankAccount", CurrencyId = currencyIdBanco ?? currencyArs, IsActive = bancoActivo };
        context.FinancialAccounts.AddRange(caja, banco);
        context.SaveChanges();
        return (caja, banco);
    }

    [Fact]
    public async Task CreateTransferAsync_CuentasValidas_CreaAmbasPatasVinculadasYAtomicas()
    {
        using var context = CreateInMemoryContext();
        var (caja, banco) = SeedAccounts(context);
        var userId = Guid.NewGuid();

        var request = new CreateTransferRequest(caja.Id, banco.Id, 50000m, DateTime.UtcNow.Date, "Pase de fondos");

        var result = await AccountingMovementEndpoints.CreateTransferAsync(request, userId, context);

        var created = Assert.IsAssignableFrom<IStatusCodeHttpResult>(result);
        Assert.Equal(201, created.StatusCode);

        var movements = await context.AccountingMovements.ToListAsync();
        Assert.Equal(2, movements.Count);

        var outgoing = Assert.Single(movements, m => m.FinancialAccountId == caja.Id);
        var incoming = Assert.Single(movements, m => m.FinancialAccountId == banco.Id);

        Assert.False(outgoing.IsIncome);
        Assert.True(incoming.IsIncome);
        Assert.Equal(50000m, outgoing.Amount);
        Assert.Equal(50000m, incoming.Amount);
        Assert.Equal(MovementSourceType.InternalTransfer, outgoing.SourceType);
        Assert.Equal(MovementSourceType.InternalTransfer, incoming.SourceType);
        Assert.NotNull(outgoing.TransferGroupId);
        Assert.Equal(outgoing.TransferGroupId, incoming.TransferGroupId);
        Assert.Equal(banco.Id.ToString(), outgoing.SourceId);
        Assert.Equal(caja.Id.ToString(), incoming.SourceId);

        // El saldo de cada cuenta refleja correctamente el movimiento de fondos
        var cajaBalance = movements.Where(m => m.FinancialAccountId == caja.Id).Sum(m => m.IsIncome ? m.Amount : -m.Amount);
        var bancoBalance = movements.Where(m => m.FinancialAccountId == banco.Id).Sum(m => m.IsIncome ? m.Amount : -m.Amount);
        Assert.Equal(-50000m, cajaBalance);
        Assert.Equal(50000m, bancoBalance);
    }

    [Fact]
    public async Task CreateTransferAsync_MismaCuentaOrigenYDestino_RetornaBadRequest()
    {
        using var context = CreateInMemoryContext();
        var (caja, _) = SeedAccounts(context);

        var request = new CreateTransferRequest(caja.Id, caja.Id, 1000m, DateTime.UtcNow.Date, null);
        var result = await AccountingMovementEndpoints.CreateTransferAsync(request, Guid.NewGuid(), context);

        var badRequest = Assert.IsAssignableFrom<IStatusCodeHttpResult>(result);
        Assert.Equal(400, badRequest.StatusCode);
        Assert.Empty(await context.AccountingMovements.ToListAsync());
    }

    [Fact]
    public async Task CreateTransferAsync_MontoCero_RetornaBadRequest()
    {
        using var context = CreateInMemoryContext();
        var (caja, banco) = SeedAccounts(context);

        var request = new CreateTransferRequest(caja.Id, banco.Id, 0m, DateTime.UtcNow.Date, null);
        var result = await AccountingMovementEndpoints.CreateTransferAsync(request, Guid.NewGuid(), context);

        var badRequest = Assert.IsAssignableFrom<IStatusCodeHttpResult>(result);
        Assert.Equal(400, badRequest.StatusCode);
    }

    [Fact]
    public async Task CreateTransferAsync_MonedasDistintas_RetornaBadRequest()
    {
        using var context = CreateInMemoryContext();
        var (caja, banco) = SeedAccounts(context, currencyIdCaja: Guid.NewGuid(), currencyIdBanco: Guid.NewGuid());

        var request = new CreateTransferRequest(caja.Id, banco.Id, 1000m, DateTime.UtcNow.Date, null);
        var result = await AccountingMovementEndpoints.CreateTransferAsync(request, Guid.NewGuid(), context);

        var badRequest = Assert.IsAssignableFrom<IStatusCodeHttpResult>(result);
        Assert.Equal(400, badRequest.StatusCode);
        Assert.Empty(await context.AccountingMovements.ToListAsync());
    }

    [Fact]
    public async Task CreateTransferAsync_CuentaDestinoInactiva_RetornaBadRequest()
    {
        using var context = CreateInMemoryContext();
        var (caja, banco) = SeedAccounts(context, bancoActivo: false);

        var request = new CreateTransferRequest(caja.Id, banco.Id, 1000m, DateTime.UtcNow.Date, null);
        var result = await AccountingMovementEndpoints.CreateTransferAsync(request, Guid.NewGuid(), context);

        var badRequest = Assert.IsAssignableFrom<IStatusCodeHttpResult>(result);
        Assert.Equal(400, badRequest.StatusCode);
    }

    [Fact]
    public async Task DeleteTransferAsync_EliminaAmbasPatas()
    {
        using var context = CreateInMemoryContext();
        var (caja, banco) = SeedAccounts(context);
        var createResult = await AccountingMovementEndpoints.CreateTransferAsync(
            new CreateTransferRequest(caja.Id, banco.Id, 20000m, DateTime.UtcNow.Date, null),
            Guid.NewGuid(),
            context);
        Assert.IsAssignableFrom<IStatusCodeHttpResult>(createResult);

        var transferGroupId = (await context.AccountingMovements.FirstAsync()).TransferGroupId!.Value;

        var deleteResult = await AccountingMovementEndpoints.DeleteTransferAsync(transferGroupId, context);

        var noContent = Assert.IsAssignableFrom<IStatusCodeHttpResult>(deleteResult);
        Assert.Equal(204, noContent.StatusCode);
        Assert.Empty(await context.AccountingMovements.ToListAsync());
    }

    [Fact]
    public async Task DeleteTransferAsync_GrupoInexistente_RetornaNotFound()
    {
        using var context = CreateInMemoryContext();
        var result = await AccountingMovementEndpoints.DeleteTransferAsync(Guid.NewGuid(), context);
        Assert.IsType<NotFound>(result);
    }

    [Fact]
    public async Task UpdateMovementAsync_MovimientoConTransferGroupId_RetornaBadRequest()
    {
        using var context = CreateInMemoryContext();
        var (caja, banco) = SeedAccounts(context);
        await AccountingMovementEndpoints.CreateTransferAsync(
            new CreateTransferRequest(caja.Id, banco.Id, 10000m, DateTime.UtcNow.Date, null),
            Guid.NewGuid(),
            context);

        var leg = await context.AccountingMovements.FirstAsync();
        var request = new UpdateMovementRequest(leg.IsIncome, leg.CategoryId, 99999m, leg.Date, "intento de edición", leg.FinancialAccountId, null);

        var result = await AccountingMovementEndpoints.UpdateMovementAsync(leg.Id, request, context);

        var badRequest = Assert.IsAssignableFrom<IStatusCodeHttpResult>(result);
        Assert.Equal(400, badRequest.StatusCode);

        var unchanged = await context.AccountingMovements.FindAsync(leg.Id);
        Assert.Equal(10000m, unchanged!.Amount); // no se modificó
    }

    [Fact]
    public async Task DeleteMovementAsync_MovimientoConTransferGroupId_RetornaBadRequest()
    {
        using var context = CreateInMemoryContext();
        var (caja, banco) = SeedAccounts(context);
        await AccountingMovementEndpoints.CreateTransferAsync(
            new CreateTransferRequest(caja.Id, banco.Id, 10000m, DateTime.UtcNow.Date, null),
            Guid.NewGuid(),
            context);

        var leg = await context.AccountingMovements.FirstAsync();

        var result = await AccountingMovementEndpoints.DeleteMovementAsync(leg.Id, context);

        var badRequest = Assert.IsAssignableFrom<IStatusCodeHttpResult>(result);
        Assert.Equal(400, badRequest.StatusCode);
        Assert.Equal(2, await context.AccountingMovements.CountAsync()); // ninguna pata se eliminó
    }

    [Fact]
    public async Task UpdateMovementAsync_MovimientoHistoricoSinTransferGroupId_SePuedeEditarNormalmente()
    {
        // Confirma que un movimiento cargado antes de esta funcionalidad (sin TransferGroupId,
        // incluyendo los que usan manualmente las categorías "Transferencia Interna") no cambia
        // su comportamiento de edición individual.
        using var context = CreateInMemoryContext();
        var (caja, _) = SeedAccounts(context);

        var historico = new AccountingMovement
        {
            Id = Guid.NewGuid(),
            IsIncome = false,
            CategoryId = Guid.NewGuid(),
            Amount = 5000m,
            Date = DateTime.UtcNow.Date,
            Description = "Transferencia Interna (Egreso) cargada manualmente",
            FinancialAccountId = caja.Id,
            SourceType = MovementSourceType.Manual,
            RegisteredByUserId = Guid.NewGuid()
        };
        context.AccountingMovements.Add(historico);
        await context.SaveChangesAsync();

        var request = new UpdateMovementRequest(historico.IsIncome, historico.CategoryId, 7500m, historico.Date, "Monto corregido", historico.FinancialAccountId, null);
        var result = await AccountingMovementEndpoints.UpdateMovementAsync(historico.Id, request, context);

        Assert.IsType<NoContent>(result);
        var updated = await context.AccountingMovements.FindAsync(historico.Id);
        Assert.Equal(7500m, updated!.Amount);
    }

    [Fact]
    public async Task MovimientoHistoricoSinTransferGroupId_PermaneceIntacto()
    {
        // Simula un movimiento cargado antes de esta funcionalidad: sin TransferGroupId,
        // debe seguir siendo un movimiento normal, editable/eliminable individualmente.
        using var context = CreateInMemoryContext();
        var (caja, _) = SeedAccounts(context);

        var historico = new AccountingMovement
        {
            Id = Guid.NewGuid(),
            IsIncome = false,
            CategoryId = Guid.NewGuid(),
            Amount = 5000m,
            Date = DateTime.UtcNow.Date,
            Description = "Transferencia Interna (Egreso) cargada manualmente antes del cambio",
            FinancialAccountId = caja.Id,
            SourceType = MovementSourceType.Manual,
            RegisteredByUserId = Guid.NewGuid()
        };
        context.AccountingMovements.Add(historico);
        await context.SaveChangesAsync();

        var saved = await context.AccountingMovements.FindAsync(historico.Id);
        Assert.NotNull(saved);
        Assert.Null(saved!.TransferGroupId);
        Assert.Equal(MovementSourceType.Manual, saved.SourceType);
    }
}
