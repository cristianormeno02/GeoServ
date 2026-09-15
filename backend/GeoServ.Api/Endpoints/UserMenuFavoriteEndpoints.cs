using System.Security.Claims;
using GeoServ.Api.Domain.Entities;
using GeoServ.Api.Infrastructure.Data;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace GeoServ.Api.Endpoints;

public static class UserMenuFavoriteEndpoints
{
    public static void MapUserMenuFavoriteEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/user-menu-favorites").RequireAuthorization();

        group.MapGet("/", GetFavoritesAsync).WithName("GetUserMenuFavorites").WithOpenApi();
        group.MapPost("/", AddFavoriteAsync).WithName("AddUserMenuFavorite").WithOpenApi();
        group.MapDelete("/", RemoveFavoriteAsync).WithName("RemoveUserMenuFavorite").WithOpenApi();
    }

    public static async Task<IResult> GetFavoritesAsync(GeoServDbContext context, HttpContext httpContext)
    {
        if (!TryGetAuthenticatedUserId(httpContext, out var userId))
        {
            return Results.Unauthorized();
        }

        var paths = await context.UserMenuFavorites
            .Where(f => f.UserId == userId)
            .OrderBy(f => f.CreatedAt)
            .Select(f => f.MenuPath)
            .ToListAsync();

        return Results.Ok(paths);
    }

    public static async Task<IResult> AddFavoriteAsync(AddUserMenuFavoriteRequest request, GeoServDbContext context, HttpContext httpContext)
    {
        if (!TryGetAuthenticatedUserId(httpContext, out var userId))
        {
            return Results.Unauthorized();
        }

        if (string.IsNullOrWhiteSpace(request?.Path))
        {
            return Results.BadRequest(new { error = "El path es requerido." });
        }

        var trimmedPath = request.Path.Trim();
        if (trimmedPath.Length > 250)
        {
            return Results.BadRequest(new { error = "El path no puede superar los 250 caracteres." });
        }

        var exists = await context.UserMenuFavorites
            .AnyAsync(f => f.UserId == userId && f.MenuPath == trimmedPath);

        if (!exists)
        {
            var favorite = new UserMenuFavorite
            {
                Id = Guid.NewGuid(),
                UserId = userId,
                MenuPath = trimmedPath,
                CreatedAt = DateTime.UtcNow
            };

            context.UserMenuFavorites.Add(favorite);
            await context.SaveChangesAsync();
        }

        return Results.NoContent();
    }

    public static async Task<IResult> RemoveFavoriteAsync([FromQuery] string? path, GeoServDbContext context, HttpContext httpContext)
    {
        if (!TryGetAuthenticatedUserId(httpContext, out var userId))
        {
            return Results.Unauthorized();
        }

        if (string.IsNullOrWhiteSpace(path))
        {
            return Results.BadRequest(new { error = "El parámetro path es requerido." });
        }

        var trimmedPath = path.Trim();
        var favorite = await context.UserMenuFavorites
            .FirstOrDefaultAsync(f => f.UserId == userId && f.MenuPath == trimmedPath);

        if (favorite != null)
        {
            context.UserMenuFavorites.Remove(favorite);
            await context.SaveChangesAsync();
        }

        return Results.NoContent();
    }

    private static bool TryGetAuthenticatedUserId(HttpContext httpContext, out Guid userId)
    {
        var userIdStr = httpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
        return Guid.TryParse(userIdStr, out userId);
    }
}

public class AddUserMenuFavoriteRequest
{
    public string Path { get; set; } = string.Empty;
}
