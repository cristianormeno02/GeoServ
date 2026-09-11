## Context

El componente `ServiceOrderListComponent` en el frontend (`frontend/src/app/features/service-orders/components/service-order-list/`) renderiza la tabla de órdenes de servicio utilizando Angular Material (`mat-table`, `matSort`, `mat-paginator`).
Actualmente, la columna `createdAt` muestra únicamente la fecha de creación con el encabezado "Fecha Alta".
El DTO `ServiceOrderListItem` ya recibe del backend las propiedades `actualEndDate`, `estimatedEndDate` y `createdAt`, por lo que todos los datos necesarios ya se encuentran disponibles en el cliente sin requerir modificaciones en el backend o en la base de datos.

## Goals / Non-Goals

**Goals:**
- Actualizar el encabezado de la columna de "Fecha Alta" a "Fecha".
- Implementar la lógica condicional de resolución de fecha en base a la prioridad:
  1. `actualEndDate` (Fecha de entrega real).
  2. `estimatedEndDate` (Fecha presupuestada de entrega).
  3. `createdAt` (Fecha de alta).
- Incorporar un icono visual representativo junto a la fecha para indicar el origen del dato.
- Incorporar un tooltip informativo (`matTooltip`) que indique explícitamente a qué fecha corresponde el valor.
- Ajustar `sortingDataAccessor` en el `MatTableDataSource` para que el ordenamiento por dicha columna se realice según el valor resuelto dinámicamente.

**Non-Goals:**
- Modificar el backend, endpoints, DTOs o esquema de base de datos (los datos ya son provistos por la API).
- Alterar la visualización de fechas en los formularios de edición, visualización de detalle o diálogos modales.

## Decisions

### 1. Centralización de la Lógica de Resolución de Fecha
Se añadirá un método auxiliar en `ServiceOrderListComponent` (o funciones getter específicas):
```typescript
getOrderDateInfo(row: ServiceOrderListItem): { date: string; tooltip: string; icon: string; cssClass: string }
```
- **Prioridad 1**: Si `row.actualEndDate` está presente y no vacío, retorna fecha real, tooltip `"Fecha de entrega real"`, icono `'check_circle'` (o `'event_available'`) y clase CSS `'date-icon-actual'`.
- **Prioridad 2**: Si `row.estimatedEndDate` está presente y no vacío, retorna fecha presupuestada, tooltip `"Fecha presupuestada de entrega"`, icono `'schedule'` (o `'event'`) y clase CSS `'date-icon-estimated'`.
- **Prioridad 3**: En cualquier otro caso, retorna `row.createdAt`, tooltip `"Fecha de alta"`, icono `'calendar_today'` (o `'add_circle_outline'`) y clase CSS `'date-icon-created'`.

*Alternativa descartada*: Pipe personalizado standalone. Aunque viable, la lógica está estrechamente ligada al ordenamiento del `MatTableDataSource` en este componente específico, por lo que centralizar el helper en el componente simplifica la integración tanto en el template como en el accessor de ordenamiento.

### 2. Iconografía y Estilos Visuales
- Se utilizarán iconos estándar de Google Material Icons (`mat-icon`), ya importados y disponibles en el componente:
  - Entrega Real: `check_circle` (verde o tono principal de éxito/completado).
  - Presupuestada: `schedule` (azul o tono de espera/planificación).
  - Alta: `calendar_today` o `add_circle_outline` (tono neutro/gris).
- Los iconos tendrán tamaño compacto (16px a 18px) alineados verticalmente junto al texto de la fecha para no ensanchar innecesariamente la columna.

### 3. Ordenamiento en la Tabla (`sortingDataAccessor`)
- La columna mantendrá su identificador en `displayedColumns` (o utilizará `displayDate` / `createdAt`) con `mat-sort-header`.
- Se configurará `dataSource.sortingDataAccessor` para que cuando el campo a ordenar sea la columna de fecha, se extraiga el timestamp numérico (`new Date(dateInfo.date).getTime()`) del valor dinámico resuelto, garantizando un ordenamiento cronológico preciso.

## Risks / Trade-offs

- [Fechas con formato o cadenas inválidas] → Se validará la existencia del string de fecha antes de parsear, retornando 0 en el accessor de sort si no es una fecha válida.
- [Impacto en rendimiento en tablas grandes] → La función de resolución de fecha es una evaluación condicional trivial en memoria sin cálculos pesados ni llamadas asíncronas.
