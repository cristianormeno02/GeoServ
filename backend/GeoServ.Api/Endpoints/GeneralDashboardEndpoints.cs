using GeoServ.Api.Domain.Entities;
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
            var claim = user.Claims.FirstOrDefault(c =>
                c.Type == ClaimTypes.NameIdentifier ||
                c.Type.Equals("sub", StringComparison.OrdinalIgnoreCase) ||
                c.Type.Equals("id", StringComparison.OrdinalIgnoreCase) ||
                c.Type.Equals("nameid", StringComparison.OrdinalIgnoreCase) ||
                c.Type.EndsWith("nameidentifier", StringComparison.OrdinalIgnoreCase));

            if (claim != null && Guid.TryParse(claim.Value, out var guid))
            {
                return guid;
            }
            return null;
        }

        // Helper para extraer Nombre de usuario
        static string GetUserName(ClaimsPrincipal user)
        {
            var nameClaim = user.Claims.FirstOrDefault(c =>
                c.Type == ClaimTypes.Name ||
                c.Type.Equals("name", StringComparison.OrdinalIgnoreCase) ||
                c.Type.Equals("unique_name", StringComparison.OrdinalIgnoreCase) ||
                c.Type.EndsWith("claims/name", StringComparison.OrdinalIgnoreCase))?.Value;

            if (!string.IsNullOrWhiteSpace(nameClaim)) return nameClaim;

            var emailClaim = user.Claims.FirstOrDefault(c =>
                c.Type == ClaimTypes.Email ||
                c.Type.Equals("email", StringComparison.OrdinalIgnoreCase) ||
                c.Type.EndsWith("claims/emailaddress", StringComparison.OrdinalIgnoreCase))?.Value;

            if (!string.IsNullOrWhiteSpace(emailClaim)) return emailClaim;

            return "Usuario";
        }

        // Helper para resolver el contexto del usuario actual
        static async Task<(Guid? userId, User? userObj, bool isAdmin)> GetUserContext(GeoServDbContext context, ClaimsPrincipal userPrincipal)
        {
            var userId = GetUserId(userPrincipal);
            User? userObj = null;

            if (userId.HasValue)
            {
                userObj = await context.Users
                    .Include(u => u.Role)
                    .AsNoTracking()
                    .FirstOrDefaultAsync(u => u.Id == userId.Value);
            }

            if (userObj == null)
            {
                var email = userPrincipal.Claims.FirstOrDefault(c =>
                    c.Type == ClaimTypes.Email ||
                    c.Type.Equals("email", StringComparison.OrdinalIgnoreCase) ||
                    c.Type.EndsWith("claims/emailaddress", StringComparison.OrdinalIgnoreCase))?.Value;

                if (!string.IsNullOrEmpty(email))
                {
                    userObj = await context.Users
                        .Include(u => u.Role)
                        .AsNoTracking()
                        .FirstOrDefaultAsync(u => u.Email == email);
                }
            }

            var isAdmin = userObj?.Role?.Name == "Administrador";
            return (userId ?? userObj?.Id, userObj, isAdmin);
        }

        // Helper: resuelve el Responsible del usuario autenticado con fallback multi-candidato robusto
        static async Task<Responsible?> ResolveResponsible(GeoServDbContext context, ClaimsPrincipal userPrincipal, User? userObj)
        {
            var userId = GetUserId(userPrincipal) ?? userObj?.Id;
            if (userId.HasValue)
            {
                var resp = await context.Responsibles
                    .AsNoTracking()
                    .FirstOrDefaultAsync(r => r.UserId == userId.Value);

                if (resp != null) return resp;
            }

            var allResponsibles = await context.Responsibles.AsNoTracking().ToListAsync();
            if (allResponsibles.Count == 0) return null;

            // Recolectar candidatos de nombres / identificadores
            var candidates = new List<string>();
            if (!string.IsNullOrWhiteSpace(userObj?.Name)) candidates.Add(userObj.Name.Trim());

            var claimName = GetUserName(userPrincipal);
            if (!string.IsNullOrWhiteSpace(claimName) && !claimName.Equals("Usuario", StringComparison.OrdinalIgnoreCase))
            {
                candidates.Add(claimName.Trim());
            }

            var email = userObj?.Email ?? userPrincipal.Claims.FirstOrDefault(c =>
                c.Type == ClaimTypes.Email ||
                c.Type.Equals("email", StringComparison.OrdinalIgnoreCase) ||
                c.Type.EndsWith("claims/emailaddress", StringComparison.OrdinalIgnoreCase))?.Value;

            if (!string.IsNullOrWhiteSpace(email))
            {
                var emailPrefix = email.Split('@')[0].Replace(".", " ").Replace("_", " ").Trim();
                if (!string.IsNullOrWhiteSpace(emailPrefix)) candidates.Add(emailPrefix);
            }

            // 1. Coincidencia exacta por nombre (case-insensitive)
            foreach (var cand in candidates)
            {
                var exact = allResponsibles.FirstOrDefault(r => r.Name.Trim().Equals(cand, StringComparison.OrdinalIgnoreCase));
                if (exact != null) return exact;
            }

            // 2. Coincidencia parcial (nombre contiene parte del usuario o viceversa)
            foreach (var cand in candidates)
            {
                var parts = cand.Split(new[] { ' ', ',', '-' }, StringSplitOptions.RemoveEmptyEntries);
                foreach (var part in parts)
                {
                    if (part.Length >= 3)
                    {
                        var partial = allResponsibles.FirstOrDefault(r => 
                            r.Name.Contains(part, StringComparison.OrdinalIgnoreCase) || 
                            cand.Contains(r.Name, StringComparison.OrdinalIgnoreCase));
                        if (partial != null) return partial;
                    }
                }
            }

            // 3. Fallback: si hay un solo responsable registrado y no es Cliente
            if (userObj?.Role?.Name != "Cliente" && allResponsibles.Count == 1)
            {
                return allResponsibles[0];
            }

            return null;
        }

        // Helper: obtiene la lista de IDs de órdenes correspondientes al usuario o admin
        static async Task<List<Guid>> GetTargetOrderIds(GeoServDbContext context, Responsible? responsible, bool isAdmin)
        {
            if (responsible != null)
            {
                return await context.ServiceOrderResponsibles
                    .AsNoTracking()
                    .Where(sor => sor.ResponsibleId == responsible.Id)
                    .Select(sor => sor.ServiceOrderId)
                    .ToListAsync();
            }

            if (isAdmin)
            {
                return await context.ServiceOrders
                    .AsNoTracking()
                    .Select(o => o.Id)
                    .ToListAsync();
            }

            return new List<Guid>();
        }

        // 1. Perfil / bienvenida del usuario
        group.MapGet("/profile", async (ClaimsPrincipal userPrincipal, GeoServDbContext context) =>
        {
            var (userId, userObj, isAdmin) = await GetUserContext(context, userPrincipal);
            var userName = userObj?.Name ?? GetUserName(userPrincipal);
            var responsible = await ResolveResponsible(context, userPrincipal, userObj);

            if (responsible == null)
            {
                if (isAdmin)
                {
                    return Results.Ok(new
                    {
                        hasResponsible = true,
                        userName,
                        responsibleName = userName,
                        position = "Administrador del Sistema",
                        title = "Administración",
                        specialties = "Gestión Integral"
                    });
                }

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
                position = responsible.Position,
                title = responsible.Title,
                specialties = responsible.Specialties
            });
        });

        // 2. KPIs personales / de órdenes
        group.MapGet("/kpis", async (ClaimsPrincipal userPrincipal, GeoServDbContext context) =>
        {
            var (userId, userObj, isAdmin) = await GetUserContext(context, userPrincipal);
            var responsible = await ResolveResponsible(context, userPrincipal, userObj);

            if (responsible == null && !isAdmin)
            {
                return Results.Ok(new { hasResponsible = false });
            }

            var myOrderIds = await GetTargetOrderIds(context, responsible, isAdmin);

            if (myOrderIds.Count == 0)
            {
                return Results.Ok(new
                {
                    hasResponsible = true,
                    ordenesActivas = 0,
                    ordenesEntregadas = 0,
                    ordenesCobradas = 0,
                    ordenesCanceladas = 0,
                    totalOrdenes = 0,
                    progresoPromedio = 0.0,
                    byStatus = Array.Empty<object>(),
                    byPriority = Array.Empty<object>()
                });
            }

            var activeStatusNames = new[] { "Alta", "Presupuestada", "Aprobada", "Iniciada" };
            var deliveredStatusName = "Entregada";
            var collectedStatusName = "Cobrada";
            var canceledStatusName = "Cancelada";

            var myOrders = await context.ServiceOrders
                .AsNoTracking()
                .Where(o => myOrderIds.Contains(o.Id))
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
            var allActiveActivities = activeOrders.SelectMany(o => o.Activities ?? new List<ServiceOrderActivity>()).ToList();
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

        // 3. Órdenes activas
        group.MapGet("/active-orders", async (ClaimsPrincipal userPrincipal, GeoServDbContext context) =>
        {
            var (userId, userObj, isAdmin) = await GetUserContext(context, userPrincipal);
            var responsible = await ResolveResponsible(context, userPrincipal, userObj);

            if (responsible == null && !isAdmin)
                return Results.Ok(Array.Empty<object>());

            var activeStatusNames = new[] { "Alta", "Presupuestada", "Aprobada", "Iniciada", "Entregada" };
            var today = DateTime.UtcNow.Date;

            var myOrderIds = await GetTargetOrderIds(context, responsible, isAdmin);

            if (myOrderIds.Count == 0)
                return Results.Ok(Array.Empty<object>());

            var orders = await context.ServiceOrders
                .AsNoTracking()
                .Where(o => myOrderIds.Contains(o.Id)
                         && o.Status != null
                         && activeStatusNames.Contains(o.Status.Name))
                .Include(o => o.Status)
                .Include(o => o.Client)
                .Include(o => o.ServiceType)
                .Include(o => o.Activities)
                .ToListAsync();

            var result = orders.Select(o =>
            {
                var activities = o.Activities?.ToList() ?? new List<ServiceOrderActivity>();
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

        // 4. Actividades pendientes
        group.MapGet("/pending-activities", async (ClaimsPrincipal userPrincipal, GeoServDbContext context) =>
        {
            var (userId, userObj, isAdmin) = await GetUserContext(context, userPrincipal);
            var responsible = await ResolveResponsible(context, userPrincipal, userObj);

            if (responsible == null && !isAdmin)
                return Results.Ok(Array.Empty<object>());

            var activeStatusNames = new[] { "Alta", "Presupuestada", "Aprobada", "Iniciada", "Entregada" };

            var myOrderIds = await GetTargetOrderIds(context, responsible, isAdmin);

            if (myOrderIds.Count == 0)
                return Results.Ok(Array.Empty<object>());

            var activeOrdersInfo = await context.ServiceOrders
                .AsNoTracking()
                .Where(o => myOrderIds.Contains(o.Id)
                         && o.Status != null
                         && activeStatusNames.Contains(o.Status.Name))
                .Select(o => new { o.Id, o.OrderNumber })
                .ToListAsync();

            if (activeOrdersInfo.Count == 0)
                return Results.Ok(Array.Empty<object>());

            var orderIdMap = activeOrdersInfo.ToDictionary(o => o.Id, o => o.OrderNumber);
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
                shortDetail = a.ShortDetail ?? string.Empty,
                state = a.State.ToString(),
                a.ProgressPercentage
            }).OrderBy(a => a.state == "EnProceso" ? 0 : 1).ToList();

            return Results.Ok(result);
        });

        // 5. Observaciones recientes (últimos 7 días)
        group.MapGet("/recent-observations", async (ClaimsPrincipal userPrincipal, GeoServDbContext context) =>
        {
            var (userId, userObj, isAdmin) = await GetUserContext(context, userPrincipal);
            var responsible = await ResolveResponsible(context, userPrincipal, userObj);

            if (responsible == null && !isAdmin)
                return Results.Ok(Array.Empty<object>());

            var sevenDaysAgo = DateTime.UtcNow.AddDays(-7);

            var myOrderIds = await GetTargetOrderIds(context, responsible, isAdmin);

            if (myOrderIds.Count == 0)
                return Results.Ok(Array.Empty<object>());

            var myOrdersInfo = await context.ServiceOrders
                .AsNoTracking()
                .Where(o => myOrderIds.Contains(o.Id))
                .Select(o => new { o.Id, o.OrderNumber })
                .ToListAsync();

            var orderIdMap = myOrdersInfo.ToDictionary(o => o.Id, o => o.OrderNumber);
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
                observationType = obs.ObservationType ?? "General",
                obs.CreatedAt,
                authorName = obs.User != null ? obs.User.Name : "Usuario",
                isOwnObservation = userId.HasValue && obs.UserId == userId.Value
            }).ToList();

            return Results.Ok(result);
        });
    }
}
