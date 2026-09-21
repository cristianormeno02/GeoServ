using GeoServ.Api.Domain.Entities;
using GeoServ.Api.Domain.Enums;
using GeoServ.Api.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace GeoServ.Api.Infrastructure.Services;

public interface IAlertCenterService
{
    Task<AlertCenterResponse> GetAlertsAsync(AlertCenterQuery query, Guid? userId, CancellationToken cancellationToken = default);
    Task<AlertCenterSummaryDto> GetSummaryAsync(Guid? userId, CancellationToken cancellationToken = default);
    Task<AlertItemDto?> UpdateStateAsync(string alertKey, UpdateAlertStateRequest request, Guid? userId, CancellationToken cancellationToken = default);
}

public class AlertCenterService : IAlertCenterService
{
    private static readonly string[] FinalOrderStatuses = ["Entregada", "Cobrada", "Cancelada"];
    private readonly GeoServDbContext _context;

    public AlertCenterService(GeoServDbContext context)
    {
        _context = context;
    }

    public async Task<AlertCenterResponse> GetAlertsAsync(AlertCenterQuery query, Guid? userId, CancellationToken cancellationToken = default)
    {
        var page = query.Page <= 0 ? 1 : query.Page;
        var pageSize = query.PageSize <= 0 ? 25 : Math.Min(query.PageSize, 100);
        var alerts = await BuildAlertsAsync(userId, cancellationToken);

        if (!string.IsNullOrWhiteSpace(query.Type))
        {
            alerts = alerts.Where(a => string.Equals(a.Type, query.Type, StringComparison.OrdinalIgnoreCase)).ToList();
        }

        if (!string.IsNullOrWhiteSpace(query.Priority))
        {
            alerts = alerts.Where(a => string.Equals(a.Priority, query.Priority, StringComparison.OrdinalIgnoreCase)).ToList();
        }

        if (!string.IsNullOrWhiteSpace(query.State))
        {
            alerts = alerts.Where(a => string.Equals(a.State, query.State, StringComparison.OrdinalIgnoreCase)).ToList();
        }
        else
        {
            alerts = alerts.Where(a => a.State != AlertStates.Resolved && !IsSnoozed(a)).ToList();
        }

        if (!string.IsNullOrWhiteSpace(query.Search))
        {
            var search = query.Search.Trim();
            alerts = alerts
                .Where(a => a.Title.Contains(search, StringComparison.OrdinalIgnoreCase)
                         || a.Description.Contains(search, StringComparison.OrdinalIgnoreCase)
                         || a.SourceLabel.Contains(search, StringComparison.OrdinalIgnoreCase))
                .ToList();
        }

        var ordered = alerts
            .OrderBy(a => PriorityRank(a.Priority))
            .ThenBy(a => a.DueDate ?? DateTime.MaxValue)
            .ThenBy(a => a.Title)
            .ToList();

        var total = ordered.Count;
        var items = ordered.Skip((page - 1) * pageSize).Take(pageSize).ToList();
        var summary = BuildSummary(alerts);

        return new AlertCenterResponse(items, total, page, pageSize, summary);
    }

    public async Task<AlertCenterSummaryDto> GetSummaryAsync(Guid? userId, CancellationToken cancellationToken = default)
    {
        var alerts = await BuildAlertsAsync(userId, cancellationToken);
        return BuildSummary(alerts.Where(a => a.State != AlertStates.Resolved && !IsSnoozed(a)).ToList());
    }

