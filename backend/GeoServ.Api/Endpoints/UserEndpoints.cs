using GeoServ.Api.Domain.Entities;
using GeoServ.Api.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using BCrypt.Net;

namespace GeoServ.Api.Endpoints;

public static class UserEndpoints
{
    public static void MapUserEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/users").RequireAuthorization();

        // 1. Get all users
        group.MapGet("/", async (GeoServDbContext context) =>
        {
            var users = await context.Users
                .Include(u => u.Role)
                .OrderBy(u => u.Name)
                .Select(u => new
                {
                    u.Id,
                    u.Name,
                    u.Email,
                    u.RoleId,
                    RoleName = u.Role != null ? u.Role.Name : null,
                    u.IsActive,
                    u.CreatedAt
                })
                .ToListAsync();

            return Results.Ok(users);
        })
        .WithName("GetUsers")
        .WithOpenApi();

        // 2. Get user by id
        group.MapGet("/{id:guid}", async (Guid id, GeoServDbContext context) =>
        {
            var user = await context.Users
                .Include(u => u.Role)
                .FirstOrDefaultAsync(u => u.Id == id);

            if (user is null) return Results.NotFound();

            return Results.Ok(new
            {
                user.Id,
                user.Name,
                user.Email,
                user.RoleId,
                RoleName = user.Role != null ? user.Role.Name : null,
                user.IsActive,
                user.CreatedAt
            });
        })
        .WithName("GetUserById")
        .WithOpenApi();

        // 3. Create user
        group.MapPost("/", async (CreateUserRequest request, GeoServDbContext context) =>
        {
            if (await context.Users.AnyAsync(u => u.Email == request.Email))
            {
                return Results.BadRequest(new { message = "Ya existe un usuario con este correo electrónico." });
            }

            var user = new User
            {
                Id = Guid.NewGuid(),
                Name = request.Name,
                Email = request.Email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
                RoleId = request.RoleId,
                IsActive = request.IsActive,
                CreatedAt = DateTime.UtcNow
            };

            context.Users.Add(user);
            await context.SaveChangesAsync();

            return Results.Created($"/api/users/{user.Id}", new { user.Id, user.Name, user.Email });
        })
        .WithName("CreateUser")
        .WithOpenApi();

        // 4. Update user
        group.MapPut("/{id:guid}", async (Guid id, UpdateUserRequest request, GeoServDbContext context) =>
        {
            if (await context.Users.AnyAsync(u => u.Email == request.Email && u.Id != id))
            {
                return Results.BadRequest(new { message = "Ya existe otro usuario con este correo electrónico." });
            }

            var user = await context.Users.FindAsync(id);
            if (user is null) return Results.NotFound();

            user.Name = request.Name;
            user.Email = request.Email;
            user.RoleId = request.RoleId;
            user.IsActive = request.IsActive;

            if (!string.IsNullOrEmpty(request.Password))
            {
                user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password);
            }

            await context.SaveChangesAsync();
            return Results.NoContent();
        })
        .WithName("UpdateUser")
        .WithOpenApi();

        // 5. Delete user
        group.MapDelete("/{id:guid}", async (Guid id, GeoServDbContext context) =>
        {
            var user = await context.Users.FindAsync(id);
            if (user is null) return Results.NotFound();

            // Evitar eliminar al último administrador
            if (user.RoleId == Guid.Parse("11111111-1111-1111-1111-111111111111"))
            {
                var adminCount = await context.Users.CountAsync(u => u.RoleId == user.RoleId);
                if (adminCount <= 1)
                {
                    return Results.BadRequest(new { message = "No se puede eliminar el último usuario administrador." });
                }
            }

            context.Users.Remove(user);
            await context.SaveChangesAsync();

            return Results.NoContent();
        })
        .WithName("DeleteUser")
        .WithOpenApi();

        // 6. Get available roles for user creation
        group.MapGet("/roles", async (GeoServDbContext context) =>
        {
            var roles = await context.Roles
                .OrderBy(r => r.Name)
                .Select(r => new { r.Id, r.Name, r.Description })
                .ToListAsync();

            return Results.Ok(roles);
        })
        .WithName("GetRoles")
        .WithOpenApi();
    }
}

public class CreateUserRequest
{
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
    public Guid RoleId { get; set; }
    public bool IsActive { get; set; } = true;
}

public class UpdateUserRequest
{
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string? Password { get; set; }
    public Guid RoleId { get; set; }
    public bool IsActive { get; set; } = true;
}
