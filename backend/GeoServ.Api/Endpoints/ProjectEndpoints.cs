using GeoServ.Api.Domain.Entities;
using GeoServ.Api.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace GeoServ.Api.Endpoints;

public static class ProjectEndpoints
{
    public static void MapProjectEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/projects").RequireAuthorization();

        // 1. Get all projects
        group.MapGet("/", async (GeoServDbContext context) =>
        {
            var projects = await context.Projects
                .OrderBy(p => p.Name)
                .Select(p => new
                {
                    p.Id,
                    p.Name,
                    p.Description,
                    p.CreatedAt
                })
                .ToListAsync();

            return Results.Ok(projects);
        })
        .WithName("GetAllProjects")
        .WithOpenApi();

        // 2. Get project by id
        group.MapGet("/{id:guid}", async (Guid id, GeoServDbContext context) =>
        {
            var project = await context.Projects
                .FirstOrDefaultAsync(p => p.Id == id);

            if (project is null) return Results.NotFound();

            return Results.Ok(new
            {
                project.Id,
                project.Name,
                project.Description,
                project.CreatedAt
            });
        })
        .WithName("GetProjectById")
        .WithOpenApi();

        // 3. Create project
        group.MapPost("/", async (CreateProjectRequest request, GeoServDbContext context) =>
        {
            if (await context.Projects.AnyAsync(p => p.Name == request.Name))
            {
                return Results.BadRequest(new { message = "Ya existe un proyecto con este nombre." });
            }

            var project = new Project
            {
                Id = Guid.NewGuid(),
                Name = request.Name,
                Description = request.Description,
                CreatedAt = DateTime.UtcNow
            };

            context.Projects.Add(project);
            await context.SaveChangesAsync();

            return Results.Created($"/api/projects/{project.Id}", project);
        })
        .WithName("CreateProject")
        .WithOpenApi();

        // 4. Update project
        group.MapPut("/{id:guid}", async (Guid id, UpdateProjectRequest request, GeoServDbContext context) =>
        {
            if (await context.Projects.AnyAsync(p => p.Name == request.Name && p.Id != id))
            {
                return Results.BadRequest(new { message = "Ya existe otro proyecto con este nombre." });
            }

            var project = await context.Projects.FindAsync(id);
            if (project is null) return Results.NotFound();

            project.Name = request.Name;
            project.Description = request.Description;

            await context.SaveChangesAsync();
            return Results.NoContent();
        })
        .WithName("UpdateProject")
        .WithOpenApi();

        // 5. Delete project
        group.MapDelete("/{id:guid}", async (Guid id, GeoServDbContext context) =>
        {
            var project = await context.Projects
                .Include(p => p.ServiceOrders)
                .FirstOrDefaultAsync(p => p.Id == id);
            
            if (project is null) return Results.NotFound();

            if (project.ServiceOrders.Any())
            {
                return Results.BadRequest(new { message = "No se puede eliminar el proyecto porque tiene órdenes de servicio asociadas." });
            }

            context.Projects.Remove(project);
            await context.SaveChangesAsync();

            return Results.NoContent();
        })
        .WithName("DeleteProject")
        .WithOpenApi();
    }
}

public class CreateProjectRequest
{
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
}

public class UpdateProjectRequest
{
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
}
