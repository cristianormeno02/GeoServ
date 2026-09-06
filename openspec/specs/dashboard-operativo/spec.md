# dashboard-operativo Specification

## Purpose
TBD - created by archiving change dashboard-operativo. Update Purpose after archive.

## Requirements

### Requirement: KPI Cards Operativas con Sparkline
El sistema DEBE proveer un endpoint `/api/dashboard/operational/kpis` que devuelva el valor consolidado actual y una serie temporal de los últimos N períodos (por defecto 6 semanas o meses según parámetro) para cuatro métricas clave: Órdenes Activas, Órdenes Estancadas, Entregadas sin Cobrar e Insumos bajo Stock Mínimo.

#### Scenario: Consulta exitosa con datos históricos
- **WHEN** el usuario autenticado solicita las tarjetas KPI indicando `periods=6`
- **THEN** el sistema retorna el conteo actual de cada métrica y un arreglo de 6 valores numéricos con sus respectivas etiquetas de período para renderizar el sparkline de tendencia.

#### Scenario: Consulta en tenant nuevo sin actividad previa
- **WHEN** el usuario consulta las KPIs en un tenant que no posee órdenes ni movimientos registrados
- **THEN** el sistema retorna 0 como valor actual para todas las métricas y arreglos con 6 valores en 0, sin arrojar excepciones.

### Requirement: Gauge de Capacidad del Equipo
El sistema DEBE proveer un endpoint `/api/dashboard/operational/team-capacity` que calcule el ratio entre la cantidad de órdenes de servicio en estado activo y la capacidad máxima de órdenes simultáneas configurada en la empresa (`EmpresaConfiguracion.OPERATIONAL_CAPACITY_MAX_ORDERS`).

#### Scenario: Cálculo de capacidad con órdenes activas y umbral configurado
- **WHEN** el sistema cuenta con 15 órdenes activas y la capacidad máxima configurada es 20
- **THEN** el sistema retorna `activeOrders: 15`, `maxCapacity: 20`, `capacityPercentage: 75.0` y estado semántico "Normal".

#### Scenario: Capacidad no configurada o en cero
- **WHEN** la empresa no ha configurado el valor de capacidad máxima o este es 0
- **THEN** el sistema asume un valor por defecto seguro (ej. 100 o 0 según corresponda) y retorna `activeOrders: X`, `maxCapacity: 0`, `capacityPercentage: 0` con una indicación de configuración pendiente.

### Requirement: Gauge de Cumplimiento de Plazos
El sistema DEBE proveer un endpoint `/api/dashboard/operational/deadline-compliance` que retorne el porcentaje de órdenes activas que se encuentran dentro del plazo máximo tolerable de permanencia en su estado actual, según el umbral definido por `ServiceType` o el valor por defecto configurado.

#### Scenario: Órdenes dentro y fuera de plazo
- **WHEN** existen 10 órdenes activas, de las cuales 8 tienen una permanencia menor o igual al umbral y 2 lo superan
- **THEN** el sistema retorna `compliancePercentage: 80.0`, `totalActive: 10`, `onTimeCount: 8`, `delayedCount: 2`.

#### Scenario: Sin órdenes activas en el período
- **WHEN** no existen órdenes en estado activo
- **THEN** el sistema retorna `compliancePercentage: 100.0`, `totalActive: 0`, `onTimeCount: 0`, `delayedCount: 0`.

### Requirement: Distribución de Órdenes por Tipo de Servicio
El sistema DEBE proveer un endpoint `/api/dashboard/operational/orders-by-service-type` que agrupe las órdenes activas por su `ServiceType`, calculando el total de órdenes y el porcentaje sobre el total para alimentar un gráfico de dona.

#### Scenario: Agrupación con múltiples tipos de servicio
- **WHEN** existen órdenes activas vinculadas a diferentes tipos de servicio
- **THEN** el sistema retorna una lista con `serviceTypeId`, `serviceTypeName`, `count` y `percentage` sumando el 100%.

