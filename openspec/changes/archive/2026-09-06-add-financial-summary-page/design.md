## Context

Diseño técnico para la implementación de la nueva página **Resumen Financiero**.
El objetivo es presentar de forma unificada el saldo consolidado de cuentas bancarias/efectivo y el estado de la cartera de cheques.

## Goals / Non-Goals

**Goals:**
- Exponer endpoint `GET /api/financial-summary` con datos consolidados de cuentas, cheques y resumen rápido.
- Mostrar en el frontend tarjetas KPI con saldo consolidado, cuentas activas y cheques por estado.
- Incluir gráfico donut con la distribución de cheques y tablas interactivas con filtros y búsqueda.
- Añadir tooltips informativos con el estilo del Dashboard Operativo.

**Non-Goals:**
- Reportes contables avanzados con flujo de caja proyectado o amortizaciones (requieren entidades no existentes).

## Decisions

1. **Backend**:
   - Endpoint `GET /api/financial-summary` en `FinancialSummaryEndpoints.cs` con `.RequireAuthorization()`.
   - Cálculo de saldo por cuenta mediante LINQ sobre `AccountingMovements` (`IsIncome ? Amount : -Amount`).
   - Mapeo de estados de cheques usando `CheckStatus` enum (`InPortfolio`, `Deposited`, `Accredited`, `Rejected`).
2. **Frontend**:
   - Componente standalone `FinancialSummaryComponent` bajo `src/app/features/finance/resumen/`.
   - Servicio `FinancialSummaryService` tipado con `AccountSummary`, `CheckSummary` y `QuickSummary`.
   - Integración de `SparklineCardComponent`, `DonutChartComponent` y Angular Material (`mat-card`, `mat-tabs`, `mat-tooltip`).
