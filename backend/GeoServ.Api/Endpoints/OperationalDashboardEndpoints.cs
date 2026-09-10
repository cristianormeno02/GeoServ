using GeoServ.Api.Domain.Entities;
using GeoServ.Api.Domain.Enums;
using GeoServ.Api.Infrastructure.Data;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;

namespace GeoServ.Api.Endpoints;

public class UpcomingDeliveryBucketDto
{
    public string Range { get; set; } = string.Empty;
    public string Key { get; set; } = string.Empty;
    public int Count { get; set; }
    public decimal TotalBudgetedAmount { get; set; }
    public string Color { get; set; } = string.Empty;
}

public class UpcomingDeliveriesResult
{
    public List<UpcomingDeliveryBucketDto> Buckets { get; set; } = new();
    public int TotalCount { get; set; }
    public decimal TotalBudgetedAmount { get; set; }
}

public class UpcomingDeliveryDetailItemDto
{
    public Guid Id { get; set; }
    public string OrderNumber { get; set; } = string.Empty;
    public string ClientName { get; set; } = string.Empty;
    public string ServiceTypeName { get; set; } = string.Empty;
    public string StatusName { get; set; } = string.Empty;
    public DateTime? EstimatedEndDate { get; set; }
    public int DaysRemaining { get; set; }
    public decimal TotalAmount { get; set; }
}

public class UpcomingDeliveriesDetailsResult
{
    public List<UpcomingDeliveryDetailItemDto> Items { get; set; } = new();
    public int TotalCount { get; set; }
    public int Page { get; set; }
    public int PageSize { get; set; }
}

public static class OperationalDashboardEndpoints
{
    public static IQueryable<ServiceOrder> GetUncollectedDeliveredOrdersQuery(GeoServDbContext context)
    {
        return context.ServiceOrders
            .AsNoTracking()
            .Include(o => o.Status)
            .Where(o => o.Status != null && o.Status.Name == "Entregada" && o.TotalAmount > o.CollectedAmount);
    }

    public static IQueryable<ServiceOrder> GetUpcomingDeliveriesQuery(GeoServDbContext context)
    {
        return context.ServiceOrders
            .AsNoTracking()
            .Include(o => o.Status)
            .Where(o => o.Status != null 
                     && o.Status.Name != "Entregada" 
                     && o.Status.Name != "Cobrada" 
                     && o.Status.Name != "Cancelada" 
                     && o.EstimatedEndDate.HasValue);
    }

    public static async Task<UpcomingDeliveriesResult> GetUpcomingDeliveriesBuckets(GeoServDbContext context, DateTime? referenceDate = null)
    {
        var today = (referenceDate ?? DateTime.UtcNow).Date;
        var orders = await GetUpcomingDeliveriesQuery(context).ToListAsync();

        var b7 = orders.Where(o => (o.EstimatedEndDate!.Value.Date - today).TotalDays <= 7).ToList();
        var b14 = orders.Where(o => (o.EstimatedEndDate!.Value.Date - today).TotalDays > 7 && (o.EstimatedEndDate!.Value.Date - today).TotalDays <= 14).ToList();
        var b30 = orders.Where(o => (o.EstimatedEndDate!.Value.Date - today).TotalDays > 14 && (o.EstimatedEndDate!.Value.Date - today).TotalDays <= 30).ToList();
        var bOver30 = orders.Where(o => (o.EstimatedEndDate!.Value.Date - today).TotalDays > 30).ToList();

        var buckets = new List<UpcomingDeliveryBucketDto>
        {
            new UpcomingDeliveryBucketDto
            {
                Range = "≤ 7 días",
                Key = "0_7",
                Count = b7.Count,
                TotalBudgetedAmount = b7.Sum(o => o.TotalAmount),
                Color = "#ef4444"
            },
            new UpcomingDeliveryBucketDto
            {
                Range = "8-14 días",
                Key = "8_14",
                Count = b14.Count,
                TotalBudgetedAmount = b14.Sum(o => o.TotalAmount),
                Color = "#f59e0b"
            },
            new UpcomingDeliveryBucketDto
            {
                Range = "15-30 días",
                Key = "15_30",
                Count = b30.Count,
                TotalBudgetedAmount = b30.Sum(o => o.TotalAmount),
                Color = "#10b981"
            },
            new UpcomingDeliveryBucketDto
            {
                Range = "> 30 días",
                Key = "over_30",
                Count = bOver30.Count,
                TotalBudgetedAmount = bOver30.Sum(o => o.TotalAmount),
                Color = "#64748b"
            }
        };

        return new UpcomingDeliveriesResult
        {
            Buckets = buckets,
            TotalCount = orders.Count,
            TotalBudgetedAmount = orders.Sum(o => o.TotalAmount)
        };
    }

