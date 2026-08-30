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
                    FinancialAccountName = m.FinancialAccount.Name,
                    PaymentMethodName = m.PaymentMethod != null ? m.PaymentMethod.Name : null,
                    ServiceOrderNumber = m.ServiceOrder != null ? m.ServiceOrder.OrderNumber : null,
                    m.RegisteredByUserId,
                    SourceType = m.SourceType.ToString(),
                    m.SourceId
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
                    // Fallback para desarrollo si no hay claims (solo MVP)
                    userId = await context.Users.Select(u => u.Id).FirstOrDefaultAsync();
                }

                var sourceId = request.ServiceOrderId?.ToString() ?? request.DirectCostId?.ToString() ?? request.FixedCostId?.ToString() ?? request.AssetId?.ToString();
                var sourceType = MovementSourceType.Manual;
                if (request.ServiceOrderId.HasValue) sourceType = MovementSourceType.ServiceOrderIncome;
                else if (request.DirectCostId.HasValue) sourceType = MovementSourceType.DirectCost;
                else if (request.FixedCostId.HasValue) sourceType = MovementSourceType.FixedCostPayment;
                else if (request.AssetId.HasValue) sourceType = MovementSourceType.AssetPurchase;

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
                    ServiceOrderId = request.ServiceOrderId,
                    FixedCostId = request.FixedCostId,
                    DirectCostId = request.DirectCostId,
                    AssetId = request.AssetId,
                    CheckId = request.CheckId,
                    ResponsibleId = request.ResponsibleId,
                    RegisteredByUserId = userId,
                    SourceType = sourceType,
                    SourceId = sourceId
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
        {
            try
            {
                var movement = await context.AccountingMovements.FindAsync(id);
                if (movement == null) return Results.NotFound();

                var sourceId = request.ServiceOrderId?.ToString() ?? request.DirectCostId?.ToString() ?? request.FixedCostId?.ToString() ?? request.AssetId?.ToString();
                var sourceType = MovementSourceType.Manual;
                if (request.ServiceOrderId.HasValue) sourceType = MovementSourceType.ServiceOrderIncome;
                else if (request.DirectCostId.HasValue) sourceType = MovementSourceType.DirectCost;
                else if (request.FixedCostId.HasValue) sourceType = MovementSourceType.FixedCostPayment;
                else if (request.AssetId.HasValue) sourceType = MovementSourceType.AssetPurchase;

                movement.IsIncome = request.IsIncome;
                movement.CategoryId = request.CategoryId;
                movement.Amount = request.Amount;
                movement.Date = request.Date;
                movement.Description = request.Description ?? string.Empty;
                movement.FinancialAccountId = request.FinancialAccountId;
                movement.PaymentMethodId = request.PaymentMethodId;
                movement.ServiceOrderId = request.ServiceOrderId;
                movement.FixedCostId = request.FixedCostId;
                movement.DirectCostId = request.DirectCostId;
                movement.AssetId = request.AssetId;
                movement.CheckId = request.CheckId;
                movement.ResponsibleId = request.ResponsibleId;
                movement.SourceType = sourceType;
                movement.SourceId = sourceId;

                await context.SaveChangesAsync();
                return Results.NoContent();
            }
            catch(Exception ex)
            {
                return Results.Problem(detail: ex.InnerException?.Message ?? ex.Message, statusCode: 500);
            }
        })
        .WithName("UpdateMovement")
        .WithOpenApi();

        group.MapDelete("/{id:guid}", async (Guid id, GeoServDbContext context) =>
        {
            var movement = await context.AccountingMovements.FindAsync(id);
            if (movement == null) return Results.NotFound();

            context.AccountingMovements.Remove(movement);
            await context.SaveChangesAsync();
            return Results.NoContent();
        })
        .WithName("DeleteMovement")
        .WithOpenApi();
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
    Guid? ServiceOrderId,
    Guid? FixedCostId,
    Guid? DirectCostId,
    Guid? AssetId,
    Guid? CheckId,
    Guid? ResponsibleId
);

public record UpdateMovementRequest(
    bool IsIncome,
    Guid CategoryId,
    decimal Amount,
    DateTime Date,
    string? Description,
    Guid FinancialAccountId,
    Guid? PaymentMethodId,
    Guid? ServiceOrderId,
    Guid? FixedCostId,
    Guid? DirectCostId,
    Guid? AssetId,
    Guid? CheckId,
    Guid? ResponsibleId
);
