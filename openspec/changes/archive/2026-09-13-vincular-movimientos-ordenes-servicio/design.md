## Context

Ver `proposal.md` para motivación y alcance integral del cambio, y las especificaciones delta en `specs/service-orders/spec.md`, `specs/service-orders/direct-costs/spec.md` y `specs/empresa/configuracion/spec.md`.

El sistema cuenta con:
- `AccountingMovement`: entidad contable con soporte de tipo polimórfico (`SourceType = ServiceOrderIncome` y `SourceType = DirectCost`), vinculada a `ServiceOrder` mediante `ServiceOrderId` y a `DirectCost` mediante `DirectCostId`. La baja es física (hard-delete mediante `DeleteMovementAsync`).
- `DirectCostCategory`: catálogo de categorías de costos directos (`Id`, `Name`, `IsActive`).
- `DirectCost`: partidas de costos directos asociadas a una orden de servicio (`ServiceOrderId`, `CategoryId`, `Quantity`, `UnitId`, `UnitPrice`, `TotalAmount`, `Status`).
- `ServiceOrder`: entidad comercial/operativa que contiene `CollectedAmount`, `TotalAmount`, `StatusId`, `CollectionDate` y la colección `DirectCosts`.
- `EmpresaConfiguracion`: tabla de configuraciones dinámicas gestionada por `IEmpresaConfiguracionService`.

## Goals / Non-Goals

**Goals:**
- Sincronizar en tiempo real el campo `CollectedAmount` de las Órdenes de Servicio al crear, modificar o eliminar físicamente movimientos contables de ingreso asociados.
- Implementar la configuración `os_collected_amount_mode` para alternar entre carga manual y cálculo automático del monto cobrado.
- Automatizar la transición de estado a "Cobrada" al alcanzar el 100% de cobro sobre órdenes entregadas (y reversión a "Entregada" ante reducciones o eliminaciones).
- Reemplazar el flujo actual de egresos de costo directo (búsqueda de fila preexistente) por la selección directa de la categoría de costo directo asignable y la orden de servicio de destino.
- Crear o consolidar automáticamente las filas contables de `DirectCost` en la orden de servicio agrupadas por categoría, con unidad por defecto ("unidad"), cantidad 1, estado "Pagado" y flag `IsFromMovement = true`.
- Aplicar aislamiento total (Enfoque 1): la consolidación opera exclusivamente sobre filas con `IsFromMovement == true`, garantizando que ninguna fila manual previa (`IsFromMovement == false`) sea adoptada o sobrescrita.
- Proteger integralmente todos los campos y acciones de las filas de `DirectCost` contables en la orden de servicio.
- Eliminar físicamente la fila contable de `DirectCost` de la orden si la sumatoria de egresos de esa categoría desciende a \$0.
- Exponer utilidades administrativas y componentes visuales para desglose de cobros y recálculo masivo.

**Non-Goals:**
- No se restringe la carga de costos directos manuales en categorías tradicionales sin movimiento.
- No se modifican los gastos fijos ni las transferencias internas.

## Decisions

### 1. Parámetro de Empresa para Modalidad de Cobro
- **Decisión**: Clave `os_collected_amount_mode` en `EmpresaConfiguracion` (grupo `"Órdenes de Servicio"`), valores `"Manual"` y `"Automatic"`.

### 2. Sincronización Centralizada de Cobros (`SyncServiceOrderCollectionAsync`)
- **Lógica**:
  1. Si `os_collected_amount_mode == "Automatic"`:
     - `sum = SUM(Amount) WHERE ServiceOrderId == orderId AND IsIncome == true`.
     - `order.CollectedAmount = sum`.
     - `firstDate = MIN(Date) WHERE ServiceOrderId == orderId AND IsIncome == true`.
     - Transición a "Cobrada": si `order.Status.Name == "Entregada"` y `order.CollectedAmount >= order.TotalAmount` (con `TotalAmount > 0`), pasa a "Cobrada" y `CollectionDate = firstDate ?? DateTime.UtcNow.Date` con observación de Hito Clave.
     - Reversión a "Entregada": si `order.Status.Name == "Cobrada"` y `order.CollectedAmount < order.TotalAmount`, vuelve a "Entregada" y `CollectionDate = null` con observación de Hito Clave.

### 3. Modelo y Asignación de Costos Directos con Aislamiento Total (Enfoque 1)
- **Propiedades de entidad**:
  - `DirectCostCategory`: `public bool IsAssignableViaMovement { get; set; } = false;`
  - `DirectCost`: `public bool IsFromMovement { get; set; } = false;`
- **Mitigación del riesgo de Adopción Silenciosa (Enfoque 1)**:
  - En `SyncServiceOrderDirectCostAsync(serviceOrderId, directCostCategoryId)`:
    - La búsqueda de la fila existente se filtra estrictamente por:
      `c.ServiceOrderId == serviceOrderId && c.CategoryId == directCostCategoryId && c.IsFromMovement == true`
    - Si el usuario tenía filas manuales cargadas a mano en esa misma categoría (`IsFromMovement == false`), **nunca son tocadas, sobrescritas ni adoptadas**. Se crea una fila contable nueva e independiente con `IsFromMovement = true`.
