using GeoServ.Api.Domain.Entities;
using GeoServ.Api.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace GeoServ.Api.Endpoints;

public static class ConsumableEndpoints
{
    public static void MapConsumableEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/consumables").RequireAuthorization();

        // --- Consumables ---

        group.MapGet("/", async (GeoServDbContext context) =>
        {
            var items = await context.Consumables
                .Include(c => c.ConsumableClass)
                    .ThenInclude(cc => cc.ConsumableType)
                .Include(c => c.Provider)
                .Include(c => c.Unit)
                .OrderByDescending(c => c.PurchaseDate)
                .ToListAsync();
            return Results.Ok(items);
        }).WithName("GetConsumables").WithOpenApi();

        group.MapPost("/", async (CreateConsumableRequest request, GeoServDbContext context) =>
        {
            var item = new Consumable
            {
                Id = Guid.NewGuid(),
                PurchaseDate = request.PurchaseDate,
                ConsumableClassId = request.ConsumableClassId,
                Description = request.Description,
                Quantity = request.Quantity,
                UnitId = request.UnitId,
                UnitCost = request.UnitCost,
                TotalCost = request.TotalCost,
                ProviderId = request.ProviderId,
                Observation = request.Observation
            };
            context.Consumables.Add(item);
            await context.SaveChangesAsync();
            return Results.Created($"/api/consumables/{item.Id}", item);
        }).WithName("CreateConsumable").WithOpenApi();

        group.MapPut("/{id:guid}", async (Guid id, UpdateConsumableRequest request, GeoServDbContext context) =>
        {
            var item = await context.Consumables.FindAsync(id);
            if (item is null) return Results.NotFound();

            item.PurchaseDate = request.PurchaseDate;
            item.ConsumableClassId = request.ConsumableClassId;
            item.Description = request.Description;
            item.Quantity = request.Quantity;
            item.UnitId = request.UnitId;
            item.UnitCost = request.UnitCost;
            item.TotalCost = request.TotalCost;
            item.ProviderId = request.ProviderId;
            item.Observation = request.Observation;

            await context.SaveChangesAsync();
            return Results.NoContent();
        }).WithName("UpdateConsumable").WithOpenApi();

        group.MapDelete("/{id:guid}", async (Guid id, GeoServDbContext context) =>
        {
            var item = await context.Consumables.FindAsync(id);
            if (item is null) return Results.NotFound();
            context.Consumables.Remove(item);
            await context.SaveChangesAsync();
            return Results.NoContent();
        }).WithName("DeleteConsumable").WithOpenApi();

        // --- Types and Classes ---

        var typesGroup = app.MapGroup("/api/consumable-types").RequireAuthorization();
        typesGroup.MapGet("/", async (GeoServDbContext context) =>
        {
            return Results.Ok(await context.ConsumableTypes.ToListAsync());
        }).WithName("GetConsumableTypes").WithOpenApi();

        typesGroup.MapPost("/", async (CreateConsumableTypeRequest request, GeoServDbContext context) =>
        {
            var type = new ConsumableType { Id = Guid.NewGuid(), Name = request.Name };
            context.ConsumableTypes.Add(type);
            await context.SaveChangesAsync();
            return Results.Created($"/api/consumable-types/{type.Id}", type);
        }).WithName("CreateConsumableType").WithOpenApi();

        var classesGroup = app.MapGroup("/api/consumable-classes").RequireAuthorization();
        classesGroup.MapGet("/", async (GeoServDbContext context) =>
        {
            return Results.Ok(await context.ConsumableClasses.Include(c => c.ConsumableType).ToListAsync());
        }).WithName("GetConsumableClasses").WithOpenApi();

        classesGroup.MapPost("/", async (CreateConsumableClassRequest request, GeoServDbContext context) =>
        {
            var cClass = new ConsumableClass { Id = Guid.NewGuid(), Name = request.Name, ConsumableTypeId = request.ConsumableTypeId };
            context.ConsumableClasses.Add(cClass);
            await context.SaveChangesAsync();
            return Results.Created($"/api/consumable-classes/{cClass.Id}", cClass);
        }).WithName("CreateConsumableClass").WithOpenApi();
    }
}

public class CreateConsumableRequest
{
    public DateTime PurchaseDate { get; set; }
    public Guid ConsumableClassId { get; set; }
    public string Description { get; set; } = string.Empty;
    public decimal Quantity { get; set; }
    public Guid UnitId { get; set; }
    public decimal UnitCost { get; set; }
    public decimal TotalCost { get; set; }
    public Guid? ProviderId { get; set; }
    public string? Observation { get; set; }
}

public class UpdateConsumableRequest
{
    public DateTime PurchaseDate { get; set; }
    public Guid ConsumableClassId { get; set; }
    public string Description { get; set; } = string.Empty;
    public decimal Quantity { get; set; }
    public Guid UnitId { get; set; }
    public decimal UnitCost { get; set; }
    public decimal TotalCost { get; set; }
    public Guid? ProviderId { get; set; }
    public string? Observation { get; set; }
}

public class CreateConsumableTypeRequest
{
    public string Name { get; set; } = string.Empty;
}

public class CreateConsumableClassRequest
{
    public string Name { get; set; } = string.Empty;
    public Guid ConsumableTypeId { get; set; }
}
