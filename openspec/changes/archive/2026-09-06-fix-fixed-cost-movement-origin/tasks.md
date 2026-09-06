## 1. Backend: Sincronización del contrato de actualización de movimientos

- [x] 1.1 Actualizar `UpdateMovementRequest` en `AccountingMovementEndpoints.cs` para incluir `SourceType` y `SourceId`, y adaptar el endpoint `PUT /api/movements/{id}` para persistir el origen polimórfico prioritariamente verificando la compilación con `dotnet build backend/GeoServ.Api`.

## 2. Frontend: Corrección de consulta y visualización de gastos fijos

- [x] 2.1 Actualizar `loadSourceOptions` en `movimiento-form.component.ts` para que `FixedCostPayment` consulte `/fixed-cost-items` en lugar de la ruta inexistente `/fixed-cost-payments`.
- [x] 2.2 Mejorar `mapFn` en `movimiento-form.component.ts` para incluir la categoría del gasto fijo junto al nombre si está disponible.
- [x] 2.3 Armonizar la etiqueta de la opción visual a "Pago de Gasto Fijo" en el template de `movimiento-form.component.ts`.
- [x] 2.4 Verificar que el frontend compila correctamente mediante `npm run build` en el directorio `frontend`.

## 3. Pruebas y Validación Integral

- [x] 3.1 Ejecutar la suite de pruebas automatizadas del backend con `dotnet test` y asegurar que no haya regresiones.
- [x] 3.2 Validar la apertura del formulario de movimiento, selección de categoría y tipo de origen "Pago de Gasto Fijo", comprobando que el desplegable lista los gastos fijos existentes.
