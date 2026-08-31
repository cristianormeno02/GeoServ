using GeoServ.Api.Domain.Entities;
using GeoServ.Api.Domain.Enums;
using GeoServ.Api.Infrastructure.Data;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;

namespace GeoServ.Api.Endpoints;

public static class FinancialDashboardEndpoints
{
    public static void MapFinancialDashboardEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/dashboard/financial").RequireAuthorization();

        // 1. KPI Cards Financieras
        group.MapGet("/kpis", async (GeoServDbContext context) =>
        {
            var now = DateTime.UtcNow;
            var currentMonth = now.Month;
            var currentYear = now.Year;
            var lastMonthDate = now.AddMonths(-1);

            // Saldos por cuenta financiera + sparkline de 6 meses
            var accounts = await context.FinancialAccounts
                .AsNoTracking()
                .Where(a => a.IsActive)
                .ToListAsync();

            var accountsSummary = new List<object>();
            decimal totalBalanceAllAccounts = 0;

            foreach (var acc in accounts)
            {
                var movements = await context.AccountingMovements
                    .AsNoTracking()
                    .Where(m => m.FinancialAccountId == acc.Id)
                    .ToListAsync();

                var currentBal = movements.Sum(m => m.IsIncome ? m.Amount : -m.Amount);
                totalBalanceAllAccounts += currentBal;

                var trend = new List<decimal>();
                for (int i = 5; i >= 0; i--)
                {
                    var pDate = now.AddMonths(-i);
                    var balAtEnd = movements
                        .Where(m => m.Date <= new DateTime(pDate.Year, pDate.Month, DateTime.DaysInMonth(pDate.Year, pDate.Month)))
                        .Sum(m => m.IsIncome ? m.Amount : -m.Amount);
                    trend.Add(balAtEnd);
                }

                accountsSummary.Add(new
                {
                    acc.Id,
                    acc.Name,
                    accountType = acc.AccountType,
                    acc.AccountNumber,
                    currentBalance = currentBal,
                    trend
                });
            }

            // Ingresos mes actual + serie de 6 meses
            var incomeCurrentMonth = await context.AccountingMovements
                .AsNoTracking()
                .Where(m => m.IsIncome && m.Date.Month == currentMonth && m.Date.Year == currentYear)
                .SumAsync(m => (decimal?)m.Amount) ?? 0;

            var incomeTrend = new List<decimal>();
            for (int i = 5; i >= 0; i--)
            {
                var pDate = now.AddMonths(-i);
                var inc = await context.AccountingMovements
                    .AsNoTracking()
                    .Where(m => m.IsIncome && m.Date.Month == pDate.Month && m.Date.Year == pDate.Year)
                    .SumAsync(m => (decimal?)m.Amount) ?? 0;
                incomeTrend.Add(inc);
            }

            // Resultado neto del mes (Ingresos - Egresos) y variación vs mes anterior
            var expensesCurrentMonth = await context.AccountingMovements
                .AsNoTracking()
                .Where(m => !m.IsIncome && m.Date.Month == currentMonth && m.Date.Year == currentYear)
                .SumAsync(m => (decimal?)m.Amount) ?? 0;

            var netResultCurrentMonth = incomeCurrentMonth - expensesCurrentMonth;

            var incomeLastMonth = await context.AccountingMovements
                .AsNoTracking()
                .Where(m => m.IsIncome && m.Date.Month == lastMonthDate.Month && m.Date.Year == lastMonthDate.Year)
                .SumAsync(m => (decimal?)m.Amount) ?? 0;

            var expensesLastMonth = await context.AccountingMovements
                .AsNoTracking()
                .Where(m => !m.IsIncome && m.Date.Month == lastMonthDate.Month && m.Date.Year == lastMonthDate.Year)
                .SumAsync(m => (decimal?)m.Amount) ?? 0;

            var netResultLastMonth = incomeLastMonth - expensesLastMonth;
            var netResultVariationPercentage = netResultLastMonth != 0 
                ? Math.Round(((netResultCurrentMonth - netResultLastMonth) / Math.Abs(netResultLastMonth)) * 100, 1) 
                : 0;

            // Saldo acumulado de cobertura
            decimal accumulatedCoverageBalance = 0;
            try
            {
                var lastCoverage = await context.MonthlyCoverageReports
                    .AsNoTracking()
                    .OrderBy(r => r.Periodo)
                    .LastOrDefaultAsync();

                if (lastCoverage != null)
                {
                    accumulatedCoverageBalance = lastCoverage.SaldoAcumulado;
                }
            }
            catch
            {
                // Fallback en memoria si la vista aún no está materializada
                var allIncomes = await context.AccountingMovements
                    .AsNoTracking()
                    .Where(m => m.SourceType == MovementSourceType.ServiceOrderIncome)
                    .SumAsync(m => (decimal?)m.Amount) ?? 0;

                var allFixed = await context.AccountingMovements
                    .AsNoTracking()
                    .Where(m => m.SourceType == MovementSourceType.FixedCostPayment)
                    .SumAsync(m => (decimal?)m.Amount) ?? 0;

                var allDirect = await context.AccountingMovements
                    .AsNoTracking()
                    .Where(m => m.SourceType == MovementSourceType.DirectCost)
                    .SumAsync(m => (decimal?)m.Amount) ?? 0;

                accumulatedCoverageBalance = allIncomes - (allFixed + allDirect);
            }

            var semanticStatus = accumulatedCoverageBalance >= 0 ? "Positive" : "Negative";

            return Results.Ok(new
            {
                totalBalanceAllAccounts,
                accounts = accountsSummary,
                monthlyIncome = new { value = incomeCurrentMonth, trend = incomeTrend },
                monthlyNetResult = new { value = netResultCurrentMonth, variationPercentage = netResultVariationPercentage },
                accumulatedCoverage = new { value = accumulatedCoverageBalance, semanticStatus }
            });
        });

