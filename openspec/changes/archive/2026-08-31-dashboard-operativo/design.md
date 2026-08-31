## Context

El sistema GeoServ gestiona órdenes de servicio, inventario, costos y facturación bajo una arquitectura multitenant donde cada tenant posee su propia base de datos SQL Server. Para el Dashboard Operativo, se requiere consultar información agregada proveniente de diversas entidades (`ServiceOrder`, `ServiceOrderStatus`, `ServiceOrderResponsible`, `InventoryMovement`, `Consumable`, `FixedCostPayment`).

## Goals / Non-Goals

**Goals:**
- Proveer endpoints de lectura independientes y eficientes bajo `/api/dashboard/operational/` que respondan en menos de 200ms para bases de datos medianas.
- Crear componentes Angular de visualización reutilizables (`sparkline-card`, `gauge-chart`, `donut-chart`, `aging-bar-chart`, `horizontal-bar-chart`) con estilo de BI moderno (un solo eje Y, paleta semántica estandarizada).
- Implementar la configuración de capacidad operativa máxima y cálculo dinámico de stock mínimo e inventario crítico.

**Non-Goals:**
- Transacciones de escritura desde los widgets del dashboard (los widgets solo leen y proveen enlaces hacia pantallas de detalle).
- Notificaciones push en segundo plano o WebSockets.
- Gráficos complejos con múltiples escalas o doble eje Y.

## Decisions

1. **Endpoints de lectura desacoplados por widget vs. Endpoint monolítico**:
   - *Decisión*: Se implementan endpoints independientes para cada widget (`/kpis`, `/team-capacity`, `/deadline-compliance`, `/orders-by-service-type`, `/workload-by-responsible`, `/stagnant-orders`, `/aging-uncollected-orders`, `/inventory-alerts`, `/upcoming-fixed-costs`).
   - *Razón*: Permite que el frontend cargue los widgets de forma asíncrona (mostrando esqueletos de carga por widget), maneje errores aislados sin romper la pantalla entera y posibilita refrescos parciales o automáticos con diferente frecuencia.
   - *Alternativa descartada*: Endpoint único `/api/dashboard/operational/summary` que ejecute todas las consultas simultáneamente, lo cual provocaría bloqueos y retrasaría toda la pantalla si una consulta compleja demora.

2. **Capacidad del equipo en `EmpresaConfiguracion`**:
   - *Decisión*: Almacenar `OPERATIONAL_CAPACITY_MAX_ORDERS` en la tabla clave-valor `EmpresaConfiguracion`.
   - *Razón*: Evita alterar esquemas rígidos y permite a cada tenant ajustar su umbral operativo desde el módulo de configuración existente sin migraciones adicionales.

3. **Cálculo de Stock en Tiempo Real con `InventoryMovement`**:
   - *Decisión*: Calcular el stock de cada insumo mediante `SUM(InventoryMovement.Cantidad)` agrupado por `ConsumableId` y compararlo con `Consumable.MinimumStock`.
   - *Razón*: Se alinea con el principio de ledger inmutable de stock definido en el cambio de inventario, garantizando consistencia absoluta sin duplicación de saldos en la tabla principal.

4. **Componentes visuales desacoplados en Angular**:
   - *Decisión*: Crear una suite de componentes standalone reutilizables en `src/app/shared/components/charts/` utilizando SVG/Canvas nativo o Chart.js encapsulado.
   - *Razón*: Garantiza que otros módulos del sistema puedan reutilizar medidores (gauges), sparklines o gráficos de aging sin acoplarse a la lógica del dashboard.

## Risks / Trade-offs

- **[Riesgo]** Degradación de rendimiento al calcular `SUM(InventoryMovement.Cantidad)` en catálogos con cientos de miles de movimientos.
  - *Mitigación*: Asegurar índice compuesto `IX_InventoryMovements_ConsumableId_Fecha` en la base de datos y filtrar consumibles activos.
- **[Riesgo]** Falta de fechas de cambio de estado histórico en órdenes creadas antes de auditoría detallada.
  - *Mitigación*: Usar `UpdatedAt` o `CreatedAt` de `ServiceOrder` como fallback seguro para el cálculo de antigüedad en estado actual.

## Migration Plan

1. Generar migración EF Core `AddMinimumStockToConsumable` para agregar la columna `MinimumStock` en `Consumables`.
2. Insertar configuración por defecto `OPERATIONAL_CAPACITY_MAX_ORDERS = 50` en `EmpresaConfiguracion` si no existe.
3. Desplegar endpoints en backend y componentes en frontend.
4. Rollback: La columna `MinimumStock` puede ser nullable o con valor por defecto 0; no produce cambios destructivos.
