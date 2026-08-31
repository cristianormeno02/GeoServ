## Why

La dirección y los socios de GeoServ necesitan evaluar con claridad y precisión la salud económica del negocio respondiendo a: **"¿cómo está la salud de la plata de la empresa, y qué tan rentable es lo que estamos haciendo?"**. El requerimiento central planteado por el cliente principal es el **Informe de Cobertura Mensual**, el cual determina si la facturación de cada mes es suficiente para absorber los costos fijos, costos directos y honorarios esperados de los profesionales, y arrastra el déficit o superávit acumulado a lo largo del tiempo. Actualmente, esta información requiere consolidaciones manuales complejas y no existe visibilidad en tiempo real de márgenes, vencimientos de pasivos ni distribución de ingresos.

## What Changes

Se implementa el **Dashboard Financiero** con una arquitectura de BI financiero (estilo Qlik/Power BI), destacando el **Informe de Cobertura Mensual** como el widget de mayor jerarquía visual del panel, acompañado por endpoints de lectura especializados y componentes gráficos interactivos:

- **Widgets & Endpoints de Lectura**:
  1. **KPI Cards Financieras**:
     - *Con Sparkline*: Saldo total en cuentas (`FinancialAccount`) e Ingresos del mes actual con tendencia histórica (últimos N períodos).
     - *Sin Sparkline (Valor + Variación)*: Resultado neto del mes y Saldo Acumulado de Cobertura (con color semántico dinámico: verde si es positivo/cubierto, rojo si existe déficit acumulado).
  2. **Gauge "Cobertura del mes"**: Ratio porcentual de cobertura mensual: `Ingresos / (GastosFijos + GastosDirectos + Honorarios) * 100`.
  3. **Gauge "Margen promedio por orden"**: Margen porcentual promedio `(Ingreso - GastosDirectos) / Ingreso` de las órdenes cobradas en el período seleccionado (default últimos 3 meses).
  4. **Informe de Cobertura Mensual (Widget Principal)**:
     - Cálculo consolidado por mes:
       - `Ingresos`: `SUM(AccountingMovement.Monto WHERE SourceType=ServiceOrderIncome)`.
       - `GastosFijos`: `SUM(AccountingMovement.Monto WHERE SourceType=FixedCostPayment)`.
       - `GastosDirectos`: `SUM(AccountingMovement.Monto WHERE SourceType=DirectCost)`.
       - `Honorarios`: `SUM(ServiceOrderDistribution.MontoEsperado WHERE Concepto=Honorarios)` correspondiente a las órdenes con cobro ingresado en dicho mes.
       - `ResultadoMes`: `Ingresos - (GastosFijos + GastosDirectos + Honorarios)`.
       - `SaldoAcumulado`: Arrastre acumulado histórico mediante función de ventana SQL `SUM(ResultadoMes) OVER (ORDER BY Periodo ROWS UNBOUNDED PRECEDING)`.
     - Implementación mediante una vista SQL (`vw_MonthlyCoverageReport`) mapeada en EF Core como entidad keyless.
     - Visualización: Gráfico combinado `combo-chart` con barras para Ingresos vs. Costos Totales y una línea superpuesta para el Saldo Acumulado, compartiendo estrictamente el **mismo eje Y en pesos**.
  5. **Aging de "Gastos Fijos por Vencer"**: Gráfico de barras por rango de vencimiento (`Vencido`, `0-7 días`, `8-15 días`, `16-30 días`) sobre `FixedCostPayment` en estado pendiente.
  6. **Proyección de Egresos Comprometidos**: Suma de `FixedCostPayment` pendientes agrupados en horizontes de 30, 60 y 90 días desde la fecha actual.
  7. **Rentabilidad por Orden de Servicio**: Ranking (Top y Bottom 10) de órdenes según su margen absoluto y porcentual (`Ingreso - SUM(DirectCost)`), con filtro por rango de fechas.
  8. **Distribución de Ingresos y Honorarios**: Agrupación de `ServiceOrderDistribution` por `Concepto` y por `Responsable` (socio/profesional), comparando `MontoEsperado` vs. `MontoReal`.
  9. **Costos por Categoría y Proveedor**: Desglose de `DirectCost` clasificado por `DirectCostCategory` y por `Provider`, con período seleccionable.
  10. **Evolución de Gastos Fijos por Categoría**: Gráfico de evolución temporal de `FixedCostPayment` efectivamente pagados por mes y clasificados por `FixedCostCategory`.
  11. **Valor y Compras de Activos**: Total de adquisiciones de activos (`AssetPurchase`) del período y valor acumulado histórico del patrimonio en activos.

- **Decisiones Clave de Diseño**:
  - *Fuente de Honorarios en Cobertura*: Los honorarios se extraen de `ServiceOrderDistribution.MontoEsperado` (lo configurado y devengado en la orden al cobrarse) y **no** de movimientos de caja de retiros (`vw_AccountingMovementDetail`), ya que los retiros reales pueden ocurrir meses después o no reflejar el compromiso financiero generado por la orden en el mes de su cobro.
  - *Jerarquía Visual Prioritaria*: El Informe de Cobertura se sitúa en la parte superior y con ancho destacado (full-width) en el dashboard, pues responde de forma directa la métrica troncal de sustentabilidad del negocio.
  - *Regla de Eje Y Único*: Todos los gráficos combinados respetan un solo eje de escala monetaria ($).

- **Fuera de Alcance (Non-goals)**:
  - Generación de asientos contables formales por partida doble o balances contables para entes fiscales (el enfoque es puramente de gestión económica y cobertura operativa/financiera).
  - Ejecución de pagos o transferencias bancarias desde el panel.
  - Proyecciones predictivas basadas en modelos de machine learning (se emplean reglas determinísticas de proyección de pagos programados a 30/60/90 días).

## Capabilities

### New Capabilities
- `dashboard-financiero`: Endpoints, vista SQL de cobertura con arrastre de saldo, read-models, componentes visuales de BI (combo chart, KPIs financieros, aging de deudas, márgenes) y panel integral del Dashboard Financiero de GeoServ.

### Modified Capabilities

## Impact

- **Base de Datos & EF Core**: Creación de la vista SQL `vw_MonthlyCoverageReport` con función de ventana analítica y mapeo como keyless entity `MonthlyCoverageReport` en `GeoServDbContext`.
- **Backend**: Nuevo grupo de endpoints `/api/dashboard/financial/*` en `FinancialDashboardEndpoints.cs` con resolución multitenant estricta.
- **Frontend**: Componente reutilizable `combo-chart` en `src/app/shared/components/charts/` y la vista completa del Dashboard Financiero en `src/app/features/dashboard-financiero/`.
