## Context

El Dashboard Financiero es el centro de control económico de GeoServ. La pregunta central del negocio es la sustentabilidad y cobertura mensual, que requiere contrastar los ingresos efectivamente percibidos por órdenes de servicio contra todos los costos del mes (costos fijos devengados/pagados, costos directos y los honorarios profesionales pactados por orden), permitiendo arrastrar el saldo acumulado en el tiempo para saber si la empresa está en superávit o en déficit operativo.

## Goals / Non-Goals

**Goals:**
- Implementar la vista analítica SQL `vw_MonthlyCoverageReport` con funciones de ventana para arrastre de saldo acumulado histórico y mapearla en EF Core como entidad keyless.
- Exponer endpoints especializados bajo `/api/dashboard/financial/*` para cada uno de los 11 widgets con soporte de filtros por rango de fechas (default: últimos 12 meses para informes anuales, últimos 3 meses para márgenes).
- Crear el componente reutilizable `ComboChartComponent` en Angular que combine barras de Ingresos vs. Costos Totales con una línea superpuesta de Saldo Acumulado compartiendo **estrictamente un único eje Y en pesos**.
- Otorgar la máxima jerarquía visual al Informe de Cobertura Mensual en el diseño de la pantalla.

**Non-Goals:**
- Contabilidad formal de partida doble o balances impositivos.
- Emisión de pagos bancarios o conciliación automática.
- Gráficos con múltiples escalas o doble eje Y (ej. no mezclar porcentajes y montos en el mismo gráfico).

## Decisions

1. **Implementación del Informe de Cobertura mediante Vista SQL (`vw_MonthlyCoverageReport`) vs. Agregación en memoria**:
   - *Decisión*: Se crea una vista en base de datos SQL Server que agrupa mensualmente ingresos de `AccountingMovement` (`SourceType = ServiceOrderIncome`), costos fijos (`SourceType = FixedCostPayment`), costos directos (`SourceType = DirectCost`) y suma los honorarios de `ServiceOrderDistribution` de las órdenes cobradas en el mes. Para el arrastre acumulado se utiliza la función analítica:
     `SUM(Ingresos - (GastosFijos + GastosDirectos + Honorarios)) OVER (ORDER BY Periodo ROWS UNBOUNDED PRECEDING) AS SaldoAcumulado`.
   - *Razón*: La base de datos calcula el saldo acumulado instantáneamente y de forma atómica para todo el histórico, independientemente del rango de meses que el frontend solicite visualizar, evitando traer miles de registros a la memoria de la aplicación.
   - *Alternativa descartada*: Calcular el arrastre en C# requeriría siempre traer todos los meses históricos desde el inicio de los tiempos para cualquier consulta de rango parcial.

2. **Origen de los Honorarios en `ServiceOrderDistribution` y no en `vw_AccountingMovementDetail`**:
   - *Decisión*: El cálculo de honorarios para la cobertura mensual toma `SUM(ServiceOrderDistribution.MontoEsperado WHERE Concepto = Honorarios)` asociado a las órdenes con cobro imputado en el mes.
   - *Razón*: Los honorarios representan el costo devengado por el trabajo profesional que dio origen al ingreso facturado ese mes. Si se leyeran los retiros reales de caja de los socios, se producirían desfasajes (ej. retiros agrupados a fin de año o retiros personales no relacionados con las órdenes del mes).

3. **Jerarquía Visual y Componente `ComboChartComponent`**:
   - *Decisión*: El Informe de Cobertura se ubica en el bloque superior prominente de la interfaz. Se desarrolla el componente `ComboChartComponent` que renderiza barras yuxtapuestas para Ingresos y Costos Totales, más una línea para el Saldo Acumulado sobre el **mismo eje Y monetario**.
   - *Razón*: Ambas métricas comparten la misma unidad ($), cumpliendo la directriz de diseño de panel de BI sin incurrir en confusiones por escalas duales.

4. **Tratamiento Semántico del Saldo Acumulado**:
   - *Decisión*: El KPI card y los indicadores de saldo acumulado adoptan color verde cuando el valor es mayor o igual a cero (superávit/cubierto) y rojo cuando es negativo (déficit financiero acumulado pendiente de cobertura).

## Risks / Trade-offs

- **[Riesgo]** Complejidad de la vista SQL al enlazar `ServiceOrderDistribution` con las fechas de cobro de `AccountingMovement`.
  - *Mitigación*: Agrupar primero las órdenes cobradas por mes vía `SourceType = ServiceOrderIncome` y hacer join con sus respectivas distribuciones agrupadas.
- **[Riesgo]** Cuentas financieras con saldos iniciales anteriores al sistema.
  - *Mitigación*: Soportar movimientos de ajuste/saldo inicial tipo `Manual` en `AccountingMovement` para cuadre de cuentas bancarias.

## Migration Plan

1. Crear migración EF Core que ejecute el script DDL de creación de la vista `vw_MonthlyCoverageReport`.
2. Registrar la entidad keyless `MonthlyCoverageReport` en `GeoServDbContext.OnModelCreating()` vinculada a `ToView("vw_MonthlyCoverageReport")`.
3. Implementar y exponer los endpoints en `FinancialDashboardEndpoints.cs`.
4. Desarrollar y desplegar los componentes de visualización en Angular.
