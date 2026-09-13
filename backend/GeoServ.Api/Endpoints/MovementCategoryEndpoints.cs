using GeoServ.Api.Domain.Entities;
using GeoServ.Api.Domain.Enums;
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
            var coherenceError = ValidateLinkedSourceTypeCoherence(request.IsIncome, request.LinkedSourceType);
            if (coherenceError != null) return Results.BadRequest(new { message = coherenceError });

            var category = new MovementCategory
            {
                Id = Guid.NewGuid(),
                Name = request.Name,
                Description = request.Description ?? string.Empty,
                IsIncome = request.IsIncome,
                IsActive = request.IsActive,
                IsSystemDefault = false,
                LinkedSourceType = request.LinkedSourceType
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

            if (category.IsSystemDefault)
            {
                return Results.BadRequest(new { message = "Esta categoría es reservada por el sistema (Transferencias Internas) y no puede modificarse." });
            }

            var coherenceError = ValidateLinkedSourceTypeCoherence(request.IsIncome, request.LinkedSourceType);
            if (coherenceError != null) return Results.BadRequest(new { message = coherenceError });

            category.Name = request.Name;
            category.Description = request.Description ?? string.Empty;
            category.IsIncome = request.IsIncome;
            category.IsActive = request.IsActive;
            category.LinkedSourceType = request.LinkedSourceType;

            await context.SaveChangesAsync();
            return Results.NoContent();
        })
        .WithName("UpdateMovementCategory")
        .WithOpenApi();

        group.MapDelete("/{id:guid}", async (Guid id, GeoServDbContext context) =>
        {
            var category = await context.MovementCategories.FindAsync(id);
            if (category == null) return Results.NotFound();

            if (category.IsSystemDefault)
            {
                return Results.BadRequest(new { message = "Esta categoría es reservada por el sistema (Transferencias Internas) y no puede eliminarse." });
            }

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

    // Valida que el vínculo de origen sea coherente con el tipo de categoría (Ingreso/Egreso).
    // Ingreso: solo null o ServiceOrderIncome. Egreso: solo null, AssetPurchase, FixedCostPayment o DirectCost.
    // Retorna un mensaje de error, o null si es válido.
    public static string? ValidateLinkedSourceTypeCoherence(bool isIncome, MovementSourceType? linkedSourceType)
    {
        if (linkedSourceType == null) return null;

        if (isIncome)
        {
            if (linkedSourceType != MovementSourceType.ServiceOrderIncome)
            {
                return "Una categoría de Ingreso solo puede vincularse a \"Cobro de Orden de Servicio\" o no tener vínculo.";
            }
        }
        else
        {
            if (linkedSourceType != MovementSourceType.AssetPurchase &&
                linkedSourceType != MovementSourceType.FixedCostPayment &&
                linkedSourceType != MovementSourceType.DirectCost)
            {
                return "Una categoría de Egreso solo puede vincularse a Compra de Activo, Pago de Gasto Fijo, Pago de Costo Directo, o no tener vínculo.";
            }
        }

        return null;
    }
}

public record CreateMovementCategoryRequest(string Name, string? Description, bool IsIncome, bool IsActive, MovementSourceType? LinkedSourceType = null);
public record UpdateMovementCategoryRequest(string Name, string? Description, bool IsIncome, bool IsActive, MovementSourceType? LinkedSourceType = null);
