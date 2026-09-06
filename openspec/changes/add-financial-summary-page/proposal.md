## Why
Agregar una página de **Resumen Financiero** que muestre, en una única vista,
- la lista de cuentas bancarias con su saldo calculado a partir de los movimientos,
- el estado y detalle de los cheques (en cartera, depositado, acreditado, rechazado).

Esto permite a los usuarios obtener rápidamente la situación financiera sin
navegar por múltiples dashboards.

## What Changes
- Nuevo endpoint API `GET /api/financial-summary` que devuelve los saldos por cuenta y el listado de cheques.
- Nuevo componente UI `FinancialSummaryPage` en el frontend que consume ese endpoint.
- Actualización del menú de navegación para incluir la opción “Resumen financiero”.

## Capabilities

### New Capabilities
- `financial-summary`: Expone la información consolidada de cuentas y cheques.

### Modified Capabilities
*(none)*

## Impact
- Backend: Añadir consultas a `FinancialAccount` y `Check` en `GeoServ.Api`.
- Frontend: crear página React bajo `frontend/src/app/features/finance/FinancialSummaryPage`.
- Menú: agregar ruta en `frontend/src/app/layout/NavMenu.tsx`.