        // 2. Gauge Cobertura del Mes
        group.MapGet("/monthly-coverage-gauge", async (GeoServDbContext context) =>
        {
            var now = DateTime.UtcNow;
            var currentMonth = now.Month;
            var currentYear = now.Year;

            var ingresos = await context.AccountingMovements
                .AsNoTracking()
                .Where(m => m.SourceType == MovementSourceType.ServiceOrderIncome && m.Date.Month == currentMonth && m.Date.Year == currentYear)
                .SumAsync(m => (decimal?)m.Amount) ?? 0;

            var gastosFijos = await context.AccountingMovements
                .AsNoTracking()
                .Where(m => m.SourceType == MovementSourceType.FixedCostPayment && m.Date.Month == currentMonth && m.Date.Year == currentYear)
                .SumAsync(m => (decimal?)m.Amount) ?? 0;

            var gastosDirectos = await context.AccountingMovements
                .AsNoTracking()
                .Where(m => m.SourceType == MovementSourceType.DirectCost && m.Date.Month == currentMonth && m.Date.Year == currentYear)
                .SumAsync(m => (decimal?)m.Amount) ?? 0;

            // Honorarios devengados en las órdenes con cobro este mes
            var paidOrderIds = await context.AccountingMovements
                .AsNoTracking()
                .Where(m => m.SourceType == MovementSourceType.ServiceOrderIncome && m.Date.Month == currentMonth && m.Date.Year == currentYear && m.ServiceOrderId != null)
                .Select(m => m.ServiceOrderId!.Value)
                .Distinct()
                .ToListAsync();

            var honorarios = await context.ServiceOrderDistributions
                .AsNoTracking()
                .Where(d => paidOrderIds.Contains(d.ServiceOrderId) && d.DistributionConcept.Name.Contains("Honorario"))
                .SumAsync(d => (decimal?)d.ExpectedAmount) ?? 0;

            var totalCostos = gastosFijos + gastosDirectos + honorarios;
            var coveragePercentage = totalCostos > 0 
                ? Math.Round((ingresos / totalCostos) * 100, 1) 
                : (ingresos > 0 ? 100.0m : 0.0m);

            return Results.Ok(new
            {
                ingresos,
                gastosFijos,
                gastosDirectos,
                honorarios,
                totalCostos,
                coveragePercentage,
                isCovered = coveragePercentage >= 100
            });
        });

