## 1. Backend - Cálculo de Saldos y Proyección Paginada

- [x] 1.1 Modificar el endpoint `GET /api/movements/` en `AccountingMovementEndpoints.cs` para calcular `initialBalance`, `periodIncome`, `periodExpense`, `finalBalance` y `balanceAfter` por movimiento cuando `financialAccountId` esté presente, y verificar la compilación con `dotnet build`.
- [x] 1.2 Agregar tests en `GeoServ.Api.Tests` para validar el cálculo de saldo inicial previo a la fecha desde, saldos entre páginas y exclusión de saldos cuando no se filtra por cuenta, y verificar con `dotnet test`.

## 2. Frontend - Servicios e Integración de Datos

- [x] 2.1 Actualizar las interfaces y métodos de `MovementService` en `movement.service.ts` para tipar `AccountSummary` y `balanceAfter`, y verificar que no genere errores de TypeScript.
- [x] 2.2 Actualizar `movimientos.ts` para procesar `accountSummary`, controlar la presencia de la columna `'balance'` en `displayedColumns` según el filtro de cuenta, y capturar query params iniciales.

## 3. Frontend - Interfaz de Usuario y Estilos

- [x] 3.1 Añadir en `movimientos.html` el bloque de métricas/tarjetas de resumen de saldos (Saldo Inicial, Ingresos, Egresos, Saldo Final) visible cuando una cuenta esté seleccionada.
- [x] 3.2 Añadir en `movimientos.html` la columna "Saldo" en la tabla con formato de moneda y diferenciación visual para saldos negativos.
- [x] 3.3 Aplicar estilos en `movimientos.css` para la barra de resumen de saldos y la columna de saldo.

## 4. Verificación y Calidad

- [x] 4.1 Ejecutar pruebas unitarias de backend con `dotnet test`.
- [x] 4.2 Ejecutar compilación y linting del frontend con `npm run build` en el workspace de Angular.
