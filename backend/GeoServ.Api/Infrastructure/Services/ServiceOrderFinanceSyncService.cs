using System.Globalization;
using GeoServ.Api.Domain.Entities;
using GeoServ.Api.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace GeoServ.Api.Infrastructure.Services;

// Sincroniza el CollectedAmount y los Costos Directos de una Orden de Servicio a partir de sus
// Movimientos Financieros vinculados. Ver openspec/changes/vincular-movimientos-ordenes-servicio.
public static class ServiceOrderFinanceSyncService
{
    private const string CollectedAmountModeKey = "os_collected_amount_mode";
    private static readonly CultureInfo ArgentineCulture = new("es-AR");

    public static async Task<string> GetCollectedAmountModeAsync(GeoServDbContext context)
    {
        var configService = new EmpresaConfiguracionService(context);
        return await configService.GetValueAsync(CollectedAmountModeKey) ?? "Manual";
    }

    // Recalcula CollectedAmount de la orden a partir de sus movimientos de ingreso vinculados,
    // gestiona la transición automática Entregada<->Cobrada y registra el hito correspondiente.
    // No hace nada si la modalidad de la empresa es "Manual".
    public static async Task SyncCollectionAsync(GeoServDbContext context, Guid serviceOrderId, Guid? userId, string movementActionText)
    {
        var mode = await GetCollectedAmountModeAsync(context);
        if (!string.Equals(mode, "Automatic", StringComparison.OrdinalIgnoreCase)) return;

        var order = await context.ServiceOrders.Include(o => o.Status).FirstOrDefaultAsync(o => o.Id == serviceOrderId);
        if (order == null) return;

        var incomeMovements = await context.AccountingMovements
            .Where(m => m.ServiceOrderId == serviceOrderId && m.IsIncome)
            .ToListAsync();

        var sum = incomeMovements.Sum(m => m.Amount);
        var firstDate = incomeMovements.Count > 0 ? incomeMovements.Min(m => m.Date) : (DateTime?)null;

        order.CollectedAmount = sum;
        order.UpdatedAt = DateTime.UtcNow;

        var finalUserId = await ResolveUserIdAsync(context, userId);
        AddObservation(context, order.Id, finalUserId, $"{movementActionText} Monto cobrado actualizado: {FormatCurrency(sum)}.");

        var statusName = order.Status?.Name;
        if (string.Equals(statusName, "Entregada", StringComparison.OrdinalIgnoreCase) && order.TotalAmount > 0 && sum >= order.TotalAmount)
        {
            var cobradaStatus = await context.ServiceOrderStatuses.FirstOrDefaultAsync(s => s.Name.ToLower() == "cobrada");
            if (cobradaStatus != null)
            {
                order.StatusId = cobradaStatus.Id;
                order.CollectionDate = firstDate ?? DateTime.UtcNow.Date;
                AddObservation(context, order.Id, finalUserId,
                    $"Orden marcada automáticamente como Cobrada tras alcanzar el monto total cobrado ({FormatCurrency(sum)}).");
            }
        }
        else if (string.Equals(statusName, "Cobrada", StringComparison.OrdinalIgnoreCase) && sum < order.TotalAmount)
        {
            var entregadaStatus = await context.ServiceOrderStatuses.FirstOrDefaultAsync(s => s.Name.ToLower() == "entregada");
            if (entregadaStatus != null)
            {
                order.StatusId = entregadaStatus.Id;
                order.CollectionDate = null;
                AddObservation(context, order.Id, finalUserId,
                    $"Orden revertida automáticamente a estado Entregada tras modificación/eliminación de cobros (Cobrado: {FormatCurrency(sum)} / Total: {FormatCurrency(order.TotalAmount)}).");
            }
        }

        await context.SaveChangesAsync();
    }

