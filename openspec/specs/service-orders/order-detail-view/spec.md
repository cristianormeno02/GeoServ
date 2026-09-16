# service-orders/order-detail-view Specification

## Purpose
Define la organización visual, el contenido y las acciones rápidas de la vista de solo lectura "Detalle de Orden de Servicio", asegurando que exponga de forma completa y consciente de moneda los datos ya disponibles en el modelo de la orden, e integrando como secciones/pestañas de esta vista funcionalidades ya construidas (Bitácora, Actividades, Movimientos de Cobro Vinculados).

## Requirements

### Requirement: Organización de Tarjetas en la Pestaña "Detalles Generales"
La pestaña "Detalles Generales" del detalle de la Orden de Servicio DEBE organizar la información en tres tarjetas temáticas: "Información General", "Fechas" y "Finanzas", en reemplazo de la tarjeta combinada "Finanzas y Fechas" actual.
- **Información General**: Cliente, Proyecto, Tipo de Servicio, Estado (badge existente), Prioridad (badge, ver requisito de Prioridad) y Descripción.
- **Fechas**: Fecha de Solicitud (`requestDate`), Fecha de Alta (`createdAt`), Inicio Presupuestado (`estimatedStartDate`), Fin Presupuestado (`estimatedEndDate`), Inicio Real (`actualStartDate`), Fin Real (`actualEndDate`) y Fecha de Cobro (`collectionDate`). Todas se muestran en formato `dd/MM/yyyy` o "N/A" si están vacías. Si la orden tiene `canceledAt` con valor, se agrega también "Fecha de Cancelación".
- **Finanzas**: Monto Presupuestado (`budgetedAmount`), Descuento (`discount`), Monto Total (`totalAmount`), Monto Cobrado (`collectedAmount`) con barra de progreso visual del porcentaje cobrado sobre el total.

#### Scenario: Visualización de las tres tarjetas temáticas
- **WHEN** el usuario abre el detalle de una Orden de Servicio
- **THEN** la pestaña "Detalles Generales" muestra las tarjetas "Información General", "Fechas" y "Finanzas" por separado, cada una con sus campos correspondientes

#### Scenario: Barra de progreso de cobro
- **WHEN** una orden tiene `totalAmount` mayor a 0 y `collectedAmount` parcial
- **THEN** la tarjeta "Finanzas" muestra una barra de progreso reflejando el porcentaje `collectedAmount / totalAmount`

### Requirement: Fila de Indicadores Clave (KPIs)
La pestaña "Detalles Generales" del detalle DEBE mostrar, antes de las tarjetas de información, una fila de indicadores clave (KPIs) con al menos: Monto Total, Monto Cobrado (con indicador de progreso del porcentaje cobrado) y Costo Directo Total, de forma que los montos más consultados sean visibles sin necesidad de leer listas de texto.

#### Scenario: Visualización de la fila de KPIs
- **WHEN** el usuario abre el detalle de una Orden de Servicio
- **THEN** la parte superior de la pestaña "Detalles Generales" muestra los indicadores de Monto Total, Monto Cobrado con su progreso y Costo Directo Total

### Requirement: Iconografía por Campo y Layout de Contenido Principal con Barra Lateral
Las tarjetas de información del detalle DEBEN mostrar un ícono distintivo junto a cada campo individual (no solo en el encabezado de cada sección), y la pestaña "Detalles Generales" DEBE organizarse en un layout de dos columnas: una columna principal con la información descriptiva y operativa (Información General, Equipo de Trabajo, Distribución Financiera, Movimientos de Cobro Vinculados) y una barra lateral con la información de referencia temporal y financiera (Fechas, Finanzas).

#### Scenario: Ícono visible por cada campo
- **WHEN** el usuario visualiza cualquier tarjeta de información del detalle
- **THEN** cada campo individual (Cliente, Proyecto, Tipo de Servicio, cada fecha, cada dato financiero, etc.) se muestra acompañado de un ícono distintivo

### Requirement: Identificación Visual del Equipo de Trabajo con Avatares
Cada responsable listado en la sección "Equipo de Trabajo" del detalle DEBE mostrarse con un avatar circular de iniciales (generadas a partir de su nombre), además de los datos textuales ya requeridos (nombre, cargo, título, especialidades, usuario vinculado).

