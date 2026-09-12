## ADDED Requirements

### Requirement: Marcar Orden de Servicio como Entregada desde el Listado
El sistema MUST permitir a los usuarios marcar una Orden de Servicio como entregada directamente desde la tabla de listado general, agilizando el flujo operativo y garantizando la consistencia de fechas y trazabilidad.

- **Disponibilidad y Visibilidad**: La opción "Marcar como entregada" MUST aparecer en la columna de acciones exclusivamente para aquellas órdenes cuyo estado actual sea `"Iniciada"`. Para órdenes en cualquier otro estado (Alta, Presupuestada, Aprobada, Entregada, Cobrada, Cancelada) el botón no debe renderizarse ni estar disponible.
- **Confirmación Obligatoria**: Al presionar la acción, el sistema MUST desplegar un diálogo modal de confirmación advirtiendo al usuario que la orden pasará a estado "Entregada" y se completarán las fechas reales correspondientes.
- **Asignación Automática de Fechas Reales**:
  - Si la orden no posee fecha de entrega real (`actualEndDate`), el sistema MUST asignarle automáticamente la fecha actual.
  - Si la orden no posee fecha de inicio real (`actualStartDate`), el sistema MUST asignarle la fecha de inicio presupuestada (`estimatedStartDate`). Si esta última tampoco estuviera definida, se tomará la fecha actual.
- **Actualización de Estado**: El estado de la orden MUST actualizarse a `"Entregada"`.
- **Registro en Bitácora y Trazabilidad**: El sistema MUST registrar automáticamente una observación en el historial (`ServiceOrderObservation`) con el tipo `Hito Clave` y el usuario autenticado, indicando que la orden fue marcada como entregada junto con las fechas reales de inicio y entrega asignadas.
- **Validación de Integridad**: Si la orden no cumple con los requisitos mínimos de integridad para el estado "Entregada" (cliente asignado, proyecto asignado, al menos un responsable en el equipo de trabajo, montos presupuestado y total mayores a cero), la operación MUST ser rechazada informando al usuario el motivo específico.

#### Scenario: Visualización del botón solo en estado Iniciada
- **WHEN** el usuario visualiza el listado de órdenes de servicio
- **THEN** la acción "Marcar como entregada" solo es visible en las filas de órdenes con estado "Iniciada"

#### Scenario: Confirmación y transición exitosa a Entregada
- **WHEN** el usuario confirma la acción en una orden en estado "Iniciada" que no tiene fechas reales cargadas
- **THEN** la orden actualiza su estado a "Entregada", asigna la fecha actual a "Fin Real", asigna el "Inicio Presupuestado" a "Inicio Real", registra un "Hito Clave" en la bitácora y refresca la lista

#### Scenario: Orden con fecha de fin real previa
- **WHEN** el usuario confirma marcar como entregada una orden en estado "Iniciada" que ya contaba con una fecha de fin real válida
- **THEN** el sistema conserva la fecha de fin real existente sin sobrescribirla con la fecha actual y actualiza el estado a "Entregada"

#### Scenario: Rechazo por orden incompleta
- **WHEN** el usuario intenta marcar como entregada una orden en estado "Iniciada" que no posee proyecto asignado o equipo de trabajo
- **THEN** el sistema rechaza la operación, no modifica los datos y muestra una notificación indicando los datos obligatorios faltantes
