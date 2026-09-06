## MODIFIED Requirements

### Requirement: Consulta de Historial de Stock
El usuario SHALL poder visualizar de forma inmediata el desglose temporal de movimientos que justifican el stock actual de un insumo al abrir el modal de historial, sin requerir acciones secundarias ni el registro previo de nuevos movimientos.

#### Scenario: Visualización del historial
- **WHEN** un usuario hace clic en el botón de historial ("Historial Stock" o "Ver Historial") sobre la fila de un insumo en el registro de insumos o inventario
- **THEN** se abre el diálogo de historial y la tabla muestra de manera inmediata y automática la lista cronológica de movimientos registrados para ese insumo (compras, ajustes, consumos), detallando fecha, tipo, cantidad y motivo.
