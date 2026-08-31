## Purpose

Proveer especificaciones de comportamiento y contratos de datos para los endpoints y componentes visuales del Dashboard Financiero de GeoServ, centrados en el Informe de Cobertura Mensual, rentabilidad por orden, márgenes y flujo de egresos comprometidos.

## ADDED Requirements

### Requirement: KPI Cards Financieras
El sistema DEBE proveer un endpoint `/api/dashboard/financial/kpis` que retorne:
- Saldo total por cuenta financiera (`FinancialAccount`) con serie histórica (sparkline).
- Ingresos acumulados del mes actual con serie histórica de los últimos N meses (sparkline).
- Resultado neto del mes actual (`Ingresos - Egresos Totales`) con porcentaje de variación contra el mes anterior.
- Saldo Acumulado de Cobertura histórico con indicador semántico de estado (`Positive` si es mayor o igual a 0, `Negative` si existe déficit acumulado).

#### Scenario: Consulta de métricas financieras del mes
- **WHEN** el usuario consulta las KPIs financieras para el mes corriente
- **THEN** el sistema retorna los valores monetarios actuales, las series para sparklines y el saldo acumulado con su correspondiente estado semántico ("Positive" o "Negative").

#### Scenario: Consulta en tenant sin cuentas financieras ni movimientos
- **WHEN** se consultan las KPIs en una base de datos sin cuentas o movimientos registrados
- **THEN** el sistema retorna saldos en 0, variaciones en 0% y estado semántico "Positive" para saldo acumulado en 0, sin errores de ejecución.

### Requirement: Gauge de Cobertura del Mes
El sistema DEBE proveer un endpoint `/api/dashboard/financial/monthly-coverage-gauge` que calcule el ratio porcentual de cobertura del mes actual según la fórmula: `(Ingresos del Mes / (Gastos Fijos + Gastos Directos + Honorarios Devengados del Mes)) * 100`.

#### Scenario: Mes con ingresos superiores a los costos totales
- **WHEN** los ingresos del mes son $1.500.000 y la suma de gastos fijos, directos y honorarios es $1.000.000
- **THEN** el sistema retorna un ratio de cobertura de 150.0%, indicando cobertura total del mes.

#### Scenario: Mes sin costos ni egresos registrados
- **WHEN** los costos totales del mes son $0
- **THEN** el sistema retorna ratio 100% si hay ingresos o 0% si tampoco hay ingresos, evitando divisiones por cero.

### Requirement: Gauge de Margen Promedio por Orden
El sistema DEBE proveer un endpoint `/api/dashboard/financial/average-order-margin` que devuelva el margen porcentual promedio `((Ingreso - GastosDirectos) / Ingreso) * 100` de todas las órdenes cobradas dentro de un período parametrizable (por defecto los últimos 3 meses).

#### Scenario: Cálculo de margen sobre órdenes cobradas
- **WHEN** se analizan 5 órdenes cobradas con un ingreso total de $1.000.000 y costos directos totales de $400.000
- **THEN** el sistema retorna un margen promedio ponderado de 60.0% junto con la cantidad de órdenes consideradas.

#### Scenario: Período sin órdenes cobradas
- **WHEN** no se registraron órdenes cobradas en el rango de fechas seleccionado
- **THEN** el sistema retorna `averageMarginPercentage: 0.0` y `ordersCount: 0`.

### Requirement: Informe de Cobertura Mensual con Arrastre Acumulado
El sistema DEBE proveer un endpoint `/api/dashboard/financial/monthly-coverage-report` respaldado por la vista SQL `vw_MonthlyCoverageReport` que devuelva una serie cronológica mensual (default últimos 12 meses) con los campos: `Periodo` (YYYY-MM), `Ingresos`, `GastosFijos`, `GastosDirectos`, `Honorarios`, `ResultadoMes` y `SaldoAcumulado`. El campo `SaldoAcumulado` DEBE calcularse acumulando el `ResultadoMes` cronológicamente desde el origen de los tiempos mediante función de ventana SQL.

#### Scenario: Evolución mensual con meses deficitarios y superavitarios
- **WHEN** el usuario solicita el informe de cobertura para los últimos 12 meses
- **THEN** el sistema retorna el desglose mensual exacto donde el `SaldoAcumulado` de cada mes refleja fielmente el arrastre acumulado del déficit o superávit de los meses precedentes.

#### Scenario: Rango de fechas sin movimientos financieros
- **WHEN** se solicita el informe en un tenant recién creado sin movimientos
- **THEN** el sistema retorna un arreglo vacío `[]` con código HTTP 200.

### Requirement: Aging de Gastos Fijos por Vencer
El sistema DEBE proveer un endpoint `/api/dashboard/financial/fixed-costs-aging` que clasifique los registros `FixedCostPayment` en estado `Pendiente` en cuatro buckets de vencimiento: `Vencido` (fecha de vencimiento anterior a hoy), `0-7 días`, `8-15 días` y `16-30 días`.

#### Scenario: Clasificación de pagos fijos pendientes por rango de vencimiento
- **WHEN** existen costos fijos pendientes con diversas fechas de vencimiento
- **THEN** el sistema retorna el monto total y cantidad de comprobantes por cada uno de los 4 rangos de vencimiento.

