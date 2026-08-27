using GeoServ.Api.Domain.Entities;
using GeoServ.Api.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace GeoServ.Api.Endpoints;

public static class FixedCostItemEndpoints
{
    public static void MapFixedCostItemEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/fixed-cost-items").RequireAuthorization();

        // --- Headers (Items) ---

        group.MapGet("/", async (GeoServDbContext context) =>
        {
            var items = await context.FixedCostItems
                .Include(f => f.Category)
                .Include(f => f.Provider)
                .ToListAsync();
            return Results.Ok(items);
        }).WithName("GetFixedCostItems").WithOpenApi();

        group.MapGet("/{id:guid}", async (Guid id, GeoServDbContext context) =>
        {
            var item = await context.FixedCostItems
                .Include(f => f.Category)
                .Include(f => f.Provider)
                .Include(f => f.Payments)
                .FirstOrDefaultAsync(f => f.Id == id);
            return item is not null ? Results.Ok(item) : Results.NotFound();
        }).WithName("GetFixedCostItemById").WithOpenApi();

        group.MapPost("/", async (CreateFixedCostItemRequest request, GeoServDbContext context) =>
        {
            var item = new FixedCostItem
            {
                Id = Guid.NewGuid(),
                Name = request.Name,
                CategoryId = request.CategoryId,
                ProviderId = request.ProviderId,
                InitialAmount = request.InitialAmount,
                IsRecurring = request.IsRecurring,
                Observation = request.Observation
            };
            context.FixedCostItems.Add(item);
            await context.SaveChangesAsync();
            return Results.Created($"/api/fixed-cost-items/{item.Id}", item);
        }).WithName("CreateFixedCostItem").WithOpenApi();

        group.MapPut("/{id:guid}", async (Guid id, UpdateFixedCostItemRequest request, GeoServDbContext context) =>
        {
            var item = await context.FixedCostItems.FindAsync(id);
            if (item is null) return Results.NotFound();

            item.Name = request.Name;
            item.CategoryId = request.CategoryId;
            item.ProviderId = request.ProviderId;
            item.InitialAmount = request.InitialAmount;
            item.IsRecurring = request.IsRecurring;
            item.Observation = request.Observation;

            await context.SaveChangesAsync();
            return Results.NoContent();
        }).WithName("UpdateFixedCostItem").WithOpenApi();

        group.MapDelete("/{id:guid}", async (Guid id, GeoServDbContext context) =>
        {
            var item = await context.FixedCostItems.FindAsync(id);
            if (item is null) return Results.NotFound();
            context.FixedCostItems.Remove(item);
            await context.SaveChangesAsync();
            return Results.NoContent();
        }).WithName("DeleteFixedCostItem").WithOpenApi();


        // --- Payments (Details) ---

        var paymentsGroup = app.MapGroup("/api/fixed-cost-payments").RequireAuthorization();

        paymentsGroup.MapPost("/", async (CreateFixedCostPaymentRequest request, GeoServDbContext context) =>
        {
            var payment = new FixedCostPayment
            {
                Id = Guid.NewGuid(),
                FixedCostItemId = request.FixedCostItemId,
                DueDate = request.DueDate,
                Amount = request.Amount,
                IsPaid = request.IsPaid,
                PaymentDate = request.PaymentDate,
                PaymentMethodId = request.PaymentMethodId,
                ReceiptNumber = request.ReceiptNumber
            };
            context.FixedCostPayments.Add(payment);
            await context.SaveChangesAsync();
            return Results.Created($"/api/fixed-cost-payments/{payment.Id}", payment);
        }).WithName("CreateFixedCostPayment").WithOpenApi();

        paymentsGroup.MapPut("/{id:guid}", async (Guid id, UpdateFixedCostPaymentRequest request, GeoServDbContext context) =>
        {
            var payment = await context.FixedCostPayments.FindAsync(id);
            if (payment is null) return Results.NotFound();

            payment.DueDate = request.DueDate;
            payment.Amount = request.Amount;
            payment.IsPaid = request.IsPaid;
            payment.PaymentDate = request.PaymentDate;
            payment.PaymentMethodId = request.PaymentMethodId;
            payment.ReceiptNumber = request.ReceiptNumber;

            await context.SaveChangesAsync();
            return Results.NoContent();
        }).WithName("UpdateFixedCostPayment").WithOpenApi();
        
        paymentsGroup.MapDelete("/{id:guid}", async (Guid id, GeoServDbContext context) =>
        {
            var payment = await context.FixedCostPayments.FindAsync(id);
            if (payment is null) return Results.NotFound();
            context.FixedCostPayments.Remove(payment);
            await context.SaveChangesAsync();
            return Results.NoContent();
        }).WithName("DeleteFixedCostPayment").WithOpenApi();
    }
}

public class CreateFixedCostItemRequest
{
    public string Name { get; set; } = string.Empty;
    public Guid CategoryId { get; set; }
    public Guid? ProviderId { get; set; }
    public decimal InitialAmount { get; set; }
    public bool IsRecurring { get; set; }
    public string? Observation { get; set; }
}

public class UpdateFixedCostItemRequest
{
    public string Name { get; set; } = string.Empty;
    public Guid CategoryId { get; set; }
    public Guid? ProviderId { get; set; }
    public decimal InitialAmount { get; set; }
    public bool IsRecurring { get; set; }
    public string? Observation { get; set; }
}

public class CreateFixedCostPaymentRequest
{
    public Guid FixedCostItemId { get; set; }
    public DateTime DueDate { get; set; }
    public decimal Amount { get; set; }
    public bool IsPaid { get; set; }
    public DateTime? PaymentDate { get; set; }
    public Guid? PaymentMethodId { get; set; }
    public string? ReceiptNumber { get; set; }
}

public class UpdateFixedCostPaymentRequest
{
    public DateTime DueDate { get; set; }
    public decimal Amount { get; set; }
    public bool IsPaid { get; set; }
    public DateTime? PaymentDate { get; set; }
    public Guid? PaymentMethodId { get; set; }
    public string? ReceiptNumber { get; set; }
}
