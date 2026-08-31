## Why

El equipo operativo y de gestión de GeoServ necesita responder de forma inmediata y confiable a dos interrogantes cotidianas clave: **"¿cómo está la carga de trabajo hoy?"** y **"¿dónde hay riesgo inminente de atraso o pérdida de dinero por descuido?"**. Actualmente, el estado de las órdenes en curso, las trabas o estancamientos en etapas operativas, las entregas pendientes de facturación/cobro, el stock crítico de insumos y los vencimientos inmediatos de costos fijos se hallan dispersos en múltiples pantallas y listados. Esto dificulta la priorización diaria y eleva el riesgo operativo.

## What Changes

Se implementa el **Dashboard Operativo** como un panel centralizado de Business Intelligence (estilo Qlik/Power BI) compuesto por widgets y endpoints de lectura independientes y desacoplados:

- **Widgets y Endpoints de Lectura Independientes**:
  1. **KPI Cards con Sparkline**:
     - *Órdenes activas*: total actual + tendencia de los últimos N períodos (default 6).
     - *Órdenes estancadas*: cantidad de órdenes que superan el umbral de permanencia + tendencia.
     - *Entregadas sin cobrar*: órdenes en estado entregado/completado sin cobro total + tendencia.
     - *Insumos bajo stock mínimo*: cantidad de ítems críticos bajo stock mínimo + tendencia.
  2. **Gauge "Capacidad del equipo"**:
     - Medidor semicircular que compara `Órdenes Activas / Capacidad Máxima Configurable` expresado como porcentaje.
     - Capacidad máxima configurable a nivel de empresa/tenant en `EmpresaConfiguracion` (clave `OPERATIONAL_CAPACITY_MAX_ORDERS`).
  3. **Gauge "Cumplimiento de plazos"**:
     - Medidor semicircular que refleja el `%` de órdenes activas cuyo tiempo transcurrido en el estado actual no supera el umbral esperado definido por `ServiceType` (o configuración general de la empresa).
  4. **Dona "Órdenes por tipo de servicio"**:
     - Gráfico de dona con la distribución proporcional y conteo de órdenes activas por cada `ServiceType`.
  5. **Carga de trabajo por responsable**:
     - Gráfico de barras horizontales con la cantidad de órdenes activas asignadas a cada responsable a través de `ServiceOrderResponsible`.
  6. **Listado de Órdenes Estancadas**:
     - Tabla paginable con las órdenes cuya permanencia en su estado actual supera el umbral parametrizado por `ServiceType`, ordenada descendentemente por días de estancamiento.
  7. **Aging de "Entregadas sin cobrar"**:
     - Gráfico de barras por rango de antigüedad (0-7 días, 8-15 días, 16-30 días, +30 días) desde la fecha de entrega (`ActualEndDate`), complementado con tabla paginable con la antigüedad exacta ordenada descendentemente.
  8. **Monitoreo de Inventario**:
     - Listado de insumos cuyo stock consolidado (`SUM(InventoryMovement.Cantidad)`) se encuentra por debajo de `StockMinimo` (`Consumable.MinimumStock`).
     - Gráfico/resumen de volumen de movimientos tipo `AjusteNegativo` del período agrupados por `Motivo`.
  9. **Costos Fijos Próximos a Vencer**:
     - Listado de registros `FixedCostPayment` en estado `Pendiente` cuya `FechaVencimiento` cae dentro de los próximos N días parametrizables (default 15 días).

- **Cambios en el Modelo de Datos**:
  - Incorporación del campo `MinimumStock` (`decimal`, default 0) en la entidad `Consumable`.
  - Inclusión de parámetros en `EmpresaConfiguracion`:
    - `OPERATIONAL_CAPACITY_MAX_ORDERS`: Capacidad operativa máxima del equipo.
    - `OPERATIONAL_DEFAULT_STAGNANT_DAYS`: Días por defecto para considerar una orden estancada si el tipo de servicio no lo especifica.

- **Criterios Visuales y Componentes Frontend**:
  - Creación de componentes reutilizables en Angular: `sparkline-card`, `gauge-chart`, `donut-chart`, `aging-bar-chart` y `horizontal-bar-chart`.
  - Gráficos estrictamente basados en un **único eje Y** (sin ejes duales).
  - Colores semánticos estándar: verde (óptimo / bajo control), amarillo (atención / alerta temprana), rojo (riesgo / crítico / desvío).

- **Decisiones de Diseño**:
  - *Endpoints desacoplados*: Cada widget consulta su propio endpoint de lectura ligero (`/api/dashboard/operational/*`), permitiendo cargas asíncronas, reintentos independientes y estrategias de caché diferenciadas.
  - *Aislamiento Multitenant*: Cada consulta resuelve la conexión de base de datos correspondiente al tenant actual mediante `ITenantService`, garantizando estanqueidad total de datos.
  - *Paginación en listados largos*: Los listados de órdenes estancadas y entregadas sin cobrar implementan paginación en servidor (`page`, `pageSize`).

- **Fuera de Alcance (Non-Goals)**:
  - Edición o mutación de estados de órdenes de servicio directamente desde el dashboard (el dashboard solo provee links de navegación al detalle de la orden).
  - Alertas push o WebSockets en tiempo real (la actualización se realiza mediante recarga de página o botón de refresco manual).
  - Capacidad máxima personalizada por responsable individual (se mantiene a nivel global del tenant para esta versión).

## Capabilities

### New Capabilities
- `dashboard-operativo`: Especificación completa del Dashboard Operativo, incluyendo endpoints de métricas, widgets de BI (gauges, KPIs con sparklines, aging, donas) y monitoreo de plazos, capacidad, inventario y vencimientos.

### Modified Capabilities

## Impact

- **Backend**: Creación del archivo de endpoints `OperationalDashboardEndpoints.cs` con rutas bajo `/api/dashboard/operational/`. Consultas optimizadas con EF Core usando `.AsNoTracking()`.
- **Base de Datos**: Migración EF Core para agregar la columna `MinimumStock` en la tabla `Consumables`.
- **Frontend**: Nuevos componentes visuales reutilizables en `src/app/shared/components/charts/` y la vista principal en `src/app/features/dashboard-operativo/`.
