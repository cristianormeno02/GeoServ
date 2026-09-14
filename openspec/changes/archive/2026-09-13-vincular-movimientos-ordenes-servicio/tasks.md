## 1. Configuración de Empresa y Modelo de Datos

- [x] 1.1 Registrar clave `os_collected_amount_mode` en `EmpresaConfiguracion` con valor por defecto `'Manual'` y soporte para valor `'Automatic'`. Verificar mediante pruebas de consulta y actualización en `EmpresaConfiguracionService`.
- [x] 1.2 Agregar propiedades `IsAssignableViaMovement` a `DirectCostCategory` e `IsFromMovement` a `DirectCost`. Generar y aplicar migración EF Core (`AddMovementAssignmentToDirectCosts`). Verificar que las entidades se mapeen correctamente.

## 2. Sincronización y Reglas de Negocio en Backend

- [x] 2.1 Implementar método `SyncCollectionAsync` (en `ServiceOrderFinanceSyncService`) para recalcular `CollectedAmount`, gestionar transiciones a "Cobrada" (`CollectedAmount >= TotalAmount` y estado "Entregada") con `CollectionDate = Min(Date)` y reversiones a "Entregada" (`CollectedAmount < TotalAmount` y estado "Cobrada") con `CollectionDate = null`. Verificar con pruebas unitarias en `GeoServ.Api.Tests`.
- [x] 2.2 Implementar la sincronización de costos directos con aislamiento total (Enfoque 1) en `ServiceOrderFinanceSyncService`, dividida en `ResolveOrCreateDirectCostRowAsync` (busca/crea la fila `IsFromMovement == true` de la categoría/orden, evitando adoptar filas manuales) y `RecalculateDirectCostRowAsync` (recalcula el importe sumando los movimientos ya vinculados a esa fila y la elimina físicamente si la suma llega a 0). Nota de implementación: se dividió en dos métodos en vez de uno solo (`SyncServiceOrderDirectCostAsync`, como sugería el design.md) para resolver de forma simple el caso de arranque en el que todavía no existe ninguna fila `IsFromMovement` para esa categoría/orden. Verificado con pruebas unitarias en `GeoServ.Api.Tests` (`ServiceOrderFinanceSyncTests`).
- [x] 2.3 Integrar sincronizaciones en `AccountingMovementEndpoints.cs`:
  - `POST /api/movements`: valida `IsAssignableViaMovement` de la categoría de costo directo, sincroniza orden en ingresos y sincroniza/crea costo directo contable en egresos.
  - `PUT /api/movements/{id}`: captura `oldServiceOrderId` y `oldDirectCostId` antes de la mutación; si cambian entidades o montos, sincroniza combinaciones anteriores y nuevas.
  - `DELETE /api/movements/{id}`: ejecuta hard-delete y sincroniza tanto cobros como costos directos contables de la orden vinculada.
  Verificado con pruebas de integración de movimientos (`ServiceOrderFinanceSyncTests`).
- [x] 2.4 Actualizar `DirectCostMasterEndpoints.cs` para soportar lectura y persistencia de `IsAssignableViaMovement` en `GET`, `POST` y `PUT /api/direct-cost-categories`.
- [x] 2.5 Actualizar endpoint `POST /api/service-orders/{id}/deliver` para que órdenes con cobro anticipado completo (`CollectedAmount >= TotalAmount`) transicionen directamente a "Cobrada" con la fecha del primer cobro registrado. Verificado con prueba nueva en `ServiceOrderDeliverTests`.
- [x] 2.6 Modificar `PUT /api/service-orders/{id}` en `ServiceOrderEndpoints.cs`: en modo `Automatic`, protege `order.CollectedAmount` contra sobrescritura manual. La protección de costos directos `IsFromMovement == true` se implementó en su propio endpoint (`DirectCostEndpoints.cs` PUT/DELETE de `/api/service-orders/{id}/direct-costs/{id}`), que es el que realmente permite editar/eliminar una fila puntual.
- [x] 2.7 Implementar endpoint `GET /api/service-orders/{id}/movements` que retorna el listado de movimientos de cobro asociados con fecha, monto, cuenta, medio de pago y descripción.
- [x] 2.8 Implementar endpoint administrativo `POST /api/service-orders/recalculate-collections` para sincronizar y actualizar en masa el `CollectedAmount` y estados de órdenes preexistentes, procesando cada orden de forma independiente.
- [x] 2.9 Integrar generación de `ServiceOrderObservation` (`ObservationType = "Hito Clave"`) dentro de `SyncCollectionAsync` y `RecalculateDirectCostRowAsync`/`ResolveOrCreateDirectCostRowAsync` para registrar en la bitácora cada alta, edición o baja de cobros y de costos directos vía movimiento (no solo las transiciones de estado). Verificado con pruebas unitarias que confirman la creación de la observación en cada caso.

