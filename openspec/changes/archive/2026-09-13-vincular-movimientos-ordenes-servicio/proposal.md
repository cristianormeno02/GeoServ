## Why

Actualmente, tanto el monto cobrado de una Orden de Servicio (`collectedAmount`) como los Costos Directos (`DirectCost`) operan de forma aislada respecto a los Movimientos Financieros de caja/banco. Esto genera inconsistencias entre la contabilidad real y los datos operativos de las órdenes, demanda doble carga administrativa y carece de automatizaciones clave para el ciclo de vida de la orden.

Esta mejora unifica de forma integral la relación entre los Movimientos Financieros y las Órdenes de Servicio en ambos sentidos del flujo de fondos:
1. **Flujo de Ingresos (Cobros)**: Permite alternar entre carga manual o cálculo automático del monto cobrado a partir de movimientos de ingreso, automatizando la transición a estado "Cobrada" y la fijación de la fecha de cobro.
2. **Flujo de Egresos (Costos Directos)**: Reemplaza la búsqueda manual de filas individuales de costo directo por una imputación directa seleccionando la categoría de costo directo asignable y la orden de servicio, consolidando automáticamente los pagos reales en la orden con aislamiento total de las filas cargadas a mano.

## What Changes

### Gestión de Cobros (Ingresos)
- **Configuración de Modalidad de Cobro**: Se incorpora `os_collected_amount_mode` en `EmpresaConfiguracion` (`Manual` vs `Automatic`).
- **Control de Edición en OS**: En modo `Automatic`, el campo "Monto Cobrado" es no editable en frontend y `PUT /api/service-orders/{id}` protege el valor ignorando sobreescrituras manuales.
- **Sincronización de Cobros**: Al crear, modificar o eliminar físicamente movimientos de ingreso vinculados a una OS, se recalcula y persiste el `CollectedAmount`.
- **Transición Automática de Estados y Fecha de Cobro**:
  - Si la orden está "Entregada" y `CollectedAmount >= TotalAmount`, transiciona automáticamente a "Cobrada" con fecha del primer cobro (`Min(Date)`).
  - Al entregar una orden con cobro anticipado completo, transiciona inmediatamente a "Cobrada".
  - Si la orden está "Cobrada" y se elimina o reduce un cobro dejando saldo pendiente (`CollectedAmount < TotalAmount`), revierte automáticamente a "Entregada" y anula `CollectionDate` (`null`).
- **Desglose de Cobros en la OS**: Listado visual de cobros vinculados dentro del formulario/detalle de la orden.
- **Utilidad de Recálculo y Migración**: Endpoint administrativo y botón en configuración para sincronizar masivamente órdenes preexistentes.
- **Bitácora de Hitos**: Cada alta, edición o baja de un cobro vinculado a la orden queda registrada como observación tipo "Hito Clave", independientemente de si dispara o no un cambio de estado.

### Gestión de Costos Directos (Egresos)
- **Categorías de Costo Directo Asignables vía Movimiento**: En `DirectCostCategory`, se añade el flag `IsAssignableViaMovement` gestionable desde el CRUD de categorías de costos directos.
- **Reemplazo del Flujo de Egresos de Costo Directo**: Al registrar un egreso con categoría de costo directo (`LinkedSourceType == DirectCost`), se retira la búsqueda de filas individuales existentes y se reemplaza por la selección de una `DirectCostCategory` asignable (`IsAssignableViaMovement == true`) y la `ServiceOrder` de destino.
- **Creación / Consolidación con Aislamiento Total (Enfoque 1)**:
  - La consolidación opera exclusivamente sobre filas con `IsFromMovement == true`.
  - Si la orden no tiene una fila con `IsFromMovement == true` para esa categoría, se crea una nueva fila (cantidad 1, unidad "unidad", precio unitario e importe total igual al movimiento, estado "Pagado" y flag `IsFromMovement = true`).
  - Si ya existe una fila con `IsFromMovement == true` en la orden para esa categoría, se actualiza su importe consolidando la suma de todos los movimientos de egreso vinculados.
  - **Sin adopción silenciosa**: Las filas cargadas previamente a mano (`IsFromMovement == false`) se mantienen inalteradas e independientes.
- **Protección Integral en la OS**: Todos los campos de las filas generadas por movimientos (`Description`, `Date`, `Quantity`, `Unit`, `UnitPrice`, `TotalAmount`) y la acción de eliminar quedan protegidos contra edición manual en el formulario de la OS.
- **Sincronización por Eliminación / Modificación de Egresos**:
  - Si se reduce un movimiento, se actualiza la fila con la nueva sumatoria.
  - Si se elimina físicamente el movimiento y la suma resultante de esa categoría en la orden queda en \$0, se elimina físicamente la fila de `DirectCost` (`IsFromMovement == true`) de la orden de servicio.
