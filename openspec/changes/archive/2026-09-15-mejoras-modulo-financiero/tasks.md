## 1. Backend: Endpoint de Detalle de Movimiento

- [x] 1.1 Modificar `GetMovementById` en `AccountingMovementEndpoints.cs` para incluir `.Include(m => m.DirectCost).ThenInclude(dc => dc!.ServiceOrder)` y proyectar `ServiceOrderNumber` resolviendo tanto la OS directa como la OS asociada al costo directo.
- [x] 1.2 Actualizar y ejecutar las pruebas en `backend/GeoServ.Api.Tests/LinkMovementCategoriesToOriginTests.cs` (o test suite correspondiente) verificando que el detalle del movimiento exponga `ServiceOrderNumber` para egresos de costo directo.

## 2. Frontend: Controles de Fecha y Persistencia en Movimientos

- [x] 2.1 Reemplazar en `src/app/features/finance/movimientos/movimientos.html` el control `mat-date-range-input` por dos campos de formulario `<mat-form-field>` independientes ("Fecha Desde" y "Fecha Hasta") con selectores de fecha individuales.
- [x] 2.2 Agregar el validador reactivo cruzado `dateRangeValidator` a `filterForm` en `movimientos.ts` para validar que `startDate` no sea posterior a `endDate` y reflejar el error en la interfaz.
- [x] 2.3 Implementar la persistencia en `localStorage` del rango de fechas seleccionado al filtrar y su restauración automática al inicializar `Movimientos`, restableciendo el valor por defecto al limpiar filtros.

## 3. Frontend: Visualización de Orden de Servicio en Listado y Edición

- [x] 3.1 Actualizar `getSourceReference()` en `movimientos.ts` para que en movimientos de tipo `DirectCost` con Orden de Servicio asociada se muestre la referencia del costo directo acompañada del número de orden (ej. `Canon Secretaria (OS: OS-2026-0012)`).
- [x] 3.2 Modificar `movimiento-form.component.ts` para que al cargar un movimiento de tipo `DirectCost` en modo edición, el control de Orden de Servicio (`sourceLabel`) se inicialice con el número de orden (`serviceOrderNumber`) en lugar de la descripción del costo directo.

## 4. Frontend: Resumen Financiero y Dashboard

- [x] 4.1 Agregar función/mapeo de etiquetas legibles en `financial-summary.component.ts` y actualizar `financial-summary.component.html` para mostrar "Cuenta Bancaria", "Efectivo" o "Billetera Digital" en la columna Tipo de cuenta.
- [x] 4.2 Ajustar la altura responsive (a 320px), viewBox y proporciones de barras en `combo-chart.component.ts` para optimizar la visualización y legibilidad del gráfico de Cobertura Mensual en pantallas completas.

## 5. Verificación y Calidad

- [x] 5.1 Ejecutar los tests de backend con `dotnet test` y verificar que pasen al 100%.
- [x] 5.2 Ejecutar la compilación del frontend con `npm run build` (o validación equivalente) comprobando que no existan errores de tipos ni de plantillas.
