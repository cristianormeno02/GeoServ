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
        var group = app.MapGroup("/api/dashboard/general")
            .RequireAuthorization()
            .AddEndpointFilter(async (context, next) =>
            {
                var dbContext = context.HttpContext.RequestServices.GetRequiredService<GeoServDbContext>();
                var userPrincipal = context.HttpContext.User;
                var (userId, userObj, isAdmin) = await GetUserContext(dbContext, userPrincipal);
                var matchedRespIds = await GetMatchedResponsibleIds(dbContext, userId, userObj, userPrincipal);

                if (matchedRespIds.Count == 0 && !isAdmin) // Maybe admin still gets a pass? 
                {
                    // The spec says: "cuando el userId no tenga un Responsible vinculado". If admin doesn't have one, do they get 403?
                    // "Si el usuario autenticado no tiene ningún Responsible con UserId igual a su User.Id -> devuelven HTTP 403"
                    return Results.Json(new { message = "Tu perfil no está vinculado a ningún responsable." }, statusCode: 403);
                }

                return await next(context);
            });

        // =====================================================================
        // HELPERS
        // =====================================================================

        // Extrae el UserId del token JWT
        static Guid? GetUserId(ClaimsPrincipal user)
        {
            foreach (var claim in user.Claims)
            {
                if (claim.Type == ClaimTypes.NameIdentifier ||
                    claim.Type == "sub" ||
                    claim.Type == "id" ||
                    claim.Type == "nameid" ||
                    claim.Type.EndsWith("nameidentifier", StringComparison.OrdinalIgnoreCase))
                {
                    if (Guid.TryParse(claim.Value, out var guid))
                        return guid;
                }
            }
            return null;
        }

        // Extrae el nombre del token JWT
        static string GetUserName(ClaimsPrincipal user)
        {
            foreach (var claim in user.Claims)
            {
                if (claim.Type == ClaimTypes.Name ||
                    claim.Type == "name" ||
                    claim.Type == "unique_name" ||
                    claim.Type.EndsWith("claims/name", StringComparison.OrdinalIgnoreCase))
                {
                    if (!string.IsNullOrWhiteSpace(claim.Value))
                        return claim.Value;
                }
            }

            foreach (var claim in user.Claims)
            {
                if (claim.Type == ClaimTypes.Email ||
                    claim.Type == "email" ||
                    claim.Type.EndsWith("claims/emailaddress", StringComparison.OrdinalIgnoreCase))
                {
                    if (!string.IsNullOrWhiteSpace(claim.Value))
                        return claim.Value;
                }
            }

            return "Usuario";
        }

        // Resuelve el usuario de la BD
        static async Task<(Guid? userId, User? userObj, bool isAdmin)> GetUserContext(
            GeoServDbContext context, ClaimsPrincipal userPrincipal)
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
                // Fallback: buscar por email del claim
                foreach (var claim in userPrincipal.Claims)
                {
                    if (claim.Type == ClaimTypes.Email ||
                        claim.Type == "email" ||
                        claim.Type.EndsWith("claims/emailaddress", StringComparison.OrdinalIgnoreCase))
                    {
                        if (!string.IsNullOrEmpty(claim.Value))
                        {
                            userObj = await context.Users
                                .Include(u => u.Role)
                                .AsNoTracking()
                                .FirstOrDefaultAsync(u => u.Email == claim.Value);
                            if (userObj != null) break;
                        }
                    }
                }
            }

            var isAdmin = userObj?.Role?.Name == "Administrador";
            return (userId ?? userObj?.Id, userObj, isAdmin);
        }

        // Obtiene TODOS los Responsible IDs que corresponden al usuario actual.
        // Estrategia simplificada:
        //   1. Match directo por UserId en Responsibles.UserId
        //   2. Match exacto por nombre (case-insensitive)
        //   3. Match parcial: algún token del nombre del usuario contiene o está contenido en el nombre del responsable
        static async Task<List<Guid>> GetMatchedResponsibleIds(
            GeoServDbContext context, Guid? userId, User? userObj, ClaimsPrincipal userPrincipal)
        {
            var allResponsibles = await context.Responsibles.AsNoTracking().ToListAsync();
            var matched = new HashSet<Guid>();

            // 1. Match por UserId
            if (userId.HasValue)
            {
                foreach (var r in allResponsibles)
                {
                    if (r.UserId.HasValue && r.UserId.Value == userId.Value)
                        matched.Add(r.Id);
                }
            }

            // Si ya encontramos por UserId, retornamos inmediatamente (es el match más fiable)
            if (matched.Count > 0)
                return matched.ToList();

            // 2. Recolectar candidatos de nombres para matching textual
            var candidates = new HashSet<string>(StringComparer.OrdinalIgnoreCase);

            if (!string.IsNullOrWhiteSpace(userObj?.Name))
                candidates.Add(userObj.Name.Trim());

            var claimName = GetUserName(userPrincipal);
            if (!string.IsNullOrWhiteSpace(claimName) && claimName != "Usuario")
                candidates.Add(claimName.Trim());

            if (!string.IsNullOrWhiteSpace(userObj?.Email))
            {
                var prefix = userObj.Email.Split('@')[0].Replace(".", " ").Replace("_", " ").Trim();
                if (!string.IsNullOrWhiteSpace(prefix))
                    candidates.Add(prefix);
            }

            if (candidates.Count == 0)
                return new List<Guid>();

            // 2a. Match exacto por nombre
            foreach (var r in allResponsibles)
            {
                var rName = r.Name?.Trim() ?? "";
                if (string.IsNullOrEmpty(rName)) continue;

                foreach (var cand in candidates)
                {
                    if (rName.Equals(cand, StringComparison.OrdinalIgnoreCase))
                    {
                        matched.Add(r.Id);
                        break;
                    }
                }
            }

            if (matched.Count > 0)
                return matched.ToList();

            // 2b. Match parcial: nombre contiene candidato o viceversa
            foreach (var r in allResponsibles)
            {
                var rName = r.Name?.Trim() ?? "";
                if (string.IsNullOrEmpty(rName)) continue;

                foreach (var cand in candidates)
                {
                    // Nombre completo contiene al otro
                    if (rName.Contains(cand, StringComparison.OrdinalIgnoreCase) ||
                        cand.Contains(rName, StringComparison.OrdinalIgnoreCase))
                    {
                        matched.Add(r.Id);
                        break;
                    }

                    // Tokens individuales (partes del nombre) >= 3 chars
                    var parts = cand.Split(new[] { ' ', ',', '-' }, StringSplitOptions.RemoveEmptyEntries);
                    foreach (var part in parts)
                    {
                        if (part.Length >= 3 && rName.Contains(part, StringComparison.OrdinalIgnoreCase))
                        {
                            matched.Add(r.Id);
                            break;
                        }
                    }
                    if (matched.Contains(r.Id)) break;
                }
            }

            return matched.ToList();
        }

        // Obtiene los IDs de las órdenes asignadas al usuario (o todas si es admin)
        static async Task<List<Guid>> GetTargetOrderIds(
            GeoServDbContext context, ClaimsPrincipal userPrincipal, User? userObj, bool isAdmin)
        {
            var userId = GetUserId(userPrincipal) ?? userObj?.Id;

            var matchedRespIds = await GetMatchedResponsibleIds(context, userId, userObj, userPrincipal);

            if (matchedRespIds.Count > 0)
            {
                var orderIds = await context.ServiceOrderResponsibles
                    .AsNoTracking()
                    .Where(sor => matchedRespIds.Contains(sor.ResponsibleId))
                    .Select(sor => sor.ServiceOrderId)
                    .Distinct()
                    .ToListAsync();

                if (orderIds.Count > 0) return orderIds;
            }

            // Fallback: si es admin, mostrar todas
            if (isAdmin)
            {
                return await context.ServiceOrders
                    .AsNoTracking()
                    .Select(o => o.Id)
                    .ToListAsync();
            }

            return new List<Guid>();
        }

        // =====================================================================
        // ENDPOINTS
        // =====================================================================

        // 0. DEBUG — Endpoint de diagnóstico (temporal, para investigar)
        group.MapGet("/debug", async (ClaimsPrincipal userPrincipal, GeoServDbContext context) =>
        {
            var (userId, userObj, isAdmin) = await GetUserContext(context, userPrincipal);
            var claimName = GetUserName(userPrincipal);

            // Listar todos los claims del token
            var allClaims = userPrincipal.Claims.Select(c => new { type = c.Type, value = c.Value }).ToList();

            // Responsables del sistema
            var allResponsibles = await context.Responsibles.AsNoTracking()
                .Select(r => new { r.Id, r.Name, r.UserId }).ToListAsync();

            // Resolver matching
            var matchedRespIds = await GetMatchedResponsibleIds(context, userId, userObj, userPrincipal);

            // Órdenes encontradas
            var targetOrderIds = await GetTargetOrderIds(context, userPrincipal, userObj, isAdmin);

            // Total de órdenes en la BD
            var totalOrdersInDb = await context.ServiceOrders.CountAsync();

            // Total de registros en ServiceOrderResponsibles
            var totalSORs = await context.ServiceOrderResponsibles.CountAsync();

            // Si se encontraron matchedRespIds, mostrar los SOR que matchean
            object matchedSORs;
            if (matchedRespIds.Count > 0)
            {
                matchedSORs = await context.ServiceOrderResponsibles.AsNoTracking()
                    .Where(sor => matchedRespIds.Contains(sor.ResponsibleId))
                    .Select(sor => new { sor.ServiceOrderId, sor.ResponsibleId })
                    .ToListAsync();
            }
            else
            {
                matchedSORs = Array.Empty<object>();
            }

            return Results.Ok(new
            {
                resolvedUserId = userId,
                resolvedUserName = userObj?.Name,
                resolvedUserEmail = userObj?.Email,
                resolvedUserRole = userObj?.Role?.Name,
                isAdmin,
                claimName,
                allClaims,
                allResponsibles,
                matchedResponsibleIds = matchedRespIds,
                matchedServiceOrderResponsibles = matchedSORs,
                targetOrderCount = targetOrderIds.Count,
                totalOrdersInDb,
                totalServiceOrderResponsibles = totalSORs
            });
        });

        // 1. Perfil / bienvenida
        group.MapGet("/profile", async (ClaimsPrincipal userPrincipal, GeoServDbContext context) =>
        {
            var (userId, userObj, isAdmin) = await GetUserContext(context, userPrincipal);
            var userName = userObj?.Name ?? GetUserName(userPrincipal);

            // Buscar el responsable vinculado
            Responsible? responsible = null;
            var matchedRespIds = await GetMatchedResponsibleIds(context, userId, userObj, userPrincipal);
            if (matchedRespIds.Count > 0)
            {
                responsible = await context.Responsibles.AsNoTracking()
                    .FirstOrDefaultAsync(r => r.Id == matchedRespIds[0]);
            }

            return Results.Ok(new
            {
                hasResponsible = true,
                userName = !string.IsNullOrWhiteSpace(userName) ? userName : (responsible?.Name ?? "Usuario"),
                responsibleName = responsible?.Name ?? userName,
                position = responsible?.Position ?? (isAdmin ? "Administrador del Sistema" : "Responsable"),
                title = responsible?.Title ?? "",
                specialties = responsible?.Specialties ?? ""
            });
        });

        // 2. KPIs
        group.MapGet("/kpis", async (ClaimsPrincipal userPrincipal, GeoServDbContext context) =>
        {
            var (userId, userObj, isAdmin) = await GetUserContext(context, userPrincipal);
            var myOrderIds = await GetTargetOrderIds(context, userPrincipal, userObj, isAdmin);

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

            var allActiveActivities = activeOrders.SelectMany(o => o.Activities ?? new List<ServiceOrderActivity>()).ToList();
            var progresoPromedio = allActiveActivities.Count > 0
                ? Math.Round(allActiveActivities.Average(a => (double)a.ProgressPercentage), 1)
                : 0.0;

            var byStatus = myOrders
                .Where(o => o.Status != null && o.Status.Name != canceledStatusName)
                .GroupBy(o => o.Status!.Name)
                .Select(g => new { statusName = g.Key, count = g.Count() })
                .ToList();

            var byPriority = activeOrders
                .GroupBy(o => o.Priority.ToString())
                .Select(g => new { priority = g.Key, count = g.Count() })
                .ToList();

            // NEW: Órdenes Estancadas
            var now = DateTime.UtcNow;
            var stagnantThresholdDate = now.AddDays(-7);
            var stagnantOrdersCount = myOrders.Count(o => o.Status != null && o.Status.Name != "Cobrada" && o.Status.Name != "Cancelada" && o.UpdatedAt <= stagnantThresholdDate);

            // NEW: Cumplimiento de Plazos
            var onTimeCount = activeOrders.Count(o => o.UpdatedAt > stagnantThresholdDate);
            var deadlineCompliancePercentage = activeOrders.Count > 0 ? Math.Round((decimal)onTimeCount / activeOrders.Count * 100, 1) : 100.0m;

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
                byPriority,
                stagnantOrders = new { value = stagnantOrdersCount, series = new[] { 0, 0, 0, 0, 0, stagnantOrdersCount } },
                deadlineCompliance = new { value = deadlineCompliancePercentage, series = new[] { 0, 0, 0, 0, 0, (double)deadlineCompliancePercentage } }
            });
        });

        // 3. Órdenes activas
        group.MapGet("/active-orders", async (ClaimsPrincipal userPrincipal, GeoServDbContext context) =>
        {
            var (userId, userObj, isAdmin) = await GetUserContext(context, userPrincipal);
            var activeStatusNames = new[] { "Alta", "Presupuestada", "Aprobada", "Iniciada", "Entregada" };
            var today = DateTime.UtcNow.Date;

            var myOrderIds = await GetTargetOrderIds(context, userPrincipal, userObj, isAdmin);

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
            var activeStatusNames = new[] { "Alta", "Presupuestada", "Aprobada", "Iniciada", "Entregada" };

            var myOrderIds = await GetTargetOrderIds(context, userPrincipal, userObj, isAdmin);

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
            var sevenDaysAgo = DateTime.UtcNow.AddDays(-7);

            var myOrderIds = await GetTargetOrderIds(context, userPrincipal, userObj, isAdmin);

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
