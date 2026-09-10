## 1. Backend: Validaciones de Guardado y Detección de Inconsistencias

- [x] 1.1 Implementar validaciones de integridad en `POST /api/service-orders` y `PUT /api/service-orders/{id}` en `ServiceOrderEndpoints.cs` para validar coherencia cronológica de fechas presupuestadas (`EstimatedEndDate >= EstimatedStartDate`), fechas reales (`ActualEndDate >= ActualStartDate`), asignación obligatoria de estado "Entregada" al cargar fecha de entrega / fin real, y verificación estricta de completitud para órdenes en estado "Entregada" (proyecto, cliente, todas las fechas excepto cobro, montos mayores a 0 y al menos un responsable en equipo de trabajo).
- [x] 1.2 Actualizar la consulta del listado en `GET /api/service-orders` para ordenar por defecto ascendentemente por número de orden (`OrderNumber ASC`) y calcular/proyectar los campos `HasInconsistencies` (booleano) e `InconsistencyReasons` (lista de descripciones de inconsistencia) sobre órdenes históricas y actuales.
- [x] 1.3 Verificar mediante `dotnet build backend/GeoServ.Api` que los cambios en backend compilen satisfactoriamente sin advertencias ni errores.

## 2. Frontend: Validaciones en Formulario de Órdenes de Servicio

- [x] 2.1 Actualizar las validaciones reactivas y la lógica de `onSubmit()` en `ServiceOrderFormComponent` para bloquear el guardado y notificar al usuario si el fin presupuestado es anterior al inicio, si el fin real es anterior al inicio real, si se define fecha de entrega con estado distinto a "Entregada", o si se intenta guardar en "Entregada" sin proyecto, cliente, fechas completas, montos requeridos o equipo de trabajo asignado.
- [x] 2.2 Incorporar indicadores visuales en las pestañas del formulario (Datos Principales, Fechas, Finanzas, Responsables) para guiar al usuario sobre los campos requeridos faltantes para el estado "Entregada".

## 3. Frontend: Filtros, Ordenamiento y Alertas en Listado

- [x] 3.1 Actualizar la interfaz `ServiceOrderListItem` en `frontend/src/app/features/service-orders/models/service-order.model.ts` para incluir las propiedades `projectId`, `hasInconsistencies` e `inconsistencyReasons`.
- [x] 3.2 Implementar en `ServiceOrderListComponent` los selectores de filtro para Proyecto (incluyendo "Todos los proyectos") y Estado (incluyendo "Todos los estados"), configurando la selección inicial por defecto en "Iniciada" y el `filterPredicate` multi-criterio correspondiente.
- [x] 3.3 Configurar el ordenamiento predeterminado de la grilla en `ServiceOrderListComponent` para mostrar los registros de forma ascendente por número de orden (`orderNumber` ASC).
- [x] 3.4 Agregar en `service-order-list.component.html` y sus estilos SCSS el icono visual de alerta (`warning`) con `matTooltip` descriptivo en las filas que presenten `hasInconsistencies`, permitiendo al usuario identificar claramente registros con información mal cargada.

## 4. Verificación y Validación Integral

- [x] 4.1 Ejecutar la compilación del frontend mediante `npm run build` en el directorio `frontend` y constatar la ausencia de errores de tipado o plantilla.
- [x] 4.2 Validar la coherencia integral entre los artefactos de especificación, diseño y tareas ejecutando `openspec validate ordenes-servicio-validaciones-y-filtros --strict`.
