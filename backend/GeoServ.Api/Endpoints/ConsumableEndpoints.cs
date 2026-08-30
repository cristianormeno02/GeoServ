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
                .Select(c => new
                {
                    c.Id,
                    c.PurchaseDate,
                    c.ConsumableClassId,
                    ConsumableClass = c.ConsumableClass,
                    c.Description,
                    Quantity = c.InventoryMovements.Sum(im => im.Cantidad),
                    c.UnitId,
                    Unit = c.Unit,
                    c.UnitCost,
                    c.TotalCost,
                    c.ProviderId,
                    Provider = c.Provider,
                    c.Observation
                })
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
                UnitId = request.UnitId,
                UnitCost = request.UnitCost,
                TotalCost = request.TotalCost,
                ProviderId = request.ProviderId,
                Observation = request.Observation
            };
            context.Consumables.Add(item);

            // Create initial InventoryMovement
            var movement = new InventoryMovement
            {
                Id = Guid.NewGuid(),
                ConsumableId = item.Id,
                Cantidad = request.Quantity,
                MovementType = GeoServ.Api.Domain.Enums.InventoryMovementType.Compra,
                Fecha = request.PurchaseDate,
                UserId = Guid.Empty // Ideally should come from HttpContext User
            };
            movement.Validate();
            context.InventoryMovements.Add(movement);

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
            item.UnitId = request.UnitId;
            item.UnitCost = request.UnitCost;
            item.TotalCost = request.TotalCost;
            item.ProviderId = request.ProviderId;
            item.Observation = request.Observation;

            // Notice: Updating quantity of an existing purchase is complex if there are other movements.
            // For now, we update the original 'Compra' movement if it exists, or just skip.
            var firstMovement = await context.InventoryMovements
                .FirstOrDefaultAsync(m => m.ConsumableId == item.Id && m.MovementType == GeoServ.Api.Domain.Enums.InventoryMovementType.Compra);
            
            if (firstMovement != null)
            {
                firstMovement.Cantidad = request.Quantity;
                firstMovement.Validate();
            }

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
            return Results.Ok(await context.ConsumableTypes.OrderBy(t => t.Name).ToListAsync());
        }).WithName("GetConsumableTypes").WithOpenApi();

        typesGroup.MapPost("/", async (CreateConsumableTypeRequest request, GeoServDbContext context) =>
        {
            if (await context.ConsumableTypes.AnyAsync(t => t.Name.ToLower() == request.Name.ToLower()))
                return Results.BadRequest(new { message = "Ya existe un tipo con ese nombre." });

            var type = new ConsumableType { Id = Guid.NewGuid(), Name = request.Name };
            context.ConsumableTypes.Add(type);
            await context.SaveChangesAsync();
            return Results.Created($"/api/consumable-types/{type.Id}", type);
        }).WithName("CreateConsumableType").WithOpenApi();

        typesGroup.MapPut("/{id:guid}", async (Guid id, CreateConsumableTypeRequest request, GeoServDbContext context) =>
        {
            var type = await context.ConsumableTypes.FindAsync(id);
            if (type == null) return Results.NotFound();

            if (await context.ConsumableTypes.AnyAsync(t => t.Id != id && t.Name.ToLower() == request.Name.ToLower()))
                return Results.BadRequest(new { message = "Ya existe otro tipo con ese nombre." });

            type.Name = request.Name;
            await context.SaveChangesAsync();
            return Results.NoContent();
        }).WithName("UpdateConsumableType").WithOpenApi();

        var classesGroup = app.MapGroup("/api/consumable-classes").RequireAuthorization();
        classesGroup.MapGet("/", async (GeoServDbContext context) =>
        {
            return Results.Ok(await context.ConsumableClasses.Include(c => c.ConsumableType).OrderBy(c => c.Name).ToListAsync());
        }).WithName("GetConsumableClasses").WithOpenApi();

        classesGroup.MapPost("/", async (CreateConsumableClassRequest request, GeoServDbContext context) =>
        {
            if (await context.ConsumableClasses.AnyAsync(c => c.Name.ToLower() == request.Name.ToLower() && c.ConsumableTypeId == request.ConsumableTypeId))
                return Results.BadRequest(new { message = "Ya existe una clase con ese nombre en este tipo de insumo." });

            var cClass = new ConsumableClass { Id = Guid.NewGuid(), Name = request.Name, ConsumableTypeId = request.ConsumableTypeId };
            context.ConsumableClasses.Add(cClass);
            await context.SaveChangesAsync();
            return Results.Created($"/api/consumable-classes/{cClass.Id}", cClass);
        }).WithName("CreateConsumableClass").WithOpenApi();

        classesGroup.MapPut("/{id:guid}", async (Guid id, CreateConsumableClassRequest request, GeoServDbContext context) =>
        {
            var cClass = await context.ConsumableClasses.FindAsync(id);
            if (cClass == null) return Results.NotFound();

            if (await context.ConsumableClasses.AnyAsync(c => c.Id != id && c.Name.ToLower() == request.Name.ToLower() && c.ConsumableTypeId == request.ConsumableTypeId))
                return Results.BadRequest(new { message = "Ya existe otra clase con ese nombre en este tipo de insumo." });

            cClass.Name = request.Name;
            cClass.ConsumableTypeId = request.ConsumableTypeId;
            await context.SaveChangesAsync();
            return Results.NoContent();
        }).WithName("UpdateConsumableClass").WithOpenApi();

        classesGroup.MapDelete("/{id:guid}", async (Guid id, GeoServDbContext context) =>
        {
            var cClass = await context.ConsumableClasses.FindAsync(id);
            if (cClass == null) return Results.NotFound();
            context.ConsumableClasses.Remove(cClass);
            await context.SaveChangesAsync();
            return Results.NoContent();
        }).WithName("DeleteConsumableClass").WithOpenApi();
        
        typesGroup.MapDelete("/{id:guid}", async (Guid id, GeoServDbContext context) =>
        {
            var type = await context.ConsumableTypes.FindAsync(id);
            if (type == null) return Results.NotFound();
            context.ConsumableTypes.Remove(type);
            await context.SaveChangesAsync();
            return Results.NoContent();
        }).WithName("DeleteConsumableType").WithOpenApi();
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