- **Lógica de la sincronización**:
  - Calcula `sumEgresos = SUM(Amount) WHERE ServiceOrderId == serviceOrderId AND DirectCost.CategoryId == directCostCategoryId AND IsIncome == false`.
  - Si `sumEgresos > 0`:
    - Si existe la fila contable (`IsFromMovement == true`):
      - `existing.UnitPrice = sumEgresos`.
      - `existing.TotalAmount = sumEgresos`.
      - `existing.Date = lastMovementDate`.
      - `existing.Status = "Pagado"`.
    - Si NO existe la fila contable:
      - Crea un nuevo `DirectCost` con `Quantity = 1`, `UnitId = unidadDefault.Id`, `UnitPrice = sumEgresos`, `TotalAmount = sumEgresos`, `Status = "Pagado"`, `IsFromMovement = true`, `Date = lastMovementDate`.
  - Si `sumEgresos == 0`:
    - Si existe la fila contable (`IsFromMovement == true`), se elimina físicamente de la base de datos para no dejar filas en \$0. Cualquier fila manual previa (`IsFromMovement == false`) permanece intacta.

### 4. Ciclo de Vida en Endpoints de Movimientos (`AccountingMovementEndpoints.cs`)
- **`POST /api/movements`**:
  - Valida `IsIncome == category.IsIncome`.
  - Si es ingreso vinculado a OS: ejecuta `SyncServiceOrderCollectionAsync(orderId)`.
  - Si es egreso de costo directo: ejecuta `SyncServiceOrderDirectCostAsync(orderId, directCostCategoryId)` y asigna `DirectCostId`.
- **`PUT /api/movements/{id}`**:
  - Captura `oldServiceOrderId = movement.ServiceOrderId` y `oldDirectCostId = movement.DirectCostId`.
  - Si cambian importes o entidades vinculadas, ejecuta las sincronizaciones tanto para la combinación anterior como para la nueva.
- **`DELETE /api/movements/{id}`**:
  - Realiza hard-delete del movimiento.
  - Sincroniza la orden para cobros (recalculando `CollectedAmount`) y para costos directos (recalculando importe o eliminando la fila contable si queda en \$0).

### 5. Protección en Orden de Servicio (Backend y Frontend)
- En `PUT /api/service-orders/{id}`:
  - Preserva `order.CollectedAmount` contra sobrescritura manual si el modo es `Automatic`.
  - En la sincronización de costos directos de la orden: las filas con `IsFromMovement == true` son excluidas de modificaciones o eliminaciones disparadas por el formulario web.
- En frontend (`service-order-form`):
  - El campo `collectedAmount` pasa a `readonly` / deshabilitado con tooltip en modo `Automatic`.
  - En la tabla de Costos Directos, las filas con `isFromMovement == true` tienen sus botones de editar y eliminar reemplazados por un icono de candado (`lock`) con tooltip explicativo, exhiben un badge distintivo *"Vía Movimientos"* con icono `sync_alt`, estilo de fila diferenciado (borde acento) y en el pie de tabla se desglosan los subtotales: *Costo Manual*, *Costo Vía Movimientos* y *Costo Directo Total*.

### 6. Reemplazo del Flujo de Egresos en Diálogo de Movimientos (Opción C)
- Se retira el diálogo `DirectCostSearchDialogComponent` (búsqueda de filas individuales).
- Al seleccionar una categoría con `LinkedSourceType == DirectCost`:
  - La interfaz de `movimiento-form.component.ts` despliega:
    1. Selector desplegable de `DirectCostCategory` (filtrado únicamente con `isAssignableViaMovement == true`).
    2. Campo de búsqueda de `ServiceOrder` (reutilizando `ServiceOrderSearchDialogComponent`).
  - Al guardar, el backend crea/actualiza la fila contable en la orden seleccionada y vincula el movimiento con `ServiceOrderId` y `DirectCostId`.

### 7. Utilidad de Sincronización Masiva
- `POST /api/service-orders/recalculate-collections`:
  - Recorre cada orden de forma secuencial y transaccional independiente para aislar fallos y no bloquear tablas.
  - Recalcula sumatorias de cobros y costos directos históricos.

