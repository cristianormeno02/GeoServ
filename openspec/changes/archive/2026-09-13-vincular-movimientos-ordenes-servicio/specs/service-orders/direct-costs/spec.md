## ADDED Requirements

### Requirement: Categorías de Costo Directo Asignables vía Movimientos
El sistema DEBE permitir configurar en cada Categoría de Costo Directo (`DirectCostCategory`) si la misma puede ser imputada a una Orden de Servicio a través de movimientos contables de egreso, mediante la propiedad booleana `IsAssignableViaMovement`.
- El valor por defecto DEBE ser `false`.
- El mantenedor de Categorías de Costo Directo (en backend y frontend) DEBE permitir visualizar y editar esta propiedad.

#### Scenario: Categoría marcada como asignable vía movimiento
- **WHEN** el usuario edita o crea una categoría de costo directo y activa la opción "Asignable vía movimiento"
- **THEN** la categoría queda habilitada para ser seleccionada al registrar movimientos de egreso vinculados a órdenes de servicio

### Requirement: Asignación y Consolidación de Costos Directos desde Movimientos de Egreso
Al registrar un movimiento contable de egreso con categoría vinculada a costo directo (`LinkedSourceType == DirectCost`), el sistema DEBE requerir que el usuario seleccione una categoría de costo directo que tenga `IsAssignableViaMovement == true` y la Orden de Servicio a la que se imputa el gasto (reemplazando la búsqueda de filas individuales de costo directo).
- **Aislamiento de Filas Manuales y Consolidación Estricta**: La búsqueda y consolidación en la Orden de Servicio DEBE operar exclusivamente sobre filas con `IsFromMovement == true` (`ServiceOrderId == orderId && CategoryId == categoryId && IsFromMovement == true`). Las filas de la misma categoría que hayan sido cargadas previamente de forma manual (`IsFromMovement == false`) NO DEBEN ser adoptadas, alteradas ni sobrescritas.
- **Creación de nueva fila contable**: Si la Orden de Servicio seleccionada no posee ninguna fila con `IsFromMovement == true` para dicha categoría, el sistema DEBE crear automáticamente un nuevo registro en `DirectCost` para esa orden con:
  - `CategoryId`: la categoría seleccionada.
  - `Description`: la descripción del movimiento (o el nombre de la categoría si está vacía).
  - `Quantity`: 1.
  - `Unit`: unidad de medida por defecto "unidad".
  - `UnitPrice`: el importe del movimiento contable.
  - `TotalAmount`: el importe del movimiento contable.
  - `Date`: fecha del movimiento contable.
  - `Status`: "Pagado".
  - `IsFromMovement`: `true`.
- **Consolidación en fila contable existente**: Si la Orden de Servicio ya posee una fila con `IsFromMovement == true` para esa categoría:
  - El sistema DEBE calcular la sumatoria de todos los movimientos de egreso asociados a esa categoría para dicha orden.
  - El sistema DEBE actualizar dicho registro de `DirectCost` asignando a `UnitPrice` y `TotalAmount` el valor de la sumatoria consolidada, actualizando la `Date` con la fecha del último movimiento imputado y fijando su estado en "Pagado".
- **Vínculo del Movimiento**: El `AccountingMovement` DEBE quedar vinculado con `ServiceOrderId` de la orden y `DirectCostId` del registro de costo directo creado o consolidado.

#### Scenario: Creación de fila contable conviviendo con fila manual previa
- **WHEN** la orden OS-001 ya tiene un costo manual de "Combustible" (\$50.000, 50 litros, IsFromMovement = false) y se registra un movimiento de egreso por \$35.000 para esa categoría y orden
- **THEN** la fila manual previa permanece inalterada y se crea una nueva fila de costo directo por \$35.000 con `IsFromMovement = true` y estado "Pagado"

