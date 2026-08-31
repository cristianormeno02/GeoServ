## 1. Prerequisitos del Modelo y Migraciones

- [x] 1.1 Verificar existencia de `InventoryMovement` y `AccountingMovement` polimórfico en el esquema actual; de no existir, aplicar migraciones pendientes.
- [x] 1.2 Agregar propiedad `MinimumStock` (`decimal`, default 0) a la entidad `Consumable` y generar migración EF Core `AddMinimumStockToConsumable`.
- [x] 1.3 Agregar clave `OPERATIONAL_CAPACITY_MAX_ORDERS` en `EmpresaConfiguracion` con valor por defecto y verificar inserción mediante script/seed.

## 2. Read-Models y Consultas de Aplicación (Backend)

- [x] 2.1 Crear DTOs/Read-Models para los 9 widgets operativos (`OperationalKpisDto`, `TeamCapacityDto`, `DeadlineComplianceDto`, `OrdersByServiceTypeDto`, `WorkloadByResponsibleDto`, `StagnantOrderDto`, `AgingUncollectedOrdersDto`, `InventoryAlertsDto`, `UpcomingFixedCostsDto`).
- [x] 2.2 Implementar consulta LINQ optimizada para KPI cards con cálculo de tendencia histórica de los últimos N períodos (default 6) y verificar respuesta con test unitario o query directa.
- [x] 2.3 Implementar consulta de capacidad operativa comparando órdenes activas contra `EmpresaConfiguracion.OPERATIONAL_CAPACITY_MAX_ORDERS`.
- [x] 2.4 Implementar consulta de cumplimiento de plazos comparando tiempo de permanencia contra umbrales por `ServiceType`.
- [x] 2.5 Implementar consultas de agrupación: órdenes activas por `ServiceType` (dona) y órdenes activas por responsable vía `ServiceOrderResponsible` (barras horizontales).
- [x] 2.6 Implementar consulta paginada de órdenes estancadas con ordenamiento descendente por días de antigüedad.
- [x] 2.7 Implementar consulta de aging de órdenes entregadas sin cobrar en buckets (0-7, 8-15, 16-30, +30 días) más endpoint de listado paginado detallado.
- [x] 2.8 Implementar consulta de stock crítico (`SUM(InventoryMovement.Cantidad) < Consumable.MinimumStock`) y mermas por `AjusteNegativo` agrupadas por motivo.
- [x] 2.9 Implementar consulta de `FixedCostPayment` pendientes con vencimiento dentro de los próximos N días (default 15).

## 3. Endpoints de Aplicación (Backend)

- [x] 3.1 Crear `OperationalDashboardEndpoints.cs` y mapear el grupo de rutas `/api/dashboard/operational/` con autorización y resolución multitenant vía `ITenantService`.
- [x] 3.2 Exponer endpoints: `GET /kpis`, `GET /team-capacity`, `GET /deadline-compliance`, `GET /orders-by-service-type`, `GET /workload-by-responsible`.
- [x] 3.3 Exponer endpoints: `GET /stagnant-orders` (con paginación), `GET /aging-uncollected-orders` (resumen y detalle paginado), `GET /inventory-alerts`, `GET /upcoming-fixed-costs`.
- [x] 3.4 Verificar respuestas HTTP 200 y esquemas JSON correctos en todos los endpoints mediante `GeoServ.Api.http` o pruebas de integración.

## 4. Componentes Visuales Reutilizables de BI (Frontend)

- [x] 4.1 Instalar o configurar soporte de gráficos ligeros (ej. `chart.js` o SVG nativo) en `frontend/package.json` y verificar compilación limpia.
- [x] 4.2 Crear componente reutilizable `SparklineCardComponent` (tarjeta KPI con valor principal, variación y mini gráfico de tendencia al pie).
- [x] 4.3 Crear componente reutilizable `GaugeChartComponent` (medidor semicircular para ratios % contra capacidad máxima o plazos).
- [x] 4.4 Crear componente reutilizable `DonutChartComponent` (gráfico de dona con leyenda interactiva para distribución por categorías).
- [x] 4.5 Crear componente reutilizable `AgingBarChartComponent` (gráfico de barras por rangos de antigüedad de alerta con un solo eje Y).
- [x] 4.6 Crear componente reutilizable `HorizontalBarChartComponent` (barras horizontales para carga de trabajo por responsable).

## 5. Implementación de la Vista del Dashboard Operativo (Frontend)

- [x] 5.1 Crear servicio `OperationalDashboardService` en Angular para consumir los endpoints de `/api/dashboard/operational/*` de manera desacoplada con manejo de carga/errores por widget.
- [x] 5.2 Crear componente principal `OperationalDashboardComponent` y registrar ruta `/dashboard/operational` en `app.routes.ts` y en el menú de navegación.
- [x] 5.3 Maquetar el layout con Angular Material (grid responsivo estilo Qlik/Power BI): fila superior con 4 KPI cards, fila central con los 2 Gauges y el gráfico de dona, fila inferior con aging, barras de carga y tablas de alertas/vencimientos.
- [x] 5.4 Integrar botones de refresco individual por widget y refresco global del dashboard.
- [x] 5.5 Validar renderizado completo y comportamiento sin datos (estados vacíos) en navegador.
