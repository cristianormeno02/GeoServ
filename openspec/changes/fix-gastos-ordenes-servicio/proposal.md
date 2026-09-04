## Why

Existen varios errores y faltantes funcionales reportados que afectan la usabilidad y el correcto funcionamiento del sistema:
1. En Gastos Fijos, los vencimientos no se guardan o no se muestran en el listado tras ser ingresados.
2. En Órdenes de Servicio, la distribución de cobro, actividades operativas y costos directos permiten reordenar sus filas, pero al guardar, este orden se pierde.
3. En Órdenes de Servicio, falta la funcionalidad para que el usuario pueda eliminar observaciones en la bitácora.

## What Changes

- **Gastos Fijos**: Corrección en el guardado y visualización de los vencimientos asociados a un gasto fijo.
- **Órdenes de Servicio (Reordenamiento)**: Implementar la persistencia del orden de las filas para distribución de cobro, actividades operativas y costos directos tras realizar un reordenamiento.
- **Órdenes de Servicio (Bitácora)**: Agregar la opción para eliminar observaciones realizadas.

## Capabilities

### New Capabilities
- `gastos-fijos`: Guardado y listado de vencimientos de gastos fijos.

### Modified Capabilities
- `service-orders`: Persistencia del orden de filas en distribución de cobro, actividades operativas y costos directos, y eliminación de observaciones en bitácora.

## Impact

- Módulo de Gastos Fijos (frontend y backend, dependiendo de dónde resida el bug de los vencimientos).
- Módulo de Órdenes de Servicio (persistencia del ordenamiento y nuevo endpoint/UI para eliminación de observaciones).
