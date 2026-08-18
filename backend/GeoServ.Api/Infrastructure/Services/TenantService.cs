using Microsoft.Extensions.Configuration;
using Microsoft.AspNetCore.Http;

namespace GeoServ.Api.Infrastructure.Services;

public class TenantService : ITenantService
{
    private readonly IHttpContextAccessor _httpContextAccessor;
    private readonly IConfiguration _configuration;
    private readonly string _defaultTenant = "default"; // O el que prefieras
    
    public TenantService(IHttpContextAccessor httpContextAccessor, IConfiguration configuration)
    {
        _httpContextAccessor = httpContextAccessor;
        _configuration = configuration;
    }

    public string GetTenantId()
    {
        var httpContext = _httpContextAccessor.HttpContext;
        if (httpContext == null) return _defaultTenant;

        // Intentar obtener de los Claims (si está logueado)
        var tenantClaim = httpContext.User.Claims.FirstOrDefault(c => c.Type == "TenantId");
        if (tenantClaim != null && !string.IsNullOrEmpty(tenantClaim.Value))
        {
            return tenantClaim.Value;
        }

        // Si no hay claim, intentar obtener del Header (ej: en el login el front envía el subdominio)
        if (httpContext.Request.Headers.TryGetValue("X-Tenant-Id", out var tenantHeader))
        {
            return tenantHeader.ToString();
        }

        return _defaultTenant;
    }

    public string GetConnectionString()
    {
        var tenantId = GetTenantId();
        var connectionStringName = $"Tenant_{tenantId}";
        
        var connectionString = _configuration.GetConnectionString(connectionStringName);
        if (string.IsNullOrEmpty(connectionString))
        {
            // Si no hay específica, usamos la DefaultConnection y le inyectamos dinámicamente el nombre de la base de datos
            var defaultConn = _configuration.GetConnectionString("DefaultConnection");
            if (string.IsNullOrEmpty(defaultConn))
            {
                throw new InvalidOperationException("DefaultConnection is missing.");
            }
            
            // Reemplazamos la base de datos por defecto ("postgres" o cualquiera) por la del tenant "geoserv_[tenantId]"
            // Asumimos formato simple; para un parseo más robusto en Npgsql se puede usar NpgsqlConnectionStringBuilder
            var builder = new Npgsql.NpgsqlConnectionStringBuilder(defaultConn);
            
            // Si el tenant es el default, lo dejamos apuntar a postgres, si no, al tenant
            if (tenantId != _defaultTenant)
            {
                builder.Database = $"geoserv_{tenantId}";
            }
            
            connectionString = builder.ToString();
        }
        
        return connectionString;
    }
}
