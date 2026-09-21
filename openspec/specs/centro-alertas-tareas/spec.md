# centro-alertas-tareas Specification

## Purpose
TBD

## Requirements

### Requirement: Inbox Centralizado de Alertas
El sistema MUST proveer un Centro de Alertas y Tareas que consolide alertas operativas y financieras del tenant autenticado en una unica vista accionable.

Cada alerta MUST incluir tipo, titulo, descripcion, prioridad, estado de gestion, entidad origen, fecha relevante, monto relevante cuando aplique y acciones disponibles.

#### Scenario: Consulta de alertas del tenant
- **WHEN** un usuario autenticado accede al Centro de Alertas
- **THEN** el sistema muestra un listado consolidado de alertas correspondientes unicamente a su tenant y permisos.

#### Scenario: Tenant sin alertas activas
- **WHEN** no existen condiciones de alerta para el tenant
- **THEN** el sistema muestra un estado vacio claro sin errores.

### Requirement: Alertas de Ordenes de Servicio por Vencer
El sistema MUST detectar Ordenes de Servicio por vencer cuando posean `EstimatedEndDate` dentro de la ventana configurada y su estado no sea `Entregada`, `Cobrada` ni `Cancelada`.

#### Scenario: Orden proxima a vencer
- **WHEN** una OS activa posee fecha estimada de entrega dentro de los proximos 7 dias
- **THEN** el Centro de Alertas muestra una alerta con accion para ver la orden y, si corresponde, marcarla como entregada.

#### Scenario: Orden ya entregada excluida
- **WHEN** una OS tiene estado `Entregada`, `Cobrada` o `Cancelada`
- **THEN** no se genera alerta de OS por vencer aunque su `EstimatedEndDate` este dentro de la ventana.

### Requirement: Alertas de Ordenes Entregadas sin Cobrar
El sistema MUST detectar Ordenes de Servicio en estado `Entregada` cuyo saldo pendiente sea mayor a cero (`TotalAmount > CollectedAmount`).

#### Scenario: Orden entregada con saldo pendiente
- **WHEN** una OS entregada posee `TotalAmount` mayor que `CollectedAmount`
- **THEN** el Centro de Alertas muestra una alerta con monto pendiente y acciones para ver la orden, registrar cobro o crear movimiento vinculado.

#### Scenario: Orden cobrada excluida
- **WHEN** una OS posee estado `Cobrada` o `CollectedAmount >= TotalAmount`
- **THEN** no se genera alerta de entregada sin cobrar.

### Requirement: Alertas de Insumos Bajo Stock Minimo
El sistema MUST detectar insumos cuyo stock consolidado sea menor que su `MinimumStock`.

#### Scenario: Insumo bajo stock minimo
- **WHEN** el stock consolidado de un insumo es menor que su stock minimo configurado
- **THEN** el Centro de Alertas muestra una alerta con stock actual, stock minimo, deficit y accion para ver el insumo o inventario filtrado.

#### Scenario: Insumo con stock suficiente
- **WHEN** el stock consolidado de un insumo es mayor o igual a su stock minimo
- **THEN** no se genera alerta de stock minimo para ese insumo.

### Requirement: Alertas de Cheques Proximos a Vencimiento
El sistema MUST detectar cheques pendientes o activos cuya fecha de vencimiento se encuentre vencida o dentro de la ventana configurada.

#### Scenario: Cheque proximo a vencer
- **WHEN** un cheque pendiente vence dentro de los proximos 7 dias
- **THEN** el Centro de Alertas muestra una alerta con fecha de vencimiento, monto y accion para ver el cheque.

#### Scenario: Cheque ya gestionado excluido
- **WHEN** un cheque se encuentra pagado, cobrado, anulado o en un estado final equivalente
- **THEN** no se genera alerta de vencimiento para ese cheque.

### Requirement: Alertas de Gastos Fijos Pendientes
El sistema MUST detectar pagos de gastos fijos en estado pendiente cuya fecha de vencimiento este vencida o dentro de la ventana configurada.

#### Scenario: Gasto fijo pendiente vencido
- **WHEN** un pago de gasto fijo pendiente posee fecha de vencimiento anterior a la fecha actual
- **THEN** el Centro de Alertas muestra una alerta critica con accion para ver o pagar el gasto fijo.

#### Scenario: Gasto fijo pagado excluido
- **WHEN** un pago de gasto fijo ya fue marcado como pagado
- **THEN** no se genera alerta de gasto fijo pendiente.

### Requirement: Alertas de Ordenes Estancadas
El sistema MUST detectar Ordenes de Servicio activas cuya permanencia en el estado actual supere el umbral configurado por tipo de servicio o configuracion de empresa.

#### Scenario: Orden estancada
- **WHEN** una OS activa supera el umbral de dias permitido en su estado actual
- **THEN** el Centro de Alertas muestra una alerta con dias de estancamiento y accion para ver la orden.

#### Scenario: Orden dentro del umbral
- **WHEN** una OS activa no supera el umbral de permanencia de su estado actual
- **THEN** no se genera alerta de estancamiento.

### Requirement: Gestion de Estado de Alertas
El sistema MUST permitir marcar alertas como leidas, pospuestas o resueltas sin modificar la entidad origen salvo que el usuario ejecute una accion de negocio explicita.

#### Scenario: Marcar alerta como leida
- **WHEN** el usuario marca una alerta como leida
- **THEN** el sistema actualiza su estado de gestion y mantiene visible la alerta mientras la condicion de negocio siga activa.

#### Scenario: Resolver alerta por condicion de negocio
- **WHEN** la condicion que originaba una alerta deja de cumplirse
- **THEN** el sistema deja de mostrar la alerta como activa aunque no haya sido resuelta manualmente.

### Requirement: Acciones Directas por Tipo de Alerta
El sistema MUST exponer acciones directas segun tipo de alerta, entidad origen, estado actual y permisos del usuario.

#### Scenario: Accion de registrar cobro
- **WHEN** una alerta corresponde a una OS entregada sin cobrar y el usuario tiene permiso para crear movimientos
- **THEN** la alerta ofrece una accion para registrar cobro o crear movimiento con la OS precargada.

#### Scenario: Accion no permitida por rol
- **WHEN** el usuario no posee permiso para ejecutar una accion asociada a una alerta
- **THEN** el sistema no muestra la accion o la muestra deshabilitada con una explicacion clara.

### Requirement: Indicador Global de Alertas Pendientes
La interfaz MUST mostrar un indicador global de alertas pendientes en el layout principal, priorizando alertas criticas y altas no resueltas.

#### Scenario: Alertas criticas pendientes
- **WHEN** existen alertas criticas o altas no resueltas
- **THEN** el indicador global muestra el conteo pendiente y permite navegar al Centro de Alertas filtrado.

#### Scenario: Sin alertas pendientes
- **WHEN** no existen alertas criticas o altas activas
- **THEN** el indicador global no muestra conteo destacado o presenta estado neutro.
