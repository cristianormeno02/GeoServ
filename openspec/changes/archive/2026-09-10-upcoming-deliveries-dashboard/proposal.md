## Why

El equipo de operaciones necesita visibilidad anticipada y clara sobre las órdenes de servicio pendientes de entrega respecto a su fecha pactada (`EstimatedEndDate`), clasificadas por nivel de urgencia temporal (≤ 7 días en rojo, 8 a 14 días en amarillo, 15 a 30 días en verde). Actualmente el dashboard operativo supervisa órdenes estancadas por inactividad y cobranza posterior a la entrega, pero carece de un monitor preventivo que alerte de forma proactiva sobre compromisos de entrega próximos a vencer para evitar retrasos con los clientes.

## What Changes

- **Nuevo endpoint de distribución de vencimientos**: `/api/dashboard/operational/upcoming-deliveries`, que clasifica las órdenes no entregadas (`Status` distinto de "Entregada", "Cobrada" y "Cancelada") con `EstimatedEndDate` en rangos semaforizados:
  - **Crítico / ≤ 7 días** (incluyendo vencidas): Rojo (`#ef4444`).
  - **Alerta / 8 a 14 días**: Amarillo / Ámbar (`#f59e0b`).
  - **A tiempo / 15 a 30 días**: Verde (`#10b981`).
  - **Plazo mayor / > 30 días**: Neutro / Informativo (`#64748b` o `#0284c7`).
- **Endpoint de listado / detalle interactivo**: Soporte para consultar el listado paginado de órdenes correspondientes a cada franja para alimentar el diálogo modal interactivo.
- **Widget visual en Dashboard Operativo**: Incorporación de un gráfico de barras horizontales por rangos (Aging Preventivo de Entregas) en la interfaz del dashboard operativo, consistente con el diseño visual del sistema.
- **Interacción y navegación**: Al hacer clic en un rango o barra, se despliega el modal con la grilla de órdenes (Nº Orden, Cliente, Tipo de Servicio, Fecha Estimada de Entrega, Días Restantes) con enlace directo para ver la orden.

## Capabilities

### New Capabilities

### Modified Capabilities

- `dashboard-operativo`: Se amplía la especificación para incorporar el monitoreo preventivo de órdenes no entregadas según su fecha presupuestada de entrega con clasificación en rangos semaforizados (≤ 7 días en rojo, 8-14 días en amarillo, 15-30 días en verde) y la visualización interactiva de su detalle.

## Impact

- **Backend**:
  - `GeoServ.Api/Endpoints/OperationalDashboardEndpoints.cs`: Nuevas rutas `/upcoming-deliveries` y `/upcoming-deliveries/details` (o extensión de `/kpis/{kpi_id}/details`).
  - `GeoServ.Api.Tests/OperationalDashboardKpisTests.cs`: Nuevas pruebas unitarias y de integración para validar la lógica de cálculo y filtros de estado.
- **Frontend**:
  - `models/operational-dashboard.model.ts`: Modelos de datos para `UpcomingDeliveriesBucket` y `UpcomingDeliveryOrder`.
  - `services/operational-dashboard.service.ts`: Métodos `getUpcomingDeliveries()` y `getUpcomingDeliveriesDetails()`.
  - `operational-dashboard.component.ts` y `operational-dashboard.component.html`: Integración del nuevo componente de barras y vinculación con modal de detalle.
- **Base de Datos**: Ninguna migración necesaria. Utiliza las entidades y campos existentes `ServiceOrder.EstimatedEndDate`, `ServiceOrder.StatusId`, `ServiceOrderStatus`, etc.