#### Scenario: Avatar de iniciales por responsable
- **WHEN** el usuario visualiza la sección "Equipo de Trabajo" del detalle
- **THEN** cada responsable se muestra con un avatar circular con sus iniciales junto a su información textual

### Requirement: Formateo Monetario Consciente de la Moneda de la Orden
Todos los montos monetarios mostrados en el detalle de la Orden de Servicio DEBEN formatearse usando la moneda real de la orden (`currencyCode`/`currencySymbol`), no la moneda o locale por defecto del navegador, y respetando el formato numérico local argentino (separador de miles con punto, decimales con coma) ya definido para el resto de la aplicación.
- Si `currencyCode` de la orden es distinto de la moneda base de la empresa y existen `foreignAmount` y `exchangeRateAtBudget` con valor, se DEBE mostrar una línea adicional indicando el monto en moneda extranjera y la cotización utilizada.

#### Scenario: Orden presupuestada en moneda base
- **WHEN** el usuario visualiza el detalle de una orden cuya moneda coincide con la moneda base de la empresa
- **THEN** todos los montos se muestran con el símbolo y formato de la moneda base, sin información adicional de cotización

#### Scenario: Orden presupuestada en moneda extranjera
- **WHEN** el usuario visualiza el detalle de una orden cuya moneda difiere de la moneda base y tiene cargado `foreignAmount` y `exchangeRateAtBudget`
- **THEN** el detalle muestra el monto en la moneda de la orden junto con el monto equivalente en moneda base y la cotización utilizada

### Requirement: Badge Visual de Prioridad
El campo Prioridad en el detalle de la Orden de Servicio DEBE mostrarse como un badge de color con ícono, siguiendo la misma convención visual ya utilizada para el badge de Estado, en lugar de texto plano.

#### Scenario: Visualización de prioridad Urgente
- **WHEN** el usuario visualiza el detalle de una orden con prioridad "Urgente"
- **THEN** el campo Prioridad se muestra como un badge de color distintivo (ej. rojo) con ícono, no como texto simple

### Requirement: Línea de Tiempo (Stepper) del Ciclo de Vida de la Orden
El detalle de la Orden de Servicio DEBE mostrar en su cabecera un stepper de solo lectura con las etapas `Alta, Presupuestada, Aprobada, Iniciada, Entregada, Cobrada`, resaltando visualmente la etapa correspondiente al estado actual de la orden.
- Si el estado actual de la orden es "Cancelada", el stepper DEBE reemplazarse por un indicador visual de estado terminal distintivo, sin intentar ubicar "Cancelada" dentro de la secuencia lineal de las demás etapas.

#### Scenario: Orden en estado intermedio
- **WHEN** el usuario visualiza el detalle de una orden en estado "Iniciada"
- **THEN** el stepper resalta la etapa "Iniciada" y muestra como completadas las etapas previas ("Alta", "Presupuestada", "Aprobada")

#### Scenario: Orden cancelada
- **WHEN** el usuario visualiza el detalle de una orden en estado "Cancelada"
- **THEN** el sistema muestra un indicador de estado terminal distintivo en lugar del stepper lineal de etapas

### Requirement: Ampliación de la Sección "Equipo de Trabajo"
La sección "Equipo de Trabajo" del detalle DEBE mostrar, además del nombre y cargo ya visibles, el título, las especialidades y el nombre de usuario del sistema vinculado (`userName`) de cada responsable, cuando dichos datos estén disponibles.

#### Scenario: Responsable con usuario del sistema vinculado
- **WHEN** un responsable de la orden tiene un `UserId` asignado
- **THEN** la sección "Equipo de Trabajo" muestra el nombre del usuario del sistema vinculado junto con el nombre, cargo, título y especialidades del responsable

### Requirement: Distribución Financiera con Monto Real Destinado y Totales
La sección "Distribución Financiera" del detalle DEBE mostrar, para cada concepto, el "Monto Real Destinado" (`actualAmount`) además del porcentaje y el "Monto Esperado" ya visibles, y DEBE incluir una fila totalizadora que sume Porcentaje, Monto Esperado y Monto Real Destinado, resaltando visualmente si la suma de porcentajes no es exactamente 100%.

