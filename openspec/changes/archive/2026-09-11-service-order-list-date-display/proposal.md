## Why

Actualmente, el listado de órdenes de servicio (OS) muestra únicamente la fecha de alta (`Fecha Alta`). Sin embargo, para la gestión y seguimiento operativo resulta mucho más relevante y contextual conocer la fecha más avanzada o representativa del estado de la orden: si ya fue entregada, su fecha real de entrega; si aún está en curso o planificada, su fecha presupuestada de entrega; y en su defecto, la fecha de alta en el sistema. Además, los usuarios necesitan una indicación visual clara (icono y tooltip) que aclare qué fecha exacta se está visualizando en cada fila.

## What Changes

- **Etiqueta de Columna en el Listado**: Se actualiza el encabezado de la columna de "Fecha Alta" a "Fecha".
- **Lógica Dinámica de Fecha**: Se evalúa y muestra la fecha según el siguiente orden de precedencia:
  1. Si la orden tiene registrada la fecha de entrega real (`actualEndDate`), se muestra esa fecha.
  2. En caso contrario, si tiene registrada la fecha presupuestada de entrega (`estimatedEndDate`), se muestra dicha fecha.
  3. En caso contrario, se muestra la fecha de alta en el sistema (`createdAt`).
- **Indicador Visual (Icono)**: Se agrega un icono representativo junto a la fecha para identificar rápidamente el tipo de fecha mostrada:
  - Entrega Real: Icono de cumplimiento / finalización (ej. `check_circle` o `event_available`).
  - Presupuestada de Entrega: Icono de planificación / plazo estimado (ej. `schedule` o `event`).
  - Fecha de Alta: Icono de creación / registro (ej. `add_circle_outline` o `history`).
- **Tooltip Explicativo**: Se agrega un tooltip descriptivo (`matTooltip`) que especifica textualmente a qué concepto corresponde la fecha mostrada ("Fecha de entrega real", "Fecha presupuestada de entrega" o "Fecha de alta").
- **Ordenamiento (Sorting)**: Se ajusta el ordenamiento de la columna para ordenar según el valor de fecha dinámicamente resuelto.

## Capabilities

### New Capabilities
<!-- Ninguna capability nueva -->

### Modified Capabilities
- `service-orders`: Se modifica el comportamiento visual del listado de órdenes de servicio incorporando la visualización dinámica de la columna de fecha con orden de prioridad (real, presupuestada, alta), icono representativo y tooltip descriptivo.

## Impact

- **Frontend**: Componente `ServiceOrderListComponent` (`service-order-list.component.html`, `service-order-list.component.ts`, `service-order-list.component.scss`). No requiere alterar contratos de API ni endpoints backend ya que `ServiceOrderListItem` y el endpoint `/api/service-orders` ya exponen `actualEndDate`, `estimatedEndDate` y `createdAt`.
- **Backend / Base de datos**: Sin impacto directo en modelos de datos ni migraciones.
