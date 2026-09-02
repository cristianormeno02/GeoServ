using GeoServ.Api.Domain.Entities;
using GeoServ.Api.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace GeoServ.Api.Infrastructure.Services;

public interface IEmpresaConfiguracionService
{
    Task<string?> GetValueAsync(string key);
    Task SetValueAsync(string key, string value, string valueType = "string", string? description = null, string group = "General");
    Task<Dictionary<string, string>> GetSmtpConfigAsync();
}

public class EmpresaConfiguracionService : IEmpresaConfiguracionService
{
    private readonly GeoServDbContext _context;

    public EmpresaConfiguracionService(GeoServDbContext context)
    {
        _context = context;
    }

    public async Task<string?> GetValueAsync(string key)
    {
        var empresa = await _context.Empresas.FirstOrDefaultAsync();
        if (empresa == null) return null;

        var config = await _context.EmpresaConfiguraciones
            .FirstOrDefaultAsync(c => c.EmpresaId == empresa.Id && c.Key == key);
        return config?.Value;
    }

    public async Task SetValueAsync(string key, string value, string valueType = "string", string? description = null, string group = "General")
    {
        var empresa = await _context.Empresas.FirstOrDefaultAsync();
        if (empresa == null) throw new InvalidOperationException("No se encontró la empresa actual.");

        var config = await _context.EmpresaConfiguraciones
            .FirstOrDefaultAsync(c => c.EmpresaId == empresa.Id && c.Key == key);

        if (config == null)
        {
            config = new EmpresaConfiguracion
            {
                Id = Guid.NewGuid(),
                EmpresaId = empresa.Id,
                Key = key,
                Value = value,
                ValueType = valueType,
                Description = description,
                Group = group
            };
            _context.EmpresaConfiguraciones.Add(config);
        }
        else
        {
            config.Value = value;
            config.ValueType = valueType;
            if (description != null) config.Description = description;
            config.Group = group;
        }

        await _context.SaveChangesAsync();
    }

    public async Task<Dictionary<string, string>> GetSmtpConfigAsync()
    {
        var empresa = await _context.Empresas.FirstOrDefaultAsync();
        if (empresa == null) return new Dictionary<string, string>();

        var configs = await _context.EmpresaConfiguraciones
            .Where(c => c.EmpresaId == empresa.Id && c.Group == "Correo Avisos")
            .ToListAsync();

        return configs.ToDictionary(c => c.Key, c => c.Value);
    }
}