        // 3. Gauge Margen Promedio por Orden
        group.MapGet("/average-order-margin", async (int? months, GeoServDbContext context) =>
        {
            var numMonths = months.HasValue && months.Value > 0 ? months.Value : 3;
            var sinceDate = DateTime.UtcNow.AddMonths(-numMonths);

            var collectedOrders = await context.ServiceOrders
                .AsNoTracking()
                .Where(o => (o.Status.Name == "Cobrada" || o.CollectedAmount > 0) && (o.CollectionDate >= sinceDate || o.UpdatedAt >= sinceDate))
                .Include(o => o.DirectCosts)
                .ToListAsync();

            var ordersCount = collectedOrders.Count;
            if (ordersCount == 0)
            {
                return Results.Ok(new
                {
                    averageMarginPercentage = 0.0,
                    ordersCount = 0,
                    totalIncome = 0,
                    totalDirectCosts = 0
                });
            }

            var totalIncome = collectedOrders.Sum(o => o.CollectedAmount > 0 ? o.CollectedAmount : o.TotalAmount);
            var totalDirectCosts = collectedOrders.Sum(o => o.DirectCosts.Sum(d => d.TotalAmount));

            var averageMarginPercentage = totalIncome > 0 
                ? Math.Round(((totalIncome - totalDirectCosts) / totalIncome) * 100, 1) 
                : 0;

            return Results.Ok(new
            {
                averageMarginPercentage,
                ordersCount,
                totalIncome,
                totalDirectCosts
            });
        });

        // 4. Informe de Cobertura Mensual (Vista SQL con Arrastre)
        group.MapGet("/monthly-coverage-report", async (int? months, GeoServDbContext context) =>
        {
            var numMonths = months.HasValue && months.Value > 0 ? months.Value : 12;

            try
            {
                var report = await context.MonthlyCoverageReports
                    .AsNoTracking()
                    .OrderBy(r => r.Periodo)
                    .ToListAsync();

                var items = report.TakeLast(numMonths).ToList();
                return Results.Ok(items);
            }
            catch
            {
                // Fallback robusto en memoria si la vista SQL aún no se ejecutó en la base actual
                var now = DateTime.UtcNow;
                var items = new List<object>();
                decimal runningBalance = 0;

                for (int i = numMonths - 1; i >= 0; i--)
                {
                    var pDate = now.AddMonths(-i);
                    var periodo = pDate.ToString("yyyy-MM");

                    var inc = await context.AccountingMovements
                        .AsNoTracking()
                        .Where(m => m.SourceType == MovementSourceType.ServiceOrderIncome && m.Date.Month == pDate.Month && m.Date.Year == pDate.Year)
                        .SumAsync(m => (decimal?)m.Amount) ?? 0;

                    var fix = await context.AccountingMovements
                        .AsNoTracking()
                        .Where(m => m.SourceType == MovementSourceType.FixedCostPayment && m.Date.Month == pDate.Month && m.Date.Year == pDate.Year)
                        .SumAsync(m => (decimal?)m.Amount) ?? 0;

                    var dir = await context.AccountingMovements
                        .AsNoTracking()
                        .Where(m => m.SourceType == MovementSourceType.DirectCost && m.Date.Month == pDate.Month && m.Date.Year == pDate.Year)
                        .SumAsync(m => (decimal?)m.Amount) ?? 0;

                    var paidOrders = await context.AccountingMovements
                        .AsNoTracking()
                        .Where(m => m.SourceType == MovementSourceType.ServiceOrderIncome && m.Date.Month == pDate.Month && m.Date.Year == pDate.Year && m.ServiceOrderId != null)
                        .Select(m => m.ServiceOrderId!.Value)
                        .ToListAsync();

                    var hon = await context.ServiceOrderDistributions
                        .AsNoTracking()
                        .Where(d => paidOrders.Contains(d.ServiceOrderId) && d.DistributionConcept.Name.Contains("Honorario"))
                        .SumAsync(d => (decimal?)d.ExpectedAmount) ?? 0;

                    var resMes = inc - (fix + dir + hon);
                    runningBalance += resMes;

                    items.Add(new
                    {
                        periodo,
                        ingresos = inc,
                        gastosFijos = fix,
                        gastosDirectos = dir,
                        honorarios = hon,
                        resultadoMes = resMes,
                        saldoAcumulado = runningBalance
                    });
                }

                return Results.Ok(items);
            }
        });

