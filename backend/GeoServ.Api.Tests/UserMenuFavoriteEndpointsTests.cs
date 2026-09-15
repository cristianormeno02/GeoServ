using System.Security.Claims;
using GeoServ.Api.Domain.Entities;
using GeoServ.Api.Endpoints;
using GeoServ.Api.Infrastructure.Data;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;
using Xunit;

namespace GeoServ.Api.Tests;

public class UserMenuFavoriteEndpointsTests
{
    private GeoServDbContext CreateInMemoryContext()
    {
        var options = new DbContextOptionsBuilder<GeoServDbContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;

        return new GeoServDbContext(options);
    }

    private HttpContext CreateHttpContextWithUser(Guid? userId)
    {
        var context = new DefaultHttpContext();
        if (userId.HasValue)
        {
            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, userId.Value.ToString())
            };
            var identity = new ClaimsIdentity(claims, "TestAuth");
            context.User = new ClaimsPrincipal(identity);
        }
        else
        {
            context.User = new ClaimsPrincipal(new ClaimsIdentity());
        }
        return context;
    }

    [Fact]
    public async Task GetFavorites_ShouldReturnOnlyCurrentUserFavorites_OrderedByCreatedAt()
    {
        using var context = CreateInMemoryContext();
        var user1 = Guid.NewGuid();
        var user2 = Guid.NewGuid();

        context.UserMenuFavorites.AddRange(
            new UserMenuFavorite { Id = Guid.NewGuid(), UserId = user1, MenuPath = "/dashboard", CreatedAt = DateTime.UtcNow.AddMinutes(1) },
            new UserMenuFavorite { Id = Guid.NewGuid(), UserId = user1, MenuPath = "/ordenes-servicio", CreatedAt = DateTime.UtcNow.AddMinutes(2) },
            new UserMenuFavorite { Id = Guid.NewGuid(), UserId = user2, MenuPath = "/proyectos", CreatedAt = DateTime.UtcNow }
        );
        await context.SaveChangesAsync();

        var httpContext = CreateHttpContextWithUser(user1);
        var result = await UserMenuFavoriteEndpoints.GetFavoritesAsync(context, httpContext);

        var okResult = Assert.IsType<Ok<List<string>>>(result);
        Assert.NotNull(okResult.Value);
        Assert.Equal(2, okResult.Value.Count);
        Assert.Equal("/dashboard", okResult.Value[0]);
        Assert.Equal("/ordenes-servicio", okResult.Value[1]);
    }

    [Fact]
    public async Task GetFavorites_WithoutAuth_ShouldReturnUnauthorized()
    {
        using var context = CreateInMemoryContext();
        var httpContext = CreateHttpContextWithUser(null);

        var result = await UserMenuFavoriteEndpoints.GetFavoritesAsync(context, httpContext);
        Assert.IsType<UnauthorizedHttpResult>(result);
    }

    [Fact]
    public async Task AddFavorite_ShouldPersistFavorite_AndBeIdempotent()
    {
        using var context = CreateInMemoryContext();
        var user = Guid.NewGuid();
        var httpContext = CreateHttpContextWithUser(user);

        var req = new AddUserMenuFavoriteRequest { Path = "/ordenes-servicio" };
        var result1 = await UserMenuFavoriteEndpoints.AddFavoriteAsync(req, context, httpContext);
        Assert.IsType<NoContent>(result1);

        var count = await context.UserMenuFavorites.CountAsync(f => f.UserId == user && f.MenuPath == "/ordenes-servicio");
        Assert.Equal(1, count);

        // Llamar de nuevo con el mismo path no debe duplicar (idempotente)
        var result2 = await UserMenuFavoriteEndpoints.AddFavoriteAsync(req, context, httpContext);
        Assert.IsType<NoContent>(result2);

        var countAfter = await context.UserMenuFavorites.CountAsync(f => f.UserId == user && f.MenuPath == "/ordenes-servicio");
        Assert.Equal(1, countAfter);
    }

    [Fact]
    public async Task AddFavorite_WithEmptyPath_ShouldReturnBadRequest()
    {
        using var context = CreateInMemoryContext();
        var user = Guid.NewGuid();
        var httpContext = CreateHttpContextWithUser(user);

        var req = new AddUserMenuFavoriteRequest { Path = "   " };
        var result = await UserMenuFavoriteEndpoints.AddFavoriteAsync(req, context, httpContext);
        var statusResult = Assert.IsAssignableFrom<IStatusCodeHttpResult>(result);
        Assert.Equal(400, statusResult.StatusCode);
    }

    [Fact]
    public async Task RemoveFavorite_ShouldDeleteOnlyCurrentUserFavorite_AndBeIdempotent()
    {
        using var context = CreateInMemoryContext();
        var user1 = Guid.NewGuid();
        var user2 = Guid.NewGuid();

        context.UserMenuFavorites.AddRange(
            new UserMenuFavorite { Id = Guid.NewGuid(), UserId = user1, MenuPath = "/dashboard", CreatedAt = DateTime.UtcNow },
            new UserMenuFavorite { Id = Guid.NewGuid(), UserId = user2, MenuPath = "/dashboard", CreatedAt = DateTime.UtcNow }
        );
        await context.SaveChangesAsync();

        var httpContext = CreateHttpContextWithUser(user1);
        var result = await UserMenuFavoriteEndpoints.RemoveFavoriteAsync("/dashboard", context, httpContext);
        Assert.IsType<NoContent>(result);

        // user1 ya no lo tiene
        var existsUser1 = await context.UserMenuFavorites.AnyAsync(f => f.UserId == user1 && f.MenuPath == "/dashboard");
        Assert.False(existsUser1);

        // user2 aún lo conserva intacto (aislamiento)
        var existsUser2 = await context.UserMenuFavorites.AnyAsync(f => f.UserId == user2 && f.MenuPath == "/dashboard");
        Assert.True(existsUser2);

        // Borrar de nuevo debe ser idempotente
        var resultIdempotent = await UserMenuFavoriteEndpoints.RemoveFavoriteAsync("/dashboard", context, httpContext);
        Assert.IsType<NoContent>(resultIdempotent);
    }

    [Fact]
    public async Task RemoveFavorite_WithEmptyPath_ShouldReturnBadRequest()
    {
        using var context = CreateInMemoryContext();
        var user = Guid.NewGuid();
        var httpContext = CreateHttpContextWithUser(user);

        var result = await UserMenuFavoriteEndpoints.RemoveFavoriteAsync("", context, httpContext);
        var statusResult = Assert.IsAssignableFrom<IStatusCodeHttpResult>(result);
        Assert.Equal(400, statusResult.StatusCode);
    }
}