    public async Task<AlertItemDto?> UpdateStateAsync(string alertKey, UpdateAlertStateRequest request, Guid? userId, CancellationToken cancellationToken = default)
    {
        if (!AlertStates.All.Contains(request.State))
        {
            return null;
        }

        var normalizedKey = Uri.UnescapeDataString(alertKey);
        var now = DateTime.UtcNow;
        var state = await _context.AlertStates
            .FirstOrDefaultAsync(s => s.AlertKey == normalizedKey && s.UserId == userId, cancellationToken);

        if (state == null)
        {
            state = new AlertState
            {
                Id = Guid.NewGuid(),
                AlertKey = normalizedKey,
                UserId = userId
            };
            _context.AlertStates.Add(state);
        }

        state.State = request.State;
        state.SnoozedUntil = request.State == AlertStates.Snoozed ? request.SnoozedUntil : null;
        state.ResolvedAt = request.State == AlertStates.Resolved ? now : null;
        state.UpdatedAt = now;

        await _context.SaveChangesAsync(cancellationToken);

        return (await BuildAlertsAsync(userId, cancellationToken)).FirstOrDefault(a => a.Id == normalizedKey);
    }

    private async Task<List<AlertItemDto>> BuildAlertsAsync(Guid? userId, CancellationToken cancellationToken)
    {
        var today = DateTime.UtcNow.Date;
        var states = await GetStateMapAsync(userId, cancellationToken);
        var alerts = new List<AlertItemDto>();

        alerts.AddRange(await BuildServiceOrderDueSoonAlertsAsync(today, states, cancellationToken));
        alerts.AddRange(await BuildUncollectedOrderAlertsAsync(today, states, cancellationToken));
        alerts.AddRange(await BuildLowStockAlertsAsync(states, cancellationToken));
        alerts.AddRange(await BuildCheckDueAlertsAsync(today, states, cancellationToken));
        alerts.AddRange(await BuildFixedCostAlertsAsync(today, states, cancellationToken));
        alerts.AddRange(await BuildStagnantOrderAlertsAsync(today, states, cancellationToken));

        return alerts;
    }

    private async Task<Dictionary<string, AlertState>> GetStateMapAsync(Guid? userId, CancellationToken cancellationToken)
    {
        return await _context.AlertStates
            .AsNoTracking()
            .Where(s => s.UserId == userId)
            .ToDictionaryAsync(s => s.AlertKey, cancellationToken);
    }

    private async Task<List<AlertItemDto>> BuildServiceOrderDueSoonAlertsAsync(DateTime today, Dictionary<string, AlertState> states, CancellationToken cancellationToken)
    {
        var maxDate = today.AddDays(7);
        var orders = await _context.ServiceOrders
            .AsNoTracking()
            .Include(o => o.Client)
            .Include(o => o.Status)
            .Where(o => o.EstimatedEndDate.HasValue
                     && o.EstimatedEndDate.Value.Date <= maxDate
                     && !FinalOrderStatuses.Contains(o.Status.Name))
            .ToListAsync(cancellationToken);

        return orders.Select(order =>
        {
            var days = (int)(order.EstimatedEndDate!.Value.Date - today).TotalDays;
            var priority = days < 0 ? AlertPriorities.Critical : AlertPriorities.High;
            var key = AlertKey("ServiceOrderDueSoon", order.Id, order.EstimatedEndDate.Value.Date);
            return CreateAlert(
                key,
                "ServiceOrderDueSoon",
                priority,
                $"OS {order.OrderNumber} por vencer",
                days < 0
                    ? $"La orden vencio hace {Math.Abs(days)} dia(s) y sigue en estado {order.Status.Name}."
                    : $"La orden vence en {days} dia(s) y sigue en estado {order.Status.Name}.",
                "ServiceOrder",
                order.Id,
                $"OS {order.OrderNumber} - {order.Client?.CompanyName ?? "Sin cliente"}",
                order.EstimatedEndDate,
                order.TotalAmount,
                states,
                [
                    ViewOrderAction(order.Id),
                    new AlertActionDto("mark-delivered", "Marcar entregada", "task_alt", null, true, order.Status.Name == "Iniciada")
                ]);
        }).ToList();
    }

