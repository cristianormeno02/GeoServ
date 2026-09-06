# inventory-ui Specification

## Purpose
Componentes visuales para acceder al libro de movimientos dinámico de cada insumo y para asentar operaciones manuales de inventario (mermas, consumos, ajustes).

## Requirements

### Requirement: Consulta de Historial de Stock
El usuario debe poder visualizar el desglose temporal de movimientos que justifican el stock actual de un insumo.

#### Scenario: Visualización del historial
- **WHEN** un usuario hace clic en "Ver Historial" sobre la fila de un Consumable
- **THEN** se abre un modal o pantalla secundaria que lista cronológicamente las compras, usos y ajustes aplicados a ese insumo específico, detallando responsable y cantidad afectada.

### Requirement: Registro manual de ajustes y consumos
El sistema debe proveer una vía para que el usuario documente salidas o entradas de inventario no ligadas estrictamente al flujo normal de compras y órdenes de servicio.

#### Scenario: Usuario registra consumo interno
- **WHEN** el usuario selecciona "Registrar Movimiento Manual" sobre un insumo, elige ConsumoInterno e ingresa la cantidad consumida
- **THEN** el sistema envía la petición de creación al backend (sin exigir Orden de Servicio ni Motivo adicional) y, tras el éxito, el stock visible del insumo disminuye.

#### Scenario: Usuario registra ajuste por rotura
- **WHEN** el usuario elige AjusteNegativo, el sistema exige ingresar un campo de texto obligatorio "Motivo"
- **THEN** si el motivo está vacío, el botón de guardado permanece deshabilitado o marca error de validación; si se completa, se envía la petición y se actualiza el stock visible.

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
