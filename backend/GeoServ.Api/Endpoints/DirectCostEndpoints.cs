using GeoServ.Api.Domain.Entities;
using GeoServ.Api.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace GeoServ.Api.Endpoints;

public static class DirectCostEndpoints
{
    public static void MapDirectCostEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/service-orders/{serviceOrderId:guid}/direct-costs").RequireAuthorization();

        group.MapGet("/", async (Guid serviceOrderId, GeoServDbContext context) =>
        {
            var costs = await context.DirectCosts
                .Include(c => c.Category)
                .Include(c => c.Provider)
                .Include(c => c.Unit)
                .Include(c => c.PaidBy)
                .Include(c => c.PaymentMethod)
                .Where(c => c.ServiceOrderId == serviceOrderId)
                .OrderBy(c => c.OrderIndex).ThenByDescending(c => c.Date)
                .ToListAsync();

            return Results.Ok(costs);
        });

        group.MapGet("/{id:guid}", async (Guid serviceOrderId, Guid id, GeoServDbContext context) =>
        {
            var cost = await context.DirectCosts
                .Include(c => c.Category)
                .Include(c => c.Provider)
                .Include(c => c.Unit)
                .Include(c => c.PaidBy)
                .Include(c => c.PaymentMethod)
                .FirstOrDefaultAsync(c => c.Id == id && c.ServiceOrderId == serviceOrderId);

            if (cost is null) return Results.NotFound();

            return Results.Ok(cost);
        });

        group.MapPost("/", async (Guid serviceOrderId, DirectCostRequest request, GeoServDbContext context, HttpContext httpContext) =>
        {
            var userIdStr = httpContext.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdStr) || !Guid.TryParse(userIdStr, out var userId))
                return Results.Unauthorized();

            var directCost = new DirectCost
            {
                Id = Guid.NewGuid(),
                ServiceOrderId = serviceOrderId,
                CategoryId = request.CategoryId,
                ProviderId = request.ProviderId,
                Description = request.Description,
                Quantity = request.Quantity,
                UnitId = request.UnitId,
                UnitPrice = request.UnitPrice,
                TotalAmount = request.TotalAmount,
                Date = request.Date,
                PaidById = request.PaidById,
                PaymentMethodId = request.PaymentMethodId,
                Status = request.Status ?? "Pendiente",
                Observations = request.Observations,
                RegisteredByUserId = userId,
                OrderIndex = request.OrderIndex
            };

            context.DirectCosts.Add(directCost);
            await context.SaveChangesAsync();

            return Results.Created($"/api/service-orders/{serviceOrderId}/direct-costs/{directCost.Id}", directCost);
        });

        group.MapPut("/{id:guid}", async (Guid serviceOrderId, Guid id, DirectCostRequest request, GeoServDbContext context) =>
        {
            var directCost = await context.DirectCosts.FirstOrDefaultAsync(c => c.Id == id && c.ServiceOrderId == serviceOrderId);
            if (directCost is null) return Results.NotFound();

            directCost.CategoryId = request.CategoryId;
            directCost.ProviderId = request.ProviderId;
            directCost.Description = request.Description;
            directCost.Quantity = request.Quantity;
            directCost.UnitId = request.UnitId;
            directCost.UnitPrice = request.UnitPrice;
            directCost.TotalAmount = request.TotalAmount;
            directCost.Date = request.Date;
            directCost.PaidById = request.PaidById;
            directCost.PaymentMethodId = request.PaymentMethodId;
            directCost.Status = request.Status ?? "Pendiente";
            directCost.Observations = request.Observations;
            directCost.OrderIndex = request.OrderIndex;

            await context.SaveChangesAsync();

            return Results.NoContent();
        });

        group.MapDelete("/{id:guid}", async (Guid serviceOrderId, Guid id, GeoServDbContext context) =>
        {
            var directCost = await context.DirectCosts.FirstOrDefaultAsync(c => c.Id == id && c.ServiceOrderId == serviceOrderId);
            if (directCost is null) return Results.NotFound();

            context.DirectCosts.Remove(directCost);
            await context.SaveChangesAsync();

            return Results.NoContent();
        });
    }
}

public class DirectCostRequest
{
    public Guid CategoryId { get; set; }
    public Guid? ProviderId { get; set; }
    public string Description { get; set; } = string.Empty;
    public decimal Quantity { get; set; }
    public Guid? UnitId { get; set; }
    public decimal UnitPrice { get; set; }
    public decimal TotalAmount { get; set; }
    public DateTime Date { get; set; }
    public Guid? PaidById { get; set; }
    public Guid? PaymentMethodId { get; set; }
    public string? Status { get; set; }
    public string? Observations { get; set; }
    public int OrderIndex { get; set; } = 0;
}
