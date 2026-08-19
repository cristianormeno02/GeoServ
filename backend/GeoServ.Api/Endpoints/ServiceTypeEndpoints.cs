using GeoServ.Api.Domain.Entities;
using GeoServ.Api.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace GeoServ.Api.Endpoints;

public static class ServiceTypeEndpoints
{
    public static void MapServiceTypeEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/service-types").RequireAuthorization();

        // 1. Get all service types
        group.MapGet("/", async (GeoServDbContext context) =>
        {
            var serviceTypes = await context.ServiceTypes
                .OrderBy(st => st.Name)
                .Select(st => new
                {
                    st.Id,
                    st.Name,
                    st.Description
                })
                .ToListAsync();

            return Results.Ok(serviceTypes);
        })
        .WithName("GetServiceTypes")
        .WithOpenApi();

        // 2. Get service type by id
        group.MapGet("/{id:guid}", async (Guid id, GeoServDbContext context) =>
        {
            var serviceType = await context.ServiceTypes
                .FirstOrDefaultAsync(st => st.Id == id);

            if (serviceType is null) return Results.NotFound();

            return Results.Ok(new
            {
                serviceType.Id,
                serviceType.Name,
                serviceType.Description
            });
        })
        .WithName("GetServiceTypeById")
        .WithOpenApi();

        // 3. Create service type
        group.MapPost("/", async (CreateServiceTypeRequest request, GeoServDbContext context) =>
        {
            if (await context.ServiceTypes.AnyAsync(st => st.Name.ToLower() == request.Name.ToLower()))
            {
                return Results.BadRequest(new { message = "Ya existe un tipo de servicio con este nombre." });
            }

            var serviceType = new ServiceType
            {
                Id = Guid.NewGuid(),
                Name = request.Name,
                Description = request.Description
            };

            context.ServiceTypes.Add(serviceType);
            await context.SaveChangesAsync();

            return Results.Created($"/api/service-types/{serviceType.Id}", serviceType);
        })
        .WithName("CreateServiceType")
        .WithOpenApi();

        // 4. Update service type
        group.MapPut("/{id:guid}", async (Guid id, UpdateServiceTypeRequest request, GeoServDbContext context) =>
        {
            if (await context.ServiceTypes.AnyAsync(st => st.Name.ToLower() == request.Name.ToLower() && st.Id != id))
            {
                return Results.BadRequest(new { message = "Ya existe otro tipo de servicio con este nombre." });
            }

            var serviceType = await context.ServiceTypes.FindAsync(id);
            if (serviceType is null) return Results.NotFound();

            serviceType.Name = request.Name;
            serviceType.Description = request.Description;

            await context.SaveChangesAsync();
            return Results.NoContent();
        })
        .WithName("UpdateServiceType")
        .WithOpenApi();

        // 5. Delete service type
        group.MapDelete("/{id:guid}", async (Guid id, GeoServDbContext context) =>
        {
            var serviceType = await context.ServiceTypes
                .Include(st => st.ServiceOrders)
                .FirstOrDefaultAsync(st => st.Id == id);
            
            if (serviceType is null) return Results.NotFound();

            if (serviceType.ServiceOrders.Any())
            {
                return Results.BadRequest(new { message = "No se puede eliminar el tipo de servicio porque tiene órdenes de servicio asociadas." });
            }

            context.ServiceTypes.Remove(serviceType);
            await context.SaveChangesAsync();

            return Results.NoContent();
        })
        .WithName("DeleteServiceType")
        .WithOpenApi();
    }
}

public class CreateServiceTypeRequest
{
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
}

public class UpdateServiceTypeRequest
{
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
}