    private async Task<List<AlertItemDto>> BuildUncollectedOrderAlertsAsync(DateTime today, Dictionary<string, AlertState> states, CancellationToken cancellationToken)
    {
        var orders = await _context.ServiceOrders
            .AsNoTracking()
            .Include(o => o.Client)
            .Include(o => o.Status)
            .Where(o => o.Status.Name == "Entregada" && o.TotalAmount > o.CollectedAmount)
            .ToListAsync(cancellationToken);

        return orders.Select(order =>
        {
            var pending = order.TotalAmount - order.CollectedAmount;
            var baseDate = (order.ActualEndDate ?? order.UpdatedAt).Date;
            var days = (int)(today - baseDate).TotalDays;
            var priority = days > 30 ? AlertPriorities.Critical : AlertPriorities.High;
            var key = AlertKey("ServiceOrderUncollected", order.Id, baseDate);
            return CreateAlert(
                key,
                "ServiceOrderUncollected",
                priority,
                $"OS {order.OrderNumber} entregada sin cobrar",
                $"Saldo pendiente de cobro: {pending:C}. Entregada hace {Math.Max(days, 0)} dia(s).",
                "ServiceOrder",
                order.Id,
                $"OS {order.OrderNumber} - {order.Client?.CompanyName ?? "Sin cliente"}",
                order.ActualEndDate ?? order.UpdatedAt,
                pending,
                states,
                [
                    ViewOrderAction(order.Id),
                    new AlertActionDto("register-payment", "Registrar cobro", "payments", $"/movimientos?serviceOrderId={order.Id}&isIncome=true", false, true),
                    new AlertActionDto("create-movement", "Crear movimiento", "add_card", $"/movimientos?serviceOrderId={order.Id}&isIncome=true", false, true)
                ]);
        }).ToList();
    }

    private async Task<List<AlertItemDto>> BuildLowStockAlertsAsync(Dictionary<string, AlertState> states, CancellationToken cancellationToken)
    {
        var consumables = await _context.Consumables
            .AsNoTracking()
            .Include(c => c.Unit)
            .Select(c => new
            {
                c.Id,
                c.Description,
                unitName = c.Unit.Name,
                c.MinimumStock,
                currentStock = c.InventoryMovements.Sum(m => (decimal?)m.Cantidad) ?? 0
            })
            .Where(c => c.currentStock < c.MinimumStock)
            .ToListAsync(cancellationToken);

        return consumables.Select(consumable =>
        {
            var deficit = consumable.MinimumStock - consumable.currentStock;
            var priority = consumable.currentStock < 0 ? AlertPriorities.Critical : AlertPriorities.High;
            var key = AlertKey("LowStock", consumable.Id);
            return CreateAlert(
                key,
                "LowStock",
                priority,
                $"Insumo bajo stock: {consumable.Description}",
                $"Stock actual {consumable.currentStock:N2} {consumable.unitName}; minimo {consumable.MinimumStock:N2}; deficit {deficit:N2}.",
                "Consumable",
                consumable.Id,
                consumable.Description,
                null,
                deficit,
                states,
                [
                    new AlertActionDto("view-inventory", "Ver inventario", "inventory_2", $"/inventario?consumableId={consumable.Id}", false, true),
                    new AlertActionDto("view-consumable", "Ver insumo", "shopping_cart", $"/insumos?consumableId={consumable.Id}", false, true)
                ]);
        }).ToList();
    }

    private async Task<List<AlertItemDto>> BuildCheckDueAlertsAsync(DateTime today, Dictionary<string, AlertState> states, CancellationToken cancellationToken)
    {
        var maxDate = today.AddDays(7);
        var checks = await _context.Checks
            .AsNoTracking()
            .Where(c => (c.Status == CheckStatus.InPortfolio || c.Status == CheckStatus.Deposited)
                     && c.DueDate.Date <= maxDate)
            .ToListAsync(cancellationToken);

        return checks.Select(check =>
        {
            var days = (int)(check.DueDate.Date - today).TotalDays;
            var priority = days < 0 ? AlertPriorities.Critical : AlertPriorities.High;
            var key = AlertKey("CheckDueSoon", check.Id, check.DueDate.Date);
            return CreateAlert(
                key,
                "CheckDueSoon",
                priority,
                $"Cheque {check.CheckNumber} por vencer",
                days < 0
                    ? $"El cheque de {check.BankName} vencio hace {Math.Abs(days)} dia(s)."
                    : $"El cheque de {check.BankName} vence en {days} dia(s).",
                "Check",
                check.Id,
                $"Cheque {check.CheckNumber} - {check.BankName}",
                check.DueDate,
                check.Amount,
                states,
                [
                    new AlertActionDto("view-check", "Ver cheque", "receipt_long", $"/cheques?checkId={check.Id}", false, true)
                ]);
        }).ToList();
    }

