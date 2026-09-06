## 1. Backend: Endpoints de Costos Directos y Persistencia en Movimientos

- [x] 1.1 Crear pruebas unitarias en `GeoServ.Api.Tests` para `GET /api/direct-costs` y creación de movimientos vinculando `DirectCostId`.
- [x] 1.2 Exponer `GET /api/direct-costs` y `GET /api/direct-costs/{id}` en `DirectCostEndpoints.cs`.
- [x] 1.3 Asignar claves foráneas relacionales (`DirectCostId`, `FixedCostId`, `ServiceOrderId`, `AssetId`) en `CreateMovement` y `UpdateMovement` dentro de `AccountingMovementEndpoints.cs`.
- [x] 1.4 Ejecutar `dotnet test backend/GeoServ.Api.Tests` y verificar que las pruebas pasen satisfactoriamente.

## 2. Frontend: Enriquecimiento de Opciones en Formulario de Movimientos

- [x] 2.1 Mejorar `mapFn` en `movimiento-form.component.ts` para el tipo `DirectCost` mostrando formato descriptivo con número de OS, descripción, categoría y monto.
- [x] 2.2 Verificar que las demás opciones (`FixedCostPayment`, `ServiceOrderIncome`, `AssetPurchase`) sigan intactas.
- [x] 2.3 Compilar el frontend con `npm run build` en el directorio `frontend`.

## 3. Validación y Pruebas Integrales

- [x] 3.1 Verificar que no haya regresiones en los endpoints existentes ni en la suite de pruebas.
- [x] 3.2 Sincronizar OpenSpec y documentar resultados en el walkthrough.
