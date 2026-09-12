## Why

Hoy, para mover fondos entre dos cuentas financieras propias (ej. de "Caja" a "Banco"), el usuario debe cargar manualmente **dos movimientos contables independientes** desde el formulario genérico: un Egreso en la cuenta origen y un Ingreso en la cuenta destino, usando por convención las categorías ya existentes "Transferencia Interna (Egreso)" / "Transferencia Interna (Ingreso)". Esto es lento, propenso a error (montos o fechas que no coinciden entre ambas patas, o directamente olvidar cargar la segunda) y no deja ningún registro que vincule ambos movimientos entre sí. Además, como no existe una forma de distinguir estas transferencias del resto, los KPIs de "Ingresos del mes" y "Egresos del mes" del dashboard financiero podrían inflarse artificialmente si se usan esas categorías (los montos brutos suman en ambos lados aunque el resultado neto cierre bien).

Se propone incorporar un tercer tipo de movimiento — **Transferencia Interna** — con una experiencia dedicada: el usuario elige cuenta origen y cuenta destino, y el sistema genera ambas patas de forma atómica y vinculada.

## What Changes

- **Nuevo tipo de origen `InternalTransfer`**: se agrega un valor al enum `MovementSourceType` (persistido como string, sin impacto en datos existentes).
- **Campo de vínculo `TransferGroupId`**: nueva columna nullable en `AccountingMovement` que asocia las dos patas de una misma transferencia. Todos los movimientos existentes quedan con este campo en `null` (no se modifican datos históricos).
- **Endpoint dedicado `POST /api/movements/transfer`**: recibe cuenta origen, cuenta destino, monto, fecha y descripción; valida (`cuentaOrigen != cuentaDestino`, monto > 0, ambas cuentas activas y de la misma moneda) y crea en una sola transacción de base de datos el Egreso (origen) y el Ingreso (destino), reutilizando las categorías semilla ya existentes "Transferencia Interna (Egreso/Ingreso)", ambos con el mismo `TransferGroupId` y `SourceType = InternalTransfer`.
- **Endpoint dedicado `DELETE /api/movements/transfer/{transferGroupId}`**: elimina ambas patas atómicamente. El `PUT`/`DELETE` genérico de `/api/movements/{id}` pasa a rechazar cualquier movimiento cuyo `TransferGroupId` no sea nulo, para impedir que quede una transferencia con una sola pata.
- **Frontend — nuevo modo "Transferencia"** en el formulario de movimientos: junto a Ingreso/Egreso se agrega un tercer selector "Transferencia entre Cuentas" que oculta el campo de categoría y de origen polimórfico, y muestra dos selectores de cuenta (Origen/Destino) en su lugar.
- **Listado de movimientos**: nueva etiqueta "Transferencia Interna" en la columna Origen, mostrando cuenta origen → cuenta destino.
- **Dashboard financiero**: los KPIs de ingresos/egresos brutos del mes (`incomeCurrentMonth`, `incomeTrend`, `expensesCurrentMonth`) excluyen explícitamente `SourceType = InternalTransfer` para no inflar cifras brutas. El saldo por cuenta (KPIs por cuenta y resumen financiero) sigue sin filtrar, ya que la transferencia debe impactar el saldo de ambas cuentas igual que hoy.
- **Sin migración de datos históricos**: no se reclasifican ni vinculan retroactivamente movimientos ya cargados con las categorías "Transferencia Interna" (ver `design.md`, sección de riesgos). Sus cifras en reportes de períodos ya cerrados no cambian.
- **Conversión de un movimiento existente a Transferencia**: el formulario de edición permite, sobre un movimiento que no forma parte de una transferencia real (sin `TransferGroupId`), cambiar su "Tipo de Movimiento" a "Transferencia entre Cuentas". Al confirmar, se elimina el movimiento individual y se crea la transferencia nueva (ambas patas) en su lugar, con aviso previo en la UI. Surgió al validar el flujo: un usuario que ya había cargado manualmente un Ingreso/Egreso con las categorías "Transferencia Interna" necesitaba una forma de "corregirlo" hacia una transferencia real vinculada, sin tener que borrarlo y recrearlo a mano desde cero.
- **Categorías "Transferencia Interna" marcadas como reservadas del sistema**: se agrega `IsSystemDefault` a `MovementCategory`. Las dos categorías semilla usadas por el endpoint de transferencia quedan marcadas `true`, excluidas del selector de categoría al cargar un Ingreso/Egreso manual, y protegidas contra edición/eliminación (backend y UI). Antes de este ajuste, esas categorías seguían apareciendo como opción manual en el formulario genérico, lo cual contradice el objetivo de la funcionalidad (que la transferencia se registre siempre por el flujo dedicado, nunca a mano).

