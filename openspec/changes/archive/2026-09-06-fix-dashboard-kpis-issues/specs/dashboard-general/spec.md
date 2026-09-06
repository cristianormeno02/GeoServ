## MODIFIED Requirements

### Requirement: Interacción de detalle en KPIs Personales
El sistema SHALL permitir al usuario visualizar el listado detallado de las órdenes de servicio que componen el valor principal de un KPI personal en "Mi dashboard" (Dashboard General). Esta acción se desencadenará al interactuar (hacer click) con el indicador numérico, y el modal SHALL renderizar de forma inmediata el listado tan pronto como se complete la respuesta asíncrona del backend, sin requerir clics ni interacciones adicionales.

#### Scenario: Visualización del detalle de órdenes en Mi Dashboard
- **WHEN** el usuario hace click en el valor numérico principal de una tarjeta de KPI personal (por ejemplo, "Órdenes Activas", "Órdenes Entregadas")
- **THEN** el sistema despliega un modal superpuesto y, al completarse la petición HTTP, renderiza de forma inmediata el listado con el detalle de sus órdenes sin exigir clics adicionales, respetando el filtrado por su identidad (usuario logueado).
