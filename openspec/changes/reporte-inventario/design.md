## Context

Se requiere transformar `inventario.component.ts` en un reporte ejecutivo. El sistema ya cuenta con `ConsumableService` y la estructura de datos en el backend que provee la información necesaria (Insumos, stock actual, stock mínimo, costos, unidades).

## Goals / Non-Goals

**Goals:**
- Proveer una vista rápida y analítica del estado del inventario.
- Reutilizar servicios y componentes existentes (`ConsumableService`, `InventoryHistoryDialogComponent`).
- Facilitar la exportación de los datos a CSV/Excel de forma sencilla.

**Non-Goals:**
- Crear nuevos endpoints en el backend (se utilizarán los existentes que ya alimentan el CRUD o el Dashboard).
- Modificar el comportamiento de la gestión de stock (altas, bajas, ajustes), que seguirá manejándose en el CRUD correspondiente.

## Decisions

- **Estructura UI:** Se utilizarán Angular Material Cards para los KPIs superiores y una `mat-table` con `mat-paginator` y `mat-sort` para el Data Grid, manteniendo la consistencia con el diseño de la aplicación.
- **Cálculo de KPIs:** Los cálculos (Valor Total, Insumos Críticos) se procesarán en el frontend tras recibir el listado, garantizando que los filtros aplicados por el usuario actualicen instantáneamente los KPIs.
- **Indicadores de Estado:** Se usará semaforización basada en: `stock === 0` (Agotado/Rojo), `stock <= stock_minimo` (Crítico/Amarillo), y mayor al mínimo (Normal/Verde).
- **Exportación:** Se implementará una exportación básica a CSV generada directamente en el frontend usando `Blob` para evitar dependencias innecesarias o carga en el backend, o se usará una librería existente si ya está configurada en el proyecto.

## Risks / Trade-offs

- **Risk:** Volumen de datos grande puede ralentizar el procesamiento en frontend.
  - **Mitigation:** Si el listado de insumos crece, se deberá delegar el filtrado y cálculo de KPIs al backend. Actualmente el volumen permite hacerlo in-memory sin impacto perceptible.
- **Risk:** Dato de Stock Mínimo.
  - **Mitigation:** En el Dashboard se muestra el stock mínimo. Si no está en el listado base, se enriquecerá o solicitará para asegurar que el semáforo funcione correctamente.
