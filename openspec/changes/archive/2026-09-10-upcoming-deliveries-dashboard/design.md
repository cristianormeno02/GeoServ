## Context

Ver `proposal.md` y `specs/dashboard-operativo/spec.md`. Actualmente, el backend `OperationalDashboardEndpoints.cs` agrupa datos de órdenes activas, estancadas y antigüedad de cobro en órdenes entregadas, mientras que el frontend dispone de componentes como `AgingBarChartComponent` y modales de inspección de KPIs. La entidad `ServiceOrder` cuenta con el campo `EstimatedEndDate`, que define la fecha comprometida de entrega pactada con el cliente.

## Goals / Non-Goals

**Goals:**
- Implementar endpoint `/api/dashboard/operational/upcoming-deliveries` para calcular la distribución de órdenes pendientes de entrega en 4 buckets semafóricos:
  - Vencidas y ≤ 7 días (Rojo: `#ef4444`).
  - 8 a 14 días (Amarillo/Ámbar: `#f59e0b`).
  - 15 a 30 días (Verde: `#10b981`).
  - Más de 30 días (Neutro: `#64748b`).
- Implementar endpoint `/api/dashboard/operational/upcoming-deliveries/details` para paginar y listar las órdenes de un bucket seleccionado.
- Habilitar en frontend la visualización del gráfico de barras horizontales (aprovechando la arquitectura de `AgingBarChartComponent`) con soporte de interacción para disparar el modal de detalle.
- Integrar la navegación fluida hacia el detalle de la orden de servicio desde el modal.

**Non-Goals:**
- Modificar el esquema de base de datos ni los estados de `ServiceOrder`.
- Enviar alertas por correo electrónico o notificaciones automáticas push (alcance puramente analítico y operativo de dashboard).
- Modificar los cálculos de otros gráficos ya existentes.

## Decisions

### Decisión 1: Clasificación de rangos en Backend y tratamiento de órdenes vencidas
- **Opción elegida**: Agrupar en backend mediante LINQ comparando `(EstimatedEndDate.Value.Date - today).Days`.
  - Si los días restantes son menores o iguales a 7 (incluyendo números negativos para órdenes ya vencidas que no han sido entregadas), se agrupan en el rango crítico "≤ 7 días" en rojo.
  - 8 a 14 días: rango de alerta preventiva en amarillo/ámbar.
  - 15 a 30 días: rango regular a tiempo en verde.
  - Mayor a 30 días: rango informativo en neutro.
- **Razón**: Asegura que el criterio de cálculo sea centralizado, consistente y no dependa del reloj del cliente, permitiendo además una consulta liviana y escalable.
- **Alternativas consideradas**: Calcular en el navegador del cliente. Descartado por ineficiencia de red y falta de control sobre paginación de grandes volúmenes.

### Decisión 2: Interacción y extensión de `AgingBarChartComponent`
- **Opción elegida**: Agregar soporte de interacción a `AgingBarChartComponent` mediante un `@Input() isClickable: boolean = false` y un `@Output() bucketClick = new EventEmitter<AgingBucket>()`, junto con estilos de cursor pointer y hover sutil.
- **Razón**: Permite que tanto el nuevo gráfico de próximas entregas como eventualmente otros gráficos de barras aprovechen la misma experiencia interactiva sin duplicar plantillas HTML ni estilos CSS idénticos.
- **Alternativas consideradas**: Crear un nuevo componente `DeliveryForecastChartComponent` desde cero. Descartado por redundancia de código, ya que la presentación visual (barras horizontales con etiquetas, porcentajes y conteos) es idéntica.

### Decisión 3: Estructura del Modal de Detalle de Órdenes Próximas a Entregar
- **Opción elegida**: Utilizar el componente modal de detalles de KPI (`KpiDetailDialogComponent` o extensión de diálogo MatDialog) para renderizar la tabla con las columnas: Nº Orden, Cliente, Tipo de Servicio, Fecha Estimada de Entrega y Días Restantes (con chip de color según urgencia), más el botón de acceso directo (`visibility`).
- **Razón**: Mantiene coherencia con el comportamiento de los otros indicadores interactivos del dashboard operativo.

## Risks / Trade-offs

- **[Riesgo] Órdenes activas con `EstimatedEndDate` nulo**:
  - *Mitigación*: Se excluyen de la consulta de vencimientos para no falsear los días restantes. En caso de requerirse, se reporta en el diseño la cantidad de órdenes sin fecha pactada.
- **[Riesgo] Diferencias horarias entre servidor y cliente**:
  - *Mitigación*: Las comparaciones de fechas se realizan a nivel de fecha truncada (`Date`) tomando `DateTime.UtcNow.Date`.
