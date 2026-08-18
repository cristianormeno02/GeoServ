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
        group.MapPost("/inicializar", async (GeoServDbContext context) =>
        {
            var tenantService = context.GetService<GeoServ.Api.Infrastructure.Services.ITenantService>();
            var tenantId = tenantService?.GetTenantId() ?? "default";
            if (tenantId != "default")
            {
                var schemaName = $"geoserv_{tenantId}";
                await context.Database.ExecuteSqlRawAsync($"CREATE SCHEMA IF NOT EXISTS \"{schemaName}\"");
            }

            await context.Database.MigrateAsync();

            if (!await context.Empresas.AnyAsync())
            {
                var nuevaEmpresa = new Empresa
                {
                    Id = Guid.NewGuid(),
                    Subdominio = "geocobre",
                    Nombre = "GeoCobre SpA",
                    Correo = "contacto@geocobre.cl",
                    Telefono = "+56912345678",
                    Direccion = "Av. Minería 123",
                    LogoSvg = "<svg width=\"100\" height=\"100\" xmlns=\"http://www.w3.org/2000/svg\"><circle cx=\"50\" cy=\"50\" r=\"40\" stroke=\"black\" stroke-width=\"3\" fill=\"#d2691e\"/></svg>"
                };

                context.Empresas.Add(nuevaEmpresa);
                await context.SaveChangesAsync();
                return Results.Ok(new { message = "Empresa geocobre inicializada correctamente." });
            }

            return Results.Ok(new { message = "La empresa ya estaba inicializada." });
        })
        .WithName("InitEmpresa")
        .WithOpenApi();
    }
}
