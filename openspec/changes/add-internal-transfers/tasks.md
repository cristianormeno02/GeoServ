## 1. Backend: Modelo de datos

- [x] 1.1 Agregar el valor `InternalTransfer` al enum `MovementSourceType` en `backend/GeoServ.Api/Domain/Enums/MovementSourceType.cs`.
- [x] 1.2 Agregar la propiedad `Guid? TransferGroupId` a `backend/GeoServ.Api/Domain/Entities/AccountingMovement.cs` y su índice (`HasIndex`) en `GeoServDbContext.cs`.
- [x] 1.3 Generar la migración EF Core aditiva (`dotnet ef migrations add AddTransferGroupToAccountingMovement --project backend/GeoServ.Api`), confirmando que solo agrega la columna nullable y **no** incluye ningún `UPDATE` sobre filas existentes. Verificar con `dotnet ef migrations script`.

## 2. Backend: Endpoints de transferencia

- [x] 2.1 Implementar `POST /api/movements/transfer` en `backend/GeoServ.Api/Endpoints/AccountingMovementEndpoints.cs`: valida cuenta origen ≠ destino, monto > 0, ambas cuentas activas y misma `CurrencyId`; crea ambas patas (Egreso en origen, Ingreso en destino) reutilizando las `MovementCategory` semilla "Transferencia Interna (Egreso/Ingreso)" por su Id conocido, mismo `TransferGroupId` (nuevo Guid), `SourceType = InternalTransfer`, en una única transacción.
- [x] 2.2 Implementar `DELETE /api/movements/transfer/{transferGroupId}` que elimina ambas patas atómicamente.
- [x] 2.3 Modificar `PUT /api/movements/{id}` y `DELETE /api/movements/{id}` para rechazar (HTTP 400) cualquier movimiento con `TransferGroupId != null`, indicando que debe usarse el endpoint de transferencia. Confirmar que movimientos con `TransferGroupId == null` (todo el histórico actual) no cambian su comportamiento.
- [x] 2.4 Agregar pruebas unitarias/integración cubriendo: creación atómica exitosa, rechazo por cuentas iguales, rechazo por monedas distintas, rechazo de `PUT`/`DELETE` individual sobre una pata de transferencia, y que un movimiento histórico sin `TransferGroupId` sigue editable/eliminable individualmente sin cambios. Verificar con `dotnet test backend/GeoServ.Api.Tests`. (`InternalTransferTests.cs`, 9 tests — todos verdes)

## 3. Backend: Dashboard financiero

- [x] 3.1 En `backend/GeoServ.Api/Endpoints/FinancialDashboardEndpoints.cs`, agregar el filtro `SourceType != MovementSourceType.InternalTransfer` a `incomeCurrentMonth`, `incomeTrend` y `expensesCurrentMonth` dentro de `/api/dashboard/financial/kpis`. No modificar el cálculo de saldo por cuenta ni `FinancialSummaryEndpoints.cs`.
- [x] 3.2 Prueba de integración: crear una transferencia y verificar que no afecta `incomeCurrentMonth`/`expensesCurrentMonth` pero sí modifica correctamente el saldo de ambas cuentas involucradas. (`FinancialDashboardKpiExclusionTests.cs`)

## 4. Frontend: Servicio y formulario

- [x] 4.1 Extender `frontend/src/app/features/finance/services/movement.service.ts` con `createTransfer(payload)` y `deleteTransfer(transferGroupId)`.
- [x] 4.2 Extender `frontend/src/app/features/finance/movimientos/movimiento-form.component.ts` con un tercer modo "Transferencia entre Cuentas": oculta categoría y origen polimórfico, muestra selectores de Cuenta Origen / Cuenta Destino, y llama a `createTransfer`.
- [x] 4.3 Verificar compilación con `npm run build` en `frontend`.

## 5. Frontend: Listado de movimientos

- [x] 5.1 En `frontend/src/app/features/finance/movimientos/movimientos.ts`/`.html`, agregar etiqueta "Transferencia Interna" a `sourceTypeLabels` y mostrar cuenta origen → cuenta destino en la columna Origen para filas con `SourceType = InternalTransfer`.
- [x] 5.2 Adaptar la acción de eliminar en el listado para que, si la fila tiene `TransferGroupId`, llame a `deleteTransfer` (con confirmación explicando que se eliminan ambas patas) en vez de al borrado individual.

## 6. Verificación integral

- [ ] 6.1 Prueba manual: crear una transferencia entre dos cuentas existentes con datos reales de desarrollo, confirmar que aparecen dos movimientos vinculados, que los saldos de ambas cuentas se actualizan correctamente, que el KPI de ingresos/egresos del mes no se infla, y que intentar editar/eliminar una sola pata desde el listado general es rechazado. **Pendiente**: requiere aplicar la migración (`dotnet ef database update`) contra la base de datos real (Supabase remota compartida) — no se ejecutó sin confirmación explícita del usuario por tratarse de una base compartida/productiva.
- [x] 6.2 Confirmar que los movimientos existentes previos al cambio (incluyendo los que ya usan las categorías "Transferencia Interna") siguen funcionando exactamente igual: visibles, editables y eliminables individualmente, sin `TransferGroupId`. (cubierto por tests unitarios: `MovimientoHistoricoSinTransferGroupId_PermaneceIntacto`, `UpdateMovementAsync_MovimientoHistoricoSinTransferGroupId_SePuedeEditarNormalmente`)