    public static async Task<UpcomingDeliveriesDetailsResult> GetUpcomingDeliveriesDetails(
        GeoServDbContext context, 
        string? rangeKey, 
        int page = 1, 
        int pageSize = 10, 
        DateTime? referenceDate = null)
    {
        var today = (referenceDate ?? DateTime.UtcNow).Date;
        var actualPage = page <= 0 ? 1 : page;
        var actualPageSize = pageSize <= 0 ? 10 : pageSize;

        var all = await GetUpcomingDeliveriesQuery(context)
            .Include(o => o.Client)
            .Include(o => o.ServiceType)
            .ToListAsync();

        IEnumerable<ServiceOrder> filtered = rangeKey switch
        {
            "0_7" or "7" or "≤ 7 días" => all.Where(o => (o.EstimatedEndDate!.Value.Date - today).TotalDays <= 7),
            "8_14" or "14" or "8-14 días" => all.Where(o => (o.EstimatedEndDate!.Value.Date - today).TotalDays > 7 && (o.EstimatedEndDate!.Value.Date - today).TotalDays <= 14),
            "15_30" or "30" or "15-30 días" => all.Where(o => (o.EstimatedEndDate!.Value.Date - today).TotalDays > 14 && (o.EstimatedEndDate!.Value.Date - today).TotalDays <= 30),
            "over_30" or ">30" or "> 30 días" => all.Where(o => (o.EstimatedEndDate!.Value.Date - today).TotalDays > 30),
            _ => all
        };

        var ordered = filtered.OrderBy(o => o.EstimatedEndDate!.Value);
        var totalCount = ordered.Count();
        var items = ordered
            .Skip((actualPage - 1) * actualPageSize)
            .Take(actualPageSize)
            .Select(o => new UpcomingDeliveryDetailItemDto
            {
                Id = o.Id,
                OrderNumber = o.OrderNumber,
                ClientName = o.Client != null ? o.Client.CompanyName : "Sin cliente",
                ServiceTypeName = o.ServiceType != null ? o.ServiceType.Name : "Sin tipo",
                StatusName = o.Status != null ? o.Status.Name : "Pendiente",
                EstimatedEndDate = o.EstimatedEndDate,
                DaysRemaining = (int)(o.EstimatedEndDate!.Value.Date - today).TotalDays,
                TotalAmount = o.TotalAmount
            })
            .ToList();

        return new UpcomingDeliveriesDetailsResult
        {
            Items = items,
            TotalCount = totalCount,
            Page = actualPage,
            PageSize = actualPageSize
        };
    }

    public static void MapOperationalDashboardEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/dashboard/operational").RequireAuthorization();

        app.MapGet("/api/dashboard/operational/test-kpis", async (GeoServDbContext context) =>
        {
            var now = DateTime.UtcNow;
            var lowStockItemsCount = await context.Consumables
                .AsNoTracking()
                .CountAsync(c => (c.InventoryMovements.Sum(m => (decimal?)m.Cantidad) ?? 0) < c.MinimumStock);
            return Results.Ok(lowStockItemsCount);
        });
        
        app.MapGet("/api/dashboard/operational/test-alerts", async (GeoServDbContext context) =>
        {
            var now = DateTime.UtcNow;
            var consumablesWithStock = await context.Consumables
                .AsNoTracking()
                .Include(c => c.Unit)
                .Select(c => new
                {
                    c.Id,
                    c.Description,
                    unitName = c.Unit.Name,
                    minimumStock = c.MinimumStock,
                    currentStock = c.InventoryMovements.Sum(m => (decimal?)m.Cantidad) ?? 0
                })
                .Where(c => c.currentStock < c.minimumStock)
                .ToListAsync();
            return Results.Ok(consumablesWithStock);
        });

