using GeoServ.Api.Domain.Enums;
using GeoServ.Api.Infrastructure.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace GeoServ.Api.Endpoints;

public static class GeneralDashboardEndpoints
{
    public static void MapGeneralDashboardEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/dashboard/general").RequireAuthorization();

        // Helper para extraer UserId de cualquier formato de claim
        static Guid? GetUserId(ClaimsPrincipal user)
        {
            var claim = user.FindFirst(ClaimTypes.NameIdentifier)
                ?? user.FindFirst("http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier")
                ?? user.FindFirst("sub")
                ?? user.FindFirst("id")
                ?? user.FindFirst("nameid");

            if (claim != null && Guid.TryParse(claim.Value, out var guid))
            {
                return guid;
            }
            return null;
        }

        // Helper para extraer Nombre de usuario
        static string GetUserName(ClaimsPrincipal user)
        {
            return user.FindFirst(ClaimTypes.Name)?.Value
                ?? user.FindFirst("http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name")?.Value
                ?? user.FindFirst("name")?.Value
                ?? user.FindFirst(ClaimTypes.Email)?.Value
                ?? user.FindFirst("email")?.Value
                ?? string.Empty;
        }

        // Helper: resuelve el ResponsibleId del usuario autenticado
        static async Task<Guid?> ResolveResponsibleId(GeoServDbContext context, ClaimsPrincipal user)
        {
            var userId = GetUserId(user);
            if (!userId.HasValue) return null;

            var responsible = await context.Responsibles
                .AsNoTracking()
                .FirstOrDefaultAsync(r => r.UserId == userId.Value);

            return responsible?.Id;
        }

        // 1. Perfil / bienvenida del usuario
        group.MapGet("/profile", async (ClaimsPrincipal userPrincipal, GeoServDbContext context) =>
        {
            var userId = GetUserId(userPrincipal);
            var userName = GetUserName(userPrincipal);

            if (!userId.HasValue)
            {
                return Results.Ok(new
                {
                    hasResponsible = false,
                    userName,
                    responsibleName = (string?)null,
                    position = (string?)null,
                    title = (string?)null,
                    specialties = (string?)null
                });
            }

            var responsible = await context.Responsibles
                .AsNoTracking()
                .FirstOrDefaultAsync(r => r.UserId == userId.Value);

            if (responsible == null)
            {
                return Results.Ok(new
                {
                    hasResponsible = false,
                    userName,
                    responsibleName = (string?)null,
                    position = (string?)null,
                    title = (string?)null,
                    specialties = (string?)null
                });
            }

            return Results.Ok(new
            {
                hasResponsible = true,
                userName,
                responsibleName = responsible.Name,
                responsible.Position,
                responsible.Title,
                responsible.Specialties
            });
        });

        // 2. KPIs personales
        group.MapGet("/kpis", async (ClaimsPrincipal userPrincipal, GeoServDbContext context) =>
        {
            var responsibleId = await ResolveResponsibleId(context, userPrincipal);

            if (!responsibleId.HasValue)
            {
                return Results.Ok(new { hasResponsible = false });
            }

            var activeStatusNames = new[] { "Alta", "Presupuestada", "Aprobada", "Iniciada" };
            var deliveredStatusName = "Entregada";
            var collectedStatusName = "Cobrada";
            var canceledStatusName = "Cancelada";

            var myOrders = await context.ServiceOrders
                .AsNoTracking()
                .Where(o => o.Responsibles.Any(r => r.ResponsibleId == responsibleId.Value))
                .Include(o => o.Status)
                .Include(o => o.Activities)
                .ToListAsync();

            var activeOrders = myOrders.Where(o => o.Status != null && activeStatusNames.Contains(o.Status.Name)).ToList();
            var ordenesEntregadas = myOrders.Count(o => o.Status?.Name == deliveredStatusName);
            var ordenesCobradas = myOrders.Count(o => o.Status?.Name == collectedStatusName);
            var ordenesCanceladas = myOrders.Count(o => o.Status?.Name == canceledStatusName);
            var ordenesActivas = activeOrders.Count;
            var totalOrdenes = myOrders.Count(o => o.Status?.Name != canceledStatusName);

            // Progreso promedio de las órdenes activas
            var allActiveActivities = activeOrders.SelectMany(o => o.Activities).ToList();
            var progresoPromedio = allActiveActivities.Count > 0
                ? Math.Round(allActiveActivities.Average(a => (double)a.ProgressPercentage), 1)
                : 0.0;

            // Distribución por estado (excluyendo Canceladas)
            var byStatus = myOrders
                .Where(o => o.Status != null && o.Status.Name != canceledStatusName)
                .GroupBy(o => o.Status!.Name)
                .Select(g => new { statusName = g.Key, count = g.Count() })
                .ToList();

            // Distribución por prioridad (órdenes activas)
            var byPriority = activeOrders
                .GroupBy(o => o.Priority.ToString())
                .Select(g => new { priority = g.Key, count = g.Count() })
                .ToList();

            return Results.Ok(new
            {
                hasResponsible = true,
                ordenesActivas,
                ordenesEntregadas,
                ordenesCobradas,
                ordenesCanceladas,
                totalOrdenes,
                progresoPromedio,
                byStatus,
                byPriority
            });
        });

