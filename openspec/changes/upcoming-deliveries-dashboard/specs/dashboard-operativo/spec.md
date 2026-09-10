## ADDED Requirements

### Requirement: Distribución de Próximas Entregas de Órdenes de Servicio
El sistema SHALL proveer un endpoint `/api/dashboard/operational/upcoming-deliveries` que clasifique las órdenes de servicio pendientes de entrega (cuyo estado sea diferente a "Entregada", "Cobrada" y "Cancelada") que cuenten con fecha presupuestada de entrega (`EstimatedEndDate`), agrupándolas en rangos temporales según los días restantes desde la fecha actual:
- Crítico / Vencidas y ≤ 7 días: color rojo (`#ef4444`)
- Alerta / 8 a 14 días: color amarillo/ámbar (`#f59e0b`)
- A tiempo / 15 a 30 días: color verde (`#10b981`)
- Mayor plazo / > 30 días: color neutro (`#64748b`)

El endpoint SHALL devolver por cada bucket el nombre del rango, la cantidad de órdenes (`count`), el color asignado y opcionalmente el monto total presupuestado (`totalBudgetedAmount`).

#### Scenario: Distribución con órdenes en los diferentes rangos
- **WHEN** existen órdenes no entregadas con fecha presupuestada a 5 días, 10 días, 20 días y 40 días
- **THEN** el sistema retorna los 4 buckets calculados con sus respectivos conteos y colores semafóricos correspondientes.

#### Scenario: Órdenes ya vencidas antes de la entrega
- **WHEN** existen órdenes no entregadas cuya fecha presupuestada de entrega es anterior a la fecha actual (`EstimatedEndDate < now`)
- **THEN** dichas órdenes se computan dentro del rango crítico de "≤ 7 días" (en rojo), incrementando su conteo.

#### Scenario: Exclusión de órdenes entregadas, cobradas o canceladas
- **WHEN** existen órdenes en estado "Entregada", "Cobrada" o "Cancelada" con fecha presupuestada de entrega dentro de los próximos 7 días
- **THEN** el sistema excluye estas órdenes del cómputo de próximas entregas.

#### Scenario: Órdenes sin fecha presupuestada de entrega
- **WHEN** existen órdenes activas que tienen `EstimatedEndDate` nulo
- **THEN** el sistema no las incluye en los rangos de días calculados para no distorsionar las métricas con fecha cierta.

### Requirement: Visualización de Aging Preventivo de Entregas en Dashboard Operativo
El frontend del dashboard operativo SHALL presentar un widget de gráfico de barras horizontales por rangos (Aging Preventivo de Entregas) que renderice visualmente las franjas de vencimiento con sus respectivos colores semafóricos (Rojo, Amarillo, Verde, Neutro) y las proporciones relativas de órdenes.

#### Scenario: Renderizado del gráfico en el dashboard
- **WHEN** el usuario ingresa al Dashboard Operativo y los datos del endpoint son cargados
- **THEN** el widget muestra las barras horizontales con longitud porcentual respecto al valor máximo, el rótulo de días, la cantidad de órdenes por rango y el color semafórico correspondiente.

#### Scenario: Estado vacío sin órdenes pendientes en las ventanas
- **WHEN** no existen órdenes no entregadas con fecha presupuestada en los rangos
- **THEN** el widget presenta un mensaje descriptivo indicando que no hay órdenes próximas a vencer en los rangos establecidos.

### Requirement: Detalle Interactivo de Órdenes Próximas a Entregar
El sistema SHALL permitir al usuario hacer clic en cualquiera de las franjas o barras del gráfico de próximas entregas para abrir un diálogo modal interactivo que liste en una tabla las órdenes correspondientes al rango seleccionado, indicando: número de orden, cliente, tipo de servicio, fecha presupuestada de entrega, días restantes hasta el vencimiento y enlace de navegación a la orden.

#### Scenario: Clic en rango para ver órdenes detalladas
- **WHEN** el usuario hace clic en el bucket "≤ 7 días"
- **THEN** se abre el modal desplegando la lista de órdenes que vencen en ese rango con sus días restantes destacados y enlaces funcionales para navegar al detalle de la orden.