        // 1. KPI Cards sin Sparkline
        group.MapGet("/kpis", async (GeoServDbContext context) =>
        {
            var now = DateTime.UtcNow;

            // Órdenes activas
            var activeOrdersCount = await context.ServiceOrders
                .AsNoTracking()
                .CountAsync(o => o.Status.Name != "Cobrada" && o.Status.Name != "Cancelada");

            // Órdenes estancadas (> 7 días en estado actual)
            var stagnantThresholdDate = now.AddDays(-7);
            var stagnantOrdersCount = await context.ServiceOrders
                .AsNoTracking()
                .CountAsync(o => o.Status.Name != "Cobrada" && o.Status.Name != "Cancelada" && o.UpdatedAt <= stagnantThresholdDate);

            // Entregadas sin cobrar
            var uncollectedOrdersCount = await GetUncollectedDeliveredOrdersQuery(context)
                .CountAsync();

            var lowStockItemsCount = await context.Consumables
                .AsNoTracking()
                .CountAsync(c => (c.InventoryMovements.Sum(m => (decimal?)m.Cantidad) ?? 0) < c.MinimumStock);

            return Results.Ok(new
            {
                activeOrders = new { value = activeOrdersCount },
                stagnantOrders = new { value = stagnantOrdersCount },
                uncollectedOrders = new { value = uncollectedOrdersCount },
                lowStockItems = new { value = lowStockItemsCount }
            });
        });

        // 2. Gauge Capacidad del Equipo
        group.MapGet("/team-capacity", async (GeoServDbContext context) =>
        {
            var activeOrders = await context.ServiceOrders
                .AsNoTracking()
                .CountAsync(o => o.Status.Name != "Cobrada" && o.Status.Name != "Cancelada");

            var config = await context.EmpresaConfiguraciones
                .AsNoTracking()
                .FirstOrDefaultAsync(c => c.Key == "OPERATIONAL_CAPACITY_MAX_ORDERS");

            var maxCapacity = 10;
            if (config != null && int.TryParse(config.Value, out var parsedCap) && parsedCap > 0)
            {
                maxCapacity = parsedCap;
            }

            var percentage = maxCapacity > 0 ? Math.Round((decimal)activeOrders / maxCapacity * 100, 1) : 0;
            var status = percentage > 100 ? "Sobrecargado" : percentage >= 80 ? "Alerta" : "Normal";

            return Results.Ok(new
            {
                activeOrders,
                maxCapacity,
                capacityPercentage = percentage,
                semanticStatus = status
            });
        });

        // 3. Gauge Cumplimiento de Plazos
        group.MapGet("/deadline-compliance", async (GeoServDbContext context) =>
        {
            var now = DateTime.UtcNow;
            var thresholdDate = now.AddDays(-7);

            var activeOrders = await context.ServiceOrders
                .AsNoTracking()
                .Where(o => o.Status.Name != "Cobrada" && o.Status.Name != "Cancelada")
                .Select(o => new { o.Id, o.UpdatedAt })
                .ToListAsync();

            var totalActive = activeOrders.Count;
            if (totalActive == 0)
            {
                return Results.Ok(new
                {
                    compliancePercentage = 100.0,
                    totalActive = 0,
                    onTimeCount = 0,
                    delayedCount = 0
                });
            }

            var onTimeCount = activeOrders.Count(o => o.UpdatedAt > thresholdDate);
            var delayedCount = totalActive - onTimeCount;
            var compliancePercentage = Math.Round((decimal)onTimeCount / totalActive * 100, 1);

            return Results.Ok(new
            {
                compliancePercentage,
                totalActive,
                onTimeCount,
                delayedCount
            });
        });

        // 4. Dona Órdenes por Tipo de Servicio
        group.MapGet("/orders-by-service-type", async (GeoServDbContext context) =>
        {
            var groups = await context.ServiceOrders
                .AsNoTracking()
                .Where(o => o.Status.Name != "Cobrada" && o.Status.Name != "Cancelada")
                .GroupBy(o => new { o.ServiceTypeId, o.ServiceType.Name })
                .Select(g => new
                {
                    serviceTypeId = g.Key.ServiceTypeId,
                    serviceTypeName = g.Key.Name,
                    count = g.Count()
                })
                .ToListAsync();

            var total = groups.Sum(g => g.count);
            var result = groups.Select(g => new
            {
                g.serviceTypeId,
                g.serviceTypeName,
                g.count,
                percentage = total > 0 ? Math.Round((decimal)g.count / total * 100, 1) : 0
            }).OrderByDescending(g => g.count);

            return Results.Ok(result);
        });

