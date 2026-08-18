using GeoServ.Api.Domain.Entities;
using GeoServ.Api.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace GeoServ.Api.Endpoints;

public static class EmpresaEndpoints
{
    public static void MapEmpresaEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/empresa");

        // Este endpoint requiere autenticación (el token JWT ya trae el TenantId)
        group.MapGet("/config", async (GeoServDbContext context) =>
        {
            // Como el ITenantService ya configuró la cadena de conexión basada en el JWT,
            // esta consulta va a la base de datos correcta de la empresa.
            var empresa = await context.Empresas.FirstOrDefaultAsync();
            if (empresa == null)
            {
                return Results.NotFound(new { message = "Configuración de empresa no encontrada en esta base de datos." });
            }

            return Results.Ok(new
            {
                empresa.Nombre,
                empresa.Correo,
                empresa.Telefono,
                empresa.Direccion,
                empresa.LogoSvg,
                empresa.Subdominio
            });
        })
        .RequireAuthorization()
        .WithName("GetEmpresaConfig")
        .WithOpenApi();

        // Endpoint auxiliar para inicializar la empresa en su propia base de datos
        // NOTA: Para producción este endpoint debería estar protegido o no existir, 
        // usarse scripts u otro mecanismo.
        group.MapPost("/inicializar", async (EmpresaInitRequest request, GeoServDbContext context) =>
        {
            await context.Database.MigrateAsync();

            if (!await context.Empresas.AnyAsync())
            {
                var nuevaEmpresa = new Empresa
                {
                    Id = Guid.NewGuid(),
                    Subdominio = request.Subdominio,
                    Nombre = request.Nombre,
                    Correo = request.Correo,
                    Telefono = request.Telefono,
                    Direccion = request.Direccion,
                    LogoSvg = request.LogoSvg
                };

                context.Empresas.Add(nuevaEmpresa);
                await context.SaveChangesAsync();
                return Results.Ok(new { message = $"Empresa {request.Nombre} inicializada correctamente." });
            }

            return Results.Ok(new { message = "La empresa ya estaba inicializada." });
        })
        .WithName("InitEmpresa")
        .WithOpenApi();
    }
}

public class EmpresaInitRequest
{
    public string Nombre { get; set; } = string.Empty;
    public string Correo { get; set; } = string.Empty;
    public string Telefono { get; set; } = string.Empty;
    public string Direccion { get; set; } = string.Empty;
    public string LogoSvg { get; set; } = string.Empty;
    public string Subdominio { get; set; } = string.Empty;
}
