using GeoServ.Api.Domain.Entities;
using GeoServ.Api.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace GeoServ.Api.Endpoints;

public static class DirectCostMasterEndpoints
{
    public static void MapDirectCostMasterEndpoints(this IEndpointRouteBuilder app)
    {
        var categoryGroup = app.MapGroup("/api/direct-cost-categories").RequireAuthorization();

        categoryGroup.MapGet("/", async (GeoServDbContext context) =>
        {
            var items = await context.DirectCostCategories.OrderBy(c => c.Name).ToListAsync();
            return Results.Ok(items);
        });

        categoryGroup.MapGet("/{id:guid}", async (Guid id, GeoServDbContext context) =>
        {
            var item = await context.DirectCostCategories.FindAsync(id);
            return item is null ? Results.NotFound() : Results.Ok(item);
        });

        categoryGroup.MapPost("/", async (DirectCostCategory request, GeoServDbContext context) =>
        {
            request.Id = Guid.NewGuid();
            context.DirectCostCategories.Add(request);
            await context.SaveChangesAsync();
            return Results.Created($"/api/direct-cost-categories/{request.Id}", request);
        });

        categoryGroup.MapPut("/{id:guid}", async (Guid id, DirectCostCategory request, GeoServDbContext context) =>
        {
            var item = await context.DirectCostCategories.FindAsync(id);
            if (item is null) return Results.NotFound();
            item.Name = request.Name;
            item.IsActive = request.IsActive;
            await context.SaveChangesAsync();
            return Results.NoContent();
        });

        categoryGroup.MapDelete("/{id:guid}", async (Guid id, GeoServDbContext context) =>
        {
            var item = await context.DirectCostCategories.FindAsync(id);
            if (item is null) return Results.NotFound();
            context.DirectCostCategories.Remove(item);
            await context.SaveChangesAsync();
            return Results.NoContent();
        });

        var providerGroup = app.MapGroup("/api/providers").RequireAuthorization();

        providerGroup.MapGet("/", async (GeoServDbContext context) =>
        {
            var items = await context.Providers.OrderBy(p => p.Name).ToListAsync();
            return Results.Ok(items);
        });

        providerGroup.MapGet("/{id:guid}", async (Guid id, GeoServDbContext context) =>
        {
            var item = await context.Providers.FindAsync(id);
            return item is null ? Results.NotFound() : Results.Ok(item);
        });

        providerGroup.MapPost("/", async (Provider request, GeoServDbContext context) =>
        {
            request.Id = Guid.NewGuid();
            context.Providers.Add(request);
            await context.SaveChangesAsync();
            return Results.Created($"/api/providers/{request.Id}", request);
        });

        providerGroup.MapPut("/{id:guid}", async (Guid id, Provider request, GeoServDbContext context) =>
        {
            var item = await context.Providers.FindAsync(id);
            if (item is null) return Results.NotFound();
            item.Name = request.Name;
            item.IsActive = request.IsActive;
            await context.SaveChangesAsync();
            return Results.NoContent();
        });

        providerGroup.MapDelete("/{id:guid}", async (Guid id, GeoServDbContext context) =>
        {
            var item = await context.Providers.FindAsync(id);
            if (item is null) return Results.NotFound();
            context.Providers.Remove(item);
            await context.SaveChangesAsync();
            return Results.NoContent();
        });

        var unitGroup = app.MapGroup("/api/units").RequireAuthorization();

        unitGroup.MapGet("/", async (GeoServDbContext context) =>
        {
            var items = await context.Units.OrderBy(u => u.Name).ToListAsync();
            return Results.Ok(items);
        });

        unitGroup.MapGet("/{id:guid}", async (Guid id, GeoServDbContext context) =>
        {
            var item = await context.Units.FindAsync(id);
            return item is null ? Results.NotFound() : Results.Ok(item);
        });

        unitGroup.MapPost("/", async (Unit request, GeoServDbContext context) =>
        {
            request.Id = Guid.NewGuid();
            context.Units.Add(request);
            await context.SaveChangesAsync();
            return Results.Created($"/api/units/{request.Id}", request);
        });

        unitGroup.MapPut("/{id:guid}", async (Guid id, Unit request, GeoServDbContext context) =>
        {
            var item = await context.Units.FindAsync(id);
            if (item is null) return Results.NotFound();
            item.Name = request.Name;
            item.IsActive = request.IsActive;
            await context.SaveChangesAsync();
            return Results.NoContent();
        });

        unitGroup.MapDelete("/{id:guid}", async (Guid id, GeoServDbContext context) =>
        {
            var item = await context.Units.FindAsync(id);
            if (item is null) return Results.NotFound();
            context.Units.Remove(item);
            await context.SaveChangesAsync();
            return Results.NoContent();
        });

        var paymentGroup = app.MapGroup("/api/payment-methods").RequireAuthorization();

        paymentGroup.MapGet("/", async (GeoServDbContext context) =>
        {
            var items = await context.PaymentMethods.OrderBy(p => p.Name).ToListAsync();
            return Results.Ok(items);
        });

        paymentGroup.MapGet("/{id:guid}", async (Guid id, GeoServDbContext context) =>
        {
            var item = await context.PaymentMethods.FindAsync(id);
            return item is null ? Results.NotFound() : Results.Ok(item);
        });

        paymentGroup.MapPost("/", async (PaymentMethod request, GeoServDbContext context) =>
        {
            request.Id = Guid.NewGuid();
            context.PaymentMethods.Add(request);
            await context.SaveChangesAsync();
            return Results.Created($"/api/payment-methods/{request.Id}", request);
        });

        paymentGroup.MapPut("/{id:guid}", async (Guid id, PaymentMethod request, GeoServDbContext context) =>
        {
            var item = await context.PaymentMethods.FindAsync(id);
            if (item is null) return Results.NotFound();
            item.Name = request.Name;
            item.IsActive = request.IsActive;
            await context.SaveChangesAsync();
            return Results.NoContent();
        });

        paymentGroup.MapDelete("/{id:guid}", async (Guid id, GeoServDbContext context) =>
        {
            var item = await context.PaymentMethods.FindAsync(id);
            if (item is null) return Results.NotFound();
            context.PaymentMethods.Remove(item);
            await context.SaveChangesAsync();
            return Results.NoContent();
        });
    }
}
