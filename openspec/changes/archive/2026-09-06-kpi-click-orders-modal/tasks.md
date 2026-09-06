## 1. Backend: Endpoints de Detalle

- [x] 1.1 Crear endpoint `GET /api/dashboard/operational/kpis/{kpi_id}/details` y verificar que responda correctamente.
- [x] 1.2 Implementar en el endpoint operativo la lógica para "Órdenes Activas", "Estancadas", etc., y verificar el listado paginado.
- [x] 1.3 Implementar en el endpoint operativo la lógica para el KPI de "Insumos Críticos", verificando que retorne la lista de insumos bajo stock mínimo.
- [x] 1.4 Crear endpoint `GET /api/dashboard/general/kpis/{kpi_id}/details` para "Mi dashboard" y verificar que aplique el filtrado por el usuario logueado en el JWT.

## 2. Frontend: Componente Modal Dinámico

- [x] 2.1 Crear el componente UI genérico `KpiDetailModal` capaz de mostrar distintas columnas según un prop `entityType` (orders o consumables). Verificar renderizado inicial sin datos.
- [x] 2.2 Integrar `KpiDetailModal` con los endpoints correspondientes según el dashboard y el `kpi_id`, verificando que los datos se muestren correctamente.

## 3. Frontend: Integración en Dashboards

- [x] 3.1 Hacer clickeables los KPIs en el Dashboard Operativo y "Mi dashboard" (estilos de cursor y hover). Verificar el cambio visual en ambos.
- [x] 3.2 Conectar el evento de click en los KPIs operativos de órdenes para abrir el modal, verificando que cargue órdenes.
- [x] 3.3 Conectar el evento de click en el KPI de Insumos Críticos para abrir el modal, verificando que cargue insumos.
- [x] 3.4 Conectar el evento de click en los KPIs de "Mi dashboard", verificando que el modal cargue únicamente las órdenes del usuario logueado.