#### Scenario: Consolidación de múltiples egresos contables
- **WHEN** la orden OS-001 ya tiene una fila contable de "Combustible" por \$35.000 (`IsFromMovement = true`) y se registra un segundo movimiento de egreso por \$15.000 para esa misma categoría y orden
- **THEN** la fila contable existente en OS-001 se actualiza con `UnitPrice = 50000` y `TotalAmount = 50000`

### Requirement: Protección Integral de Costos Directos Originados en Movimientos
Las filas de Costo Directo en una Orden de Servicio que hayan sido generadas o sincronizadas a partir de movimientos contables (`IsFromMovement == true`) DEBEN ser estrictamente de solo lectura en el formulario y detalle de la Orden de Servicio.
- **Campos Protegidos**: El usuario NO DEBE poder modificar `Description`, `Date`, `Quantity`, `Unit`, `UnitPrice`, `TotalAmount` ni `Status`.
- **Acciones Protegidas**: Las acciones de editar y eliminar manualmente dicha fila en la tabla de la OS DEBEN estar deshabilitadas o bloqueadas tanto en la interfaz de usuario como en la API `PUT /api/service-orders/{id}`.
- **Distintivo Visual**: Cada fila con `IsFromMovement == true` DEBE exhibir un badge distintivo ("Vía Movimientos") con ícono diferenciado y un estilo de fila diferenciado (borde de acento), y sus acciones de editar/eliminar DEBEN reemplazarse por un ícono de candado con tooltip explicativo del motivo del bloqueo.

#### Scenario: Bloqueo de acciones y edición en la orden de servicio
- **WHEN** el usuario visualiza o intenta guardar la grilla de costos directos de la OS
- **THEN** las filas con `IsFromMovement == true` muestran sus acciones de edición y borrado bloqueadas y sus valores no son alterados por el guardado del formulario

#### Scenario: Identificación visual de una fila vía movimiento
- **WHEN** el usuario visualiza la grilla de costos directos de una orden que tiene una fila con `IsFromMovement == true`
- **THEN** dicha fila exhibe el badge "Vía Movimientos", un ícono de candado en lugar de los botones de editar/eliminar, y un estilo de fila diferenciado del resto

### Requirement: Desglose de Subtotales por Origen en la Grilla de Costos Directos

La grilla de Costos Directos de la Orden de Servicio DEBE mostrar en su pie de tabla el desglose de subtotales agrupados por origen: "Costo Manual" (suma de filas con `IsFromMovement == false`), "Costo Vía Movimientos" (suma de filas con `IsFromMovement == true`) y "Costo Directo Total" (suma de ambos).

#### Scenario: Visualización de subtotales por origen
- **WHEN** la orden OS-001 tiene costos directos manuales por \$20.000 y costos directos vía movimiento por \$35.000
- **THEN** el pie de tabla de Costos Directos exhibe "Costo Manual: \$20.000", "Costo Vía Movimientos: \$35.000" y "Costo Directo Total: \$55.000"

### Requirement: Sincronización de Costos Directos por Modificación o Eliminación de Movimientos
Al modificar el importe, reasignar de orden o eliminar físicamente (`DELETE /api/movements/{id}`) un movimiento de egreso vinculado a un costo directo:
- El sistema DEBE recalcular la sumatoria de los movimientos de egreso restantes para la categoría y orden correspondientes.
- Si la suma resultante es mayor a 0, la fila de `DirectCost` (`IsFromMovement == true`) en la orden DEBE actualizar su importe (`UnitPrice = TotalAmount = nuevaSuma`).
- Si la suma resultante es igual a 0 (se eliminó el único movimiento o todos los movimientos contables de esa categoría en la orden), la fila de `DirectCost` (`IsFromMovement == true`) DEBE ser eliminada físicamente de la Orden de Servicio, sin afectar ninguna fila manual preexistente.

