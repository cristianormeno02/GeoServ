using GeoServ.Api.Domain.Entities;
using GeoServ.Api.Infrastructure.Data;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace GeoServ.Api.Endpoints;

public static class InventoryMovementEndpoints
{
    public static void MapInventoryMovementEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/inventory-movements").RequireAuthorization();

        group.MapGet("/consumable/{consumableId:guid}", async (Guid consumableId, GeoServDbContext context) =>
        {
            var items = await context.InventoryMovements
                .Where(m => m.ConsumableId == consumableId)
                .OrderByDescending(m => m.Fecha)
                .ToListAsync();
            return Results.Ok(items);
        }).WithName("GetInventoryMovementsByConsumable").WithOpenApi();

        group.MapPost("/", async (CreateInventoryMovementRequest request, GeoServDbContext context, HttpContext httpContext) =>
        {
            var userIdStr = httpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!Guid.TryParse(userIdStr, out var userId)) 
            {
                userId = await context.Users.Select(u => u.Id).FirstOrDefaultAsync();
            }

            var movement = new InventoryMovement
            {
                Id = Guid.NewGuid(),
                ConsumableId = request.ConsumableId,
                Cantidad = request.Cantidad,
                MovementType = request.MovementType,
                Motivo = request.Motivo,
                Fecha = request.Fecha ?? DateTime.UtcNow,
                UserId = userId
            };
            
            movement.Validate();
            
            context.InventoryMovements.Add(movement);
            await context.SaveChangesAsync();
            
            return Results.Created($"/api/inventory-movements/{movement.Id}", movement);
        }).WithName("CreateInventoryMovement").WithOpenApi();
    }
}

public class CreateInventoryMovementRequest
{
    public Guid ConsumableId { get; set; }
    public decimal Cantidad { get; set; }
    public GeoServ.Api.Domain.Enums.InventoryMovementType MovementType { get; set; }
    public string? Motivo { get; set; }
    public DateTime? Fecha { get; set; }
}
