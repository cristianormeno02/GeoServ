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
                empresa.TaxId,
                empresa.LogoSvg,
                empresa.Subdominio
            });
        })
        .RequireAuthorization()
        .WithName("GetEmpresaConfig")
        .WithOpenApi();

        group.MapGet("/settings", async (GeoServDbContext context) =>
        {
            var empresa = await context.Empresas.Include(e => e.Configuraciones).FirstOrDefaultAsync();
            if (empresa == null) return Results.NotFound();

            var settings = empresa.Configuraciones.ToDictionary(c => c.Key, c => new { c.Value, c.ValueType, c.Description });
            return Results.Ok(settings);
        })
        .RequireAuthorization()
        .WithName("GetEmpresaSettings")
        .WithOpenApi();

        group.MapPut("/settings", async (UpdateSettingsRequest request, GeoServDbContext context, GeoServ.Api.Infrastructure.Services.IEmpresaConfiguracionService configService) =>
        {
            try
            {
                if (request.Settings.TryGetValue("os_number_format", out var osNumberFormat))
                {
                    // Validar si hay OS creadas
                    var hasOrders = await context.ServiceOrders.AnyAsync();
                    if (hasOrders)
                    {
                        var currentFormat = await configService.GetValueAsync("os_number_format");
                        if (currentFormat != osNumberFormat.Value)
                        {
                            return Results.BadRequest(new { message = "No es posible cambiar el formato de numeración porque el sistema detectó que ya existen Órdenes de Servicio creadas para esta empresa. Esta configuración solo puede modificarse cuando no hay órdenes registradas, a fin de evitar inconsistencias en los números asignados." });
                        }
                    }
                }

                foreach (var setting in request.Settings)
                {
                    await configService.SetValueAsync(setting.Key, setting.Value.Value, setting.Value.ValueType, setting.Value.Description);
                }

                return Results.Ok();
            }
            catch (Exception ex)
            {
                return Results.Problem(detail: ex.Message);
            }
        })
        .RequireAuthorization()
        .WithName("UpdateEmpresaSettings")
        .WithOpenApi();

        // Endpoint auxiliar para inicializar la empresa en su propia base de datos
        // NOTA: Para producción este endpoint debería estar protegido o no existir, 
        // usarse scripts u otro mecanismo.
        group.MapPost("/inicializar", async ([Microsoft.AspNetCore.Mvc.FromForm] EmpresaInitFormRequest request, GeoServDbContext context) =>
        {
            await context.Database.MigrateAsync();

            string logoSvgContent = string.Empty;
            if (request.LogoFile is not null && request.LogoFile.Length > 0)
            {
                using var reader = new StreamReader(request.LogoFile.OpenReadStream());
                logoSvgContent = await reader.ReadToEndAsync();
            }

            var empresaExistente = await context.Empresas.FirstOrDefaultAsync();

            if (empresaExistente == null)
            {
                var nuevaEmpresa = new Empresa
                {
                    Id = Guid.NewGuid(),
                    Subdominio = request.Subdominio,
                    Nombre = request.Nombre,
                    Correo = request.Correo,
                    Telefono = request.Telefono,
                    Direccion = request.Direccion,
                    TaxId = request.TaxId,
                    LogoSvg = logoSvgContent
                };

                context.Empresas.Add(nuevaEmpresa);
                await context.SaveChangesAsync();
                return Results.Ok(new { message = $"Empresa {request.Nombre} inicializada correctamente." });
            }
            else
            {
                // Actualizar los datos de la empresa existente
                empresaExistente.Subdominio = request.Subdominio;
                empresaExistente.Nombre = request.Nombre;
                empresaExistente.Correo = request.Correo;
                empresaExistente.Telefono = request.Telefono;
                empresaExistente.Direccion = request.Direccion;
                empresaExistente.TaxId = request.TaxId;
                
                // Solo actualizar el logo si se envió un archivo nuevo
                if (!string.IsNullOrEmpty(logoSvgContent))
                {
                    empresaExistente.LogoSvg = logoSvgContent;
                }

                await context.SaveChangesAsync();
                return Results.Ok(new { message = $"Empresa {request.Nombre} actualizada correctamente." });
            }
        })
        .DisableAntiforgery()
        .WithName("InitEmpresa")
        .WithOpenApi();
    }
}

public class EmpresaInitFormRequest
{
    public string Nombre { get; set; } = string.Empty;
    public string Correo { get; set; } = string.Empty;
    public string Telefono { get; set; } = string.Empty;
    public string Direccion { get; set; } = string.Empty;
    public string Subdominio { get; set; } = string.Empty;
    public string TaxId { get; set; } = string.Empty;
    public Microsoft.AspNetCore.Http.IFormFile? LogoFile { get; set; }
}

public record UpdateSettingsRequest(Dictionary<string, SettingValueDto> Settings);
public record SettingValueDto(string Value, string ValueType = "string", string? Description = null);