        // 5. Carga de Trabajo por Responsable (Barras horizontales)
        group.MapGet("/workload-by-responsible", async (GeoServDbContext context) =>
        {
            var activeOrders = await context.ServiceOrders
                .AsNoTracking()
                .Where(o => o.Status.Name != "Cobrada" && o.Status.Name != "Cancelada")
                .Include(o => o.Responsibles)
                    .ThenInclude(r => r.Responsible)
                .ToListAsync();

            var assigned = activeOrders
                .SelectMany(o => o.Responsibles.Select(r => new { OrderId = o.Id, ResponsibleName = r.Responsible.Name, ResponsibleId = r.ResponsibleId }))
                .GroupBy(x => new { x.ResponsibleId, x.ResponsibleName })
                .Select(g => new
                {
                    responsibleId = (Guid?)g.Key.ResponsibleId,
                    responsibleName = g.Key.ResponsibleName,
                    activeOrdersCount = g.Count()
                })
                .ToList();

            var unassignedCount = activeOrders.Count(o => !o.Responsibles.Any());
            if (unassignedCount > 0)
            {
                assigned.Add(new
                {
                    responsibleId = (Guid?)null,
                    responsibleName = "Sin Asignar",
                    activeOrdersCount = unassignedCount
                });
            }

            return Results.Ok(assigned.OrderByDescending(x => x.activeOrdersCount));
        });

        // 6. Listado de Órdenes Estancadas (Paginado)
        group.MapGet("/stagnant-orders", async (int? page, int? pageSize, GeoServDbContext context) =>
        {
            var now = DateTime.UtcNow;
            var thresholdDate = now.AddDays(-7);
            var actualPage = page ?? 1;
            var actualPageSize = pageSize ?? 10;

            var query = context.ServiceOrders
                .AsNoTracking()
                .Where(o => o.Status.Name != "Cobrada" && o.Status.Name != "Cancelada" && o.UpdatedAt <= thresholdDate)
                .Include(o => o.Client)
                .Include(o => o.ServiceType)
                .Include(o => o.Status);

            var totalCount = await query.CountAsync();

            var items = await query
                .OrderBy(o => o.UpdatedAt)
                .Skip((actualPage - 1) * actualPageSize)
                .Take(actualPageSize)
                .Select(o => new
                {
                    o.Id,
                    o.OrderNumber,
                    clientName = o.Client.CompanyName,
                    serviceTypeName = o.ServiceType.Name,
                    statusName = o.Status.Name,
                    daysInStatus = (int)(now - o.UpdatedAt).TotalDays,
                    lastUpdate = o.UpdatedAt
                })
                .ToListAsync();

            return Results.Ok(new
            {
                items,
                totalCount,
                page = actualPage,
                pageSize = actualPageSize
            });
        });

        // 7. Aging de Entregadas sin Cobrar + Listado
        group.MapGet("/aging-uncollected-orders", async (int? page, int? pageSize, GeoServDbContext context) =>
        {
            var now = DateTime.UtcNow;
            var actualPage = page ?? 1;
            var actualPageSize = pageSize ?? 10;

            var query = GetUncollectedDeliveredOrdersQuery(context)
                .Include(o => o.Client)
                .Include(o => o.ServiceType);

            var allOrders = await query.ToListAsync();

            var b0_7 = allOrders.Where(o => (now - (o.ActualEndDate ?? o.UpdatedAt)).TotalDays <= 7).ToList();
            var b8_15 = allOrders.Where(o => (now - (o.ActualEndDate ?? o.UpdatedAt)).TotalDays > 7 && (now - (o.ActualEndDate ?? o.UpdatedAt)).TotalDays <= 15).ToList();
            var b16_30 = allOrders.Where(o => (now - (o.ActualEndDate ?? o.UpdatedAt)).TotalDays > 15 && (now - (o.ActualEndDate ?? o.UpdatedAt)).TotalDays <= 30).ToList();
            var b30Plus = allOrders.Where(o => (now - (o.ActualEndDate ?? o.UpdatedAt)).TotalDays > 30).ToList();

            var buckets = new[]
            {
                new { range = "0-7 días", count = b0_7.Count, totalPendingAmount = b0_7.Sum(o => o.TotalAmount - o.CollectedAmount) },
                new { range = "8-15 días", count = b8_15.Count, totalPendingAmount = b8_15.Sum(o => o.TotalAmount - o.CollectedAmount) },
                new { range = "16-30 días", count = b16_30.Count, totalPendingAmount = b16_30.Sum(o => o.TotalAmount - o.CollectedAmount) },
                new { range = "+30 días", count = b30Plus.Count, totalPendingAmount = b30Plus.Sum(o => o.TotalAmount - o.CollectedAmount) }
            };

            var items = allOrders
                .OrderByDescending(o => (now - (o.ActualEndDate ?? o.UpdatedAt)).TotalDays)
                .Skip((actualPage - 1) * actualPageSize)
                .Take(actualPageSize)
                .Select(o => new
                {
                    o.Id,
                    o.OrderNumber,
                    clientName = o.Client.CompanyName,
                    serviceTypeName = o.ServiceType.Name,
                    deliveryDate = o.ActualEndDate ?? o.UpdatedAt,
                    daysSinceDelivery = (int)(now - (o.ActualEndDate ?? o.UpdatedAt)).TotalDays,
                    totalAmount = o.TotalAmount,
                    collectedAmount = o.CollectedAmount,
                    pendingAmount = o.TotalAmount - o.CollectedAmount
                })
                .ToList();

            return Results.Ok(new
            {
                buckets,
                totalPendingAmount = allOrders.Sum(o => o.TotalAmount - o.CollectedAmount),
                totalCount = allOrders.Count,
                items,
                page = actualPage,
                pageSize = actualPageSize
            });
        });

