using GeoServ.Api.Domain.Entities;
using GeoServ.Api.Domain.Enums;
using GeoServ.Api.Infrastructure.Data;
using GeoServ.Api.Infrastructure.Services;
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
                .Include(m => m.FixedCostPayment)
                    .ThenInclude(fcp => fcp!.FixedCostItem)
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

            object? accountSummary = null;
            decimal? runningBalance = null;

            if (financialAccountId.HasValue)
            {
                var accId = financialAccountId.Value;
                var initialBalance = startDate.HasValue
                    ? await context.AccountingMovements
                        .Where(m => m.FinancialAccountId == accId && m.Date < startDate.Value.Date)
                        .SumAsync(m => (decimal?)(m.IsIncome ? m.Amount : -m.Amount)) ?? 0m
                    : 0m;

                var periodQuery = context.AccountingMovements.Where(m => m.FinancialAccountId == accId);
                if (startDate.HasValue)
                    periodQuery = periodQuery.Where(m => m.Date >= startDate.Value.Date);
                if (endDate.HasValue)
                    periodQuery = periodQuery.Where(m => m.Date <= endDate.Value.Date.AddDays(1).AddTicks(-1));

                var periodIncome = await periodQuery.Where(m => m.IsIncome).SumAsync(m => (decimal?)m.Amount) ?? 0m;
                var periodExpense = await periodQuery.Where(m => !m.IsIncome).SumAsync(m => (decimal?)m.Amount) ?? 0m;
                var finalBalance = initialBalance + periodIncome - periodExpense;

                accountSummary = new
                {
                    InitialBalance = initialBalance,
                    PeriodIncome = periodIncome,
                    PeriodExpense = periodExpense,
                    FinalBalance = finalBalance
                };

                var skipCount = (actualPage - 1) * actualPageSize;
                var priorDelta = skipCount > 0
                    ? await query
                        .OrderBy(m => m.Date)
                        .ThenBy(m => m.CreatedAt)
                        .ThenBy(m => m.Id)
                        .Take(skipCount)
                        .SumAsync(m => (decimal?)(m.IsIncome ? m.Amount : -m.Amount)) ?? 0m
                    : 0m;

                runningBalance = initialBalance + priorDelta;
            }

            var rawItems = await query
                .OrderBy(m => m.Date)
                .ThenBy(m => m.CreatedAt)
                .ThenBy(m => m.Id)
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
                    m.FixedCostPaymentId,
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
                                ? (m.FixedCostPayment != null ? $"{m.FixedCostPayment.FixedCostItem.Name} - Venc. {m.FixedCostPayment.DueDate:dd/MM/yyyy}" : null)
                                : m.SourceType == MovementSourceType.AssetPurchase
                                    ? (m.Asset != null ? m.Asset.Name : null)
                                    : null
                })
                .ToListAsync();

            var currentBal = runningBalance;
            var items = rawItems.Select(m =>
            {
                decimal? balAfter = null;
                if (currentBal.HasValue)
                {
                    currentBal += (m.IsIncome ? m.Amount : -m.Amount);
                    balAfter = currentBal.Value;
                }

                return new
                {
                    m.Id,
                    m.IsIncome,
                    m.CategoryId,
                    m.CategoryName,
                    m.Amount,
                    BalanceAfter = balAfter,
                    m.Date,
                    m.CreatedAt,
                    m.Description,
                    m.FinancialAccountId,
                    m.FinancialAccountName,
                    m.PaymentMethodId,
                    m.PaymentMethodName,
                    m.ServiceOrderId,
                    m.ServiceOrderNumber,
                    m.FixedCostId,
                    m.FixedCostPaymentId,
                    m.DirectCostId,
                    m.AssetId,
                    m.CheckId,
                    m.ResponsibleId,
                    m.RegisteredByUserId,
                    m.SourceType,
                    m.SourceId,
                    m.TransferGroupId,
                    m.SourceReference
                };
            }).ToList();

            return Results.Ok(new
            {
                Items = items,
                TotalCount = totalCount,
                Page = actualPage,
                PageSize = actualPageSize,
                AccountSummary = accountSummary
            });
        })
        .WithName("GetMovements")
        .WithOpenApi();

        group.MapGet("/{id:guid}", (Guid id, GeoServDbContext context) => GetMovementByIdAsync(id, context))
        .WithName("GetMovementById")
        .WithOpenApi();

        group.MapPost("/", async ([FromBody] CreateMovementRequest request, HttpContext httpContext, GeoServDbContext context) =>
        {
            var userIdStr = httpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
            Guid? userId = Guid.TryParse(userIdStr, out var uid) ? uid : null;
            return await CreateMovementAsync(request, userId, context);
        })
        .WithName("CreateMovement")
        .WithOpenApi();

        group.MapPut("/{id:guid}", async (Guid id, [FromBody] UpdateMovementRequest request, HttpContext httpContext, GeoServDbContext context) =>
        {
            var userIdStr = httpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
            Guid? userId = Guid.TryParse(userIdStr, out var uid) ? uid : null;
            return await UpdateMovementAsync(id, request, context, userId);
        })
        .WithName("UpdateMovement")
        .WithOpenApi();

        group.MapDelete("/{id:guid}", async (Guid id, HttpContext httpContext, GeoServDbContext context) =>
        {
            var userIdStr = httpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
            Guid? userId = Guid.TryParse(userIdStr, out var uid) ? uid : null;
            return await DeleteMovementAsync(id, context, userId);
        })
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

    public static async Task<IResult> GetMovementByIdAsync(Guid id, GeoServDbContext context)
    {
        var movement = await context.AccountingMovements
            .Include(m => m.Category)
            .Include(m => m.FinancialAccount)
            .Include(m => m.PaymentMethod)
            .Include(m => m.ServiceOrder)
            .Include(m => m.DirectCost)
                .ThenInclude(dc => dc!.ServiceOrder)
            .Include(m => m.Asset)
            .Include(m => m.FixedCostPayment)
                .ThenInclude(fcp => fcp!.FixedCostItem)
            .FirstOrDefaultAsync(m => m.Id == id);

        if (movement is null) return Results.NotFound();

        return Results.Ok(new
        {
            movement.Id,
            movement.IsIncome,
            movement.CategoryId,
            CategoryName = movement.Category?.Name,
            movement.Amount,
            movement.Date,
            movement.Description,
            movement.FinancialAccountId,
            movement.PaymentMethodId,
            movement.ServiceOrderId,
            ServiceOrderNumber = movement.ServiceOrder != null
                ? movement.ServiceOrder.OrderNumber
                : (movement.DirectCost != null && movement.DirectCost.ServiceOrder != null ? movement.DirectCost.ServiceOrder.OrderNumber : null),
            movement.FixedCostId,
            movement.FixedCostPaymentId,
            movement.DirectCostId,
            movement.AssetId,
            movement.CheckId,
            movement.ResponsibleId,
            movement.RegisteredByUserId,
            SourceType = movement.SourceType.ToString(),
            movement.SourceId,
            movement.TransferGroupId,
            SourceReference = BuildSourceReference(movement)
        });
    }

    // Construye la referencia legible del origen específico de un movimiento (usada en el listado y en el detalle).
    public static string? BuildSourceReference(AccountingMovement movement)
    {
        return movement.SourceType switch
        {
            MovementSourceType.ServiceOrderIncome => movement.ServiceOrder?.OrderNumber,
            MovementSourceType.DirectCost => movement.DirectCost?.Description,
            MovementSourceType.FixedCostPayment => movement.FixedCostPayment != null
                ? $"{movement.FixedCostPayment.FixedCostItem.Name} - Venc. {movement.FixedCostPayment.DueDate:dd/MM/yyyy}"
                : null,
            MovementSourceType.AssetPurchase => movement.Asset?.Name,
            _ => null
        };
    }

    // Valida que el SourceType/SourceId recibidos sean coherentes con el vínculo configurado en la categoría.
    // Si la categoría no tiene vínculo (LinkedSourceType == null) no se restringe nada (preserva Manual
    // y los movimientos históricos cuya categoría aún no tiene vínculo configurado). Retorna un IResult de
    // error para responder de inmediato, o null si es válido.
    private static async Task<IResult?> ValidateCategoryCoherenceAsync(GeoServDbContext context, Guid categoryId, MovementSourceType sourceType, string? sourceId)
    {
        var category = await context.MovementCategories.FindAsync(categoryId);
        // Si la categoría no existe, no es responsabilidad de esta validación: la FK de base de datos
        // la rechazará al guardar. Aquí solo nos importa la coherencia cuando sí existe y tiene vínculo.
        if (category == null) return null;

        if (category.LinkedSourceType != null)
        {
            if (sourceType != category.LinkedSourceType.Value)
            {
                return Results.BadRequest(new { message = $"La categoría \"{category.Name}\" requiere un origen de tipo {category.LinkedSourceType}." });
            }

            if (string.IsNullOrWhiteSpace(sourceId))
            {
                return Results.BadRequest(new { message = $"Debe seleccionar un origen específico para la categoría \"{category.Name}\"." });
            }
        }

        return null;
    }

    // Aplica el ciclo de vida del vínculo con un vencimiento de Gasto Fijo (FixedCostPayment) al crear/editar
    // un movimiento: revierte el vencimiento anterior si cambió, marca el nuevo como pagado, y si no cambió
    // pero sigue vinculado, sincroniza fecha/medio de pago. Retorna un IResult de error, o null si es válido.
    private static async Task<IResult?> ApplyFixedCostPaymentLinkAsync(
        GeoServDbContext context,
        Guid? oldFixedCostPaymentId,
        Guid? newFixedCostPaymentId,
        DateTime movementDate,
        Guid? paymentMethodId)
    {
        if (oldFixedCostPaymentId == newFixedCostPaymentId)
        {
            if (newFixedCostPaymentId.HasValue)
            {
                var currentPayment = await context.FixedCostPayments.FindAsync(newFixedCostPaymentId.Value);
                if (currentPayment != null)
                {
                    currentPayment.PaymentDate = movementDate;
                    currentPayment.PaymentMethodId = paymentMethodId;
                }
            }
            return null;
        }

        if (oldFixedCostPaymentId.HasValue)
        {
            var oldPayment = await context.FixedCostPayments.FindAsync(oldFixedCostPaymentId.Value);
            if (oldPayment != null)
            {
                oldPayment.IsPaid = false;
                oldPayment.PaymentDate = null;
                oldPayment.PaymentMethodId = null;
            }
        }

        if (newFixedCostPaymentId.HasValue)
        {
            var newPayment = await context.FixedCostPayments.FindAsync(newFixedCostPaymentId.Value);
            if (newPayment == null)
            {
                return Results.BadRequest(new { message = "El vencimiento de Gasto Fijo indicado no existe." });
            }

            if (newPayment.IsPaid)
            {
                return Results.BadRequest(new { message = "El vencimiento seleccionado ya se encuentra pagado." });
            }

            newPayment.IsPaid = true;
            newPayment.PaymentDate = movementDate;
            newPayment.PaymentMethodId = paymentMethodId;
        }

        return null;
    }

    public static async Task<IResult> CreateMovementAsync(CreateMovementRequest request, Guid? userId, GeoServDbContext context)
    {
        try
        {
            if (request.Date.Date > DateTime.UtcNow.Date)
            {
                return Results.BadRequest(new { message = "No se permiten movimientos con fecha futura." });
            }

            var sourceId = request.SourceId;
            var sourceType = request.SourceType;

            var coherenceError = await ValidateCategoryCoherenceAsync(context, request.CategoryId, sourceType, sourceId);
            if (coherenceError != null) return coherenceError;

            var resolvedUserId = userId ?? await context.Users.Select(u => u.Id).FirstOrDefaultAsync();

            Guid? serviceOrderId = null;
            Guid? directCostId = null;
            Guid? fixedCostPaymentId = null;
            Guid? assetId = null;

            if (Guid.TryParse(sourceId, out var parsedGuid))
            {
                if (sourceType == MovementSourceType.ServiceOrderIncome) serviceOrderId = parsedGuid;
                // Nuevo flujo: SourceId transporta el Id de la Orden de Servicio de destino (no una fila existente).
                else if (sourceType == MovementSourceType.DirectCost) serviceOrderId = parsedGuid;
                else if (sourceType == MovementSourceType.FixedCostPayment) fixedCostPaymentId = parsedGuid;
                else if (sourceType == MovementSourceType.AssetPurchase) assetId = parsedGuid;
            }

            var directCostRowWasNew = false;
            if (sourceType == MovementSourceType.DirectCost)
            {
                if (!serviceOrderId.HasValue)
                    return Results.BadRequest(new { message = "Debe seleccionar la orden de servicio de destino." });
                if (!request.DirectCostCategoryId.HasValue)
                    return Results.BadRequest(new { message = "Debe seleccionar una categoría de costo directo." });

                var dcCategory = await context.DirectCostCategories.FindAsync(request.DirectCostCategoryId.Value);
                if (dcCategory == null || !dcCategory.IsAssignableViaMovement)
                    return Results.BadRequest(new { message = "La categoría de costo directo seleccionada no está habilitada para asignación vía movimiento." });

                var existingRow = await context.DirectCosts.FirstOrDefaultAsync(d =>
                    d.ServiceOrderId == serviceOrderId.Value && d.CategoryId == request.DirectCostCategoryId.Value && d.IsFromMovement);
                directCostRowWasNew = existingRow == null;
                directCostId = existingRow?.Id ?? await ServiceOrderFinanceSyncService.ResolveOrCreateDirectCostRowAsync(
                    context, serviceOrderId.Value, request.DirectCostCategoryId.Value, resolvedUserId, request.Date, request.Description);
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
                RegisteredByUserId = resolvedUserId,
                SourceType = sourceType,
                SourceId = sourceId,
                ServiceOrderId = serviceOrderId,
                DirectCostId = directCostId,
                FixedCostPaymentId = fixedCostPaymentId,
                AssetId = assetId
            };

            context.AccountingMovements.Add(movement);

            var paymentError = await ApplyFixedCostPaymentLinkAsync(context, null, fixedCostPaymentId, movement.Date, movement.PaymentMethodId);
            if (paymentError != null) return paymentError;

            await context.SaveChangesAsync();

            if (sourceType == MovementSourceType.ServiceOrderIncome && serviceOrderId.HasValue)
            {
                var actionText = $"Se registró un cobro de {ServiceOrderFinanceSyncService.FormatCurrency(movement.Amount)} vinculado a la orden " +
                    $"(Movimiento: {(string.IsNullOrWhiteSpace(movement.Description) ? "sin descripción" : movement.Description)}, Fecha: {movement.Date:dd/MM/yyyy}).";
                await ServiceOrderFinanceSyncService.SyncCollectionAsync(context, serviceOrderId.Value, resolvedUserId, actionText);
            }
            else if (sourceType == MovementSourceType.DirectCost && directCostId.HasValue)
            {
                await ServiceOrderFinanceSyncService.RecalculateDirectCostRowAsync(context, directCostId.Value, resolvedUserId, directCostRowWasNew);
            }

            return Results.Created($"/api/movements/{movement.Id}", movement);
        }
        catch (Exception ex)
        {
            return Results.Problem(detail: ex.InnerException?.Message ?? ex.Message, statusCode: 500);
        }
    }

    public static async Task<IResult> CreateTransferAsync(CreateTransferRequest request, Guid? userId, GeoServDbContext context)
    {
        try
        {
            if (request.Date.Date > DateTime.UtcNow.Date)
            {
                return Results.BadRequest(new { message = "No se permiten transferencias con fecha futura." });
            }

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

    public static async Task<IResult> UpdateMovementAsync(Guid id, UpdateMovementRequest request, GeoServDbContext context, Guid? userId = null)
    {
        try
        {
            if (request.Date.Date > DateTime.UtcNow.Date)
            {
                return Results.BadRequest(new { message = "No se permiten movimientos con fecha futura." });
            }

            var movement = await context.AccountingMovements.FindAsync(id);
            if (movement == null) return Results.NotFound();

            if (movement.TransferGroupId.HasValue)
            {
                return Results.BadRequest(new { message = "Este movimiento forma parte de una Transferencia Interna y no puede editarse individualmente. Elimine la transferencia completa y vuelva a cargarla." });
            }

            // Estado anterior, capturado antes de mutar, para poder resincronizar ambos lados si cambia el vínculo.
            var oldSourceType = movement.SourceType;
            var oldServiceOrderId = movement.ServiceOrderId;
            var oldDirectCostId = movement.DirectCostId;

            var sourceType = request.SourceType ?? MovementSourceType.Manual;
            var sourceId = request.SourceId;

            Guid? serviceOrderId = request.ServiceOrderId;
            Guid? directCostId = request.DirectCostId;
            Guid? fixedCostPaymentId = request.FixedCostPaymentId;
            Guid? assetId = request.AssetId;
            var isNewDirectCostFlow = false;

            if (!request.SourceType.HasValue)
            {
                sourceId = request.ServiceOrderId?.ToString() ?? request.DirectCostId?.ToString() ?? request.FixedCostPaymentId?.ToString() ?? request.AssetId?.ToString();
                if (request.ServiceOrderId.HasValue) sourceType = MovementSourceType.ServiceOrderIncome;
                else if (request.DirectCostId.HasValue) sourceType = MovementSourceType.DirectCost;
                else if (request.FixedCostPaymentId.HasValue) sourceType = MovementSourceType.FixedCostPayment;
                else if (request.AssetId.HasValue) sourceType = MovementSourceType.AssetPurchase;
            }
            else if (Guid.TryParse(sourceId, out var parsedGuid))
            {
                if (sourceType == MovementSourceType.ServiceOrderIncome) serviceOrderId = parsedGuid;
                // Nuevo flujo: SourceId transporta el Id de la Orden de Servicio de destino (no una fila existente).
                else if (sourceType == MovementSourceType.DirectCost) { serviceOrderId = parsedGuid; isNewDirectCostFlow = true; }
                else if (sourceType == MovementSourceType.FixedCostPayment) fixedCostPaymentId = parsedGuid;
                else if (sourceType == MovementSourceType.AssetPurchase) assetId = parsedGuid;
            }

            var coherenceError = await ValidateCategoryCoherenceAsync(context, request.CategoryId, sourceType, sourceId);
            if (coherenceError != null) return coherenceError;

            var resolvedUserId = userId ?? await context.Users.Select(u => u.Id).FirstOrDefaultAsync();
            var directCostRowWasNew = false;

            if (isNewDirectCostFlow)
            {
                if (!serviceOrderId.HasValue)
                    return Results.BadRequest(new { message = "Debe seleccionar la orden de servicio de destino." });
                if (!request.DirectCostCategoryId.HasValue)
                    return Results.BadRequest(new { message = "Debe seleccionar una categoría de costo directo." });

                var dcCategory = await context.DirectCostCategories.FindAsync(request.DirectCostCategoryId.Value);
                if (dcCategory == null || !dcCategory.IsAssignableViaMovement)
                    return Results.BadRequest(new { message = "La categoría de costo directo seleccionada no está habilitada para asignación vía movimiento." });

                var existingRow = await context.DirectCosts.FirstOrDefaultAsync(d =>
                    d.ServiceOrderId == serviceOrderId.Value && d.CategoryId == request.DirectCostCategoryId.Value && d.IsFromMovement);
                directCostRowWasNew = existingRow == null;
                directCostId = existingRow?.Id ?? await ServiceOrderFinanceSyncService.ResolveOrCreateDirectCostRowAsync(
                    context, serviceOrderId.Value, request.DirectCostCategoryId.Value, resolvedUserId, request.Date, request.Description);
            }

            var oldFixedCostPaymentId = movement.FixedCostPaymentId;

            movement.IsIncome = request.IsIncome;
            movement.CategoryId = request.CategoryId;
            movement.Amount = request.Amount;
            movement.Date = request.Date;
            movement.Description = request.Description ?? string.Empty;
            movement.FinancialAccountId = request.FinancialAccountId;
            movement.PaymentMethodId = request.PaymentMethodId;
            movement.ServiceOrderId = serviceOrderId;
            // FixedCostId legado NO se reasigna: se conserva intacto para movimientos históricos
            // (ver design.md); los movimientos nuevos/editados usan exclusivamente FixedCostPaymentId.
            movement.FixedCostPaymentId = fixedCostPaymentId;
            movement.DirectCostId = directCostId;
            movement.AssetId = assetId;
            movement.CheckId = request.CheckId;
            movement.ResponsibleId = request.ResponsibleId;
            movement.SourceType = sourceType;
            movement.SourceId = sourceId;

            var paymentError = await ApplyFixedCostPaymentLinkAsync(context, oldFixedCostPaymentId, fixedCostPaymentId, movement.Date, movement.PaymentMethodId);
            if (paymentError != null) return paymentError;

            await context.SaveChangesAsync();

            // --- Resincronización de Cobros (Ingresos): lado anterior y lado nuevo, si difieren ---
            var incomeOrdersToSync = new HashSet<Guid>();
            if (oldSourceType == MovementSourceType.ServiceOrderIncome && oldServiceOrderId.HasValue)
                incomeOrdersToSync.Add(oldServiceOrderId.Value);
            if (sourceType == MovementSourceType.ServiceOrderIncome && serviceOrderId.HasValue)
                incomeOrdersToSync.Add(serviceOrderId.Value);

            foreach (var orderId in incomeOrdersToSync)
            {
                var actionText = $"Se actualizó un cobro vinculado a la orden (Movimiento: {(string.IsNullOrWhiteSpace(movement.Description) ? "sin descripción" : movement.Description)}, Fecha: {movement.Date:dd/MM/yyyy}).";
                await ServiceOrderFinanceSyncService.SyncCollectionAsync(context, orderId, resolvedUserId, actionText);
            }

            // --- Resincronización de Costos Directos vía Movimiento: fila anterior y fila nueva, si difieren ---
            var directCostRowsToSync = new HashSet<Guid>();
            if (oldDirectCostId.HasValue) directCostRowsToSync.Add(oldDirectCostId.Value);
            if (sourceType == MovementSourceType.DirectCost && directCostId.HasValue) directCostRowsToSync.Add(directCostId.Value);

            foreach (var rowId in directCostRowsToSync)
            {
                var wasJustCreated = isNewDirectCostFlow && directCostRowWasNew && rowId == directCostId;
                await ServiceOrderFinanceSyncService.RecalculateDirectCostRowAsync(context, rowId, resolvedUserId, wasJustCreated);
            }

            return Results.NoContent();
        }
        catch (Exception ex)
        {
            return Results.Problem(detail: ex.InnerException?.Message ?? ex.Message, statusCode: 500);
        }
    }

    public static async Task<IResult> DeleteMovementAsync(Guid id, GeoServDbContext context, Guid? userId = null)
    {
        var movement = await context.AccountingMovements.FindAsync(id);
        if (movement == null) return Results.NotFound();

        if (movement.TransferGroupId.HasValue)
        {
            return Results.BadRequest(new { message = "Este movimiento forma parte de una Transferencia Interna y no puede eliminarse individualmente. Elimine la transferencia completa." });
        }

        if (movement.FixedCostPaymentId.HasValue)
        {
            var payment = await context.FixedCostPayments.FindAsync(movement.FixedCostPaymentId.Value);
            if (payment != null)
            {
                payment.IsPaid = false;
                payment.PaymentDate = null;
                payment.PaymentMethodId = null;
            }
        }

        var sourceType = movement.SourceType;
        var serviceOrderId = movement.ServiceOrderId;
        var directCostId = movement.DirectCostId;
        var amount = movement.Amount;
        var description = movement.Description;
        var date = movement.Date;

        context.AccountingMovements.Remove(movement);
        await context.SaveChangesAsync();

        var resolvedUserId = userId ?? await context.Users.Select(u => u.Id).FirstOrDefaultAsync();

        if (sourceType == MovementSourceType.ServiceOrderIncome && serviceOrderId.HasValue)
        {
            var actionText = $"Se eliminó un cobro de {ServiceOrderFinanceSyncService.FormatCurrency(amount)} vinculado a la orden " +
                $"(Movimiento: {(string.IsNullOrWhiteSpace(description) ? "sin descripción" : description)}, Fecha: {date:dd/MM/yyyy}).";
            await ServiceOrderFinanceSyncService.SyncCollectionAsync(context, serviceOrderId.Value, resolvedUserId, actionText);
        }
        else if (directCostId.HasValue)
        {
            await ServiceOrderFinanceSyncService.RecalculateDirectCostRowAsync(context, directCostId.Value, resolvedUserId, wasJustCreated: false);
        }

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
    Guid? ResponsibleId,
    // Categoría de Costo Directo elegida por el usuario cuando SourceType == DirectCost.
    // SourceId, en ese caso, transporta el Id de la Orden de Servicio de destino (no el de una fila existente).
    Guid? DirectCostCategoryId = null
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
    Guid? FixedCostPaymentId = null,
    Guid? DirectCostId = null,
    Guid? AssetId = null,
    Guid? CheckId = null,
    Guid? ResponsibleId = null,
    // Categoría de Costo Directo elegida por el usuario cuando SourceType == DirectCost.
    // SourceId, en ese caso, transporta el Id de la Orden de Servicio de destino (no el de una fila existente).
    Guid? DirectCostCategoryId = null
);