#### Scenario: Visualización de fila totalizadora en el detalle
- **WHEN** la orden tiene al menos un concepto de distribución financiera cargado
- **THEN** la sección muestra una fila final con los totales de Porcentaje, Monto Esperado y Monto Real Destinado

### Requirement: Pestaña de Bitácora en el Detalle
El detalle de la Orden de Servicio DEBE incluir una pestaña "Bitácora" que integre el componente de línea de tiempo de observaciones ya existente, permitiendo consultar el historial completo y agregar nuevas notas sin necesidad de entrar al modo edición de la orden.

#### Scenario: Alta de una observación desde el detalle
- **WHEN** el usuario completa el campo de texto y el tipo de observación en la pestaña "Bitácora" del detalle y confirma el guardado
- **THEN** la observación se agrega a la línea de tiempo con el usuario de la sesión activa y la fecha/hora actual, sin requerir abrir el formulario de edición de la orden

### Requirement: Pestaña de Actividades en el Detalle
El detalle de la Orden de Servicio DEBE incluir una pestaña "Actividades" que liste, en modo solo lectura, las Actividades Operativas de la orden: Detalle corto, Estado (badge) y Porcentaje de Avance con barra de progreso alineada a la derecha.

#### Scenario: Visualización de actividades operativas
- **WHEN** la orden tiene actividades operativas cargadas
- **THEN** la pestaña "Actividades" del detalle las lista con su estado y porcentaje de avance, sin controles de edición

#### Scenario: Orden sin actividades cargadas
- **WHEN** la orden no tiene actividades operativas cargadas
- **THEN** la pestaña "Actividades" muestra un estado vacío con ícono y mensaje guía

### Requirement: Movimientos de Cobro Vinculados en el Detalle
La tarjeta "Finanzas" del detalle de la Orden de Servicio DEBE incluir una sub-sección que liste los movimientos contables de ingreso vinculados a la orden, consumiendo el servicio ya existente que expone `GET /api/service-orders/{id}/movements`: Fecha, Monto, Cuenta Financiera, Medio de Pago y Descripción, con un totalizador que concilie con el "Monto Cobrado" de la orden.

#### Scenario: Orden con cobros parciales registrados
- **WHEN** el usuario visualiza el detalle de una orden que registra movimientos de ingreso vinculados
- **THEN** la sub-sección de Movimientos de Cobro Vinculados lista cada movimiento y su totalizador coincide con el "Monto Cobrado" mostrado en la tarjeta "Finanzas"

### Requirement: Acción Rápida "Marcar como Entregada" desde el Detalle
La cabecera del detalle de la Orden de Servicio DEBE incluir la acción "Marcar como Entregada", visible únicamente cuando el estado actual de la orden es "Iniciada", reutilizando el mismo diálogo de confirmación y la misma lógica de negocio ya implementados para esta acción en el listado de Órdenes de Servicio.

#### Scenario: Acción visible solo en estado Iniciada
- **WHEN** el usuario visualiza el detalle de una orden en estado "Iniciada"
- **THEN** el botón "Marcar como Entregada" está visible en la cabecera del detalle

#### Scenario: Acción no disponible en otros estados
- **WHEN** el usuario visualiza el detalle de una orden en cualquier estado distinto de "Iniciada"
- **THEN** el botón "Marcar como Entregada" no se muestra en la cabecera del detalle

#### Scenario: Confirmación exitosa desde el detalle
- **WHEN** el usuario confirma la acción "Marcar como Entregada" desde el detalle de una orden "Iniciada"
- **THEN** el sistema actualiza el estado de la orden a "Entregada" y refresca la información mostrada en el detalle sin requerir recargar la página completa

### Requirement: Estados Vacíos con Guía Visual
Toda sección del detalle que pueda no tener datos cargados (Equipo de Trabajo, Distribución Financiera, Actividades, Bitácora, Movimientos de Cobro Vinculados, Documentos Adjuntos, Costos Directos) DEBE mostrar, en ausencia de datos, un estado vacío con ícono y mensaje guía, en reemplazo de los mensajes de texto plano actuales.

#### Scenario: Sección sin datos
- **WHEN** una sección del detalle no tiene registros asociados a la orden
- **THEN** el sistema muestra un ícono representativo y un mensaje guía en lugar de únicamente texto plano
