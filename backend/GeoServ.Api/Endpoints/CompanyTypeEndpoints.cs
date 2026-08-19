using GeoServ.Api.Domain.Entities;
using GeoServ.Api.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace GeoServ.Api.Endpoints;

public static class CompanyTypeEndpoints
{
    public static void MapCompanyTypeEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/company-types").RequireAuthorization();

        // 1. Get all company types
        group.MapGet("/", async (GeoServDbContext context) =>
        {
            var companyTypes = await context.CompanyTypes
                .OrderBy(c => c.Name)
                .Select(c => new
                {
                    c.Id,
                    c.Name,
                    c.Description
                })
                .ToListAsync();

            return Results.Ok(companyTypes);
        })
        .WithName("GetCompanyTypesList")
        .WithOpenApi();

        // 2. Get company type by id
        group.MapGet("/{id:guid}", async (Guid id, GeoServDbContext context) =>
        {
            var companyType = await context.CompanyTypes
                .FirstOrDefaultAsync(c => c.Id == id);

            if (companyType is null) return Results.NotFound();

            return Results.Ok(new
            {
                companyType.Id,
                companyType.Name,
                companyType.Description
            });
        })
        .WithName("GetCompanyTypeById")
        .WithOpenApi();

        // 3. Create company type
        group.MapPost("/", async (CreateCompanyTypeRequest request, GeoServDbContext context) =>
        {
            if (await context.CompanyTypes.AnyAsync(c => c.Name == request.Name))
            {
                return Results.BadRequest(new { message = "Ya existe un tipo de compañía con este nombre." });
            }

            var companyType = new CompanyType
            {
                Id = Guid.NewGuid(),
                Name = request.Name,
                Description = request.Description
            };

            context.CompanyTypes.Add(companyType);
            await context.SaveChangesAsync();

            return Results.Created($"/api/company-types/{companyType.Id}", companyType);
        })
        .WithName("CreateCompanyType")
        .WithOpenApi();

        // 4. Update company type
        group.MapPut("/{id:guid}", async (Guid id, UpdateCompanyTypeRequest request, GeoServDbContext context) =>
        {
            if (await context.CompanyTypes.AnyAsync(c => c.Name == request.Name && c.Id != id))
            {
                return Results.BadRequest(new { message = "Ya existe otro tipo de compañía con este nombre." });
            }

            var companyType = await context.CompanyTypes.FindAsync(id);
            if (companyType is null) return Results.NotFound();

            companyType.Name = request.Name;
            companyType.Description = request.Description;

            await context.SaveChangesAsync();
            return Results.NoContent();
        })
        .WithName("UpdateCompanyType")
        .WithOpenApi();

        // 5. Delete company type
        group.MapDelete("/{id:guid}", async (Guid id, GeoServDbContext context) =>
        {
            var companyType = await context.CompanyTypes
                .Include(c => c.Clients)
                .FirstOrDefaultAsync(c => c.Id == id);
            
            if (companyType is null) return Results.NotFound();

            if (companyType.Clients.Any())
            {
                return Results.BadRequest(new { message = "No se puede eliminar este tipo de compañía porque ya existe una o más compañías (clientes) con este tipo asociado." });
            }

            context.CompanyTypes.Remove(companyType);
            await context.SaveChangesAsync();

            return Results.NoContent();
        })
        .WithName("DeleteCompanyType")
        .WithOpenApi();
    }
}

public class CreateCompanyTypeRequest
{
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
}

public class UpdateCompanyTypeRequest
{
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
}