## 3. Frontend: Movimientos, Orden de Servicio y Configuración

- [x] 3.1 Actualizar el mantenedor de Categorías de Costo Directo en frontend para incluir el control/switch "Asignable vía movimiento" (`isAssignableViaMovement`).
- [x] 3.2 Modificar `MovimientoFormComponent` implementando el reemplazo completo (Opción C): se retiró `DirectCostSearchDialogComponent`; al seleccionar un egreso con categoría de costo directo se presenta el selector de `DirectCostCategory` (filtrando solo las que tienen `isAssignableViaMovement == true`) y el buscador de `ServiceOrder` (reutilizando `ServiceOrderSearchDialogComponent`).
- [x] 3.3 Actualizar `ServiceOrderFormComponent` para consultar `os_collected_amount_mode` (vía `EmpresaConfigService.getSettings()`, ya usado para `os_number_format`) y deshabilitar `collectedAmount` cuando el modo sea `Automatic`, con ícono de candado y tooltip informativo.
- [x] 3.4 En la sección de Costos Directos de `ServiceOrderFormComponent`, se reemplazan las acciones de edición/eliminación por un ícono de candado con tooltip para filas con `isFromMovement == true`, se agrega badge "Vía Movimientos", estilo de fila diferenciado (borde de acento), y desglose de subtotales (Costo Manual / Costo Vía Movimientos / Costo Directo Total) debajo de la grilla.
- [x] 3.5 Incorporar tabla de desglose de movimientos de cobro en la pestaña financiera de `ServiceOrderFormComponent`, consumiendo `GET /api/service-orders/{id}/movements`, con totalizador.
- [x] 3.6 Agregar selector de modalidad de cobro (`Manual` / `Automatic`) y botón de sincronización masiva con modal de confirmación (`ConfirmDialogComponent`) en el módulo de Configuración de Empresa.
- [x] 3.7 Corregir `CopyDirectCostsDialogComponent` (excluye filas `isFromMovement == true` del listado de origen) y `openCopyDirectCostsDialog()` en `ServiceOrderFormComponent` (crea cada fila copiada con `quantity = 1`, unidad por defecto resuelta vía `UnitService`, `unitPrice = 0`, `totalAmount = 0` e `isFromMovement = false`, conservando `categoryId`, `description` y `providerId`).

## 4. Verificación y Calidad

- [x] 4.1 Ejecutar suite completa de tests de backend (`dotnet test`): **49/49 pruebas pasan** (41 preexistentes + 8 nuevas en `ServiceOrderFinanceSyncTests.cs` y `ServiceOrderDeliverTests.cs`).
- [x] 4.2 Verificar compilación limpia de frontend (`ng build`): **build exitoso**, sin errores (solo warnings preexistentes no relacionados con este cambio). Nota: `npm test` no es ejecutable en este proyecto — `angular.json` no tiene un builder `test` configurado (gap preexistente, no introducido por este cambio), por lo que no hay suite de tests de frontend que correr.
