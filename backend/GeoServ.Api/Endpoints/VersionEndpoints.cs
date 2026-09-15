using System.Reflection;

namespace GeoServ.Api.Endpoints;

public static class VersionEndpoints
{
    public static void MapVersionEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/system");

        // Endpoint público: lo consume la página "Acerca de" del frontend,
        // no requiere autenticación para poder diagnosticar problemas de sesión.
        group.MapGet("/version", () =>
        {
            var assembly = Assembly.GetExecutingAssembly();
            var version = assembly.GetName().Version?.ToString(3) ?? "0.0.0";

            DateTime buildDate;
            try
            {
                buildDate = File.GetLastWriteTimeUtc(assembly.Location);
            }
            catch
            {
                buildDate = DateTime.UtcNow;
            }

            return Results.Ok(new
            {
                version,
                buildDate
            });
        })
        .WithName("GetSystemVersion")
        .WithOpenApi();
    }
}
