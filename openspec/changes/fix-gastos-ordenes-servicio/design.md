## Context

Existen errores en la plataforma respecto a la persistencia de datos relacionados al orden de filas en colecciones de Órdenes de Servicio y problemas al guardar o listar los vencimientos de los Gastos Fijos (ver proposal.md para detalles de motivación). Además, la bitácora de observaciones requiere la capacidad de eliminar registros existentes, la cual estaba intencionalmente restringida a "sólo inserción" previamente.

## Goals / Non-Goals

**Goals:**
- Persistir la posición u orden de las filas (drag & drop) en las tablas de Distribución de Cobro, Actividades Operativas y Costos Directos dentro de las Órdenes de Servicio.
- Asegurar que los Vencimientos de Gastos Fijos se inserten correctamente y se listen al cargar el gasto.
- Modificar el backend y frontend para permitir la eliminación (hard o soft delete) de observaciones en la bitácora.

**Non-Goals:**
- No se implementará edición de observaciones de la bitácora, únicamente eliminación.
- No se reconstruirá la lógica base de las colecciones, simplemente se añadirá o corregirá la persistencia del orden existente.

## Decisions

1. **Persistencia del Orden (Service Orders)**
   - *Decisión*: Añadir un campo `OrderIndex` (int) a las entidades relacionales hijas (`ServiceOrderCollectionDistribution`, `ServiceOrderActivity`, `ServiceOrderDirectCost` - o los nombres reales en el modelo de base de datos) para persistir el orden visual.
   - *Alternativa considerada*: Borrar y reinsertar las filas en el orden que llegan desde el frontend. Si se usa un arreglo ordenado y EF Core las elimina/recrea, podría causar problemas con IDs generados e inconsistencias. Se opta por actualizar/mantener el campo `OrderIndex`.

2. **Borrado de Observaciones (Bitácora)**
   - *Decisión*: Implementar un `DELETE` endpoint para las observaciones. 
   - *Alternativa considerada*: Usar soft-delete (marcar `IsDeleted` = true). Dependiendo de las políticas generales de la app, se usará soft-delete si la app ya lo utiliza (usando `ISoftDeletable` por ejemplo), o hard delete directo para limpiar la base.

3. **Corrección de Vencimientos (Gastos Fijos)**
   - *Decisión*: Validar el binding o mapeo desde los DTOs de Request hacia las entidades hijas de `FixedExpense` (Gastos Fijos), asegurando que EF Core guarde la relación 1:N correctamente y el endpoint GET las incluya con `.Include(...)`.

## Risks / Trade-offs

- **Risk: Pérdida de datos al actualizar el orden** → *Mitigation*: Validar que la actualización en bulk de `OrderIndex` solo modifique las filas existentes que corresponden a la misma Orden de Servicio y no modifique los IDs primarios.
