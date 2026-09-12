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
- **Frontend**:
  - `movement.service.ts`: nuevo método `createTransfer(...)` y `deleteTransfer(transferGroupId)`.
  - `movimiento-form.component.ts`: nuevo modo "Transferencia" con selección de cuenta origen/destino.
  - `movimientos.ts` / `.html`: nueva etiqueta de origen y acción de borrado acorde para filas con `TransferGroupId`.
