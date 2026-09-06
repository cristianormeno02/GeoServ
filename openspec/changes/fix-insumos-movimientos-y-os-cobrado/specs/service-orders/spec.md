## ADDED Requirements

### Requirement: Visualización de Monto Cobrado en Listado de Órdenes de Servicio
La tabla principal del listado de Órdenes de Servicio SHALL mostrar la columna de monto cobrado además del monto presupuestado para cada orden.

#### Scenario: Visualización de montos presupuestado y cobrado en listado
- **WHEN** el usuario accede al listado de Órdenes de Servicio (`/ordenes-servicio`)
- **THEN** la tabla presenta la columna "Presupuestado" con el monto presupuestado (`budgetedAmount`) y la columna "Cobrado" con el monto cobrado (`collectedAmount`) para cada orden, formateados con el filtro de moneda.
