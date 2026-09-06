## ADDED Requirements

### Requirement: Interacción de detalle en KPI Operativo
El sistema DEBE permitir al usuario visualizar el listado detallado de las entidades que componen el valor principal de un KPI en el dashboard operativo. Esta acción se desencadenará al interactuar (hacer click) con el indicador numérico.

#### Scenario: Visualización del detalle de órdenes
- **WHEN** el usuario hace click en el valor numérico principal de una tarjeta de KPI referida a órdenes (por ejemplo, "Órdenes Activas" u "Órdenes Estancadas")
- **THEN** el sistema despliega un modal superpuesto que muestra un listado con el detalle de las órdenes correspondientes a dicho KPI (incluyendo ID de orden, Cliente, Estado actual y Fecha).

#### Scenario: Visualización del detalle de Insumos Críticos
- **WHEN** el usuario hace click en el valor numérico principal de la tarjeta de KPI de "Insumos bajo Stock Mínimo"
- **THEN** el sistema despliega un modal superpuesto que muestra un listado con el detalle de los insumos críticos (incluyendo ID del insumo, Descripción, Stock Actual, Stock Mínimo y Déficit).

### Requirement: Endpoints para listado de detalle de KPI
El sistema DEBE proveer la capacidad para obtener el listado paginado de las entidades (órdenes o insumos) que actualmente cumplen con la condición lógica del KPI clickeado.

#### Scenario: Consulta paginada del detalle de órdenes
- **WHEN** el dashboard solicita el detalle de un KPI de órdenes específico pasando su identificador y parámetros de paginación
- **THEN** el sistema retorna la lista de órdenes correspondientes junto con la información de total de registros.

#### Scenario: Consulta paginada del detalle de insumos críticos
- **WHEN** el dashboard solicita el detalle del KPI de insumos críticos
- **THEN** el sistema retorna la lista de insumos con stock por debajo del mínimo, junto con la información de total de registros.
