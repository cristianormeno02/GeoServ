## Why

Al registrar o editar un movimiento contable de egreso seleccionando la categoría "Pago de Gasto Fijo" y el tipo de origen "Pago de Costo Fijo", el selector de origen específico no muestra ningún elemento disponible. Esto sucede porque el frontend consulta erróneamente un endpoint inexistente (`/fixed-cost-payments` sin verbo GET) en lugar del endpoint de gastos fijos (`/fixed-cost-items`). Adicionalmente, el endpoint de actualización en el backend no procesa los campos polimórficos `SourceType` y `SourceId`, provocando que las ediciones restablezcan el origen a Manual.

## What Changes

- **Frontend (`movimiento-form.component.ts`)**: Corregir la consulta de opciones de origen para el tipo `FixedCostPayment`, direccionándola hacia `/fixed-cost-items`.
- **Frontend (`movimiento-form.component.ts`)**: Mejorar la presentación de las opciones de gastos fijos en el desplegable para mostrar el nombre del gasto fijo y opcionalmente su categoría o información contextual.
- **Frontend (`movimiento-form.component.ts`)**: Armonizar la etiqueta de la opción visual a "Pago de Gasto Fijo" para coincidir con el resto del sistema.
- **Backend (`AccountingMovementEndpoints.cs`)**: Asegurar que `UpdateMovementRequest` acepte `SourceType` y `SourceId` para preservar de forma consistente el origen polimórfico al editar movimientos contables.

## Capabilities

### New Capabilities
<!-- Ninguna capability nueva requerida -->

### Modified Capabilities
- `accounting-ui`: Extender el requerimiento de registro polimórfico para soportar la selección efectiva de gastos fijos activos (`FixedCostItem`) como origen específico de egresos.

## Impact

- **Frontend**: Formulario de movimientos contables (`movimiento-form.component.ts`).
- **Backend**: Endpoint de actualización de movimientos en `AccountingMovementEndpoints.cs`.
- **APIs afectadas**: `GET /api/fixed-cost-items` consumido por el selector de origen de movimientos.
