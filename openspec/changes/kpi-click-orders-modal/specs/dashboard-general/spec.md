## ADDED Requirements

### Requirement: Interacción de detalle en KPIs Personales
El sistema DEBE permitir al usuario visualizar el listado detallado de las órdenes de servicio que componen el valor principal de un KPI personal en "Mi dashboard" (Dashboard General). Esta acción se desencadenará al interactuar (hacer click) con el indicador numérico.

#### Scenario: Visualización del detalle de órdenes en Mi Dashboard
- **WHEN** el usuario hace click en el valor numérico principal de una tarjeta de KPI personal (por ejemplo, "Órdenes Activas", "Órdenes Entregadas")
- **THEN** el sistema despliega un modal superpuesto que muestra un listado con el detalle de sus órdenes correspondientes a dicho KPI, respetando el filtrado por su identidad (usuario logueado).

### Requirement: Endpoint para listado de detalle de KPI Personal
El sistema DEBE proveer la capacidad para obtener el listado paginado de órdenes de servicio que actualmente cumplen con la condición lógica del KPI personal seleccionado, asegurando que solo se devuelvan las órdenes donde el usuario actual es responsable.

#### Scenario: Consulta paginada del detalle asegurando identidad
- **WHEN** el dashboard general solicita el detalle de un KPI específico pasando su identificador y parámetros de paginación
- **THEN** el sistema evalúa la condición de ese KPI, aplica el filtro estricto por el `UserId` del token JWT, y retorna la lista de órdenes correspondientes.
