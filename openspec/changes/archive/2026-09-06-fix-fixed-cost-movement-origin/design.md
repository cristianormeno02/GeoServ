## Context

Actualmente, el sistema GeoServ soporta movimientos contables con orígenes polimórficos (`SourceType` y `SourceId`). Al registrar un movimiento de egreso con tipo de origen `FixedCostPayment` ("Pago de Gasto Fijo"), el componente de formulario `movimiento-form.component.ts` intenta obtener las opciones consultando `GET /api/fixed-cost-payments`. Sin embargo, dicho endpoint no tiene implementado un método `GET` en el backend; el endpoint que expone la lista de gastos fijos es `GET /api/fixed-cost-items`. Como resultado, la llamada HTTP falla y el selector de origen queda vacío.

Asimismo, en `AccountingMovementEndpoints.cs`, el DTO `UpdateMovementRequest` carece de las propiedades `SourceType` y `SourceId`, lo cual provoca que al actualizar un movimiento existente se restablezcan dichos campos a valores por defecto (`Manual` y `null`).

## Goals / Non-Goals

**Goals:**
- Conectar la carga de opciones de origen para `FixedCostPayment` al endpoint existente `GET /api/fixed-cost-items`.
- Mejorar la visualización del listado en el desplegable mostrando el nombre del gasto fijo y su categoría asociada para mayor claridad del operador.
- Armonizar la etiqueta de la opción visual a "Pago de Gasto Fijo" en el selector de tipo de origen.
- Sincronizar el contrato de actualización (`UpdateMovementRequest`) en el backend para admitir `SourceType` y `SourceId`, evitando pérdidas de contexto al editar movimientos.

**Non-Goals:**
- No se modificará el esquema de base de datos ni las tablas de `FixedCostItems` o `AccountingMovements`.
- No se altera la lógica de cuotas o vencimientos dentro del módulo de gastos fijos.

## Decisions

### Decisión 1: Mapeo del endpoint en `loadSourceOptions`
- **Elección**: Cambiar la ruta para `FixedCostPayment` en `loadSourceOptions` de `/fixed-cost-payments` a `/fixed-cost-items`.
- **Alternativas consideradas**:
  - *Crear un nuevo endpoint `GET /api/fixed-cost-payments`*: Descartado porque la entidad de cabecera que el usuario identifica conceptualmente como "gasto fijo" (alquiler, luz, internet, etc.) es `FixedCostItem`, y `GET /api/fixed-cost-items` ya incluye las categorías y está listo para su consumo.

### Decisión 2: Formato descriptivo en el selector
- **Elección**: Permitir que el selector muestre `${x.name}${x.category?.name ? ' (' + x.category.name + ')' : ''}` si la categoría está disponible, o `x.name`.
- **Razón**: Permite distinguir gastos fijos con nombres similares o genéricos (ej. "Servicio de Limpieza").

### Decisión 3: Soporte polimórfico en `UpdateMovementRequest`
- **Elección**: Añadir `GeoServ.Api.Domain.Enums.MovementSourceType? SourceType` y `string? SourceId` al `UpdateMovementRequest`. En el handler de `MapPut`, si `request.SourceType.HasValue` se utilizan estos campos prioritariamente; en caso contrario, se mantiene el fallback retrospectivo con los IDs específicos heredados (`FixedCostId`, etc.).
- **Razón**: Garantiza consistencia simétrica entre `CreateMovementRequest` y `UpdateMovementRequest` sin romper compatibilidad.

## Risks / Trade-offs

- **[Riesgo]** Movimientos creados previamente con la relación heredada `FixedCostId`.
  - **Mitigación**: El endpoint de consulta de movimientos ya proyecta `SourceType` y `SourceId`, y el endpoint de actualización mantendrá compatibilidad con los campos específicos legados si `SourceType` no viniera informado.