### 8. Registro Integral en Bitácora de Hitos
- **Decisión**: Toda alteración del `CollectedAmount` o de una fila de `DirectCost` originada por un movimiento contable (alta, edición o eliminación) DEBE generar una `ServiceOrderObservation` con `ObservationType = "Hito Clave"`, además de (no en reemplazo de) las observaciones ya previstas para las transiciones de estado "Entregada"/"Cobrada".
- **Alcance**: Aplica a `SyncServiceOrderCollectionAsync` y `SyncServiceOrderDirectCostAsync`, invocadas desde `POST`, `PUT` y `DELETE /api/movements/{id}` y desde el recálculo masivo (`recalculate-collections`, agrupando en una sola observación resumen por orden en vez de una por movimiento histórico).
- **Textos de observación**:
  - Alta de cobro: *"Se registró un cobro de \$X vinculado a la orden (Movimiento: {descripción}, Fecha: {fecha})."*
  - Edición de cobro (cambio de importe u orden): *"Se actualizó un cobro vinculado a la orden: \$X → \$Y."*
  - Baja de cobro: *"Se eliminó un cobro de \$X vinculado a la orden. Monto cobrado actualizado: \$Z."*
  - Alta de costo directo vía movimiento (fila nueva): *"Se registró un pago de costo directo de \$X para la categoría '{categoría}' (vía movimiento)."*
  - Consolidación de costo directo (fila existente): *"Se actualizó el costo directo de '{categoría}' a \$X tras un movimiento de egreso."*
  - Baja de costo directo (fila eliminada por quedar en \$0): *"Se eliminó el costo directo de '{categoría}' por no quedar movimientos contables asociados."*
- **Usuario de la observación**: se registra con el `UserId` del usuario autenticado que ejecuta la operación sobre el movimiento (mismo criterio de fallback ya usado en `DeliverServiceOrderAsync` si no hay contexto de usuario, ej. en el recálculo masivo).
- **Razón**: Da trazabilidad completa en la bitácora de la orden sobre el origen de cada variación de `CollectedAmount` y de cada costo directo imputado automáticamente, no solo sobre los cambios de estado, cerrando la asimetría de auditoría entre el flujo de ingresos y el de egresos.

### 9. Corrección de la Copia de Plantilla de Costos Directos
- **Contexto**: `openCopyDirectCostsDialog()` en `service-order-form.component.ts` (líneas ~952-987) hoy copia cada `DirectCost` de la orden origen con un spread `{...cost, id: nuevoGuid, serviceOrderId}`, trasladando tal cual `Quantity`, `UnitPrice`, `TotalAmount`, `Unit`, etc. `CopyDirectCostsDialogComponent` trae las filas vía `DirectCostService.getCostsByOrder(order.id)` sin ningún filtro.
- **Decisión**:
  - Modificar `CopyDirectCostsDialogComponent` para excluir del listado seleccionable las filas con `isFromMovement == true` de la orden origen.
  - Modificar el mapeo en `openCopyDirectCostsDialog()` para que, en lugar de propagar todos los campos, cada fila copiada se cree explícitamente con `quantity = 1`, `unitId = unidadDefault.Id`, `unitPrice = 0`, `totalAmount = 0`, `isFromMovement = false`, conservando únicamente `categoryId`, `description` y `providerId` de la fila origen.
- **Razón**: La función de copia está pensada como una plantilla de ítems a presupuestar/cargar en la nueva orden, no como una réplica de montos ya pagados en otra orden; y las filas `isFromMovement == true` son pagos reales atados a movimientos contables de la orden origen, sin sentido como plantilla reutilizable ni como réplica editable en la orden destino.
- **Alcance**: Cambio acotado a la función de copia existente; no afecta la carga manual individual de costos directos ni la sincronización vía movimientos ya descripta en las Decisiones 3 y 6.

## Risks / Trade-offs

- **[Riesgo] Concurrencia optimista y recálculo masivo**: `ServiceOrder` no cuenta con `RowVersion`.
  - *Mitigación*: Procesamiento transaccional individual por orden en sincronización masiva y dentro de la misma transacción para movimientos unitarios.
- **[Riesgo] Reasignación de orden o categoría en movimiento**:
  - *Mitigación*: Se comparan explícitamente los valores anteriores con los nuevos en `PUT /api/movements/{id}`, actualizando ambas órdenes y categorías afectadas.
- **[Riesgo] Ausencia de unidad "unidad" en catálogo**:
  - *Mitigación*: Búsqueda tolerante en `Units` (por nombre "unidad", "u" o primera activa) con creación automática fallback si no existiera ninguna unidad.
- **[Riesgo] Eliminación de orden con movimientos contables**:
  - *Mitigación*: La restricción `DeleteBehavior.Restrict` en las FKs hacia `ServiceOrders` y `DirectCosts` impide borrados accidentales de órdenes con registros contables existentes.

## Migration Plan

1. Crear y aplicar migración EF Core para `DirectCostCategories.IsAssignableViaMovement` y `DirectCosts.IsFromMovement`.
2. Registrar configuración `os_collected_amount_mode = "Manual"` en `EmpresaConfiguraciones`.
3. Al desplegar, habilitar las categorías de costo directo deseadas para carga vía movimiento.
4. Si se desea, cambiar la modalidad de cobro a `Automatic` y ejecutar la sincronización masiva desde la pantalla de configuración.