- **Bitácora de Hitos**: Cada alta, consolidación o baja de una fila de costo directo vía movimiento queda registrada como observación tipo "Hito Clave" en la orden.
- **Corrección de la Copia de Plantilla de Costos Directos**: Al copiar costos directos desde otra orden, se excluyen las filas `IsFromMovement == true` de la orden origen (no constituyen plantilla reutilizable), y las filas copiadas se crean con cantidad 1, unidad "unidad", precio unitario y total en \$0 (ya no se replican los montos de la orden origen).

## Capabilities

### New Capabilities
<!-- No se crean capacidades maestras nuevas, se extienden las existentes -->

### Modified Capabilities
- `service-orders`: Actualización de requerimientos de `collectedAmount` para modo automático, transiciones automáticas bidireccionales ("Entregada" <-> "Cobrada"), asignación de fecha de cobro y visualización de cobros vinculados.
- `service-orders/direct-costs`: Reemplazo del flujo de vinculación por categoría asignable + orden, aislamiento total de filas manuales, consolidación automática por categoría, protección integral de campos y eliminación al restar a cero.
- `empresa/configuracion`: Parámetro de configuración `os_collected_amount_mode` y endpoint de recálculo masivo.

## Impact

- **Backend**:
  - `GeoServ.Api/Domain/Entities/DirectCostCategory.cs`: Nueva propiedad `IsAssignableViaMovement`.
  - `GeoServ.Api/Domain/Entities/DirectCost.cs`: Nueva propiedad `IsFromMovement`.
  - Migración EF Core para las nuevas propiedades de costos directos.
  - `GeoServ.Api/Endpoints/DirectCostMasterEndpoints.cs`: Soporte para `IsAssignableViaMovement` en CRUD de categorías de costo directo.
  - `GeoServ.Api/Endpoints/AccountingMovementEndpoints.cs`:
    - `POST /api/movements`: Sincronización de cobros (ingresos) y sincronización/creación de costos directos con aislamiento por `IsFromMovement == true` (egresos). Validación de `IsIncome == category.IsIncome`.
    - `PUT /api/movements/{id}`: Detección de cambio de orden vinculada (`oldServiceOrderId`), categoría o importe, recalculando ambas órdenes tanto para cobros como para costos directos.
    - `DELETE /api/movements/{id}`: Hard-delete con recálculo de cobros y recálculo/eliminación de fila de costo directo contable.
  - `GeoServ.Api/Endpoints/ServiceOrderEndpoints.cs`:
    - `PUT /api/service-orders/{id}`: Protección de `CollectedAmount` contra sobrescritura manual en modo automático, y protección de filas de `DirectCosts` con `IsFromMovement == true`.
    - `POST /api/service-orders/{id}/deliver`: Transición directa a "Cobrada" si ya registra cobro completo.
    - `GET /api/service-orders/{id}/movements`: Consulta de cobros vinculados.
    - `POST /api/service-orders/recalculate-collections`: Recálculo transaccional masivo por orden.
- **Frontend**:
  - `frontend/src/app/features/finance/movimientos/`: En egresos de costo directo, reemplazo del diálogo buscador de filas individuales por selectores de `DirectCostCategory` (filtradas por `isAssignableViaMovement`) y `ServiceOrder`.
  - `frontend/src/app/features/finance/categorias-costo-directo/`: Control para habilitar `isAssignableViaMovement`.
  - `frontend/src/app/features/service-orders/components/service-order-form/`:
    - Bloqueo de `collectedAmount` en modo `Automatic` y tabla de cobros vinculados.
    - En la tabla de Costos Directos, bloqueo de acciones de edición/eliminación y campos para filas con `isFromMovement == true` con badge indicador.
    - Corrección de `openCopyDirectCostsDialog()` para excluir filas `isFromMovement == true` y resetear cantidad/unidad/montos en las filas copiadas.
  - `frontend/src/app/features/service-orders/components/copy-direct-costs-dialog/`: Filtrado de filas `isFromMovement == true` en el listado de costos disponibles para copiar.
  - `frontend/src/app/features/empresa/`: Selector de modalidad de cobro y botón de sincronización masiva.
- **Base de Datos**: Migración para columnas `DirectCostCategories.IsAssignableViaMovement` y `DirectCosts.IsFromMovement`.
