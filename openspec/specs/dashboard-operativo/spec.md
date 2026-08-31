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
El sistema DEBE proveer un endpoint `/api/dashboard/operational/aging-uncollected-orders` que clasifique las órdenes de servicio en estado completado/entregado con saldo pendiente de cobro (`TotalAmount > CollectedAmount`) en rangos de antigüedad desde la fecha de entrega (`0-7 días`, `8-15 días`, `16-30 días`, `>30 días`), permitiendo además obtener el listado paginado detallado.

#### Scenario: Distribución por buckets de antigüedad
- **WHEN** se solicita el resumen de aging para órdenes entregadas pendientes de cobro
- **THEN** el sistema retorna un objeto con el conteo y monto total adeudado por cada rango (`0-7`, `8-15`, `16-30`, `>30`).

#### Scenario: Todas las órdenes cobradas
- **WHEN** no existen órdenes entregadas con saldo pendiente
- **THEN** el sistema retorna 0 en monto y conteo para cada uno de los 4 rangos y una lista detallada vacía.

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
