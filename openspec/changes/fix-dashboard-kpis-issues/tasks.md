## 1. Backend: Corrección de filtro para "Órdenes entregadas sin cobrar"

- [x] 1.1 Escribir pruebas automatizadas en backend (ciclo Red) que verifiquen que una orden de servicio en estado "Iniciada" con fecha de fin asignada (`ActualEndDate`) no sea contabilizada en el contador de entregadas sin cobrar de `/api/dashboard/operational/kpis`, ni en los buckets/listado de `/api/dashboard/operational/aging-uncollected-orders`, ni en el detalle `/api/dashboard/operational/kpis/uncollectedOrders/details`.
- [x] 1.2 Ajustar las consultas en `OperationalDashboardEndpoints.cs` para filtrar estrictamente por estado "Entregada" (`o.Status.Name == "Entregada"` y saldo pendiente `o.TotalAmount > o.CollectedAmount`), verificando que las pruebas pasen exitosamente con `dotnet test`.

## 2. Frontend: Refresco inmediato del listado en modal de KPIs

- [x] 2.1 Actualizar las pruebas unitarias de `KpiDetailModal` (`kpi-detail-modal.spec.ts`) para verificar que al recibir la respuesta asíncrona del servicio HTTP se dispare la detección de cambios (`markForCheck`) y se actualice el estado visual sin requerir eventos adicionales del DOM.
- [x] 2.2 Modificar `KpiDetailModal` inyectando `ChangeDetectorRef` y ejecutando `markForCheck()` en la suscripción a los datos de la API, verificando la compilación con `npm run build` y comprobando que al abrir el modal desde Dashboard General y Dashboard Operativo los datos se rendericen de forma inmediata.
