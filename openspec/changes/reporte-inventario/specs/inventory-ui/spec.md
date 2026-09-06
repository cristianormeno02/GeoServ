## ADDED Requirements

### Requirement: Panel de Reporte Ejecutivo de Inventario
El sistema SHALL proveer una página principal de Inventario que funcione como un reporte de estado actual, mostrando métricas clave (KPIs) y una tabla consolidada con el stock valorizado de los insumos.

#### Scenario: Visualización de KPIs del inventario
- **WHEN** el usuario accede a la página de Inventario
- **THEN** el sistema muestra tarjetas superiores con el Valor Total del Inventario, la cantidad de Insumos Críticos (bajo mínimo), la cantidad de Insumos Agotados (stock cero) y el Total de Insumos Activos.

#### Scenario: Visualización de tabla de estado de stock
- **WHEN** el usuario accede a la página de Inventario
- **THEN** el sistema muestra una tabla de datos con la lista de insumos incluyendo su Clase, Stock Actual, Stock Mínimo, Unidad de Medida, Costo Unitario, y la Valorización Total (Stock Actual * Costo Unitario), junto con un indicador visual (semáforo) de su estado.

#### Scenario: Filtrado de datos del inventario
- **WHEN** el usuario ingresa texto en el buscador, selecciona una clase de insumo o elige un estado de stock
- **THEN** la tabla de datos y los KPIs se actualizan para reflejar únicamente la información de los insumos que coinciden con los filtros aplicados.

#### Scenario: Acceso rápido al historial de stock
- **WHEN** el usuario hace clic en la acción de historial en una fila de la tabla de reporte
- **THEN** el sistema abre el diálogo de historial de stock correspondiente al insumo de esa fila.
