## MODIFIED Requirements

### Requirement: KPI Cards Operativas con Sparkline
El sistema DEBE proveer un endpoint `/api/dashboard/operational/kpis` que devuelva el valor consolidado actual para cuatro métricas clave: Órdenes Activas, Órdenes Estancadas, Entregadas sin Cobrar e Insumos bajo Stock Mínimo.
El valor numérico de cada métrica DEBE presentarse centrado y con un tamaño destacado en su color de énfasis original, descartando la representación histórica (gráfica de línea).

#### Scenario: Consulta exitosa de KPIs
- **WHEN** el usuario autenticado solicita las tarjetas KPI
- **THEN** el sistema retorna el conteo actual de cada métrica sin incluir series temporales ni datos históricos.

#### Scenario: Consulta en tenant nuevo sin actividad previa
- **WHEN** el usuario consulta las KPIs en un tenant que no posee órdenes ni movimientos registrados
- **THEN** el sistema retorna 0 como valor actual para todas las métricas, sin arrojar excepciones.

### Requirement: Gauge de Capacidad del Equipo
El sistema DEBE proveer un endpoint `/api/dashboard/operational/team-capacity` que calcule el ratio entre la cantidad de órdenes de servicio en estado activo y la capacidad máxima de órdenes simultáneas configurada en la empresa (`EmpresaConfiguracion.OPERATIONAL_CAPACITY_MAX_ORDERS`).

#### Scenario: Cálculo de capacidad con órdenes activas y umbral configurado
- **WHEN** el sistema cuenta con 15 órdenes activas y la capacidad máxima configurada es 20
- **THEN** el sistema retorna `activeOrders: 15`, `maxCapacity: 20`, `capacityPercentage: 75.0` y estado semántico "Normal".

#### Scenario: Capacidad no configurada o en cero
- **WHEN** la empresa no ha configurado el valor de capacidad máxima o este es 0
- **THEN** el sistema asume un valor por defecto de 10 (modificado de 50) y retorna `activeOrders: X`, `maxCapacity: 10`, calculando el porcentaje correspondiente.

### Requirement: Monitoreo de Inventario Crítico y Mermas
El sistema DEBE proveer un endpoint `/api/dashboard/operational/inventory-alerts` que reporte los insumos con stock consolidado (`SUM(InventoryMovement.Cantidad)`) estrictamente menor a `Consumable.MinimumStock`, junto con el volumen acumulado de movimientos de tipo `AjusteNegativo` del mes actual agrupado por `Motivo`. Si `Consumable.MinimumStock` no posee un valor configurado en el sistema, se DEBE asumir como 0 por defecto.

#### Scenario: Detección de insumos bajo stock mínimo
- **WHEN** existen insumos cuyo stock calculado es inferior a su stock mínimo configurado
- **THEN** el sistema retorna la lista de insumos críticos con `consumableId`, `description`, `currentStock`, `minimumStock` y `deficit`.

#### Scenario: Inventario con stock suficiente y sin mermas
- **WHEN** todos los insumos tienen stock mayor o igual al mínimo (o 0 si no estuviese configurado) y no hubo ajustes negativos
- **THEN** el sistema retorna `criticalConsumables: []` y `negativeAdjustmentsByReason: []`.

## ADDED Requirements

### Requirement: Botón de Ayuda en Informes
La interfaz de usuario del Dashboard Operativo DEBE incluir un botón de ayuda en la esquina inferior derecha de cada widget o informe. Al hacer clic, se DEBE desplegar un modal o mensaje contextual que explique la información mostrada, su forma de cálculo o interpretación.

#### Scenario: Visualización de la explicación de un widget
- **WHEN** el usuario hace clic en el botón de ayuda ubicado en la parte inferior derecha de un widget (ej. Gauge de Capacidad del Equipo)
- **THEN** el sistema despliega un mensaje o modal con la explicación pertinente al widget consultado.

### Requirement: Logo de la Empresa en Cabecera
La interfaz del Dashboard Operativo DEBE mostrar en su parte superior el logo de la empresa. Este logo DEBE estar alineado al centro y contenido visualmente dentro de un círculo con fondo de color blanco.

#### Scenario: Visualización del logo de la empresa
- **WHEN** el usuario accede al Dashboard Operativo
- **THEN** el sistema renderiza el logo de la empresa centrado en la parte superior, encapsulado en un contenedor circular de fondo blanco.
