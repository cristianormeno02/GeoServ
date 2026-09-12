## Context

Ver `proposal.md` y `specs/service-orders/spec.md`.
GeoServ gestiona el ciclo de vida de las Órdenes de Servicio mediante una API REST en ASP.NET Core (`ServiceOrderEndpoints.cs`) y una aplicación frontend en Angular standalone (`ServiceOrderListComponent`).
Las órdenes en estado "Entregada" están sujetas a reglas de integridad estrictas (`ValidateServiceOrderRules`), exigiendo que existan fechas de inicio y fin real, cliente, proyecto, equipo asignado y montos mayores a cero.

## Goals / Non-Goals

**Goals:**
- Proveer un endpoint dedicado `POST /api/service-orders/{id}/deliver` que ejecute de forma atómica y segura la transición de estado.
- Resolver automáticamente las fechas reales faltantes:
  - `ActualEndDate`: fecha actual (`DateTime.UtcNow.Date`) si no estaba definida.
  - `ActualStartDate`: fecha presupuestada (`EstimatedStartDate`), o fecha actual si tampoco existía inicio presupuestado.
- Validar las condiciones de negocio antes de aplicar la transición para evitar estados inconsistentes.
- Registrar una observación de auditoría en `ServiceOrderObservation` clasificada como `Hito Clave`.
- En el frontend, agregar un botón con confirmación modal en la columna de acciones del listado, visible exclusivamente cuando la orden esté en estado `"Iniciada"`.

**Non-Goals:**
- No se modifican las pantallas de alta ni edición de la orden de servicio.
- No se alteran forzosamente los porcentajes ni estados de las actividades operativas asociadas.
- No se gestionan pagos ni cobros reales (correspondientes al estado posterior "Cobrada").

## Decisions

### Decisión 1: Endpoint backend dedicado `POST /api/service-orders/{id}/deliver`
- **Elección**: Crear un endpoint específico en `ServiceOrderEndpoints.cs`.
- **Razón**: Permite ejecutar la lógica de entrega en una sola transacción, sin requerir que el frontend descargue el payload completo de la orden ni corra el riesgo de sobreescribir o duplicar actividades o distribuciones en un `PUT` masivo.
- **Alternativa descartada**: Hacer un `GET` del detalle completo de la orden en el cliente y disparar un `PUT` general. Descartado por ineficiencia de red y riesgo de condiciones de carrera con datos desactualizados.

### Decisión 2: Resolución y validación de fechas
- **Elección**:
  - Si `ActualEndDate` es nulo, se establece en `DateTime.UtcNow.Date`.
  - Si `ActualStartDate` es nulo, se asigna `EstimatedStartDate ?? DateTime.UtcNow.Date`.
  - Si `ActualEndDate < ActualStartDate`, se devuelve un error de validación informando la inconsistencia temporal.
- **Razón**: Asegura el cumplimiento de las restricciones de `ValidateServiceOrderRules` sin requerir inputs manuales del usuario en el caso habitual.

### Decisión 3: Registro automático de Bitácora (`ServiceOrderObservation`)
- **Elección**: Crear una entrada en `context.ServiceOrderObservations` vinculada al `UserId` autenticado (desde los Claims del JWT) con tipo `"Hito Clave"` y texto descriptivo: `"Orden marcada como entregada. Fecha inicio real: {fecha}, Fecha fin real: {fecha}"`.
- **Razón**: Mantiene la trazabilidad y la línea de tiempo inmutable de la orden.

### Decisión 4: UI/UX en `ServiceOrderListComponent`
- **Elección**:
  - Agregar un botón `<button mat-icon-button color="accent" matTooltip="Marcar como entregada" *ngIf="row.statusName === 'Iniciada'" (click)="deliverOrder(row)">` con icono `task_alt`.
  - Usar `ConfirmDialogComponent` para solicitar confirmación explícita antes de ejecutar la petición.
  - Manejo de feedback con `MatSnackBar` (éxito en verde, error descriptivo en rojo) y recarga de la lista con `loadOrders()`.
- **Razón**: Mantiene la consistencia visual y de interacción existente en el sistema.

## Risks / Trade-offs

- **[Riesgo]** Una orden en estado "Iniciada" podría no tener asignado proyecto, cliente o responsables (creada con datos parciales antes de restricciones).
  - **Mitigación**: El endpoint ejecuta `ValidateServiceOrderRules`. Si falta algún requisito, responde HTTP 400 Bad Request con un mensaje claro (ej. "Para marcar la orden como entregada debe asignar un proyecto."). El frontend muestra la notificación de advertencia en pantalla sin alterar la orden.
- **[Riesgo]** Desfase de zona horaria entre el cliente y el servidor al asignar la fecha actual.
  - **Mitigación**: Se utiliza `DateTime.UtcNow.Date` en el backend, en consonancia con el estándar de fechas UTC utilizado en todo el sistema GeoServ.
