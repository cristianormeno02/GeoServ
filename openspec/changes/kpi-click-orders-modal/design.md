## Context

El Dashboard Operativo y "Mi dashboard" muestran tarjetas de KPIs. Se requiere agregar la capacidad de hacer click sobre el valor principal de un KPI para visualizar en un modal las entidades que lo componen (órdenes o insumos críticos), mejorando la usabilidad.

## Goals / Non-Goals

**Goals:**
- Proveer un listado rápido de entidades (órdenes o insumos) desde cualquier KPI interactivo.
- Reutilizar componentes UI de tabla/modal para soportar distintos tipos de datos (órdenes o insumos) y distintos contextos (operativo vs personal).
- Garantizar que "Mi dashboard" mantenga sus reglas estrictas de filtrado por usuario.

**Non-Goals:**
- No se modificará la estructura de los cálculos estadísticos de los KPIs actuales.
- No se agregará edición en lote dentro de este modal.

## Decisions

### Reutilización de Endpoints vs Nuevos Endpoints
**Decisión**: Crear endpoints específicos como `GET /api/dashboard/operational/kpis/{kpi_id}/details` y `GET /api/dashboard/general/kpis/{kpi_id}/details` en lugar de acoplar lógica a los buscadores generales.
**Rationale**: Los KPIs operativos y generales tienen reglas de negocio específicas. "Mi dashboard" en particular debe asegurar el filtrado estricto por JWT. Centralizar la obtención del listado de detalles en los mismos controladores del dashboard asegura que apliquen las mismas reglas (ej. permisos, identidades) que usan los resúmenes. El endpoint devolverá un formato genérico que el modal pueda interpretar o el modal sabrá qué tipo de tabla mostrar según el kpi_id.

### Componente Modal Dinámico
**Decisión**: Crear un componente genérico `KpiDetailModal` que reciba el tipo de entidad (`orders` o `consumables`) para renderizar las columnas correctas de la tabla.
**Rationale**: Permite reutilizar el mismo modal contenedor tanto para el listado de insumos críticos como para los listados de órdenes, simplificando el código de los componentes del dashboard.

## Risks / Trade-offs

- [Performance] -> Al abrir el modal, la consulta para obtener el listado paginado podría ser costosa. **Mitigación**: Asegurar que las consultas utilicen los mismos filtros e índices base que los endpoints de resumen.
- [Security] -> Riesgo de mostrar órdenes de otros usuarios en "Mi dashboard". **Mitigación**: El nuevo endpoint en `dashboard/general` debe usar la misma lógica centralizada de filtrado por JWT descrita en los requerimientos existentes.