        // 3. Órdenes activas del responsable
        group.MapGet("/active-orders", async (ClaimsPrincipal userPrincipal, GeoServDbContext context) =>
        {
            var responsibleId = await ResolveResponsibleId(context, userPrincipal);
            if (!responsibleId.HasValue)
                return Results.Ok(Array.Empty<object>());

            var activeStatusNames = new[] { "Alta", "Presupuestada", "Aprobada", "Iniciada", "Entregada" };
            var today = DateTime.UtcNow.Date;

            var orders = await context.ServiceOrders
                .AsNoTracking()
                .Where(o => o.Responsibles.Any(r => r.ResponsibleId == responsibleId.Value)
                         && o.Status != null
                         && activeStatusNames.Contains(o.Status.Name))
                .Include(o => o.Status)
                .Include(o => o.Client)
                .Include(o => o.ServiceType)
                .Include(o => o.Activities)
                .ToListAsync();

            var result = orders.Select(o =>
            {
                var activities = o.Activities?.ToList() ?? new List<Domain.Entities.ServiceOrderActivity>();
                var progressPercentage = activities.Count > 0
                    ? (int)Math.Round(activities.Average(a => (double)a.ProgressPercentage))
                    : 0;

                string alertLevel = "ok";
                if (o.EstimatedEndDate.HasValue)
                {
                    var daysLeft = (o.EstimatedEndDate.Value.Date - today).Days;
                    if (daysLeft < 0)
                        alertLevel = "overdue";
                    else if (daysLeft <= 7)
                        alertLevel = "warning";
                }

                return new
                {
                    o.Id,
                    o.OrderNumber,
                    clientName = o.Client != null ? o.Client.CompanyName : "Sin cliente",
                    serviceTypeName = o.ServiceType != null ? o.ServiceType.Name : "General",
                    statusName = o.Status != null ? o.Status.Name : "Alta",
                    priority = o.Priority.ToString(),
                    estimatedEndDate = o.EstimatedEndDate,
                    progressPercentage,
                    alertLevel
                };
            }).OrderBy(o => o.alertLevel == "overdue" ? 0 : o.alertLevel == "warning" ? 1 : 2)
              .ThenBy(o => o.estimatedEndDate)
              .ToList();

            return Results.Ok(result);
        });

        // 4. Actividades pendientes del responsable
        group.MapGet("/pending-activities", async (ClaimsPrincipal userPrincipal, GeoServDbContext context) =>
        {
            var responsibleId = await ResolveResponsibleId(context, userPrincipal);
            if (!responsibleId.HasValue)
                return Results.Ok(Array.Empty<object>());

            var activeStatusNames = new[] { "Alta", "Presupuestada", "Aprobada", "Iniciada", "Entregada" };

            var myActiveOrderIds = await context.ServiceOrders
                .AsNoTracking()
                .Where(o => o.Responsibles.Any(r => r.ResponsibleId == responsibleId.Value)
                         && o.Status != null
                         && activeStatusNames.Contains(o.Status.Name))
                .Select(o => new { o.Id, o.OrderNumber })
                .ToListAsync();

            if (myActiveOrderIds.Count == 0)
                return Results.Ok(Array.Empty<object>());

            var orderIdMap = myActiveOrderIds.ToDictionary(o => o.Id, o => o.OrderNumber);
            var orderIds = orderIdMap.Keys.ToList();

            var activities = await context.ServiceOrderActivities
                .AsNoTracking()
                .Where(a => orderIds.Contains(a.ServiceOrderId)
                         && (a.State == ActivityState.Pendiente || a.State == ActivityState.EnProceso))
                .ToListAsync();

            var result = activities.Select(a => new
            {
                a.Id,
                orderNumber = orderIdMap.GetValueOrDefault(a.ServiceOrderId, string.Empty),
                a.ShortDetail,
                state = a.State.ToString(),
                a.ProgressPercentage
            }).OrderBy(a => a.state == "EnProceso" ? 0 : 1).ToList();

            return Results.Ok(result);
        });

        // 5. Observaciones recientes (últimos 7 días) en órdenes del responsable
        group.MapGet("/recent-observations", async (ClaimsPrincipal userPrincipal, GeoServDbContext context) =>
        {
            var userId = GetUserId(userPrincipal);
            var responsibleId = await ResolveResponsibleId(context, userPrincipal);
            if (!responsibleId.HasValue)
                return Results.Ok(Array.Empty<object>());

            var sevenDaysAgo = DateTime.UtcNow.AddDays(-7);

            var myOrderIds = await context.ServiceOrders
                .AsNoTracking()
                .Where(o => o.Responsibles.Any(r => r.ResponsibleId == responsibleId.Value))
                .Select(o => new { o.Id, o.OrderNumber })
                .ToListAsync();

            if (myOrderIds.Count == 0)
                return Results.Ok(Array.Empty<object>());

            var orderIdMap = myOrderIds.ToDictionary(o => o.Id, o => o.OrderNumber);
            var orderIds = orderIdMap.Keys.ToList();

            var observations = await context.ServiceOrderObservations
                .AsNoTracking()
                .Where(obs => orderIds.Contains(obs.ServiceOrderId) && obs.CreatedAt >= sevenDaysAgo)
                .Include(obs => obs.User)
                .OrderByDescending(obs => obs.CreatedAt)
                .ToListAsync();

            var result = observations.Select(obs => new
            {
                obs.Id,
                orderNumber = orderIdMap.GetValueOrDefault(obs.ServiceOrderId, string.Empty),
                obs.Text,
                obs.ObservationType,
                obs.CreatedAt,
                authorName = obs.User != null ? obs.User.Name : "Usuario",
                isOwnObservation = userId.HasValue && obs.UserId == userId.Value
            }).ToList();

            return Results.Ok(result);
        });
    }
}