        // 8. Monitoreo de Inventario (Stock crítico y Mermas)
        group.MapGet("/inventory-alerts", async (GeoServDbContext context) =>
        {
            var now = DateTime.UtcNow;

            var consumablesWithStock = await context.Consumables
                .AsNoTracking()
                .Include(c => c.Unit)
                .Select(c => new
                {
                    c.Id,
                    c.Description,
                    unitName = c.Unit.Name,
                    minimumStock = c.MinimumStock,
                    currentStock = c.InventoryMovements.Sum(m => (decimal?)m.Cantidad) ?? 0
                })
                .Where(c => c.currentStock < c.minimumStock)
                .ToListAsync();

            var criticalConsumables = consumablesWithStock.Select(c => new
            {
                consumableId = c.Id,
                c.Description,
                c.unitName,
                c.minimumStock,
                c.currentStock,
                deficit = c.minimumStock - c.currentStock
            }).OrderByDescending(c => c.deficit).ToList();

            // Mermas por AjusteNegativo del mes actual
            var negativeAdjustments = await context.InventoryMovements
                .AsNoTracking()
                .Where(m => m.MovementType == InventoryMovementType.AjusteNegativo && m.Fecha.Month == now.Month && m.Fecha.Year == now.Year)
                .GroupBy(m => m.Motivo ?? "Sin motivo especificado")
                .Select(g => new
                {
                    reason = g.Key,
                    quantity = g.Sum(m => Math.Abs(m.Cantidad)),
                    count = g.Count()
                })
                .OrderByDescending(g => g.quantity)
                .ToListAsync();

            return Results.Ok(new
            {
                criticalConsumables,
                negativeAdjustmentsByReason = negativeAdjustments
            });
        });

        // 9. Costos Fijos Próximos a Vencer
        group.MapGet("/upcoming-fixed-costs", async (int? daysAhead, GeoServDbContext context) =>
        {
            var days = daysAhead.HasValue && daysAhead.Value > 0 ? daysAhead.Value : 15;
            var today = DateTime.UtcNow.Date;
            var maxDueDate = today.AddDays(days);

            var items = await context.FixedCostPayments
                .AsNoTracking()
                .Where(p => !p.IsPaid && p.DueDate >= today && p.DueDate <= maxDueDate)
                .Include(p => p.FixedCostItem)
                    .ThenInclude(i => i.Category)
                .OrderBy(p => p.DueDate)
                .Select(p => new
                {
                    id = p.Id,
                    fixedCostItemId = p.FixedCostItemId,
                    itemName = p.FixedCostItem.Name,
                    categoryName = p.FixedCostItem.Category.Name,
                    amount = p.Amount,
                    dueDate = p.DueDate,
                    daysRemaining = (int)(p.DueDate.Date - today).TotalDays
                })
                .ToListAsync();

            return Results.Ok(items);
        });

        // 10. Próximas Entregas (Aging Preventivo)
        group.MapGet("/upcoming-deliveries", async (GeoServDbContext context) =>
        {
            var result = await GetUpcomingDeliveriesBuckets(context);
            return Results.Ok(result);
        });

        group.MapGet("/upcoming-deliveries/details", async (string? rangeKey, int? page, int? pageSize, GeoServDbContext context) =>
        {
            var result = await GetUpcomingDeliveriesDetails(context, rangeKey, page ?? 1, pageSize ?? 10);
            return Results.Ok(result);
        });

