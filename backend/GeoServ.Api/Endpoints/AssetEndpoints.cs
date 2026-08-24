using GeoServ.Api.Domain.Entities;
using GeoServ.Api.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace GeoServ.Api.Endpoints;

public static class AssetEndpoints
{
    public static void MapAssetEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/assets").RequireAuthorization();

        group.MapGet("/", async (GeoServDbContext context) =>
        {
            var assets = await context.Assets
                .Include(a => a.Provider)
                .OrderByDescending(a => a.PurchaseDate)
                .Select(a => new
                {
                    a.Id,
                    a.Name,
                    a.Description,
                    a.PurchasePrice,
                    a.PurchaseDate,
                    a.ProviderId,
                    ProviderName = a.Provider != null ? a.Provider.Name : null
                })
                .ToListAsync();
            return Results.Ok(assets);
        }).WithName("GetAssets").WithOpenApi();

        group.MapPost("/", async (CreateAssetRequest request, GeoServDbContext context) =>
        {
            var asset = new Asset
            {
                Id = Guid.NewGuid(),
                Name = request.Name,
                Description = request.Description,
                PurchasePrice = request.PurchasePrice,
                PurchaseDate = request.PurchaseDate,
                ProviderId = request.ProviderId
            };
            context.Assets.Add(asset);
            await context.SaveChangesAsync();
            return Results.Created($"/api/assets/{asset.Id}", asset);
        }).WithName("CreateAsset").WithOpenApi();

        group.MapPut("/{id:guid}", async (Guid id, UpdateAssetRequest request, GeoServDbContext context) =>
        {
            var asset = await context.Assets.FindAsync(id);
            if (asset is null) return Results.NotFound();

            asset.Name = request.Name;
            asset.Description = request.Description;
            asset.PurchasePrice = request.PurchasePrice;
            asset.PurchaseDate = request.PurchaseDate;
            asset.ProviderId = request.ProviderId;

            await context.SaveChangesAsync();
            return Results.NoContent();
        }).WithName("UpdateAsset").WithOpenApi();

        group.MapDelete("/{id:guid}", async (Guid id, GeoServDbContext context) =>
        {
            var asset = await context.Assets.FindAsync(id);
            if (asset is null) return Results.NotFound();
            context.Assets.Remove(asset);
            await context.SaveChangesAsync();
            return Results.NoContent();
        }).WithName("DeleteAsset").WithOpenApi();
    }
}

public class CreateAssetRequest
{
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public decimal PurchasePrice { get; set; }
    public DateTime PurchaseDate { get; set; }
    public Guid? ProviderId { get; set; }
}

public class UpdateAssetRequest
{
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public decimal PurchasePrice { get; set; }
    public DateTime PurchaseDate { get; set; }
    public Guid? ProviderId { get; set; }
}
