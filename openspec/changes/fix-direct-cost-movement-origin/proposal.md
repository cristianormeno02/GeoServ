## Why

Al registrar o editar un movimiento contable de egreso seleccionando la categoría "Pago de Costo Directo" y el tipo de origen "Costo Directo", el selector de origen específico no muestra ningún elemento disponible. Esto sucede porque el frontend consulta el endpoint `/direct-costs`, el cual no existe en el backend de forma global (solo estaba disponible anidado bajo `/api/service-orders/{id}/direct-costs`), resultando en un error HTTP 404 que vacía la lista. Adicionalmente, el registro y actualización de movimientos no sincronizaba el campo relacional `DirectCostId`.

## What Changes

- **Backend (`DirectCostEndpoints.cs`)**: Exponer el endpoint `GET /api/direct-costs` (y `GET /api/direct-costs/{id}`) retornando los costos directos con datos enriquecidos de su orden de servicio asociada (`ServiceOrder.OrderNumber`), categoría (`Category.Name`) y proveedor (`Provider.Name`).
- **Backend (`AccountingMovementEndpoints.cs`)**: Al crear (`POST /api/movements`) o actualizar (`PUT /api/movements/{id}`) un movimiento con origen polimórfico `DirectCost`, vincular y sincronizar la clave foránea `DirectCostId`.
- **Frontend (`movimiento-form.component.ts`)**: Mejorar la presentación de las opciones de costos directos en el desplegable para mostrar el número de la orden de servicio asociada, la descripción del costo, la categoría y el monto.

## Capabilities

### New Capabilities
<!-- Ninguna capability nueva requerida -->

### Modified Capabilities
- `accounting-ui`: Extender el requerimiento de registro polimórfico para soportar la selección efectiva de costos directos (`DirectCost`) como origen específico de egresos.

## Impact

- **Frontend**: Formulario de movimientos contables (`movimiento-form.component.ts`).
- **Backend**: `DirectCostEndpoints.cs` y `AccountingMovementEndpoints.cs`.
- **APIs afectadas**: `GET /api/direct-costs` (nueva ruta global). Las rutas existentes `/api/service-orders/{id}/direct-costs`, `/api/fixed-cost-items`, `/api/service-orders` y `/api/assets` permanecen 100% intactas.
