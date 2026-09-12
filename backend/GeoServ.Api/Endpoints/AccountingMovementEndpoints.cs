using GeoServ.Api.Domain.Entities;
using GeoServ.Api.Domain.Enums;
using GeoServ.Api.Infrastructure.Data;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace GeoServ.Api.Endpoints;

public static class AccountingMovementEndpoints
{
    public static void MapAccountingMovementEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/movements").RequireAuthorization();

        group.MapGet("/", async (
            int? page, 
            int? pageSize, 
            DateTime? startDate, 
            DateTime? endDate, 
            Guid? categoryId, 
            Guid? financialAccountId, 
            bool? isIncome, 
            GeoServDbContext context) =>
        {
            var query = context.AccountingMovements
                .Include(m => m.FinancialAccount)
                .Include(m => m.Category)
                .Include(m => m.PaymentMethod)
                .Include(m => m.ServiceOrder)
                .Include(m => m.DirectCost)
                    .ThenInclude(dc => dc!.ServiceOrder)
                .Include(m => m.FixedCost)
                .Include(m => m.Asset)
                .AsQueryable();

            if (startDate.HasValue)
                query = query.Where(m => m.Date >= startDate.Value.Date);
            if (endDate.HasValue)
                query = query.Where(m => m.Date <= endDate.Value.Date.AddDays(1).AddTicks(-1));
            
            if (categoryId.HasValue)
                query = query.Where(m => m.CategoryId == categoryId.Value);
            
            if (financialAccountId.HasValue)
                query = query.Where(m => m.FinancialAccountId == financialAccountId.Value);
            
            if (isIncome.HasValue)
                query = query.Where(m => m.IsIncome == isIncome.Value);

            var totalCount = await query.CountAsync();

            var actualPage = page ?? 1;
            var actualPageSize = pageSize ?? 10;

            var items = await query
                .OrderBy(m => m.Date)
                .ThenBy(m => m.CreatedAt)
                .Skip((actualPage - 1) * actualPageSize)
                .Take(actualPageSize)
                .Select(m => new
                {
                    m.Id,
                    m.IsIncome,
                    m.CategoryId,
                    CategoryName = m.Category.Name,
                    m.Amount,
                    m.Date,
                    m.CreatedAt,
                    m.Description,
                    m.FinancialAccountId,
                    FinancialAccountName = m.FinancialAccount.Name,
                    m.PaymentMethodId,
                    PaymentMethodName = m.PaymentMethod != null ? m.PaymentMethod.Name : null,
                    m.ServiceOrderId,
                    ServiceOrderNumber = m.ServiceOrder != null ? m.ServiceOrder.OrderNumber : (m.DirectCost != null && m.DirectCost.ServiceOrder != null ? m.DirectCost.ServiceOrder.OrderNumber : null),
                    m.FixedCostId,
                    m.DirectCostId,
                    m.AssetId,
                    m.CheckId,
                    m.ResponsibleId,
                    m.RegisteredByUserId,
                    SourceType = m.SourceType.ToString(),
                    m.SourceId,
                    m.TransferGroupId,
                    SourceReference = m.SourceType == MovementSourceType.ServiceOrderIncome
                        ? (m.ServiceOrder != null ? m.ServiceOrder.OrderNumber : null)
                        : m.SourceType == MovementSourceType.DirectCost
                            ? (m.DirectCost != null ? m.DirectCost.Description : null)
                            : m.SourceType == MovementSourceType.FixedCostPayment
                                ? (m.FixedCost != null ? m.FixedCost.Description : null)
                                : m.SourceType == MovementSourceType.AssetPurchase
                                    ? (m.Asset != null ? m.Asset.Name : null)
                                    : null
                })
                .ToListAsync();

            return Results.Ok(new
            {
                Items = items,
                TotalCount = totalCount,
                Page = actualPage,
                PageSize = actualPageSize
            });
        })
        .WithName("GetMovements")
        .WithOpenApi();

