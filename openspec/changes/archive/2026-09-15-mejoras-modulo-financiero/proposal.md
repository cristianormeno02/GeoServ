## Why

El módulo financiero presenta inconsistencias de usabilidad y visualización que dificultan la operación diaria del usuario:
1. En el Libro Diario (Movimientos Financieros), el selector de fechas actual no permite seleccionar y validar de manera intuitiva un período desde/hasta independiente, perdiéndose la selección cada vez que el usuario navega o recarga la página.
2. Al listar movimientos de egreso originados en Pagos de Costos Directos vinculados a una Orden de Servicio, el número de orden queda oculto por el nombre del costo directo en la columna de origen. Además, al editar el movimiento, el campo "Orden de Servicio" exhibe la descripción del costo directo en lugar del número de la orden seleccionada debido a una omisión en la API y el binding del componente.
3. En la tabla del Resumen Financiero, la columna de Tipo de Cuenta muestra identificadores internos en inglés (`BankAccount`, `Cash`, `DigitalWallet`).
4. En el Dashboard Financiero, el gráfico principal de Informe de Cobertura Mensual cuenta con una altura fija y proporciones comprimidas que distorsionan su legibilidad en pantallas completas o de alta resolución.

Este cambio resuelve estos puntos de forma integral para garantizar precisión informativa, persistencia de preferencias de usuario y una experiencia visual profesional.

## What Changes

- **Movimientos Financieros - Selector de Períodos Independiente**:
  - Reemplazo del control único de rango por dos controles independientes con datepicker: `Fecha Desde` y `Fecha Hasta`.
  - Incorporación de validadores reactivos de coherencia de fechas (`Fecha Desde` no puede ser posterior a `Fecha Hasta`).
- **Movimientos Financieros - Persistencia en LocalStorage**:
  - Almacenamiento automático en `localStorage` del rango de fechas seleccionado al aplicar filtros.
  - Restauración automática del período almacenado al inicializar la pantalla.
- **Movimientos Financieros - Nro de Orden de Servicio en Listado**:
  - Ajuste en la columna "Origen" para que los movimientos de tipo `DirectCost` asociados a una Orden de Servicio muestren conjuntamente la referencia del costo directo y el número de orden (ej: `Canon Secretaria (OS: OS-2026-0012)`).
- **Movimientos Financieros - Nro de Orden de Servicio en Edición**:
  - Modificación del backend (`AccountingMovementEndpoints.cs`) en `GET /api/financial-movements/{id}` para incluir `ServiceOrderNumber`.
  - Corrección del formulario modal de movimientos (`movimiento-form.component.ts`) para que el campo etiquetado como "Orden de Servicio" muestre el identificador/número de orden y no la descripción del costo directo.
- **Resumen Financiero - Tipos de Cuenta en Español**:
  - Sustitución de los valores en crudo (`BankAccount`, `Cash`, `DigitalWallet`) por etiquetas legibles (`Cuenta Bancaria`, `Efectivo`, `Billetera Digital`) en la grilla de cuentas financieras.
- **Dashboard Financiero - Optimización Visual del Gráfico de Cobertura**:
  - Ajuste de dimensiones, altura responsive (de 240px a un rango adecuado de 320px–360px) y tratamiento de proporciones en el componente SVG `combo-chart` para evitar achatamiento o distorsión en pantallas medianas y anchas.

## Capabilities

### New Capabilities
<!-- Ninguna nueva capacidad; se refinan y extienden capacidades existentes -->

### Modified Capabilities
- `accounting-ui`: Inclusión de controles separados de fecha con validación cruzada y almacenamiento local en filtros, visualización explícita del número de orden de servicio en orígenes de tipo `DirectCost` en la grilla y carga del número de orden en el formulario de edición de movimientos.
- `financial-summary`: Presentación legible en español de las tipologías de cuenta en la tabla consolidada de cuentas financieras.
- `dashboard-financiero`: Mejora de proporciones, altura y renderizado del gráfico de Cobertura Mensual para visualización nítida y legible.

## Impact

- **Frontend**:
  - `src/app/features/finance/movimientos/movimientos.html`: nuevo layout para selectores de fechas Desde/Hasta.
  - `src/app/features/finance/movimientos/movimientos.ts`: validación de fechas, persistencia en `localStorage`, formato enriquecido para `getSourceReference()`.
  - `src/app/features/finance/movimientos/movimiento-form.component.ts`: mapeo del número de orden en `sourceLabel` cuando `sourceType === 'DirectCost'`.
  - `src/app/features/finance/resumen/financial-summary.component.html` y TS: helper para traducir tipo de cuenta bancaria.
  - `src/app/shared/components/charts/combo-chart.component.ts`: estilización, altura y proporciones del SVG.
- **Backend**:
  - `GeoServ.Api/Endpoints/AccountingMovementEndpoints.cs`: incorporación del campo `ServiceOrderNumber` en el endpoint `GetMovementById`.
- **APIs y Contratos**:
  - El DTO retornado por `GET /api/financial-movements/{id}` pasa a incluir `serviceOrderNumber` (campo no rompiente, aditivo).
