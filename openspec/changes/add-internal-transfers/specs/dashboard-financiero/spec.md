## MODIFIED Requirements

### Requirement: KPI Cards Financieras
El sistema DEBE proveer un endpoint `/api/dashboard/financial/kpis` que retorne:
- Saldo total por cuenta financiera (`FinancialAccount`) con serie histórica (sparkline). Este cálculo incluye todos los movimientos de la cuenta, incluyendo Transferencias Internas (`SourceType = InternalTransfer`), ya que estas modifican legítimamente el saldo real de cada cuenta.
- Ingresos acumulados del mes actual con serie histórica de los últimos N meses (sparkline). Este cálculo EXCLUYE los movimientos de tipo Transferencia Interna (`SourceType = InternalTransfer`), para no inflar la cifra bruta de ingresos con fondos que solo se movieron entre cuentas propias.
- Resultado neto del mes actual (`Ingresos - Egresos Totales`) con porcentaje de variación contra el mes anterior. Al excluirse las Transferencias Internas de ambos términos por igual, el resultado neto no se ve afectado por esta exclusión.
- Egresos del mes actual, excluyendo igualmente los movimientos de tipo Transferencia Interna por el mismo motivo que los ingresos.
- Saldo Acumulado de Cobertura histórico con indicador semántico de estado (`Positive` si es mayor o igual a 0, `Negative` si existe déficit acumulado).

#### Scenario: Consulta de métricas financieras del mes
- **WHEN** el usuario consulta las KPIs financieras para el mes corriente
- **THEN** el sistema retorna los valores monetarios actuales, las series para sparklines y el saldo acumulado con su correspondiente estado semántico ("Positive" o "Negative")

#### Scenario: Consulta en tenant sin cuentas financieras ni movimientos
- **WHEN** se consultan las KPIs en una base de datos sin cuentas o movimientos registrados
- **THEN** el sistema retorna saldos en 0, variaciones en 0% y estado semántico "Positive" para saldo acumulado en 0, sin errores de ejecución

#### Scenario: Mes con una Transferencia Interna registrada entre dos cuentas propias
- **WHEN** en el mes corriente se registró una Transferencia Interna de $500.000 entre dos cuentas propias, además de $1.000.000 en Ingresos y $600.000 en Egresos de otro origen
- **THEN** el sistema retorna `incomeCurrentMonth = $1.000.000` y `expensesCurrentMonth = $600.000` (sin incluir el monto de la transferencia), mientras que el saldo de cada una de las dos cuentas involucradas en la transferencia refleja el movimiento de los $500.000 entre ellas
