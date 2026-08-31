## Why

El dashboard ubicado en la ruta `/dashboard` es actualmente un placeholder sin funcionalidad real. Los colaboradores y responsables de ejecución que ingresan al sistema no tienen ningún punto de partida relevante: no ven sus órdenes, su carga activa ni sus actividades pendientes. El dashboard debe ser el primer contacto útil del usuario con el sistema, mostrándole información contextualizada a su propio trabajo — sin exponer datos financieros ni operativos globales de la empresa.

## What Changes

- El componente `DashboardComponent` (ruta `/dashboard`) se reemplaza con un dashboard centrado en el usuario autenticado.
- El backend expone un nuevo grupo de endpoints `/api/dashboard/general/*` que resuelven los datos filtrando siempre por el `userId` extraído del JWT (sin que el cliente tenga que enviarlo).
- Si el usuario no tiene un `Responsible` vinculado (`Responsible.UserId`), el dashboard muestra un estado vacío amistoso indicando que el perfil no está configurado para visualizar trabajo propio.
- No se expone ningún dato financiero (montos, costos, movimientos de caja).

## Capabilities

### New Capabilities

- `dashboard-general`: Dashboard personal centrado en el usuario autenticado. Muestra órdenes de servicio donde el usuario figura como responsable, su estado, progreso estimado, actividades pendientes y observaciones recientes. Incluye estado vacío amistoso si el usuario no tiene un `Responsible` asociado.

### Modified Capabilities

_(ninguna)_

## Impact

- **Backend**: Nuevo archivo `GeneralDashboardEndpoints.cs`. Mapeo en `Program.cs`. No requiere migración de base de datos.
- **Frontend**: Reemplazo completo de `dashboard.component.ts/html/css` existente (actualmente es un placeholder vacío). Nuevo `GeneralDashboardService`. Reutilización de los componentes visuales de la biblioteca compartida (`SparklineCardComponent`, `DonutChartComponent`).
- **No breaking**: La ruta `/dashboard` ya existe y no cambia; solo se rellena con contenido real.
