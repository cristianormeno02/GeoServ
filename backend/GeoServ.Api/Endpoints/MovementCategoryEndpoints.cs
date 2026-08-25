using GeoServ.Api.Domain.Entities;
using GeoServ.Api.Infrastructure.Data;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace GeoServ.Api.Endpoints;

public static class MovementCategoryEndpoints
{
    public static void MapMovementCategoryEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/movement-categories").RequireAuthorization();

        group.MapGet("/", async (GeoServDbContext context) =>
        {
            var categories = await context.MovementCategories
                .OrderBy(c => c.Name)
                .ToListAsync();
            return Results.Ok(categories);
        })
        .WithName("GetMovementCategories")
        .WithOpenApi();

        group.MapGet("/{id:guid}", async (Guid id, GeoServDbContext context) =>
        {
            var category = await context.MovementCategories.FindAsync(id);
            return category is not null ? Results.Ok(category) : Results.NotFound();
        })
        .WithName("GetMovementCategoryById")
        .WithOpenApi();

        group.MapPost("/", async ([FromBody] CreateMovementCategoryRequest request, GeoServDbContext context) =>
        {
            var category = new MovementCategory
            {
                Id = Guid.NewGuid(),
                Name = request.Name,
                Description = request.Description ?? string.Empty,
                IsIncome = request.IsIncome,
                IsActive = request.IsActive
            };

            context.MovementCategories.Add(category);
            await context.SaveChangesAsync();

            return Results.Created($"/api/movement-categories/{category.Id}", category);
        })
        .WithName("CreateMovementCategory")
        .WithOpenApi();

        group.MapPut("/{id:guid}", async (Guid id, [FromBody] UpdateMovementCategoryRequest request, GeoServDbContext context) =>
        {
            var category = await context.MovementCategories.FindAsync(id);
            if (category == null) return Results.NotFound();

            category.Name = request.Name;
            category.Description = request.Description ?? string.Empty;
            category.IsIncome = request.IsIncome;
            category.IsActive = request.IsActive;

            await context.SaveChangesAsync();
            return Results.NoContent();
        })
        .WithName("UpdateMovementCategory")
        .WithOpenApi();

        group.MapDelete("/{id:guid}", async (Guid id, GeoServDbContext context) =>
        {
            var category = await context.MovementCategories.FindAsync(id);
            if (category == null) return Results.NotFound();

            // Lógica de eliminación suave o validación si está en uso
            var inUse = await context.AccountingMovements.AnyAsync(m => m.CategoryId == id);
            if (inUse) return Results.BadRequest("No se puede eliminar la categoría porque está siendo usada en movimientos.");

            context.MovementCategories.Remove(category);
            await context.SaveChangesAsync();
            return Results.NoContent();
        })
        .WithName("DeleteMovementCategory")
        .WithOpenApi();
    }
}

public record CreateMovementCategoryRequest(string Name, string? Description, bool IsIncome, bool IsActive);
public record UpdateMovementCategoryRequest(string Name, string? Description, bool IsIncome, bool IsActive);