    private async Task<List<AlertItemDto>> BuildFixedCostAlertsAsync(DateTime today, Dictionary<string, AlertState> states, CancellationToken cancellationToken)
    {
        var maxDate = today.AddDays(15);
        var payments = await _context.FixedCostPayments
            .AsNoTracking()
            .Include(p => p.FixedCostItem)
                .ThenInclude(i => i.Category)
            .Where(p => !p.IsPaid && p.DueDate.Date <= maxDate)
            .ToListAsync(cancellationToken);

        return payments.Select(payment =>
        {
            var days = (int)(payment.DueDate.Date - today).TotalDays;
            var priority = days < 0 ? AlertPriorities.Critical : days <= 7 ? AlertPriorities.High : AlertPriorities.Medium;
            var key = AlertKey("FixedCostPending", payment.Id, payment.DueDate.Date);
            return CreateAlert(
                key,
                "FixedCostPending",
                priority,
                $"Gasto fijo pendiente: {payment.FixedCostItem.Name}",
                days < 0
                    ? $"Vencio hace {Math.Abs(days)} dia(s). Categoria: {payment.FixedCostItem.Category.Name}."
                    : $"Vence en {days} dia(s). Categoria: {payment.FixedCostItem.Category.Name}.",
                "FixedCostPayment",
                payment.Id,
                payment.FixedCostItem.Name,
                payment.DueDate,
                payment.Amount,
                states,
                [
                    new AlertActionDto("pay-fixed-cost", "Pagar gasto fijo", "paid", $"/gastos-fijos?paymentId={payment.Id}", false, true),
                    new AlertActionDto("view-fixed-cost", "Ver gasto fijo", "event_repeat", $"/gastos-fijos?paymentId={payment.Id}", false, true)
                ]);
        }).ToList();
    }

    private async Task<List<AlertItemDto>> BuildStagnantOrderAlertsAsync(DateTime today, Dictionary<string, AlertState> states, CancellationToken cancellationToken)
    {
        var threshold = DateTime.UtcNow.AddDays(-7);
        var orders = await _context.ServiceOrders
            .AsNoTracking()
            .Include(o => o.Client)
            .Include(o => o.Status)
            .Where(o => o.UpdatedAt <= threshold && o.Status.Name != "Cobrada" && o.Status.Name != "Cancelada")
            .ToListAsync(cancellationToken);

        return orders.Select(order =>
        {
            var days = (int)(DateTime.UtcNow - order.UpdatedAt).TotalDays;
            var priority = days > 14 ? AlertPriorities.Critical : AlertPriorities.High;
            var key = AlertKey("ServiceOrderStagnant", order.Id, order.UpdatedAt.Date);
            return CreateAlert(
                key,
                "ServiceOrderStagnant",
                priority,
                $"OS {order.OrderNumber} estancada",
                $"La orden permanece en estado {order.Status.Name} desde hace {days} dia(s).",
                "ServiceOrder",
                order.Id,
                $"OS {order.OrderNumber} - {order.Client?.CompanyName ?? "Sin cliente"}",
                order.UpdatedAt,
                order.TotalAmount,
                states,
                [
                    ViewOrderAction(order.Id),
                    new AlertActionDto("mark-delivered", "Marcar entregada", "task_alt", null, true, order.Status.Name == "Iniciada")
                ]);
        }).ToList();
    }

