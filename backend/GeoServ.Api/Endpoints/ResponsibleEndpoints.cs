using GeoServ.Api.Domain.Entities;
using GeoServ.Api.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace GeoServ.Api.Endpoints;

public static class ResponsibleEndpoints
{
    public static void MapResponsibleEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/responsibles").WithTags("Responsibles");

        // Obtener todos los responsables
        group.MapGet("/", async (GeoServDbContext context) =>
        {
            var responsibles = await context.Responsibles
                .Include(r => r.User)
                .OrderBy(r => r.Name)
                .Select(r => new {
                    r.Id,
                    r.Name,
                    r.Position,
                    r.Title,
                    r.Specialties,
                    r.UserId,
                    UserName = r.User != null ? r.User.Name : null
                })
                .ToListAsync();

            return Results.Ok(responsibles);
        })
        .WithName("GetResponsibles")
        .WithOpenApi();

        // Obtener un responsable por ID
        group.MapGet("/{id:guid}", async (Guid id, GeoServDbContext context) =>
        {
            var r = await context.Responsibles
                .Include(r => r.User)
                .FirstOrDefaultAsync(x => x.Id == id);

            if (r == null) return Results.NotFound();

            return Results.Ok(new {
                r.Id,
                r.Name,
                r.Position,
                r.Title,
                r.Specialties,
                r.UserId,
                UserName = r.User != null ? r.User.Name : null
            });
        })
        .WithName("GetResponsibleById")
        .WithOpenApi();

        // Crear responsable
        group.MapPost("/", async (CreateResponsibleRequest request, GeoServDbContext context) =>
        {
            // Validar UserId
            if (request.UserId.HasValue)
            {
                var user = await context.Users.Include(u => u.Role).FirstOrDefaultAsync(u => u.Id == request.UserId.Value);
                if (user == null) return Results.BadRequest("Usuario no encontrado.");
                if (user.Role?.Name == "Cliente") return Results.BadRequest("Un cliente no puede ser asignado como responsable.");

                var existingAssigned = await context.Responsibles.AnyAsync(r => r.UserId == request.UserId.Value);
                if (existingAssigned) return Results.BadRequest("Este usuario ya está asignado a otro responsable.");
            }

            var responsible = new Responsible
            {
                Id = Guid.NewGuid(),
                Name = request.Name,
                Position = request.Position,
                Title = request.Title,
                Specialties = request.Specialties,
                UserId = request.UserId
            };

            context.Responsibles.Add(responsible);
            await context.SaveChangesAsync();

            return Results.Created($"/api/responsibles/{responsible.Id}", responsible.Id);
        })
        .WithName("CreateResponsible")
        .WithOpenApi();

        // Actualizar responsable
        group.MapPut("/{id:guid}", async (Guid id, UpdateResponsibleRequest request, GeoServDbContext context) =>
        {
            var responsible = await context.Responsibles.FindAsync(id);
            if (responsible == null) return Results.NotFound();

            if (request.UserId.HasValue && request.UserId.Value != responsible.UserId)
            {
                var user = await context.Users.Include(u => u.Role).FirstOrDefaultAsync(u => u.Id == request.UserId.Value);
                if (user == null) return Results.BadRequest("Usuario no encontrado.");
                if (user.Role?.Name == "Cliente") return Results.BadRequest("Un cliente no puede ser asignado como responsable.");

                var existingAssigned = await context.Responsibles.AnyAsync(r => r.UserId == request.UserId.Value);
                if (existingAssigned) return Results.BadRequest("Este usuario ya está asignado a otro responsable.");
            }

            responsible.Name = request.Name;
            responsible.Position = request.Position;
            responsible.Title = request.Title;
            responsible.Specialties = request.Specialties;
            responsible.UserId = request.UserId;

            await context.SaveChangesAsync();
            return Results.NoContent();
        })
        .WithName("UpdateResponsible")
        .WithOpenApi();

        // Eliminar responsable
        group.MapDelete("/{id:guid}", async (Guid id, GeoServDbContext context) =>
        {
            var responsible = await context.Responsibles.FindAsync(id);
            if (responsible == null) return Results.NotFound();

            var isInUse = await context.ServiceOrderResponsibles.AnyAsync(sor => sor.ResponsibleId == id);
            if (isInUse) return Results.BadRequest("No se puede eliminar el responsable porque está asignado a una o más órdenes de servicio.");

            context.Responsibles.Remove(responsible);
            await context.SaveChangesAsync();

            return Results.NoContent();
        })
        .WithName("DeleteResponsible")
        .WithOpenApi();
    }
}

// DTOs
public record CreateResponsibleRequest(string Name, string? Position, string? Title, string? Specialties, Guid? UserId);
public record UpdateResponsibleRequest(string Name, string? Position, string? Title, string? Specialties, Guid? UserId);
