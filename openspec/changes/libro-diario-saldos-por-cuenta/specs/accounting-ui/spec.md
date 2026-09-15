## ADDED Requirements

### Requirement: Consulta de saldos por cuenta financiera en movimientos
Cuando el usuario filtre los movimientos financieros por una cuenta financiera específica (`financialAccountId`), el sistema DEBE calcular y retornar el saldo acumulado previo al período filtrado (`initialBalance`), la sumatoria de ingresos del período (`periodIncome`), la sumatoria de egresos del período (`periodExpense`) y el saldo al cierre del período (`finalBalance`), además del saldo resultante acumulado (`balanceAfter`) para cada movimiento listado.

#### Scenario: Usuario filtra por cuenta bancaria y período
- **WHEN** el usuario selecciona una cuenta financiera específica y un rango de fechas en el Libro Diario
- **THEN** el sistema calcula `initialBalance` sumando todos los movimientos de esa cuenta con fecha anterior a `startDate`
- **THEN** el sistema calcula los totales de ingresos y egresos dentro del rango de fechas
- **THEN** cada movimiento devuelto incluye `balanceAfter` reflejando el saldo acumulado tras la aplicación secuencial de dicho movimiento

#### Scenario: Usuario consulta sin filtrar por cuenta ("Todas las cuentas")
- **WHEN** el usuario consulta movimientos con el filtro de cuenta en "Todas"
- **THEN** el sistema no calcula saldo inicial ni saldo acumulado por fila, y la grilla oculta la columna de saldo para evitar inconsistencias entre cuentas heterogéneas

### Requirement: Barra de resumen de saldos en Libro Diario
La interfaz de usuario del Libro Diario DEBE mostrar un bloque de resumen de saldos destacado en la parte superior cuando se haya seleccionado una cuenta financiera específica.

#### Scenario: Visualización del bloque de resumen al seleccionar una cuenta
- **WHEN** el filtro de cuenta tiene seleccionada una cuenta financiera puntual
- **THEN** la interfaz muestra cuatro tarjetas o indicadores: "Saldo Inicial", "Ingresos (+)", "Egresos (-)" y "Saldo Final"
- **THEN** los montos se presentan con formato de moneda y colores semánticos correspondientes

#### Scenario: Ocultamiento del bloque de resumen en vista global
- **WHEN** el filtro de cuenta está en "Todas"
- **THEN** el bloque de resumen de saldos de cuenta se oculta automáticamente

### Requirement: Columna dinámica de saldo en grilla de movimientos
La grilla de movimientos DEBE incluir una columna "Saldo" únicamente cuando se encuentre filtrada una cuenta financiera puntual.

#### Scenario: Grilla con cuenta seleccionada
- **WHEN** el usuario aplica el filtro con una cuenta financiera seleccionada
- **THEN** la tabla incluye la columna "Saldo" mostrando el valor de `balanceAfter` formateado, con estilo visual de advertencia si el saldo es negativo

#### Scenario: Grilla sin cuenta seleccionada
- **WHEN** el usuario consulta con el selector de cuenta en "Todas"
- **THEN** la tabla excluye la columna "Saldo" de las columnas visibles
