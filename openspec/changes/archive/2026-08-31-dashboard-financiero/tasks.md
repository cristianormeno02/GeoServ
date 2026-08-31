## 1. Prerequisitos y Vista SQL de Cobertura (Backend / Base de Datos)

- [x] 1.1 Verificar la existencia de `AccountingMovement` polimórfico (`SourceType`, `SourceId`), `vw_AccountingMovementDetail` y `ServiceOrderDistribution` en el esquema actual; si no están aplicados, ejecutar sus migraciones correspondientes.
- [x] 1.2 Diseñar el script SQL DDL para la vista `vw_MonthlyCoverageReport` con la función de ventana `SUM(ResultadoMes) OVER (ORDER BY Periodo ROWS UNBOUNDED PRECEDING)` y verificar su ejecución en SQL Server.
- [x] 1.3 Crear la migración EF Core `CreateMonthlyCoverageReportView` que contenga el DDL de la vista SQL `vw_MonthlyCoverageReport`.
- [x] 1.4 Crear la entidad keyless `MonthlyCoverageReport` en `GeoServ.Api.Domain.Entities` y configurarla en `GeoServDbContext.OnModelCreating()` con `.ToView("vw_MonthlyCoverageReport")`.

## 2. Read-Models y Consultas de Aplicación (Backend)

- [x] 2.1 Crear DTOs/Read-Models para los 11 widgets financieros (`FinancialKpisDto`, `MonthlyCoverageGaugeDto`, `AverageOrderMarginDto`, `MonthlyCoverageReportItemDto`, `FixedCostsAgingDto`, `CommittedExpensesProjectionDto`, `ServiceOrdersProfitabilityDto`, `DistributionSummaryDto`, `DirectCostsBreakdownDto`, `FixedCostsEvolutionDto`, `AssetsValuationDto`).
- [x] 2.2 Implementar consulta de KPI cards financieras (saldos por cuenta, ingresos del mes con serie sparkline, resultado neto y saldo acumulado con flag semántico).
- [x] 2.3 Implementar consulta para el Gauge de cobertura del mes `Ingresos / (Fijos + Directos + Honorarios)`.
- [x] 2.4 Implementar consulta para el Gauge de margen promedio por orden cobrada en los últimos N meses (default 3).
- [x] 2.5 Implementar consulta al DbSet `MonthlyCoverageReports` con filtro por rango de fechas (default últimos 12 meses) y orden cronológico.
- [x] 2.6 Implementar consulta de aging de gastos fijos pendientes en 4 rangos (`Vencido`, `0-7`, `8-15`, `16-30` días).
- [x] 2.7 Implementar consulta de proyección de egresos comprometidos a 30, 60 y 90 días desde hoy.
- [x] 2.8 Implementar consulta de ranking de rentabilidad Top/Bottom 10 por orden de servicio (`Ingreso - DirectCosts`).
- [x] 2.9 Implementar consulta de distribución de ingresos (`ServiceOrderDistribution`) agrupada por concepto y responsable con comparativa `MontoEsperado` vs. `MontoReal`.
- [x] 2.10 Implementar consulta de costos directos agrupados por `DirectCostCategory` (dona) y por `Provider` (ranking).
- [x] 2.11 Implementar consulta de evolución de costos fijos pagados agrupados por mes y por `FixedCostCategory`.
- [x] 2.12 Implementar consulta de compras de activos del período (`SourceType = AssetPurchase`) y valor acumulado total.

## 3. Endpoints de Aplicación (Backend)

- [x] 3.1 Crear `FinancialDashboardEndpoints.cs` y mapear el grupo `/api/dashboard/financial/` con autorización y resolución multitenant vía `ITenantService`.
- [x] 3.2 Exponer endpoints: `GET /kpis`, `GET /monthly-coverage-gauge`, `GET /average-order-margin`, `GET /monthly-coverage-report`.
- [x] 3.3 Exponer endpoints: `GET /fixed-costs-aging`, `GET /committed-expenses-projection`, `GET /service-orders-profitability`, `GET /distribution-summary`.
- [x] 3.4 Exponer endpoints: `GET /direct-costs-breakdown`, `GET /fixed-costs-evolution`, `GET /assets-valuation`.
- [x] 3.5 Verificar respuestas HTTP 200 y cálculo correcto de arrastre de saldo acumulado mediante archivo `.http` o pruebas de integración.

## 4. Componentes Visuales Reutilizables de BI (Frontend)

- [x] 4.1 Crear o reutilizar componente `ComboChartComponent` en Angular que permita renderizar barras agrupadas (Ingresos vs. Costos) y línea de Saldo Acumulado compartiendo **estrictamente un solo eje Y**.
- [x] 4.2 Reutilizar componentes `SparklineCardComponent`, `GaugeChartComponent`, `DonutChartComponent` y `AgingBarChartComponent` desarrollados en la suite común de gráficos.
- [x] 4.3 Implementar directiva o clase de color semántico para saldos financieros (verde positivo, rojo déficit).

## 5. Implementación de la Vista del Dashboard Financiero (Frontend)

- [x] 5.1 Crear servicio `FinancialDashboardService` en Angular para consultar los endpoints de `/api/dashboard/financial/*` con filtros de fecha globales y por widget.
- [x] 5.2 Crear componente principal `FinancialDashboardComponent` y registrar la ruta `/dashboard/financial` en `app.routes.ts` y en el menú de navegación.
- [x] 5.3 Maquetar el layout con Angular Material destacando en la sección superior el **Informe de Cobertura Mensual** en formato prominente (ancho completo o sección prioritaria), acompañado de las 4 KPI cards y los 2 Gauges de Cobertura y Margen.
- [x] 5.4 Maquetar la sección inferior con el Aging de gastos fijos, proyección a 30/60/90 días, tablas de rentabilidad Top/Bottom, distribución de ingresos, y gráficos de costos por categoría y activos.
- [x] 5.5 Incorporar selector de rango temporal global (ej. "Últimos 3 meses", "Últimos 6 meses", "Últimos 12 meses", "Año actual", "Personalizado") que actualice los widgets dependientes.
- [x] 5.6 Validar renderizado responsivo y comportamiento ante escenarios de datos vacíos o sin movimientos.
