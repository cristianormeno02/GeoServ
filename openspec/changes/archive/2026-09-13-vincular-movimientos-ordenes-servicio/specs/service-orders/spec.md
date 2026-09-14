## MODIFIED Requirements

### Requirement: Monto Cobrado
El formulario financiero de la OS DEBE incluir el campo numérico **"Monto Cobrado"** (`CollectedAmount`).
- Este campo es **independiente** del "Total Final" (`TotalAmount`): representa lo efectivamente cobrado al cliente, no el monto presupuestado.
- Se usa para disparar la lógica de distribución real de ingresos (regla de los tercios/porcentajes).
- El campo debe aplicar el formato numérico local argentino (separador de miles con punto, decimales con coma).
- **Modalidad Configurable**: La editabilidad del campo depende del parámetro de empresa `os_collected_amount_mode`:
  - En modalidad `Manual`, el usuario puede ingresar y modificar libremente el monto cobrado desde el formulario.
  - En modalidad `Automatic`, el campo es de solo lectura (no editable) en la interfaz de usuario, y la API bloquea modificaciones manuales para preservar el valor calculado a partir de los movimientos financieros de ingreso asociados.

#### Scenario: Edición de monto cobrado en modo manual
- **WHEN** la empresa tiene configurada la modalidad `Manual`
- **THEN** el usuario puede editar directamente el campo Monto Cobrado en la Orden de Servicio y guardarlo

#### Scenario: Bloqueo de edición de monto cobrado en modo automático
- **WHEN** la empresa tiene configurada la modalidad `Automatic`
- **THEN** el campo Monto Cobrado se muestra no editable / solo lectura en el formulario y cualquier valor manual enviado en la actualización de la orden es ignorado por la API

## ADDED Requirements

### Requirement: Sincronización Automática de Cobros desde Movimientos Contables
En modalidad automática, el monto cobrado (`CollectedAmount`) de una Orden de Servicio DEBE ser igual a la sumatoria exacta de los montos de todos los movimientos contables de ingreso (`IsIncome == true`) asociados a dicha orden (`ServiceOrderId == order.Id`).
- Al registrar un nuevo movimiento de ingreso vinculado a una OS, el sistema DEBE actualizar automáticamente `CollectedAmount` de la orden sumando dicho importe.
- Al editar un movimiento contable (modificación de importe, cambio de tipo ingreso/egreso o cambio de OS asociada), el sistema DEBE recalcular y persistir el `CollectedAmount` de todas las órdenes involucradas.
- Al eliminar físicamente un movimiento contable vinculado a una OS, el sistema DEBE recalcular y actualizar el `CollectedAmount` de la orden descontando el movimiento suprimido.

#### Scenario: Registro de un cobro vinculado a una OS
- **WHEN** se crea un movimiento de ingreso por $50.000 vinculado a la orden OS-001
- **THEN** el campo `CollectedAmount` de OS-001 se actualiza automáticamente incrementándose en $50.000

#### Scenario: Reasignación de orden en un movimiento contable
- **WHEN** un movimiento de cobro de $20.000 cambia su vinculación de OS-001 a OS-002
- **THEN** `CollectedAmount` de OS-001 disminuye en $20.000 y `CollectedAmount` de OS-002 aumenta en $20.000

#### Scenario: Eliminación física de un movimiento de cobro
- **WHEN** se elimina físicamente un movimiento de cobro de $30.000 asociado a la orden OS-001
- **THEN** `CollectedAmount` de OS-001 se recalcula reflejando la deducción de $30.000