    // Busca la fila de Costo Directo "vía movimiento" (IsFromMovement == true) de la orden/categoría dados.
    // Si no existe, crea una fila placeholder (monto en 0, se completa en RecalculateDirectCostRowAsync).
    // Nunca toca ni adopta filas manuales (IsFromMovement == false) de la misma categoría.
    public static async Task<Guid> ResolveOrCreateDirectCostRowAsync(
        GeoServDbContext context, Guid serviceOrderId, Guid directCostCategoryId, Guid? userId, DateTime movementDate, string? movementDescription)
    {
        var existing = await context.DirectCosts.FirstOrDefaultAsync(d =>
            d.ServiceOrderId == serviceOrderId && d.CategoryId == directCostCategoryId && d.IsFromMovement);
        if (existing != null) return existing.Id;

        var category = await context.DirectCostCategories.FindAsync(directCostCategoryId);
        var unitId = await GetOrCreateDefaultUnitIdAsync(context);
        var finalUserId = await ResolveUserIdAsync(context, userId);

        var row = new DirectCost
        {
            Id = Guid.NewGuid(),
            ServiceOrderId = serviceOrderId,
            CategoryId = directCostCategoryId,
            Description = string.IsNullOrWhiteSpace(movementDescription) ? (category?.Name ?? "Costo directo") : movementDescription!,
            Quantity = 1,
            UnitId = unitId,
            UnitPrice = 0,
            TotalAmount = 0,
            Date = movementDate,
            Status = "Pagado",
            IsFromMovement = true,
            RegisteredByUserId = finalUserId ?? Guid.Empty
        };

        context.DirectCosts.Add(row);
        await context.SaveChangesAsync();
        return row.Id;
    }

    // Recalcula el importe de una fila de Costo Directo "vía movimiento" a partir de la sumatoria de
    // los movimientos actualmente vinculados a ella. Si la suma queda en 0 elimina la fila físicamente.
    // Registra el hito correspondiente en la bitácora de la orden en todos los casos.
    public static async Task RecalculateDirectCostRowAsync(GeoServDbContext context, Guid directCostRowId, Guid? userId, bool wasJustCreated)
    {
        var row = await context.DirectCosts.Include(d => d.Category)
            .FirstOrDefaultAsync(d => d.Id == directCostRowId && d.IsFromMovement);
        if (row == null) return;

        var linked = await context.AccountingMovements.Where(m => m.DirectCostId == row.Id).ToListAsync();
        var sum = linked.Sum(m => m.Amount);
        var finalUserId = await ResolveUserIdAsync(context, userId);
        var categoryName = row.Category?.Name ?? "Costo Directo";

        if (sum > 0)
        {
            row.UnitPrice = sum;
            row.TotalAmount = sum;
            row.Date = linked.Max(m => m.Date);
            row.Status = "Pagado";

            var text = wasJustCreated
                ? $"Se registró un pago de costo directo de {FormatCurrency(sum)} para la categoría '{categoryName}' (vía movimiento)."
                : $"Se actualizó el costo directo de '{categoryName}' a {FormatCurrency(sum)} tras un movimiento de egreso.";
            AddObservation(context, row.ServiceOrderId, finalUserId, text);
        }
        else
        {
            context.DirectCosts.Remove(row);
            AddObservation(context, row.ServiceOrderId, finalUserId,
                $"Se eliminó el costo directo de '{categoryName}' por no quedar movimientos contables asociados.");
        }

        await context.SaveChangesAsync();
    }

    public static async Task<Guid?> ResolveUserIdAsync(GeoServDbContext context, Guid? userId)
    {
        if (userId.HasValue && userId.Value != Guid.Empty) return userId.Value;
        var fallback = await context.Users.Select(u => (Guid?)u.Id).FirstOrDefaultAsync();
        return fallback;
    }

    public static void AddObservation(GeoServDbContext context, Guid serviceOrderId, Guid? userId, string text)
    {
        // Sin usuarios en el sistema (solo posible en bases de test vacías): se omite el registro de bitácora.
        if (!userId.HasValue) return;

        context.ServiceOrderObservations.Add(new ServiceOrderObservation
        {
            Id = Guid.NewGuid(),
            ServiceOrderId = serviceOrderId,
            Text = text,
            ObservationType = "Hito Clave",
            UserId = userId.Value,
            CreatedAt = DateTime.UtcNow
        });
    }

    public static async Task<Guid> GetOrCreateDefaultUnitIdAsync(GeoServDbContext context)
    {
        var unit = await context.Units.FirstOrDefaultAsync(u => u.Name.ToLower() == "unidad")
            ?? await context.Units.FirstOrDefaultAsync(u => u.IsActive);
        if (unit != null) return unit.Id;

        var newUnit = new Unit { Id = Guid.NewGuid(), Name = "Unidad", IsActive = true };
        context.Units.Add(newUnit);
        await context.SaveChangesAsync();
        return newUnit.Id;
    }

    public static string FormatCurrency(decimal amount) => "$" + amount.ToString("N2", ArgentineCulture);
}
