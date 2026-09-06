## Why

Actualmente existe un CRUD para administrar Insumos (altas, bajas, ajustes de stock y valorización) pero carecemos de una vista gerencial y de reporte para el inventario completo. Es necesario proveer una página de "Inventario" que funcione como un panel de inteligencia de negocios (BI) y reporte, enfocándose en el análisis de los datos (costos inmovilizados, alertas de stock bajo y quiebres de stock) y no en la carga de datos, permitiendo a los supervisores tomar decisiones rápidamente.

## What Changes

- Transformación del componente vacío actual de `inventario.component.ts` en un reporte ejecutivo.
- Creación de un panel superior con KPIs clave: Valor Total del Inventario, Insumos Críticos, Insumos Agotados y Total de Insumos Activos.
- Implementación de una barra de filtros de búsqueda (por texto, clase de insumo, y estado de stock).
- Incorporación de la acción de Exportar (Excel/CSV).
- Creación de una tabla de datos (Data Grid) que consolida la foto actual: Insumo, Clase, Stock, Stock Mínimo (si aplica), Unidad, Costo Unitario, Valorización (Stock * Costo Unitario) y Estado visual mediante semáforos (Normal, Bajo Mínimo, Agotado).
- Reutilización del diálogo de historial de inventario (`InventoryHistoryDialogComponent`) accediendo desde las acciones de cada fila de la tabla.

## Capabilities

### New Capabilities

### Modified Capabilities
- `inventory-ui`: Se diseña y estructura la página de inventario como un reporte de estado de insumos con KPIs, tabla de datos y filtros.

## Impact

- Componente Frontend: `inventario.component.ts`, `inventario.component.html`, y `inventario.component.css`.
- Servicios: Integración con `ConsumableService` o endpoints similares para obtener el listado y cálculos.
- El cambio afecta solo a la interfaz de usuario de la sección Inventario. No requiere cambios a nivel backend ya que los datos de stock y costos de insumos ya existen.