        // 5. Aging de Gastos Fijos por Vencer
        group.MapGet("/fixed-costs-aging", async (GeoServDbContext context) =>
        {
            var today = DateTime.UtcNow.Date;

            var pendingPayments = await context.FixedCostPayments
                .AsNoTracking()
                .Where(p => !p.IsPaid)
                .ToListAsync();

            var vencidos = pendingPayments.Where(p => p.DueDate.Date < today).ToList();
            var b0_7 = pendingPayments.Where(p => p.DueDate.Date >= today && p.DueDate.Date <= today.AddDays(7)).ToList();
            var b8_15 = pendingPayments.Where(p => p.DueDate.Date > today.AddDays(7) && p.DueDate.Date <= today.AddDays(15)).ToList();
            var b16_30 = pendingPayments.Where(p => p.DueDate.Date > today.AddDays(15) && p.DueDate.Date <= today.AddDays(30)).ToList();

            var buckets = new[]
            {
                new { range = "Vencido", count = vencidos.Count, totalAmount = vencidos.Sum(p => p.Amount), color = "#ef4444" },
                new { range = "0-7 días", count = b0_7.Count, totalAmount = b0_7.Sum(p => p.Amount), color = "#f97316" },
                new { range = "8-15 días", count = b8_15.Count, totalAmount = b8_15.Sum(p => p.Amount), color = "#f59e0b" },
                new { range = "16-30 días", count = b16_30.Count, totalAmount = b16_30.Sum(p => p.Amount), color = "#3b82f6" }
            };

            return Results.Ok(new
            {
                buckets,
                totalPendingAmount = pendingPayments.Sum(p => p.Amount),
                totalCount = pendingPayments.Count
            });
        });

        // 6. Proyección de Egresos Comprometidos (30/60/90 días)
        group.MapGet("/committed-expenses-projection", async (GeoServDbContext context) =>
        {
            var today = DateTime.UtcNow.Date;

            var pending = await context.FixedCostPayments
                .AsNoTracking()
                .Where(p => !p.IsPaid && p.DueDate.Date >= today)
                .ToListAsync();

            var p30 = pending.Where(p => p.DueDate.Date <= today.AddDays(30)).Sum(p => p.Amount);
            var p60 = pending.Where(p => p.DueDate.Date > today.AddDays(30) && p.DueDate.Date <= today.AddDays(60)).Sum(p => p.Amount);
            var p90 = pending.Where(p => p.DueDate.Date > today.AddDays(60) && p.DueDate.Date <= today.AddDays(90)).Sum(p => p.Amount);

            return Results.Ok(new
            {
                projection30d = p30,
                projection60d = p60,
                projection90d = p90,
                totalCommitted = p30 + p60 + p90
            });
        });

        // 7. Rentabilidad por Orden de Servicio (Ranking Top/Bottom 10)
        group.MapGet("/service-orders-profitability", async (DateTime? startDate, DateTime? endDate, GeoServDbContext context) =>
        {
            var query = context.ServiceOrders
                .AsNoTracking()
                .Where(o => o.Status.Name != "Cancelada")
                .Include(o => o.Client)
                .Include(o => o.ServiceType)
                .Include(o => o.DirectCosts)
                .AsQueryable();

            if (startDate.HasValue)
                query = query.Where(o => o.CreatedAt >= startDate.Value);
            if (endDate.HasValue)
                query = query.Where(o => o.CreatedAt <= endDate.Value);

            var orders = await query.ToListAsync();

            var calculated = orders.Select(o =>
            {
                var income = o.TotalAmount;
                var directCosts = o.DirectCosts.Sum(d => d.TotalAmount);
                var profit = income - directCosts;
                var marginPercentage = income > 0 ? Math.Round((profit / income) * 100, 1) : 0;

                return new
                {
                    o.Id,
                    o.OrderNumber,
                    clientName = o.Client.CompanyName,
                    serviceTypeName = o.ServiceType.Name,
                    income,
                    directCosts,
                    profit,
                    marginPercentage
                };
            }).ToList();

            var topOrders = calculated.OrderByDescending(x => x.profit).Take(10).ToList();
            var bottomOrders = calculated.OrderBy(x => x.profit).Take(10).ToList();

            return Results.Ok(new
            {
                topOrders,
                bottomOrders,
                totalAnalyzed = calculated.Count
            });
        });

        // 8. Distribución de Ingresos y Honorarios
        group.MapGet("/distribution-summary", async (DateTime? startDate, DateTime? endDate, GeoServDbContext context) =>
        {
            var query = context.ServiceOrderDistributions
                .AsNoTracking()
                .Include(d => d.DistributionConcept)
                .Include(d => d.ServiceOrder)
                .AsQueryable();

            if (startDate.HasValue)
                query = query.Where(d => d.ServiceOrder.CreatedAt >= startDate.Value);
            if (endDate.HasValue)
                query = query.Where(d => d.ServiceOrder.CreatedAt <= endDate.Value);

            var distributions = await query.ToListAsync();

            var byConcept = distributions
                .GroupBy(d => d.DistributionConcept.Name)
                .Select(g => new
                {
                    conceptName = g.Key,
                    expectedAmount = g.Sum(d => d.ExpectedAmount),
                    actualAmount = g.Sum(d => d.ActualAmount)
                })
                .OrderByDescending(x => x.expectedAmount)
                .ToList();

            return Results.Ok(new
            {
                byConcept,
                totalExpected = byConcept.Sum(x => x.expectedAmount),
                totalActual = byConcept.Sum(x => x.actualAmount)
            });
        });

