## ADDED Requirements

### Requirement: Configuración de Modalidad de Monto Cobrado
El sistema DEBE permitir configurar el parámetro `os_collected_amount_mode` en la configuración de la empresa para determinar el origen del monto cobrado de las órdenes de servicio.
- Valores admitidos: `Manual` y `Automatic`.
- Valor por defecto: `Manual` para garantizar retrocompatibilidad con las instalaciones existentes.
- En modo `Manual`, la carga del monto cobrado se realiza directamente en la orden de servicio.
- En modo `Automatic`, el monto se calcula exclusivamente mediante la sumatoria de movimientos contables de ingreso asociados.

#### Scenario: Parámetro configurado en Manual
- **WHEN** el parámetro `os_collected_amount_mode` está configurado en `Manual`
- **THEN** el monto cobrado de la orden es editable en su formulario

#### Scenario: Parámetro configurado en Automatic
- **WHEN** el parámetro `os_collected_amount_mode` está configurado en `Automatic`
- **THEN** el monto cobrado de la orden es calculado por el sistema y no editable por el usuario

### Requirement: Recálculo y Sincronización Masiva de Cobros de Órdenes
El sistema DEBE proveer una función administrativa de recálculo masivo que procese todas las órdenes de servicio existentes de la empresa, actualizando su `CollectedAmount`, estado y fecha de cobro en función de los movimientos contables históricos de ingreso vinculados a cada orden.
- Para cada orden, calcula la suma de movimientos de ingreso vinculados (`IsIncome == true` y `ServiceOrderId == order.Id`).
- Si la suma difiere del `CollectedAmount` actual de la orden, actualiza el valor.
- Si la orden está en estado "Entregada" y la suma cubre el total de la orden, transiciona a estado "Cobrada" asignando como `CollectionDate` la fecha del movimiento de cobro más antiguo.

#### Scenario: Ejecución de sincronización masiva
- **WHEN** el administrador ejecuta la sincronización masiva de montos cobrados
- **THEN** todas las órdenes de servicio se actualizan con la sumatoria real de sus movimientos de ingreso y transicionan a "Cobrada" si cumplen las condiciones