#### Scenario: Modificación del monto de un egreso
- **WHEN** un movimiento de egreso vinculado a "Combustible" en OS-001 pasa de \$35.000 a \$40.000
- **THEN** la fila contable de "Combustible" en OS-001 actualiza su total a \$40.000

#### Scenario: Eliminación física del único movimiento contable de la categoría
- **WHEN** se elimina el único movimiento de egreso contable de "Combustible" de la orden OS-001
- **THEN** la fila contable correspondiente a "Combustible" (`IsFromMovement == true`) es eliminada de OS-001, mientras que cualquier fila manual previa permanece intacta

### Requirement: Registro en Bitácora de Cada Pago de Costo Directo Vía Movimiento

Toda creación, consolidación o eliminación de una fila contable de `DirectCost` (`IsFromMovement == true`) originada por movimientos de egreso DEBE generar una observación de tipo `"Hito Clave"` en la bitácora de la Orden de Servicio.

- **Creación**: Se registra una observación indicando la categoría de costo directo y el monto imputado.
- **Consolidación**: Se registra una observación indicando la categoría y el nuevo monto acumulado.
- **Eliminación**: Se registra una observación indicando la categoría cuya fila fue eliminada por no quedar movimientos contables asociados.

#### Scenario: Observación al crear una fila de costo directo vía movimiento
- **WHEN** se registra el primer egreso de $35.000 para la categoría "Combustible" (asignable vía movimiento) en la orden OS-001
- **THEN** se agrega una observación de tipo "Hito Clave" en la bitácora de OS-001 indicando el pago de costo directo registrado

#### Scenario: Observación al eliminar la fila de costo directo
- **WHEN** se elimina el único movimiento de egreso de "Combustible" de la orden OS-001 y su fila contable es eliminada
- **THEN** se agrega una observación de tipo "Hito Clave" en la bitácora de OS-001 indicando que el costo directo de "Combustible" fue eliminado por no quedar movimientos asociados

### Requirement: Copia de Plantilla de Costos Directos sin Montos ni Vínculo a Movimientos

Al copiar costos directos desde otra Orden de Servicio (diálogo de copia de plantilla), el sistema DEBE tratar la operación como una copia de plantilla de ítems (categoría, descripción, proveedor), no como una copia de montos reales ni de vínculos contables.

- **Reseteo de montos y cantidades**: Cada fila copiada DEBE crearse con `Quantity = 1`, `Unit` = unidad por defecto "unidad", `UnitPrice = 0` y `TotalAmount = 0`, independientemente de los valores que tuviera en la orden origen.
- **Sin vínculo a movimientos**: Cada fila copiada DEBE crearse con `IsFromMovement = false` y sin ninguna referencia a movimientos contables de la orden origen.
- **Exclusión de filas originadas en movimientos**: Las filas de la orden origen con `IsFromMovement == true` NO DEBEN ofrecerse como opción en el listado de costos directos disponibles para copiar, ya que representan pagos reales vinculados a movimientos contables específicos de esa orden y no constituyen un ítem de plantilla reutilizable.
- **Campos que sí se copian**: `CategoryId`, `Description` y `ProviderId` (si aplica) se copian sin cambios, ya que forman parte de la plantilla de ítems.

#### Scenario: Copia de costo directo manual desde otra orden
- **WHEN** el usuario copia un costo directo manual de categoría "Materiales" (Cantidad 10, Precio Unitario \$500, Total \$5.000) desde la orden OS-001 hacia la orden OS-002
- **THEN** en OS-002 se crea una fila de "Materiales" con Cantidad 1, Unidad "unidad", Precio Unitario \$0 y Total \$0

#### Scenario: Exclusión de costos directos vía movimiento en el listado de copia
- **WHEN** el usuario abre el diálogo de copia de costos directos seleccionando como origen la orden OS-001, que tiene una fila de "Combustible" con `IsFromMovement == true`
- **THEN** dicha fila no aparece en el listado de costos disponibles para copiar hacia la orden destino
