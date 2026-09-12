## Why

Actualmente, para marcar una Orden de Servicio como entregada, el usuario debe abrir la orden en modo edición, navegar por las pestañas o acordeones, modificar manualmente las fechas reales (inicio y fin) y cambiar el estado a "Entregada". Esto genera fricción operativa y lentitud en la gestión diaria cuando múltiples órdenes finalizan sus trabajos. Permitir realizar esta transición directamente desde la tabla de órdenes de servicio, solicitando confirmación y autocompletando las fechas requeridas con trazabilidad en la bitácora, agiliza sustancialmente el flujo de trabajo sin comprometer la consistencia de los datos.

## What Changes

- **Acción directa en listado**: Incorporar un botón de acción rápida "Marcar como entregada" en la columna de acciones del listado de Órdenes de Servicio.
- **Condición de visualización**: El botón debe mostrarse **exclusivamente** para aquellas órdenes que se encuentren actualmente en estado `"Iniciada"`.
- **Modal de confirmación**: Al hacer clic en la acción, el sistema debe desplegar un diálogo de confirmación que detalle la acción a realizar y las fechas que se asignarán automáticamente.
- **Cálculo y asignación de fechas**:
  - Si la orden no cuenta con fecha de entrega real (`actualEndDate`), se asigna automáticamente la fecha actual (`DateTime.UtcNow.Date`).
  - Si la orden no cuenta con fecha de inicio real (`actualStartDate`), se precarga con la fecha de inicio presupuestada (`estimatedStartDate`). En caso de no tener inicio presupuestado, se toma la fecha actual.
- **Transición de estado**: El estado de la orden cambia a `"Entregada"`.
- **Trazabilidad y Bitácora**: Se registra automáticamente una observación en el historial (`ServiceOrderObservation`) categorizada como `Hito Clave`, detallando que la orden fue marcada como entregada junto con las fechas de inicio y fin real establecidas.
- **Endpoint backend dedicado**: Implementar el endpoint `POST /api/service-orders/{id}/deliver` para procesar la entrega de forma atómica y consistente con las validaciones de negocio existentes.

## Capabilities

### Modified Capabilities
- `service-orders`: Se modifica la especificación para incorporar la transición rápida al estado "Entregada" desde el listado, las reglas de asignación por defecto de fechas reales (`actualEndDate` y `actualStartDate`), y el registro automático en la bitácora del hito de entrega.

## Impact

- **Backend**:
  - `GeoServ.Api/Endpoints/ServiceOrderEndpoints.cs`: Nuevo endpoint `POST /api/service-orders/{id}/deliver` con validaciones de negocio, actualización de estado/fechas y registro en bitácora.
  - `GeoServ.Api.Tests/ServiceOrderValidationTests.cs`: Pruebas unitarias para validar las reglas de negocio y consistencia al marcar como entregada.
- **Frontend**:
  - `ServiceOrderService`: Nuevo método `markAsDelivered(id: string)`.
  - `ServiceOrderListComponent`: Inclusión del botón en la columna de acciones (visible solo si `row.statusName === 'Iniciada'`), diálogo de confirmación, manejo de feedback con snackbar y refresco de la tabla.
