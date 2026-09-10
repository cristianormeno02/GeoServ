## Why

Actualmente, el listado de Órdenes de Servicio presenta limitaciones de usabilidad al carecer de filtros directos por Proyecto y Estado (teniendo como foco operativo principal las órdenes "Iniciadas"), y no cuenta con un ordenamiento consistente ascendente por número de orden. Asimismo, el formulario de guardado y edición carece de validaciones de integridad de fechas (coherencia entre inicio y fin presupuestado/real) y de verificación de completitud estricta al pasar al estado "Entregada" (asignación de proyecto, cliente, fechas completas, montos y equipo de trabajo). Para resguardar la calidad de datos históricos y futuros, se requiere además señalar visualmente mediante un indicador de alerta en el listado aquellas órdenes con información incompleta o inconsistente.

## What Changes

- **Filtros en el Listado de Órdenes de Servicio**:
  - Filtro desplegable por Proyecto (con opción "Todos los proyectos").
  - Filtro desplegable por Estado (con opción "Todos los estados"), configurado por defecto en "Iniciada".
  - Ordenamiento inicial predeterminado de forma ascendente por número de orden (`OrderNumber` ASC).
- **Validaciones al Guardar (Creación y Edición)**:
  - **Fecha de Entrega y Estado**: Si se especifica una fecha de entrega / fin real (`ActualEndDate`), el estado de la orden debe ser obligatoriamente "Entregada".
  - **Coherencia Fechas Presupuestadas**: El fin presupuestado (`EstimatedEndDate`) no puede ser anterior al inicio presupuestado (`EstimatedStartDate`).
  - **Coherencia Fechas Reales**: Cuando se cargue el fin real (`ActualEndDate`), no puede ser anterior al inicio real (`ActualStartDate`).
  - **Requisitos de Estado "Entregada"**: Al cambiar o guardar una orden en estado "Entregada", el sistema debe validar obligatoriamente que tenga asignado Proyecto, Cliente, todas las fechas completas excepto fecha de cobro (`RequestDate`, `EstimatedStartDate`, `EstimatedEndDate`, `ActualStartDate`, `ActualEndDate`), todos los montos completos excepto monto cobrado y descuento (`BudgetedAmount`, `TotalAmount`), y equipo de trabajo (al menos un responsable asignado).
- **Indicador de Alerta de Inconsistencias en el Listado**:
  - En la tabla de órdenes de servicio, si una orden incumple alguna de las reglas de consistencia mencionadas (ej. órdenes guardadas previamente sin proyecto en estado Entregada, o con fechas cruzadas), se mostrará un icono/indicador visual de alerta con tooltip descriptivo detallando las inconsistencias detectadas.

## Capabilities

### Modified Capabilities
- `service-orders`: Incorporación de filtros de listado (Proyecto y Estado con valor por defecto "Iniciada"), ordenamiento por N° de orden ascendente, validaciones estrictas de fechas y requisitos de entrega, y detección/señalización de alertas de inconsistencia en órdenes existentes y nuevas.

## Impact

- **Backend (`ServiceOrderEndpoints.cs`)**:
  - Parámetros opcionales de filtrado y ordenamiento en `GET /api/service-orders` (o cálculo de inconsistencias enriqueciendo el DTO de listado con `hasInconsistencies` y `validationIssues`).
  - Validaciones de dominio en los endpoints de creación (`POST /api/service-orders`) y actualización (`PUT /api/service-orders/{id}`).
- **Frontend (`service-orders`)**:
  - `ServiceOrderListComponent`: Controles de filtro (Proyecto, Estado con default "Iniciada"), ordenamiento predeterminado ascendente por `orderNumber`, nueva columna/indicador de alerta con tooltip.
  - `ServiceOrderFormComponent`: Validaciones reactivas y mensajes de error específicos en `onSubmit` y en controles de fechas y estado al guardar.
  - Modelos TypeScript (`ServiceOrderListItem`, interfaces de validación).
