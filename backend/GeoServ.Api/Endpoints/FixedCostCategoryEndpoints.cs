using GeoServ.Api.Domain.Entities;
using GeoServ.Api.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace GeoServ.Api.Endpoints;

public static class FixedCostCategoryEndpoints
{
    public static void MapFixedCostCategoryEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/fixed-cost-categories").RequireAuthorization();

        group.MapGet("/", async (GeoServDbContext context) =>
        {
            var items = await context.FixedCostCategories.OrderBy(c => c.Name).ToListAsync();
            return Results.Ok(items);
        }).WithName("GetFixedCostCategories").WithOpenApi();

        group.MapGet("/{id:guid}", async (Guid id, GeoServDbContext context) =>
        {
            var item = await context.FixedCostCategories.FindAsync(id);
            return item is not null ? Results.Ok(item) : Results.NotFound();
        }).WithName("GetFixedCostCategoryById").WithOpenApi();

        group.MapPost("/", async (CreateFixedCostCategoryRequest request, GeoServDbContext context) =>
        {
            var item = new FixedCostCategory
            {
                Id = Guid.NewGuid(),
                Name = request.Name,
                Description = request.Description
            };
            context.FixedCostCategories.Add(item);
            await context.SaveChangesAsync();
            return Results.Created($"/api/fixed-cost-categories/{item.Id}", item);
        }).WithName("CreateFixedCostCategory").WithOpenApi();

        group.MapPut("/{id:guid}", async (Guid id, UpdateFixedCostCategoryRequest request, GeoServDbContext context) =>
        {
            var item = await context.FixedCostCategories.FindAsync(id);
            if (item is null) return Results.NotFound();

            item.Name = request.Name;
            item.Description = request.Description;

            await context.SaveChangesAsync();
            return Results.NoContent();
        }).WithName("UpdateFixedCostCategory").WithOpenApi();

        group.MapDelete("/{id:guid}", async (Guid id, GeoServDbContext context) =>
        {
            var item = await context.FixedCostCategories.FindAsync(id);
            if (item is null) return Results.NotFound();

            // Check if there are related items
            if (await context.FixedCostItems.AnyAsync(f => f.CategoryId == id) || await context.FixedCosts.AnyAsync(f => f.CategoryId == id))
            {
                return Results.BadRequest(new { message = "No se puede eliminar la categoría porque está en uso por gastos fijos." });
            }

            context.FixedCostCategories.Remove(item);
            await context.SaveChangesAsync();
            return Results.NoContent();
        }).WithName("DeleteFixedCostCategory").WithOpenApi();
    }
}

public class CreateFixedCostCategoryRequest
{
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
}

public class UpdateFixedCostCategoryRequest
{
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
}
