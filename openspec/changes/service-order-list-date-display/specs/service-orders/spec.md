## ADDED Requirements

### Requirement: Visualización Dinámica de Fecha en el Listado de Órdenes de Servicio
El listado de Órdenes de Servicio DEBE presentar una columna de fecha denominada "Fecha" (en reemplazo del encabezado estático "Fecha Alta"), cuyo valor y contexto se resuelven dinámicamente de acuerdo con el ciclo de vida y los datos registrados en la orden.

- **Orden de Precedencia para la Fecha**:
  1. **Fecha de Entrega Real**: Si la orden posee registrada la fecha de finalización/entrega real (`actualEndDate`), el sistema DEBE mostrar esta fecha con prioridad máxima.
  2. **Fecha Presupuestada de Entrega**: Si no posee fecha de entrega real pero cuenta con fecha presupuestada de fin (`estimatedEndDate`), el sistema DEBE mostrar dicha fecha presupuestada.
  3. **Fecha de Alta**: Si no posee ninguna de las anteriores, el sistema DEBE mostrar la fecha de creación/alta en el sistema (`createdAt`).
- **Formato Visual**: La fecha DEBE mostrarse bajo el formato localizado `dd/MM/yyyy`.
- **Icono Distintivo**: Cada fila DEBE mostrar junto a la fecha un icono que identifique visualmente el origen del dato:
  - Entrega Real: Icono representativo de finalización/cumplimiento (ej. `check_circle` o `event_available`).
  - Presupuestada de Entrega: Icono representativo de planificación o plazo estimado (ej. `schedule` o `event`).
  - Fecha de Alta: Icono representativo de alta o inicio (ej. `add_circle_outline` o `history`).
- **Tooltip Informativo**: La celda o el icono de fecha DEBE contar con un tooltip descriptivo (`matTooltip`) que informe con precisión al usuario a qué concepto corresponde el valor mostrado ("Fecha de entrega real", "Fecha presupuestada de entrega" o "Fecha de alta").
- **Ordenamiento (Sorting)**: La tabla DEBE permitir ordenar ascendentemente y descendentemente las órdenes según el valor de la fecha resuelta dinámicamente.

#### Scenario: Orden con fecha de entrega real registrada
- **WHEN** una orden de servicio posee cargada su fecha de fin/entrega real (`actualEndDate`)
- **THEN** la columna "Fecha" muestra dicha fecha formateada en `dd/MM/yyyy`, acompañada del icono de entrega real y el tooltip "Fecha de entrega real"

#### Scenario: Orden sin fecha de entrega real pero con fecha presupuestada de entrega
- **WHEN** una orden de servicio no posee fecha de entrega real (`actualEndDate` vacía o nula) pero sí posee fecha presupuestada de entrega (`estimatedEndDate`)
- **THEN** la columna "Fecha" muestra la fecha presupuestada de entrega en formato `dd/MM/yyyy`, acompañada del icono de planificación y el tooltip "Fecha presupuestada de entrega"

#### Scenario: Orden sin fechas de entrega registradas
- **WHEN** una orden de servicio no posee fecha de entrega real ni fecha presupuestada de entrega
- **THEN** la columna "Fecha" muestra la fecha de alta en el sistema (`createdAt`) en formato `dd/MM/yyyy`, acompañada del icono de alta y el tooltip "Fecha de alta"

#### Scenario: Ordenamiento por columna Fecha
- **WHEN** el usuario hace clic en el encabezado de ordenamiento de la columna "Fecha"
- **THEN** la tabla ordena las filas según la fecha resuelta dinámicamente de cada orden de servicio