#### Scenario: Todos los costos fijos están pagados
- **WHEN** no existen registros de `FixedCostPayment` en estado pendiente
- **THEN** el sistema retorna monto $0 y conteo 0 para todos los rangos.

### Requirement: Proyección de Egresos Comprometidos
El sistema DEBE proveer un endpoint `/api/dashboard/financial/committed-expenses-projection` que sume los `FixedCostPayment` pendientes agrupados en tres ventanas temporales proyectadas desde la fecha actual: `Próximos 30 días`, `31 a 60 días` y `61 a 90 días`.

#### Scenario: Cálculo de compromisos a 30, 60 y 90 días
- **WHEN** existen compromisos de pago registrados para los siguientes tres meses
- **THEN** el sistema retorna los totales agrupados para las ventanas `30d`, `60d` y `90d` junto con el acumulado total proyectado.

#### Scenario: Sin compromisos futuros registrados
- **WHEN** no hay pagos comprometidos en el horizonte de 90 días
- **THEN** el sistema retorna $0 en las tres ventanas.

### Requirement: Rentabilidad por Orden de Servicio
El sistema DEBE proveer un endpoint `/api/dashboard/financial/service-orders-profitability` que genere un ranking de las 10 órdenes más rentables (Top) y las 10 menos rentables (Bottom), calculando para cada una: `Ingreso`, `CostosDirectosTotales`, `MargenBrutoMonetario` y `MargenPorcentual`, con filtro opcional de fechas.

#### Scenario: Obtención de ranking Top/Bottom de órdenes
- **WHEN** el usuario consulta la rentabilidad filtrando por el último trimestre
- **THEN** el sistema retorna dos listas separadas (`topOrders` y `bottomOrders`) ordenadas correspondientemente por margen.

#### Scenario: No hay órdenes en el rango de fechas
- **WHEN** no existen órdenes con ingresos o costos en el rango consultado
- **THEN** el sistema retorna `topOrders: []` y `bottomOrders: []`.

### Requirement: Distribución de Ingresos y Honorarios
El sistema DEBE proveer un endpoint `/api/dashboard/financial/distribution-summary` que totalice los registros de `ServiceOrderDistribution` del período agrupados por `Concepto` (Amortización, Capitalización, Honorarios, Utilidad) y por `Responsable` (socio/profesional), detallando `MontoEsperado` y `MontoReal`.

#### Scenario: Comparativa entre montos esperados y reales distribuidos
- **WHEN** existen órdenes con distribuciones liquidadas en el período
- **THEN** el sistema retorna el agregado por concepto y el desglose individual por responsable comparando lo proyectado vs. lo efectivamente liquidado.

#### Scenario: Sin distribuciones en el período
- **WHEN** no se registraron distribuciones en las órdenes del período
- **THEN** el sistema retorna colecciones vacías para conceptos y responsables.

### Requirement: Costos por Categoría y Proveedor
El sistema DEBE proveer un endpoint `/api/dashboard/financial/direct-costs-breakdown` que totalice los `DirectCost` del período agrupados por `DirectCostCategory` (para gráfico de dona) y por `Provider` (para ranking de proveedores con mayor volumen de costos).

#### Scenario: Agrupación de costos directos por categoría y proveedor
- **WHEN** existen costos directos cargados en el rango de fechas
- **THEN** el sistema retorna la lista por categoría con porcentaje de participación y el listado de proveedores ordenado por monto total facturado.

#### Scenario: Período sin costos directos
- **WHEN** no se registran costos directos en el período
- **THEN** el sistema retorna listas vacías con HTTP 200.

### Requirement: Evolución de Gastos Fijos por Categoría
El sistema DEBE proveer un endpoint `/api/dashboard/financial/fixed-costs-evolution` que reporte la serie mensual de montos pagados de `FixedCostPayment`, clasificados por `FixedCostCategory` a lo largo de los últimos N meses (default 12).

#### Scenario: Consulta de evolución de gastos fijos
- **WHEN** se solicita la evolución de gastos fijos del último año
- **THEN** el sistema retorna una matriz o lista mensual con los montos imputados a cada categoría de costo fijo.

#### Scenario: Base sin gastos fijos históricos
- **WHEN** no existen pagos de costos fijos en el historial
- **THEN** el sistema retorna una serie con valores en cero para todos los meses solicitados.

### Requirement: Valoración y Adquisición de Activos
El sistema DEBE proveer un endpoint `/api/dashboard/financial/assets-valuation` que reporte el monto total de compras de bienes de uso/activos (`AccountingMovement` con `SourceType = AssetPurchase`) dentro del período seleccionado, junto con la valuación total histórica acumulada de los activos de la empresa.

#### Scenario: Cálculo de compras del período y patrimonio en activos
- **WHEN** existen compras de activos en el período y adquisiciones previas
- **THEN** el sistema retorna `periodPurchasesTotal`, `historicalAssetsTotal` y el detalle de los activos incorporados recientemente.

#### Scenario: Sin activos registrados
- **WHEN** la empresa no tiene activos dados de alta
- **THEN** el sistema retorna `periodPurchasesTotal: 0`, `historicalAssetsTotal: 0` e `items: []`.
