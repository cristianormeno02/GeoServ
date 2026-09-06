## Why

El dashboard operativo actual muestra los KPIs principales, pero los usuarios necesitan ver el detalle de las órdenes que componen esos números. Al permitir hacer click en un KPI para abrir un modal con la lista de órdenes, se mejora significativamente la trazabilidad y la capacidad de análisis rápido sin tener que navegar a la vista completa de órdenes y aplicar filtros manualmente.

## What Changes

- Se agregará interactividad (click) al valor principal de las tarjetas de KPI en el Dashboard Operativo y en "Mi dashboard" (Dashboard General).
- Se implementará un modal genérico que se abrirá al hacer click en los KPIs.
- Para la mayoría de los KPIs (como "Órdenes Abiertas", "Órdenes Vencidas", etc.), el modal mostrará un listado con las órdenes de servicio que cumplen con la condición.
- Específicamente para el KPI de "Insumos críticos" en el Dashboard Operativo, el modal mostrará el listado de insumos que están por debajo de su stock mínimo, en lugar de órdenes.
- El listado en el modal incluirá información relevante de la entidad correspondiente (orden o insumo) y permitirá navegar a los detalles si es necesario.

## Capabilities

### New Capabilities
<!-- Ninguna nueva capacidad principal, es una mejora sobre dashboards existentes -->

### Modified Capabilities
- `dashboard-operativo`: Se modifica para agregar el comportamiento de click en los KPIs, mostrando órdenes para la mayoría y el detalle de insumos para el KPI de "Insumos críticos".
- `dashboard-general`: Se modifica para agregar el comportamiento de click en los KPIs personales del usuario, mostrando el listado de sus órdenes correspondientes.

## Impact

- **UI/Componentes**: Modificación del componente de Dashboard Operativo y creación de un nuevo componente modal para el listado de órdenes.
- **Consultas/Estado**: Es posible que se requiera refinar o reutilizar las consultas que obtienen los datos del KPI para ahora obtener el listado paginado o completo de las órdenes correspondientes a ese estado/filtro.
