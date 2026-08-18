namespace GeoServ.Api.Infrastructure.Services;

public interface ITenantService
{
    /// <summary>
    /// Gets the current tenant identifier (e.g. "geocobre")
    /// </summary>
    string GetTenantId();
    
    /// <summary>
    /// Gets the connection string for the current tenant.
    /// </summary>
    string GetConnectionString();
}