        // 11. Detalle de KPIs
        group.MapGet("/kpis/{kpi_id}/details", async (string kpi_id, int? page, int? pageSize, GeoServDbContext context) =>
        {
            var now = DateTime.UtcNow;
            var actualPage = page ?? 1;
            var actualPageSize = pageSize ?? 10;

            if (kpi_id == "activeOrders")
            {
                var query = context.ServiceOrders
                    .AsNoTracking()
                    .Where(o => o.Status != null && o.Status.Name != "Cobrada" && o.Status.Name != "Cancelada")
                    .Include(o => o.Client)
                    .Include(o => o.Status);

                var totalCount = await query.CountAsync();
                var items = await query
                    .OrderByDescending(o => o.CreatedAt)
                    .Skip((actualPage - 1) * actualPageSize)
                    .Take(actualPageSize)
                    .Select(o => new
                    {
                        o.Id,
                        o.OrderNumber,
                        clientName = o.Client != null ? o.Client.CompanyName : "Sin cliente",
                        statusName = o.Status != null ? o.Status.Name : "Alta",
                        date = o.CreatedAt
                    })
                    .ToListAsync();

                return Results.Ok(new { entityType = "orders", items, totalCount, page = actualPage, pageSize = actualPageSize });
            }
            else if (kpi_id == "stagnantOrders")
            {
                var thresholdDate = now.AddDays(-7);
                var query = context.ServiceOrders
                    .AsNoTracking()
                    .Where(o => o.Status != null && o.Status.Name != "Cobrada" && o.Status.Name != "Cancelada" && o.UpdatedAt <= thresholdDate)
                    .Include(o => o.Client)
                    .Include(o => o.Status);

                var totalCount = await query.CountAsync();
                var items = await query
                    .OrderBy(o => o.UpdatedAt)
                    .Skip((actualPage - 1) * actualPageSize)
                    .Take(actualPageSize)
                    .Select(o => new
                    {
                        o.Id,
                        o.OrderNumber,
                        clientName = o.Client != null ? o.Client.CompanyName : "Sin cliente",
                        statusName = o.Status != null ? o.Status.Name : "Alta",
                        date = o.UpdatedAt
                    })
                    .ToListAsync();

                return Results.Ok(new { entityType = "orders", items, totalCount, page = actualPage, pageSize = actualPageSize });
            }
            else if (kpi_id == "uncollectedOrders")
            {
                var query = GetUncollectedDeliveredOrdersQuery(context)
                    .Include(o => o.Client);

                var totalCount = await query.CountAsync();
                var items = await query
                    .OrderByDescending(o => o.ActualEndDate ?? o.UpdatedAt)
                    .Skip((actualPage - 1) * actualPageSize)
                    .Take(actualPageSize)
                    .Select(o => new
                    {
                        o.Id,
                        o.OrderNumber,
                        clientName = o.Client != null ? o.Client.CompanyName : "Sin cliente",
                        statusName = o.Status != null ? o.Status.Name : "Alta",
                        date = o.ActualEndDate ?? o.UpdatedAt
                    })
                    .ToListAsync();

                return Results.Ok(new { entityType = "orders", items, totalCount, page = actualPage, pageSize = actualPageSize });
            }
            else if (kpi_id == "criticalConsumables")
            {
                var consumablesWithStock = await context.Consumables
                    .AsNoTracking()
                    .Select(c => new
                    {
                        c.Id,
                        c.Description,
                        minimumStock = c.MinimumStock,
                        currentStock = c.InventoryMovements.Sum(m => (decimal?)m.Cantidad) ?? 0
                    })
                    .Where(c => c.currentStock < c.minimumStock)
                    .OrderByDescending(c => c.minimumStock - c.currentStock)
                    .ToListAsync(); // Resolve evaluation client side

                var totalCount = consumablesWithStock.Count;
                var items = consumablesWithStock
                    .Skip((actualPage - 1) * actualPageSize)
                    .Take(actualPageSize)
                    .Select(c => new
                    {
                        id = c.Id,
                        description = c.Description,
                        currentStock = c.currentStock,
                        minimumStock = c.minimumStock,
                        deficit = c.minimumStock - c.currentStock
                    })
                    .ToList();

                return Results.Ok(new { entityType = "consumables", items, totalCount, page = actualPage, pageSize = actualPageSize });
            }

            return Results.BadRequest(new { message = "Invalid KPI ID" });
        });
    }
}
