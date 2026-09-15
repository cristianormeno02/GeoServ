## Context

Ver `proposal.md` para motivación y justificación general.
Actualmente el endpoint `GET /api/movements/` recibe parámetros de filtrado y paginación (`page`, `pageSize`, `startDate`, `endDate`, `financialAccountId`, etc.) y devuelve `{ items, totalCount }`.
En el frontend, el componente `Movimientos` (`/movimientos`) gestiona un formulario reactivo `filterForm` y muestra los resultados mediante Angular Material Table.

## Goals / Non-Goals

**Goals:**
- Extender el backend para calcular con exactitud contable el saldo inicial histórico, los ingresos del período, los egresos del período y el saldo final para una cuenta dada.
- Devolver para cada movimiento en la página actual su `balanceAfter` (saldo resultante luego de aplicar el movimiento).
- Incorporar en el frontend una barra de resumen superior con métricas claras (Saldo Inicial, Ingresos (+), Egresos (-), Saldo Final).
- Alternar dinámicamente la visibilidad de la columna "Saldo" según si hay una cuenta filtrada o no.
- Soportar parámetros por URL (`queryParams`) para navegación directa con filtros precargados.

**Non-Goals:**
- Modificar entidades o tablas en la base de datos (no se requieren migraciones de EF Core).
- Modificar la vista de Resumen Financiero en este cambio (se abordará posteriormente según lo acordado con el usuario).

## Decisions

### 1. Cálculo de saldos en Backend
- **Decisión**: El cálculo del saldo inicial y del saldo progresivo (`balanceAfter`) se realiza en el servidor.
- **Justificación**: Al tener paginación server-side (`page`, `pageSize`), el cliente solo dispone de los registros de la página actual. Para conocer el saldo con el que inicia la página N, es indispensable considerar el historial acumulado en base de datos.
- **Alternativa descartada**: Enviar todos los registros sin paginar al cliente para calcular en frontend; descartado por penalización de rendimiento ante cuentas con miles de movimientos.

### 2. Estructura de Respuesta del Endpoint
- **Decisión**: Cuando `financialAccountId` esté presente en la consulta, la respuesta incluirá un objeto `accountSummary`:
  ```json
  {
    "items": [
      {
        "id": "...",
        "amount": 1000.0,
        "isIncome": true,
        "balanceAfter": 26000.0,
        ...
      }
    ],
    "totalCount": 45,
    "accountSummary": {
      "initialBalance": 25000.0,
      "periodIncome": 10000.0,
      "periodExpense": 4000.0,
      "finalBalance": 31000.0
    }
  }
  ```
  Si no se filtra por cuenta, `accountSummary` será `null` y `balanceAfter` en los ítems será `null`.

### 3. Cálculo de `balanceAfter` respetando Paginación
- **Algoritmo**:
  1. `initialBalance = context.AccountingMovements.Where(m => m.FinancialAccountId == accId && m.Date < startDate).Sum(m => m.IsIncome ? m.Amount : -m.Amount)`
  2. Si `actualPage > 1`, se suma el delta de los movimientos de esa cuenta entre `startDate` y los registros previos a la página:
     `prePageDelta = query.Take((actualPage - 1) * actualPageSize).Sum(m => m.IsIncome ? m.Amount : -m.Amount)`
     `runningBalance = initialBalance + prePageDelta`
  3. Para cada ítem evaluado secuencialmente en la página:
     `runningBalance += (item.IsIncome ? item.Amount : -item.Amount)`
     `item.BalanceAfter = runningBalance`

### 4. Presentación Dinámica en la Tabla (Frontend)
- **Decisión**: Agregar `'balance'` a `displayedColumns` exclusivamente cuando `financialAccountId` tenga un valor seleccionado.
- **Justificación**: Evita incoherencias contables al visualizar "Todas las cuentas", donde un saldo acumulado no representa ninguna cuenta real.

## Risks / Trade-offs

- **[Paginación y ordenamiento temporal]** → La consulta debe mantener un ordenamiento determinista (`OrderBy(m => m.Date).ThenBy(m => m.CreatedAt).ThenBy(m => m.Id)`) para que el saldo acumulado sea estrictamente consistente entre páginas.
- **[Filtrado por tipo (Ingreso/Egreso) simultáneo]** → Si el usuario filtra por cuenta Y además selecciona solo "Ingresos", el saldo de la cuenta considera todos los movimientos reales para calcular el saldo final de la cuenta, mientras que `balanceAfter` de la grilla refleja el saldo de la cuenta tras cada operación mostrada. Se clarificará con etiquetas explicativas.