### Requirement: Transición Automática a Estado Cobrada y Asignación de Fecha de Cobro
El ciclo de vida de la Orden de Servicio DEBE transicionar automáticamente a estado **"Cobrada"** únicamente cuando la orden esté en estado **"Entregada"** y el monto cobrado acumulado cubra la totalidad del total presupuestado (`CollectedAmount >= TotalAmount`).
- **Fecha de Cobro (`CollectionDate`)**: Al transicionar a "Cobrada", el sistema DEBE establecer la fecha de cobro con la fecha del primer movimiento de cobro registrado (`Min(Date)` de los movimientos vinculados).
- **Cobros Previos al Entregar**: Si una orden en estado "Iniciada" recibe pagos o anticipos que cubren el total presupuestado, la orden permanecerá "Iniciada" hasta que operativamente sea marcada como "Entregada"; al marcarse como "Entregada", detectará que `CollectedAmount >= TotalAmount` y transicionará automáticamente a "Cobrada" con la fecha de su primer cobro.
- **Cobros Parciales**: Si una orden está en estado "Entregada" pero registra cobros parciales (`0 < CollectedAmount < TotalAmount`), la orden DEBE permanecer en estado "Entregada" registrando el monto acumulado.
- **Reversión por Eliminación o Modificación a la Baja**: Si una orden se encuentra en estado "Cobrada" y por eliminación física o modificación de movimientos el monto acumulado desciende por debajo del total (`CollectedAmount < TotalAmount`), el sistema DEBE revertir automáticamente el estado de la orden a **"Entregada"** y limpiar el campo `CollectionDate` (asignándolo en `null`).

#### Scenario: Cobro total sobre orden entregada
- **WHEN** una orden OS-001 está en estado "Entregada" con total de $100.000 y se registra un movimiento de cobro que completa los $100.000
- **THEN** el estado de OS-001 cambia automáticamente a "Cobrada" y `CollectionDate` se fija en la fecha del primer cobro

#### Scenario: Cobro parcial sobre orden entregada
- **WHEN** una orden OS-001 está en estado "Entregada" con total de $100.000 y se registra un cobro de $40.000
- **THEN** la orden acumula `CollectedAmount = 40000` pero su estado permanece en "Entregada"

#### Scenario: Entrega de orden con cobro anticipado completo
- **WHEN** una orden en estado "Iniciada" con cobros previos acumulados que cubren el 100% es marcada como "Entregada"
- **THEN** la orden pasa a estado "Cobrada" y su `CollectionDate` queda fijada con la fecha del primer cobro registrado

#### Scenario: Reversión automática a Entregada por eliminación de cobro
- **WHEN** se elimina físicamente un movimiento de cobro de una orden en estado "Cobrada" provocando que `CollectedAmount < TotalAmount`
- **THEN** el estado de la orden vuelve automáticamente a "Entregada" y `CollectionDate` pasa a ser null

### Requirement: Registro en Bitácora de Cada Cobro Vinculado

Toda alta, edición o eliminación de un movimiento contable de ingreso vinculado a una Orden de Servicio DEBE generar una observación de tipo `"Hito Clave"` en la bitácora de la orden, independientemente de si la operación dispara o no una transición de estado.

- **Alta de cobro**: Se registra una observación indicando el monto del cobro y la fecha del movimiento.
- **Edición de cobro**: Se registra una observación indicando el importe anterior y el nuevo importe.
- **Eliminación de cobro**: Se registra una observación indicando el monto eliminado y el `CollectedAmount` resultante.

#### Scenario: Observación al registrar un cobro
- **WHEN** se crea un movimiento de ingreso de $50.000 vinculado a la orden OS-001
- **THEN** se agrega una observación de tipo "Hito Clave" en la bitácora de OS-001 indicando el cobro registrado

#### Scenario: Observación al eliminar un cobro
- **WHEN** se elimina un movimiento de cobro de $30.000 asociado a la orden OS-001
- **THEN** se agrega una observación de tipo "Hito Clave" en la bitácora de OS-001 indicando el cobro eliminado y el nuevo `CollectedAmount`

### Requirement: Desglose de Movimientos de Cobro en la Orden de Servicio
El sistema DEBE proveer en la vista y edición de la Orden de Servicio una sección o tabla informativa que liste todos los movimientos contables de ingreso vinculados a la orden.
- Cada fila DEBE mostrar: Fecha, Monto, Cuenta Financiera (Caja/Banco), Medio de Pago y Descripción.
- Debe incluir un totalizador que coincida con `CollectedAmount`.

#### Scenario: Visualización de movimientos asociados
- **WHEN** el usuario visualiza el detalle o formulario de una Orden de Servicio que registra cobros
- **THEN** el sistema presenta la tabla con el desglose de movimientos de ingreso vinculados y el total consolidado