    private static AlertItemDto CreateAlert(
        string key,
        string type,
        string priority,
        string title,
        string description,
        string sourceEntityType,
        Guid sourceEntityId,
        string sourceLabel,
        DateTime? dueDate,
        decimal? amount,
        Dictionary<string, AlertState> states,
        IReadOnlyList<AlertActionDto> actions)
    {
        states.TryGetValue(key, out var state);
        return new AlertItemDto(
            key,
            type,
            title,
            description,
            priority,
            state?.State ?? AlertStates.New,
            sourceEntityType,
            sourceEntityId,
            sourceLabel,
            dueDate,
            amount,
            DateTime.UtcNow,
            state?.SnoozedUntil,
            actions);
    }

    private static AlertActionDto ViewOrderAction(Guid orderId)
    {
        return new AlertActionDto("view-order", "Ver orden", "open_in_new", $"/ordenes-servicio/{orderId}", false, true);
    }

    private static string AlertKey(string type, Guid entityId, DateTime? date = null)
    {
        return date.HasValue
            ? $"{type}:{entityId:N}:{date.Value:yyyyMMdd}"
            : $"{type}:{entityId:N}";
    }

    private static bool IsSnoozed(AlertItemDto alert)
    {
        return alert.State == AlertStates.Snoozed && alert.SnoozedUntil.HasValue && alert.SnoozedUntil.Value > DateTime.UtcNow;
    }

    private static int PriorityRank(string priority)
    {
        return priority switch
        {
            AlertPriorities.Critical => 0,
            AlertPriorities.High => 1,
            AlertPriorities.Medium => 2,
            _ => 3
        };
    }

    private static AlertCenterSummaryDto BuildSummary(IReadOnlyList<AlertItemDto> alerts)
    {
        return new AlertCenterSummaryDto(
            alerts.Count,
            alerts.Count(a => a.Priority == AlertPriorities.Critical),
            alerts.Count(a => a.Priority == AlertPriorities.High),
            alerts.Count(a => a.Priority == AlertPriorities.Medium),
            alerts.Count(a => a.State == AlertStates.New),
            alerts.Count(a => a.State == AlertStates.Read),
            alerts.Count(a => a.State == AlertStates.Snoozed),
            alerts.Count(a => a.State == AlertStates.Resolved),
            alerts.Count(a => (a.Priority == AlertPriorities.Critical || a.Priority == AlertPriorities.High) && a.State != AlertStates.Resolved));
    }
}

public static class AlertPriorities
{
    public const string Critical = "Critical";
    public const string High = "High";
    public const string Medium = "Medium";
    public const string Low = "Low";
}

public static class AlertStates
{
    public const string New = "New";
    public const string Read = "Read";
    public const string Snoozed = "Snoozed";
    public const string Resolved = "Resolved";
    public static readonly string[] All = [New, Read, Snoozed, Resolved];
}

public record AlertCenterQuery(
    string? Type,
    string? Priority,
    string? State,
    string? Search,
    int Page = 1,
    int PageSize = 25);

public record AlertCenterResponse(
    IReadOnlyList<AlertItemDto> Items,
    int TotalCount,
    int Page,
    int PageSize,
    AlertCenterSummaryDto Summary);

public record AlertCenterSummaryDto(
    int TotalActive,
    int CriticalCount,
    int HighCount,
    int MediumCount,
    int NewCount,
    int ReadCount,
    int SnoozedCount,
    int ResolvedCount,
    int ActionableCount);

public record AlertItemDto(
    string Id,
    string Type,
    string Title,
    string Description,
    string Priority,
    string State,
    string SourceEntityType,
    Guid SourceEntityId,
    string SourceLabel,
    DateTime? DueDate,
    decimal? Amount,
    DateTime CreatedAt,
    DateTime? SnoozedUntil,
    IReadOnlyList<AlertActionDto> Actions);

public record AlertActionDto(
    string Key,
    string Label,
    string Icon,
    string? Route,
    bool RequiresConfirmation,
    bool Enabled);

public record UpdateAlertStateRequest(string State, DateTime? SnoozedUntil);