        group.MapGet("/{id:guid}", async (Guid id, GeoServDbContext context) =>
        {
            var movement = await context.AccountingMovements
                .Include(m => m.Category)
                .Include(m => m.FinancialAccount)
                .Include(m => m.PaymentMethod)
                .Include(m => m.ServiceOrder)
                .FirstOrDefaultAsync(m => m.Id == id);
            return movement is not null ? Results.Ok(movement) : Results.NotFound();
        })
        .WithName("GetMovementById")
        .WithOpenApi();

        group.MapPost("/", async ([FromBody] CreateMovementRequest request, HttpContext httpContext, GeoServDbContext context) =>
        {
            try 
            {
                var userIdStr = httpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
                if (!Guid.TryParse(userIdStr, out var userId)) 
                {
                    userId = await context.Users.Select(u => u.Id).FirstOrDefaultAsync();
                }

                var sourceId = request.SourceId;
                var sourceType = request.SourceType;

                Guid? serviceOrderId = null;
                Guid? directCostId = null;
                Guid? fixedCostId = null;
                Guid? assetId = null;

                if (Guid.TryParse(sourceId, out var parsedGuid))
                {
                    if (sourceType == MovementSourceType.ServiceOrderIncome) serviceOrderId = parsedGuid;
                    else if (sourceType == MovementSourceType.DirectCost) directCostId = parsedGuid;
                    else if (sourceType == MovementSourceType.FixedCostPayment) fixedCostId = parsedGuid;
                    else if (sourceType == MovementSourceType.AssetPurchase) assetId = parsedGuid;
                }

                var movement = new AccountingMovement
                {
                    Id = Guid.NewGuid(),
                    IsIncome = request.IsIncome,
                    CategoryId = request.CategoryId,
                    Amount = request.Amount,
                    Date = request.Date,
                    Description = request.Description ?? string.Empty,
                    FinancialAccountId = request.FinancialAccountId,
                    PaymentMethodId = request.PaymentMethodId,
                    CheckId = request.CheckId,
                    ResponsibleId = request.ResponsibleId,
                    RegisteredByUserId = userId,
                    SourceType = sourceType,
                    SourceId = sourceId,
                    ServiceOrderId = serviceOrderId,
                    DirectCostId = directCostId,
                    FixedCostId = fixedCostId,
                    AssetId = assetId
                };

                context.AccountingMovements.Add(movement);
                await context.SaveChangesAsync();

                return Results.Created($"/api/movements/{movement.Id}", movement);
            }
            catch(Exception ex)
            {
                return Results.Problem(detail: ex.InnerException?.Message ?? ex.Message, statusCode: 500);
            }
        })
        .WithName("CreateMovement")
        .WithOpenApi();

        group.MapPut("/{id:guid}", async (Guid id, [FromBody] UpdateMovementRequest request, GeoServDbContext context) =>
            await UpdateMovementAsync(id, request, context))
        .WithName("UpdateMovement")
        .WithOpenApi();

        group.MapDelete("/{id:guid}", async (Guid id, GeoServDbContext context) =>
            await DeleteMovementAsync(id, context))
        .WithName("DeleteMovement")
        .WithOpenApi();

        // --- Transferencias Internas entre cuentas propias ---
        group.MapPost("/transfer", async ([FromBody] CreateTransferRequest request, HttpContext httpContext, GeoServDbContext context) =>
        {
            var userIdStr = httpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
            Guid? userId = Guid.TryParse(userIdStr, out var uid) ? uid : null;
            return await CreateTransferAsync(request, userId, context);
        })
        .WithName("CreateTransfer")
        .WithOpenApi();

