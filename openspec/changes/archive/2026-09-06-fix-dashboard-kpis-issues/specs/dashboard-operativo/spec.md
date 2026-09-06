## MODIFIED Requirements

### Requirement: Aging de Entregadas sin Cobrar
El sistema SHALL proveer un endpoint `/api/dashboard/operational/aging-uncollected-orders` que clasifique las órdenes de servicio en estado estrictamente "Entregada" con saldo pendiente de cobro (`TotalAmount > CollectedAmount`) en rangos de antigüedad desde la fecha de entrega (`0-7 días`, `8-15 días`, `16-30 días`, `>30 días`), permitiendo además obtener el listado paginado detallado. Las órdenes en otros estados (incluyendo estado "Iniciada") NO DEBEN ser contabilizadas como entregadas sin cobrar, aun cuando posean fecha `ActualEndDate` no nula.

#### Scenario: Distribución por buckets de antigüedad
- **WHEN** se solicita el resumen de aging para órdenes entregadas pendientes de cobro
- **THEN** el sistema retorna un objeto con el conteo y monto total adeudado por cada rango (`0-7`, `8-15`, `16-30`, `>30`), considerando exclusivamente órdenes en estado "Entregada".

#### Scenario: Todas las órdenes cobradas
- **WHEN** no existen órdenes en estado "Entregada" con saldo pendiente
- **THEN** el sistema retorna 0 en monto y conteo para cada uno de los 4 rangos y una lista detallada vacía.

#### Scenario: Exclusión de órdenes en estado Iniciada
- **WHEN** existe una orden de servicio en estado "Iniciada" con saldo pendiente y fecha `ActualEndDate` no nula
- **THEN** la orden es excluida del cálculo de aging de entregadas sin cobrar y no aparece en los buckets ni en el listado.

### Requirement: Interacción de detalle en KPI Operativo
El sistema SHALL permitir al usuario visualizar el listado detallado de las entidades que componen el valor principal de un KPI en el dashboard operativo al interactuar (hacer click) con el indicador numérico. El modal de detalle SHALL renderizar inmediatamente la tabla con los datos tras recibir la respuesta HTTP, sin requerir clics adicionales del usuario.

#### Scenario: Visualización del detalle de órdenes
- **WHEN** el usuario hace click en el valor numérico principal de una tarjeta de KPI referida a órdenes (por ejemplo, "Órdenes Activas" u "Órdenes Estancadas")
- **THEN** el sistema despliega un modal superpuesto y, al finalizar la carga asíncrona, renderiza de inmediato el listado con el detalle de las órdenes (incluyendo ID de orden, Cliente, Estado actual y Fecha) sin requerir interacción adicional.

#### Scenario: Visualización del detalle de Insumos Críticos
- **WHEN** el usuario hace click en el valor numérico principal de la tarjeta de KPI de "Insumos bajo Stock Mínimo"
- **THEN** el sistema despliega un modal superpuesto y, al finalizar la carga asíncrona, renderiza de inmediato el listado con el detalle de los insumos críticos (incluyendo ID del insumo, Descripción, Stock Actual, Stock Mínimo y Déficit) sin requerir interacción adicional.

### Requirement: Endpoints para listado de detalle de KPI
El sistema SHALL proveer la capacidad para obtener el listado paginado de las entidades (órdenes o insumos) que actualmente cumplen con la condición lógica del KPI clickeado. Para el KPI `uncollectedOrders`, únicamente se considerarán órdenes en estado "Entregada" con saldo pendiente (`TotalAmount > CollectedAmount`).

#### Scenario: Consulta paginada del detalle de órdenes
- **WHEN** el dashboard solicita el detalle de un KPI de órdenes específico pasando su identificador y parámetros de paginación
- **THEN** el sistema retorna la lista de órdenes correspondientes junto con la información de total de registros.

#### Scenario: Consulta paginada del detalle de órdenes entregadas sin cobrar
- **WHEN** el dashboard solicita el detalle del KPI `uncollectedOrders`
- **THEN** el sistema retorna únicamente órdenes cuyo estado sea "Entregada" y `TotalAmount > CollectedAmount`, excluyendo órdenes en estado "Iniciada".

#### Scenario: Consulta paginada del detalle de insumos críticos
- **WHEN** el dashboard solicita el detalle del KPI de insumos críticos
- **THEN** el sistema retorna la lista de insumos con stock por debajo del mínimo, junto con la información de total de registros.
