## 1. Backend

- [x] 1.1 Crear endpoint `GET /api/financial-summary` en `FinancialSummaryEndpoints.cs` con cálculo dinámico de saldos y agrupación de cheques.
- [x] 1.2 Registrar el endpoint en `Program.cs` con autorización.

## 2. Frontend: Modelos y Servicios

- [x] 2.1 Crear `financial-summary.service.ts` con tipado para `AccountSummary`, `CheckSummary`, `QuickSummary` y método `getSummary()`.

## 3. Frontend: Componente y Vista

- [x] 3.1 Crear `FinancialSummaryComponent` standalone con detección de cambios y control de errores.
- [x] 3.2 Implementar tarjetas KPI superiores (Sparkline Cards) con tamaño adaptable.
- [x] 3.3 Implementar gráfico Donut de cheques por estado y columnas de tarjetas de cheques acreditados y rechazados.
- [x] 3.4 Implementar pestañas para Cuentas Bancarias y Cheques con buscador y filtros por estado/tipo.
- [x] 3.5 Integrar botones y tooltips de ayuda (`help_outline`) con el estilo del Dashboard Operativo.
- [x] 3.6 Configurar ruta `/finanzas/resumen` en `app.routes.ts`.