        // 9. Costos por Categoría y Proveedor
        group.MapGet("/direct-costs-breakdown", async (DateTime? startDate, DateTime? endDate, GeoServDbContext context) =>
        {
            var query = context.DirectCosts
                .AsNoTracking()
                .Include(d => d.Category)
                .Include(d => d.Provider)
                .Include(d => d.ServiceOrder)
                .AsQueryable();

            if (startDate.HasValue)
                query = query.Where(d => d.ServiceOrder.CreatedAt >= startDate.Value);
            if (endDate.HasValue)
                query = query.Where(d => d.ServiceOrder.CreatedAt <= endDate.Value);

            var costs = await query.ToListAsync();
            var totalDirect = costs.Sum(c => c.TotalAmount);

            var byCategory = costs
                .GroupBy(c => c.Category.Name)
                .Select(g => new
                {
                    categoryName = g.Key,
                    totalAmount = g.Sum(c => c.TotalAmount),
                    percentage = totalDirect > 0 ? Math.Round((g.Sum(c => c.TotalAmount) / totalDirect) * 100, 1) : 0
                })
                .OrderByDescending(x => x.totalAmount)
                .ToList();

            var byProvider = costs
                .Where(c => c.Provider != null)
                .GroupBy(c => c.Provider!.Name)
                .Select(g => new
                {
                    providerName = g.Key,
                    totalAmount = g.Sum(c => c.TotalAmount),
                    count = g.Count()
                })
                .OrderByDescending(x => x.totalAmount)
                .Take(10)
                .ToList();

            return Results.Ok(new
            {
                totalAmount = totalDirect,
                byCategory,
                byProvider
            });
        });

        // 10. Evolución de Gastos Fijos por Categoría
        group.MapGet("/fixed-costs-evolution", async (int? months, GeoServDbContext context) =>
        {
            var numMonths = months.HasValue && months.Value > 0 ? months.Value : 12;
            var sinceDate = DateTime.UtcNow.AddMonths(-numMonths);

            var payments = await context.FixedCostPayments
                .AsNoTracking()
                .Where(p => p.IsPaid && p.PaymentDate != null && p.PaymentDate >= sinceDate)
                .Include(p => p.FixedCostItem)
                    .ThenInclude(i => i.Category)
                .ToListAsync();

            var result = payments
                .GroupBy(p => new { Periodo = p.PaymentDate!.Value.ToString("yyyy-MM"), CategoryName = p.FixedCostItem.Category.Name })
                .Select(g => new
                {
                    periodo = g.Key.Periodo,
                    categoryName = g.Key.CategoryName,
                    amount = g.Sum(p => p.Amount)
                })
                .OrderBy(x => x.periodo)
                .ToList();

            return Results.Ok(result);
        });

        // 11. Valoración y Compras de Activos
        group.MapGet("/assets-valuation", async (DateTime? startDate, DateTime? endDate, GeoServDbContext context) =>
        {
            var assets = await context.Assets
                .AsNoTracking()
                .ToListAsync();

            var historicalAssetsTotal = assets.Sum(a => a.PurchasePrice);

            var movementsQuery = context.AccountingMovements
                .AsNoTracking()
                .Where(m => m.SourceType == MovementSourceType.AssetPurchase)
                .AsQueryable();

            if (startDate.HasValue)
                movementsQuery = movementsQuery.Where(m => m.Date >= startDate.Value);
            if (endDate.HasValue)
                movementsQuery = movementsQuery.Where(m => m.Date <= endDate.Value);

            var periodPurchases = await movementsQuery.SumAsync(m => (decimal?)m.Amount) ?? 0;

            var recentAssets = assets
                .OrderByDescending(a => a.PurchaseDate)
                .Take(5)
                .Select(a => new
                {
                    a.Id,
                    a.Name,
                    a.PurchaseDate,
                    a.PurchasePrice,
                    description = a.Description
                })
                .ToList();

            return Results.Ok(new
            {
                periodPurchasesTotal = periodPurchases,
                historicalAssetsTotal,
                recentAssets
            });
        });
    }
}