## Cambios posteriores a la implementación inicial

Durante la validación con uso real se detectaron y corrigieron, dentro del alcance de este mismo change:
1. `categorias-movimiento.ts` no refrescaba la tabla tras recibir la respuesta del API (le faltaba `ChangeDetectorRef.detectChanges()`, presente en los componentes hermanos) — bug preexistente, no introducido por esta funcionalidad, pero descubierto al usarla.
2. La base de datos del tenant `geocobre` estaba desactualizada (solo 3 de 26 migraciones aplicadas) — se puso al día aplicando todas las migraciones pendientes; no es un cambio de código.

## Capabilities

### Modified Capabilities
- `accounting-ui`: se agrega el flujo de registro de Transferencias Internas (selección de cuenta origen/destino, creación atómica de ambas patas, restricción de edición/eliminación individual) y su representación en el listado de movimientos.
- `dashboard-financiero`: se ajustan las fórmulas de los KPIs de Ingresos/Egresos del mes para excluir movimientos de `SourceType = InternalTransfer`, evitando inflar las cifras brutas sin alterar el resultado neto ni los saldos por cuenta.

## Impact

- **Backend**:
  - `GeoServ.Api/Domain/Enums/MovementSourceType.cs`: nuevo valor `InternalTransfer`.
  - `GeoServ.Api/Domain/Entities/AccountingMovement.cs`: nueva propiedad `Guid? TransferGroupId`.
  - Nueva migración EF Core aditiva (columna nullable, sin backfill).
  - `GeoServ.Api/Endpoints/AccountingMovementEndpoints.cs`: nuevos endpoints `POST /api/movements/transfer` y `DELETE /api/movements/transfer/{transferGroupId}`; guarda en `PUT`/`DELETE /api/movements/{id}` para rechazar movimientos con `TransferGroupId` asignado.
  - `GeoServ.Api/Endpoints/FinancialDashboardEndpoints.cs`: filtro adicional `SourceType != InternalTransfer` en el cálculo de `incomeCurrentMonth`, `incomeTrend` y `expensesCurrentMonth` dentro de `/kpis`.
  - `GeoServ.Api/Domain/Entities/MovementCategory.cs`: nueva propiedad `bool IsSystemDefault`.
  - `GeoServ.Api/Endpoints/MovementCategoryEndpoints.cs`: `PUT`/`DELETE` rechazan categorías `IsSystemDefault`; `POST` fuerza `IsSystemDefault = false`.
  - Dos migraciones EF Core adicionales: columna `IsSystemDefault` + `UpdateData` marcando las dos categorías de transferencia existentes.
- **Frontend**:
  - `movement.service.ts`: nuevo método `createTransfer(...)` y `deleteTransfer(transferGroupId)`.
  - `movimiento-form.component.ts`: nuevo modo "Transferencia" con selección de cuenta origen/destino, disponible también en edición para convertir un movimiento existente (borra y recrea como transferencia).
  - `movimientos.ts` / `.html`: nueva etiqueta de origen y acción de borrado acorde para filas con `TransferGroupId`.
  - `movement-category.service.ts`: nuevo campo `isSystemDefault` en la interfaz `MovementCategory`.
  - `categorias-movimiento.ts` / `.html` / `.css`: oculta editar/eliminar y agrega chip "Sistema" para categorías `isSystemDefault`; corrección del refresco de tabla (`ChangeDetectorRef`).
