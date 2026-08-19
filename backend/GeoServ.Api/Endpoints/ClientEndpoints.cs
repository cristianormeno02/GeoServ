using GeoServ.Api.Domain.Entities;
using GeoServ.Api.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace GeoServ.Api.Endpoints;

public static class ClientEndpoints
{
    public static void MapClientEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/clients").RequireAuthorization();

        // 1. Get all clients
        group.MapGet("/", async (GeoServDbContext context) =>
        {
            var clients = await context.Clients
                .Include(c => c.CompanyType)
                .Select(c => new
                {
                    c.Id,
                    c.CompanyName,
                    c.TaxId,
                    CompanyTypeName = c.CompanyType != null ? c.CompanyType.Name : null,
                    c.ContactEmail,
                    c.ContactPhone
                })
                .ToListAsync();

            return Results.Ok(clients);
        })
        .WithName("GetClients")
        .WithOpenApi();

        // 2. Get client by id
        group.MapGet("/{id:guid}", async (Guid id, GeoServDbContext context) =>
        {
            var client = await context.Clients
                .Include(c => c.CompanyType)
                .Include(c => c.User)
                .FirstOrDefaultAsync(c => c.Id == id);

            if (client is null) return Results.NotFound();

            return Results.Ok(new
            {
                client.Id,
                client.CompanyName,
                client.TaxId,
                client.CompanyTypeId,
                client.UserId,
                client.ContactEmail,
                client.ContactPhone,
                UserDisplay = client.User != null ? $"{client.User.Name} ({client.User.Email})" : null
            });
        })
        .WithName("GetClientById")
        .WithOpenApi();

        // 3. Create client
        group.MapPost("/", async (CreateClientRequest request, GeoServDbContext context) =>
        {
            if (await context.Clients.AnyAsync(c => c.TaxId == request.TaxId))
            {
                return Results.BadRequest(new { message = "Ya existe un cliente con este ID Fiscal." });
            }

            var client = new Client
            {
                Id = Guid.NewGuid(),
                CompanyName = request.CompanyName,
                TaxId = request.TaxId,
                CompanyTypeId = request.CompanyTypeId,
                ContactEmail = request.ContactEmail,
                ContactPhone = request.ContactPhone,
                UserId = request.UserId,
                CreatedAt = DateTime.UtcNow
            };

            context.Clients.Add(client);
            await context.SaveChangesAsync();

            return Results.Created($"/api/clients/{client.Id}", client);
        })
        .WithName("CreateClient")
        .WithOpenApi();

        // 4. Update client
        group.MapPut("/{id:guid}", async (Guid id, UpdateClientRequest request, GeoServDbContext context) =>
        {
            if (await context.Clients.AnyAsync(c => c.TaxId == request.TaxId && c.Id != id))
            {
                return Results.BadRequest(new { message = "Ya existe otro cliente con este ID Fiscal." });
            }

            var client = await context.Clients.FindAsync(id);
            if (client is null) return Results.NotFound();

            client.CompanyName = request.CompanyName;
            client.TaxId = request.TaxId;
            client.CompanyTypeId = request.CompanyTypeId;
            client.ContactEmail = request.ContactEmail;
            client.ContactPhone = request.ContactPhone;
            client.UserId = request.UserId;

            await context.SaveChangesAsync();
            return Results.NoContent();
        })
        .WithName("UpdateClient")
        .WithOpenApi();

        // 5. Delete client (Reactive approach)
        group.MapDelete("/{id:guid}", async (Guid id, GeoServDbContext context) =>
        {
            var client = await context.Clients
                .Include(c => c.ServiceOrders)
                .FirstOrDefaultAsync(c => c.Id == id);
            
            if (client is null) return Results.NotFound();

            if (client.ServiceOrders.Any())
            {
                return Results.BadRequest(new { message = "No se puede eliminar el cliente porque tiene órdenes de servicio asociadas." });
            }

            context.Clients.Remove(client);
            await context.SaveChangesAsync();

            return Results.NoContent();
        })
        .WithName("DeleteClient")
        .WithOpenApi();

        // 6. Get available users for client assignment
        group.MapGet("/available-users", async (Guid? currentUserId, GeoServDbContext context) =>
        {
            var query = context.Users
                .Include(u => u.Role)
                .Where(u => u.Role.Name == "Cliente");

            // Si estamos editando un cliente, permitimos que el usuario actual del cliente también aparezca
            var availableUsers = await query
                .Where(u => !context.Clients.Any(c => c.UserId == u.Id) || (currentUserId.HasValue && u.Id == currentUserId.Value))
                .Select(u => new
                {
                    u.Id,
                    u.Name,
                    u.Email
                })
                .ToListAsync();

            return Results.Ok(availableUsers);
        })
        .WithName("GetAvailableUsersForClient")
        .WithOpenApi();

        // 7. Get company types for dropdown
        group.MapGet("/company-types", async (GeoServDbContext context) =>
        {
            var types = await context.CompanyTypes
                .Select(ct => new { ct.Id, ct.Name })
                .ToListAsync();

            return Results.Ok(types);
        })
        .WithName("GetCompanyTypes")
        .WithOpenApi();
    }
}

public class CreateClientRequest
{
    public string CompanyName { get; set; } = string.Empty;
    public string TaxId { get; set; } = string.Empty;
    public Guid? CompanyTypeId { get; set; }
    public string ContactEmail { get; set; } = string.Empty;
    public string ContactPhone { get; set; } = string.Empty;
    public Guid? UserId { get; set; }
}

public class UpdateClientRequest
{
    public string CompanyName { get; set; } = string.Empty;
    public string TaxId { get; set; } = string.Empty;
    public Guid? CompanyTypeId { get; set; }
    public string ContactEmail { get; set; } = string.Empty;
    public string ContactPhone { get; set; } = string.Empty;
    public Guid? UserId { get; set; }
}