        group.MapDelete("/transfer/{transferGroupId:guid}", async (Guid transferGroupId, GeoServDbContext context) =>
            await DeleteTransferAsync(transferGroupId, context))
        .WithName("DeleteTransfer")
        .WithOpenApi();
    }

    // Categorías semilla reutilizadas (ver GeoServDbContext.cs) para no romper la FK de movimientos históricos
    // que ya las referencian.
    private static readonly Guid InternalTransferIncomeCategoryId = Guid.Parse("A3333333-3333-3333-3333-333333333333");
    private static readonly Guid InternalTransferExpenseCategoryId = Guid.Parse("AAAAAAAA-AAAA-AAAA-AAAA-AAAAAAAAAAAA");

    public static async Task<IResult> CreateTransferAsync(CreateTransferRequest request, Guid? userId, GeoServDbContext context)
    {
        try
        {
            if (request.FromAccountId == request.ToAccountId)
            {
                return Results.BadRequest(new { message = "La cuenta origen y la cuenta destino no pueden ser la misma." });
            }

            if (request.Amount <= 0)
            {
                return Results.BadRequest(new { message = "El monto de la transferencia debe ser mayor a cero." });
            }

            var fromAccount = await context.FinancialAccounts.FindAsync(request.FromAccountId);
            var toAccount = await context.FinancialAccounts.FindAsync(request.ToAccountId);

            if (fromAccount == null || toAccount == null)
            {
                return Results.BadRequest(new { message = "La cuenta origen o la cuenta destino no existe." });
            }

            if (!fromAccount.IsActive || !toAccount.IsActive)
            {
                return Results.BadRequest(new { message = "Ambas cuentas deben estar activas para transferir fondos." });
            }

            if (fromAccount.CurrencyId != toAccount.CurrencyId)
            {
                return Results.BadRequest(new { message = "No se puede transferir entre cuentas de distinta moneda." });
            }

            var resolvedUserId = userId ?? await context.Users.Select(u => u.Id).FirstOrDefaultAsync();

            var transferGroupId = Guid.NewGuid();
            var description = string.IsNullOrWhiteSpace(request.Description)
                ? $"Transferencia interna: {fromAccount.Name} -> {toAccount.Name}"
                : request.Description!;

            var outgoing = new AccountingMovement
            {
                Id = Guid.NewGuid(),
                IsIncome = false,
                CategoryId = InternalTransferExpenseCategoryId,
                Amount = request.Amount,
                Date = request.Date,
                Description = description,
                FinancialAccountId = fromAccount.Id,
                SourceType = MovementSourceType.InternalTransfer,
                SourceId = toAccount.Id.ToString(),
                TransferGroupId = transferGroupId,
                RegisteredByUserId = resolvedUserId
            };

            var incoming = new AccountingMovement
            {
                Id = Guid.NewGuid(),
                IsIncome = true,
                CategoryId = InternalTransferIncomeCategoryId,
                Amount = request.Amount,
                Date = request.Date,
                Description = description,
                FinancialAccountId = toAccount.Id,
                SourceType = MovementSourceType.InternalTransfer,
                SourceId = fromAccount.Id.ToString(),
                TransferGroupId = transferGroupId,
                RegisteredByUserId = resolvedUserId
            };

            context.AccountingMovements.AddRange(outgoing, incoming);
            await context.SaveChangesAsync();

            return Results.Created($"/api/movements/transfer/{transferGroupId}", new { transferGroupId, outgoing, incoming });
        }
        catch (Exception ex)
        {
            return Results.Problem(detail: ex.InnerException?.Message ?? ex.Message, statusCode: 500);
        }
    }

    public static async Task<IResult> UpdateMovementAsync(Guid id, UpdateMovementRequest request, GeoServDbContext context)
    {
        try
        {
            var movement = await context.AccountingMovements.FindAsync(id);
            if (movement == null) return Results.NotFound();

            if (movement.TransferGroupId.HasValue)
            {
                return Results.BadRequest(new { message = "Este movimiento forma parte de una Transferencia Interna y no puede editarse individualmente. Elimine la transferencia completa y vuelva a cargarla." });
            }

            var sourceType = request.SourceType ?? MovementSourceType.Manual;
            var sourceId = request.SourceId;

            Guid? serviceOrderId = request.ServiceOrderId;
            Guid? directCostId = request.DirectCostId;
            Guid? fixedCostId = request.FixedCostId;
            Guid? assetId = request.AssetId;

            if (!request.SourceType.HasValue)
            {
                sourceId = request.ServiceOrderId?.ToString() ?? request.DirectCostId?.ToString() ?? request.FixedCostId?.ToString() ?? request.AssetId?.ToString();
                if (request.ServiceOrderId.HasValue) sourceType = MovementSourceType.ServiceOrderIncome;
                else if (request.DirectCostId.HasValue) sourceType = MovementSourceType.DirectCost;
                else if (request.FixedCostId.HasValue) sourceType = MovementSourceType.FixedCostPayment;
                else if (request.AssetId.HasValue) sourceType = MovementSourceType.AssetPurchase;
            }
            else if (Guid.TryParse(sourceId, out var parsedGuid))
            {
                if (sourceType == MovementSourceType.ServiceOrderIncome) serviceOrderId = parsedGuid;
                else if (sourceType == MovementSourceType.DirectCost) directCostId = parsedGuid;
                else if (sourceType == MovementSourceType.FixedCostPayment) fixedCostId = parsedGuid;
                else if (sourceType == MovementSourceType.AssetPurchase) assetId = parsedGuid;
            }

            movement.IsIncome = request.IsIncome;
            movement.CategoryId = request.CategoryId;
            movement.Amount = request.Amount;
            movement.Date = request.Date;
            movement.Description = request.Description ?? string.Empty;
            movement.FinancialAccountId = request.FinancialAccountId;
            movement.PaymentMethodId = request.PaymentMethodId;
            movement.ServiceOrderId = serviceOrderId;
            movement.FixedCostId = fixedCostId;
            movement.DirectCostId = directCostId;
            movement.AssetId = assetId;
            movement.CheckId = request.CheckId;
            movement.ResponsibleId = request.ResponsibleId;
            movement.SourceType = sourceType;
            movement.SourceId = sourceId;

            await context.SaveChangesAsync();
            return Results.NoContent();
        }
        catch (Exception ex)
        {
            return Results.Problem(detail: ex.InnerException?.Message ?? ex.Message, statusCode: 500);
        }
    }

    public static async Task<IResult> DeleteMovementAsync(Guid id, GeoServDbContext context)
    {
        var movement = await context.AccountingMovements.FindAsync(id);
        if (movement == null) return Results.NotFound();

        if (movement.TransferGroupId.HasValue)
        {
            return Results.BadRequest(new { message = "Este movimiento forma parte de una Transferencia Interna y no puede eliminarse individualmente. Elimine la transferencia completa." });
        }

        context.AccountingMovements.Remove(movement);
        await context.SaveChangesAsync();
        return Results.NoContent();
    }

    public static async Task<IResult> DeleteTransferAsync(Guid transferGroupId, GeoServDbContext context)
    {
        var legs = await context.AccountingMovements
            .Where(m => m.TransferGroupId == transferGroupId)
            .ToListAsync();

        if (legs.Count == 0) return Results.NotFound();

        context.AccountingMovements.RemoveRange(legs);
        await context.SaveChangesAsync();
        return Results.NoContent();
    }
}

public record CreateMovementRequest(
    bool IsIncome,
    Guid CategoryId,
    decimal Amount,
    DateTime Date,
    string? Description,
    Guid FinancialAccountId,
    Guid? PaymentMethodId,
    GeoServ.Api.Domain.Enums.MovementSourceType SourceType,
    string? SourceId,
    Guid? CheckId,
    Guid? ResponsibleId
);

public record CreateTransferRequest(
    Guid FromAccountId,
    Guid ToAccountId,
    decimal Amount,
    DateTime Date,
    string? Description
);

public record UpdateMovementRequest(
    bool IsIncome,
    Guid CategoryId,
    decimal Amount,
    DateTime Date,
    string? Description,
    Guid FinancialAccountId,
    Guid? PaymentMethodId,
    GeoServ.Api.Domain.Enums.MovementSourceType? SourceType = null,
    string? SourceId = null,
    Guid? ServiceOrderId = null,
    Guid? FixedCostId = null,
    Guid? DirectCostId = null,
    Guid? AssetId = null,
    Guid? CheckId = null,
    Guid? ResponsibleId = null
);


