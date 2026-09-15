## Why

Actualmente, el Libro Diario (Movimientos Financieros) permite consultar los ingresos y egresos de forma cronológica y filtrar por cuenta financiera. Sin embargo, al auditar una cuenta bancaria o caja chica específica, el usuario no puede visualizar el saldo inicial previo al período ni el saldo resultante progresivo tras cada movimiento, lo cual dificulta la conciliación bancaria y el seguimiento del flujo de fondos sin tener que recurrir a cálculos manuales.

## What Changes

- **Saldos en consulta de movimientos por cuenta (Backend)**: El endpoint `GET /api/movements/` incluirá, cuando se filtre por una cuenta financiera específica (`financialAccountId`):
  - `initialBalance`: Saldo acumulado de la cuenta antes de la `startDate` seleccionada.
  - `periodIncome`: Sumatoria de ingresos en el período para dicha cuenta.
  - `periodExpense`: Sumatoria de egresos en el período para dicha cuenta.
  - `finalBalance`: Saldo de la cuenta al cierre del período (`initialBalance + periodIncome - periodExpense`).
  - `balanceAfter` en cada elemento del listado: Saldo acumulado resultante tras el movimiento, calculado secuencialmente respetando la paginación.
- **Barra de resumen de saldos (Frontend)**: En la pantalla del Libro Diario, al filtrar por una cuenta puntual, se exhibirá un bloque resumen con Saldo Inicial, Ingresos (+), Egresos (-) y Saldo Final.
- **Columna dinámica de Saldo Resultante (Frontend)**: La tabla de movimientos agregará dinámicamente la columna "Saldo" cuando se filtre por cuenta individual, ocultándola cuando el filtro esté en "Todas las cuentas" para evitar inconsistencias multicuenta.
- **Soporte de navegación con parámetros de URL (Frontend)**: Permitir acceder a `/movimientos` con query params (`financialAccountId`, `startDate`, `endDate`) para precargar automáticamente los filtros.

## Capabilities

### Modified Capabilities
- `accounting-ui`: Extender la especificación de visualización de movimientos contables para requerir el cálculo y presentación de saldos iniciales, progresivos y finales al filtrar por una cuenta financiera específica.

## Impact

- **Backend**: `GeoServ.Api/Endpoints/AccountingMovementEndpoints.cs` (cálculo de saldo inicial, totales de período y saldo progresivo paginado).
- **Frontend**:
  - `frontend/src/app/features/finance/services/movement.service.ts` (actualización de interfaces DTO y respuesta paginada).
  - `frontend/src/app/features/finance/movimientos/movimientos.ts` y `movimientos.html` / `movimientos.css` (lógica de visualización de saldos, columna dinámica, query params de ruta).