#### Scenario: Base sin órdenes activas
- **WHEN** no hay órdenes activas registradas
- **THEN** el sistema retorna una lista vacía `[]` con código HTTP 200.

### Requirement: Carga de Trabajo por Responsable
El sistema DEBE proveer un endpoint `/api/dashboard/operational/workload-by-responsible` que devuelva la cantidad de órdenes de servicio activas asignadas a cada responsable a través de `ServiceOrderResponsible`.

#### Scenario: Responsables con asignaciones activas
- **WHEN** existen responsables asignados a órdenes activas
- **THEN** el sistema retorna un listado con `responsibleId`, `responsibleName`, `activeOrdersCount` ordenado descendentemente por cantidad de órdenes.

#### Scenario: Órdenes activas sin responsable asignado
- **WHEN** existen órdenes activas sin ningún responsable asignado
- **THEN** el sistema incluye en el listado una entrada especial con nombre "Sin Asignar" y la cantidad correspondiente.

### Requirement: Listado de Órdenes Estancadas
El sistema DEBE proveer un endpoint `/api/dashboard/operational/stagnant-orders` que retorne una grilla paginada con las órdenes activas cuya permanencia en el estado actual supere el umbral configurado, detallando número de orden, cliente, tipo de servicio, estado actual, fecha de último cambio de estado y días de estancamiento.

#### Scenario: Paginación y ordenamiento de órdenes estancadas
- **WHEN** el usuario solicita la página 1 con tamaño 10
- **THEN** el sistema retorna los primeros 10 registros ordenados descendentemente por días de estancamiento junto con el total de registros encontrados.

#### Scenario: Ninguna orden estancada
- **WHEN** todas las órdenes activas cumplen con sus tiempos de permanencia
- **THEN** el sistema retorna `items: []`, `totalCount: 0`, `page: 1`, `pageSize: 10`.

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

### Requirement: Monitoreo de Inventario Crítico y Mermas
El sistema DEBE proveer un endpoint `/api/dashboard/operational/inventory-alerts` que reporte los insumos con stock consolidado (`SUM(InventoryMovement.Cantidad)`) estrictamente menor a `Consumable.MinimumStock`, junto con el volumen acumulado de movimientos de tipo `AjusteNegativo` del mes actual agrupado por `Motivo`.

#### Scenario: Detección de insumos bajo stock mínimo
- **WHEN** existen insumos cuyo stock calculado es inferior a su stock mínimo configurado
- **THEN** el sistema retorna la lista de insumos críticos con `consumableId`, `description`, `currentStock`, `minimumStock` y `deficit`.

#### Scenario: Inventario con stock suficiente y sin mermas
- **WHEN** todos los insumos tienen stock mayor o igual al mínimo y no hubo ajustes negativos
- **THEN** el sistema retorna `criticalConsumables: []` y `negativeAdjustmentsByReason: []`.

### Requirement: Costos Fijos Próximos a Vencer
El sistema DEBE proveer un endpoint `/api/dashboard/operational/upcoming-fixed-costs` que liste los `FixedCostPayment` con estado de pago pendiente cuya `FechaVencimiento` se encuentre entre la fecha actual y los próximos N días parametrizables (`daysAhead`, default 15).

#### Scenario: Costos próximos a vencer encontrados
- **WHEN** existen costos fijos pendientes que vencen en los próximos 10 días y se consulta con `daysAhead=15`
- **THEN** el sistema retorna la lista ordenada ascendentemente por fecha de vencimiento con `fixedCostPaymentId`, `categoryName`, `monto`, `fechaVencimiento` y `diasRestantes`.

#### Scenario: Sin costos fijos pendientes en la ventana
- **WHEN** no hay costos fijos con vencimiento en los próximos N días
- **THEN** el sistema retorna una lista vacía `[]`.

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
