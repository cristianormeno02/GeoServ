## Why

En el módulo de Registro de Insumos (`/insumos`), al abrir el modal de historial de movimientos de stock para un insumo, la tabla no muestra los movimientos existentes de forma inmediata debido a un problema de reactividad y detección de cambios con Angular Material Table; únicamente se visualizaban los movimientos tras registrar un nuevo movimiento manual.
Por otro lado, en el listado principal de Órdenes de Servicio (`/ordenes-servicio`), únicamente se expone la columna del monto presupuestado, impidiendo a los usuarios comparar y visualizar de manera ágil el monto efectivamente cobrado sin tener que ingresar al detalle individual de cada orden.

## What Changes

- **Historial de Movimientos de Insumos**: Se actualiza `InventoryHistoryDialogComponent` para utilizar `MatTableDataSource` (o disparar la detección de cambios / refresco de filas) inmediatamente tras la carga asíncrona de movimientos desde la API, garantizando que el listado de movimientos se visualice al instante al abrir el diálogo.
- **Listado de Órdenes de Servicio**: Se incorpora la columna "Cobrado" (`collectedAmount`) en la tabla de `ServiceOrderListComponent` (en `displayedColumns` y en el template HTML), aprovechando que la API backend ya provee este valor en el endpoint `GET /api/service-orders` y que la interfaz TypeScript ya contempla dicha propiedad.

## Capabilities

### New Capabilities
<!-- No se introducen nuevas capacidades maestras -->

### Modified Capabilities
- `inventory-ui`: Se actualiza el requerimiento de consulta de historial de stock para garantizar que la tabla renderice los movimientos de inmediato al abrir el diálogo modal sin requerir interacción adicional.
- `service-orders`: Se incorpora el requerimiento de visualización del monto cobrado en la tabla del listado de órdenes de servicio, junto con el monto presupuestado.

## Impact

- **Frontend**:
  - `frontend/src/app/features/consumables/components/inventory-history-dialog/inventory-history-dialog.component.ts`: Manejo del datasource del listado de movimientos con detección de cambios adecuada.
  - `frontend/src/app/features/service-orders/components/service-order-list/service-order-list.component.ts`: Inclusión de `collectedAmount` en `displayedColumns`.
  - `frontend/src/app/features/service-orders/components/service-order-list/service-order-list.component.html`: Adición de la columna `collectedAmount` con formato de moneda y ajuste del `colspan` en `*matNoDataRow`.
- **Backend / APIs**: Sin cambios necesarios; el endpoint `GET /api/service-orders` ya devuelve `collectedAmount`.
- **Dependencias**: Sin nuevas dependencias.
