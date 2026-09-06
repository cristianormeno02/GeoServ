## Why

Se han identificado dos problemas en los tableros de control (Dashboard General y Dashboard Operativo):
1. Al abrir el modal de detalle de órdenes o insumos asociados a un KPI, la tabla con el listado no se visualiza de forma inmediata al finalizar la carga de datos, requiriendo un clic u otra interacción del usuario para que Angular refresque la vista.
2. En el Dashboard Operativo, la métrica "Órdenes entregadas sin cobrar" contabiliza erróneamente órdenes de servicio que están en estado "Iniciada" debido a la presencia de fechas de finalización registradas en la entidad, cuando el indicador debe restringirse estrictamente a órdenes cuyo estado sea "Entregada" y posean saldo pendiente.

## What Changes

- **Refresco automático del modal de KPIs**: Integrar la notificación de detección de cambios (`ChangeDetectorRef.markForCheck()` o actualización de estado reactivo) en `KpiDetailModal` al completar la carga asíncrona de datos desde la API, garantizando que el listado de órdenes/insumos se dibuje inmediatamente tanto en el Dashboard General como en el Dashboard Operativo sin necesidad de clics previos.
- **Corrección del filtro de Órdenes Entregadas sin Cobrar**: Ajustar las consultas en los endpoints del Dashboard Operativo (`/api/dashboard/operational/kpis`, `/api/dashboard/operational/aging-uncollected-orders` y `/api/dashboard/operational/kpis/uncollectedOrders/details`) para filtrar estrictamente por estado `Entregada` (`o.Status.Name == "Entregada"` y `o.TotalAmount > o.CollectedAmount`), excluyendo órdenes en estado "Iniciada" u otros estados previos independientemente del valor de `ActualEndDate`.

## Capabilities

### New Capabilities

### Modified Capabilities
- `dashboard-operativo`: Se corrigen los criterios de cálculo del KPI y listados de "Órdenes entregadas sin cobrar" para considerar exclusivamente órdenes en estado "Entregada" con saldo pendiente, y se asegura el renderizado inmediato del modal de detalle de KPIs.
- `dashboard-general`: Se asegura la correcta visualización inmediata del listado de órdenes en el modal de detalle de KPIs al recibir los datos asíncronos.

## Impact

- **Frontend**: Componente `KpiDetailModal` (`frontend/src/app/shared/components/kpi-detail-modal/kpi-detail-modal.ts`).
- **Backend**: Endpoints de métricas operativas en `OperationalDashboardEndpoints.cs`.
- **APIs/Contratos**: Sin cambios que rompan compatibilidad; se corrigen los resultados de los endpoints de KPIs y aging para cumplir con las reglas de negocio esperadas.
