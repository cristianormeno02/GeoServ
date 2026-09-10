## Context

El sistema GeoServ gestiona Órdenes de Servicio (OS) a través de una API Minimal en .NET 8 (Entity Framework Core) y un cliente web Angular 18 (Standalone Components, Angular Material). Actualmente, el listado general en `ServiceOrderListComponent` solo cuenta con una barra de búsqueda de texto libre y ordena los registros por fecha de creación descendente (`CreatedAt DESC`).
En cuanto al guardado (`ServiceOrderFormComponent` y `POST/PUT /api/service-orders`), las validaciones se centran en unicidad de número y suma de porcentajes de distribución al 100%, pero no previenen discrepancias de fechas ni exigen completitud para hitos críticos de entrega operativa.

## Goals / Non-Goals

**Goals:**
- Implementar filtros combinados reactivos en el listado de Órdenes de Servicio por Proyecto y Estado, con selección inicial predeterminada en "Iniciada".
- Establecer el ordenamiento predeterminado del listado en ascendente por Número de Orden (`OrderNumber` ASC) tanto en backend como frontend.
- Implementar validaciones de integridad de fechas y estado tanto en frontend (formulario reactivo) como en backend (endpoints POST/PUT de Service Orders):
  - Asociación estricta de Fecha de Entrega / Fin Real (`ActualEndDate`) con el estado "Entregada".
  - Verificación cronológica: `EstimatedEndDate >= EstimatedStartDate` y `ActualEndDate >= ActualStartDate`.
  - Verificación de completitud para el estado "Entregada": Proyecto, Cliente, todas las fechas excepto cobro, todos los montos requeridos y equipo de trabajo asignado.
- Exponer un mecanismo de detección de inconsistencias en el backend y representarlo mediante un indicador visual de alerta con tooltip descriptivo en el listado para advertir sobre registros históricos o incongruentes.

**Non-Goals:**
- Modificar el flujo de cobros ni la regla de cálculo de porcentajes de distribución de facturación.
- Bloquear la consulta de lectura de órdenes históricas que presenten inconsistencias (deben listarse normalmente pero destacando su alerta).
- Alterar la lógica de costos directos o bitácora de observaciones.

## Decisions

### 1. Detección y Exposición de Inconsistencias en Backend
- **Decisión**: El endpoint `GET /api/service-orders` evaluará directamente las reglas de coherencia sobre cada orden proyectada, agregando los campos booleanos `hasInconsistencies` y el array `inconsistencyReasons: string[]`.
- **Razón**: Centraliza las reglas de negocio en el backend y evita que el frontend tenga que transferir o cargar innecesariamente colecciones completas en cada fila del listado solo para validar.
- **Alternativas consideradas**: 
  - *Calcularlo exclusivamente en el frontend*: Requeriría que el endpoint de listado exponga todos los IDs, fechas y conteos de relaciones, aumentando el payload y duplicando la lógica de negocio.

### 2. Filtrado y Ordenamiento en Frontend y Backend
- **Decisión**:
  - En backend, ordenar la consulta por `OrderNumber ASC` (o `CreatedAt ASC` como fallback).
  - En frontend, cargar los catálogos de Proyectos y Estados para poblar dos `mat-select` de filtro junto al input de búsqueda.
  - El filtro de Estado se inicializará con el ID o nombre del estado "Iniciada". Se aplicará un `filterPredicate` personalizado en `MatTableDataSource` (o parámetros de consulta) que combine búsqueda de texto, ID de proyecto y nombre/ID de estado.
  - Se configurará `MatSort` con `active: 'orderNumber'` y `direction: 'asc'`.

### 3. Validaciones al Guardar (Frontend & Backend)
- **Decisión**:
  - **Backend**: Aplicar validaciones defensivas en `POST /api/service-orders` y `PUT /api/service-orders/{id}` retornando `Results.BadRequest(new { message = "..." })` ante cualquier violación.
  - **Frontend**: Añadir validaciones reactivas antes de despachar la petición en `onSubmit()` del `ServiceOrderFormComponent`, marcando los campos correspondientes y mostrando un `MatSnackBar` explicativo con el motivo exacto del bloqueo.

## Risks / Trade-offs

- **[Riesgo] Órdenes históricas en estado Entregada que no se puedan editar sin completar los nuevos campos obligatorios**
  - *Mitigación*: Este comportamiento es deseado según el requerimiento, ya que garantiza que al re-guardar o actualizar una orden en dicho estado, se subsane la información faltante. La alerta en el listado advertirá previamente a los operadores sobre estos casos.
- **[Riesgo] Formato alfanumérico vs numérico en ordenamiento por OrderNumber**
  - *Mitigación*: Las órdenes usan un formato estandarizado (ej. OS-00000001 o números con padding). El ordenamiento ascendente por string respeta el orden secuencial cuando los números conservan longitud fija.

## Migration Plan

No requiere migraciones de base de datos (no se añaden nuevas columnas a la base de datos). Las validaciones y reglas operan sobre las entidades existentes (`ServiceOrder`, `ServiceOrderStatus`, `Project`, `Client`, `Responsible`).
