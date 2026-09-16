## Purpose

Define las capacidades principales para crear, gestionar y realizar el seguimiento de las Órdenes de Servicio (OS) dentro del sistema de consultoría geológica, contemplando un manejo completo del ciclo de vida financiero y operativo.

## Requirements

### Requirement: Estructura General del Formulario y UI/UX (Acordeones y Badges)
El formulario de Creación y Edición de Órdenes de Servicio debe organizarse de manera modular para evitar el scroll vertical excesivo y mejorar la experiencia del usuario.
- **Sección Principal Fija**: La primera sección ("Datos Principales") debe permanecer siempre visible y expandida por defecto.
- **Acordeones para Secciones Subsiguientes**: Todas las demás secciones deben estar contenidas obligatoriamente dentro de componentes de acordeón (expansibles/colapsables):
  1. Cronograma y Trazabilidad (Fechas)
  2. Gestión Financiera y Presupuesto (incluyendo Distribución de Cobro y Moneda)
  3. Ejecución y Avance (Actividades)
  4. Equipo de Trabajo (Responsables)
  5. Bitácora y Observaciones
- **Badges de Validación Dinámicos**: Cada cabecera de acordeón (excepto la primera) debe incluir un badge rojo dinámico que indique la cantidad exacta de campos obligatorios (*) faltantes en esa sección, bloqueando el guardado hasta que todos se completen.

#### Scenario: Visualización de acordeones en el formulario
- **WHEN** el usuario abre el formulario de una Orden de Servicio
- **THEN** la sección "Datos Principales" se muestra siempre expandida y las demás secciones se presentan como acordeones colapsables, cada uno con su badge de validación en la cabecera

### Requirement: Fechas de la Orden
El sistema DEBE gestionar las siguientes fechas clave en el ciclo de vida de la orden.
- **Manejo Visual y Formato**: Todos los campos de fecha en la interfaz de usuario deben mostrarse y validarse bajo el formato **`dd/mm/aaaa`** (día/mes/año).
- **Inicialización (Creación)**: Al crear una NUEVA Orden de Servicio, los campos "Fecha de Solicitud", "Inicio Presupuestado" y "Fin Presupuestado" deben inicializarse automáticamente con la **fecha actual** del sistema.
- **Inicialización (Edición)**: Al abrir una OS existente para editar, el formulario DEBE cargar correctamente **todos** los valores previamente guardados sin excepción: campos de fecha (Inicio Real, Fin Real, Fecha de Cobro), campos numéricos, y selectores (Cliente, Proyecto, Tipo de Servicio, Estado). Ningún campo puede quedar vacío o en blanco si tenía un valor almacenado.
- **Fecha de Solicitud**: Momento en que el cliente solicitó el servicio, la cual es independiente de la fecha de creación en el sistema (`CreatedAt`).
- **Fechas Presupuestadas**: "Inicio Presupuestado" (`EstimatedStartDate`) y "Fin Presupuestado" (`EstimatedEndDate`).
- **Lógica de Precarga Automática**: Cuando el usuario seleccione o modifique el valor de "Inicio Presupuestado", el sistema debe copiar automáticamente ese valor al campo "Inicio Real" (`ActualStartDate`). De igual forma, cuando se modifique "Fin Presupuestado", su valor se copia automáticamente a "Fin Real" (`ActualEndDate`). El usuario puede modificar libremente las fechas reales después de la copia automática.
- **Fechas Reales**: "Inicio Real" (`ActualStartDate`) y "Fin Real" (`ActualEndDate`), las cuales se actualizarán conforme avance o concluya el trabajo. Estos campos son **opcionales** al guardar.
- **Fecha de Cobro** (`CollectionDate`): Este campo es **opcional** al guardar.

#### Scenario: Precarga automática de fechas reales
- **WHEN** el usuario modifica "Inicio Presupuestado" o "Fin Presupuestado" en el formulario de la orden
- **THEN** el sistema copia automáticamente ese valor a "Inicio Real" o "Fin Real" respectivamente, sin impedir que el usuario los edite después

### Requirement: Manejo Multimoneda y Catálogo de Monedas
El sistema DEBE soportar presupuestación y cobranza dinámica utilizando múltiples monedas.
- **Catálogo de Monedas**: Debe existir una tabla maestra de monedas (`Currency`) que almacene su `Code` (ej. USD, CLP, ARS), su `Symbol` (ej. $) y su `Name` (ej. Dólar, Peso Chileno).
- Al crear o editar el presupuesto en la Orden de Servicio, la moneda presupuestada se seleccionará obligatoriamente desde este catálogo a través de un combo/selector.
- Si la moneda seleccionada es la moneda base (ej. ARS), el campo "Monto Presupuestado (Base)" SHALL ser editable directamente por el usuario de forma inmediata tanto en creación como en edición de la orden, sin requerir cambiar o re-seleccionar la moneda.
- Si la moneda seleccionada es distinta a la moneda base (ej. ARS), el sistema debe habilitar el campo "Monto en Moneda Extranjera" y requerir la "Cotización al Presupuestar" para calcular automáticamente el "Monto Presupuestado" en la moneda base.
- Al registrar el cobro, el sistema debe permitir ingresar el monto cobrado y la "Cotización a la Fecha de Cobro" si aplica.

#### Scenario: Presupuesto en moneda extranjera
- **WHEN** el usuario selecciona una moneda distinta a la moneda base al presupuestar la orden
- **THEN** el sistema habilita el campo "Monto en Moneda Extranjera" y requiere la "Cotización al Presupuestar" para calcular el Monto Presupuestado en moneda base

#### Scenario: Edición de monto presupuestado en moneda base al abrir orden existente
- **WHEN** el usuario abre una Orden de Servicio existente cuya moneda asignada es la moneda base (ej. ARS) para su edición
- **THEN** el sistema SHALL habilitar de forma inmediata el campo "Monto Presupuestado (Base)" como editable, manteniendo resuelta la moneda sin requerir cambio manual de divisa

### Requirement: Monto Cobrado
El formulario financiero de la OS DEBE incluir el campo numérico **"Monto Cobrado"** (`CollectedAmount`).
- Este campo es **independiente** del "Total Final" (`TotalAmount`): representa lo efectivamente cobrado al cliente, no el monto presupuestado.
- Se usa para disparar la lógica de distribución real de ingresos (regla de los tercios/porcentajes).
- El campo debe aplicar el formato numérico local argentino (separador de miles con punto, decimales con coma).
- **Modalidad Configurable**: La editabilidad del campo depende del parámetro de empresa `os_collected_amount_mode`:
  - En modalidad `Manual`, el usuario puede ingresar y modificar libremente el monto cobrado desde el formulario.
  - En modalidad `Automatic`, el campo es de solo lectura (no editable) en la interfaz de usuario, y la API bloquea modificaciones manuales para preservar el valor calculado a partir de los movimientos financieros de ingreso asociados.

#### Scenario: Edición de monto cobrado en modo manual
- **WHEN** la empresa tiene configurada la modalidad `Manual`
- **THEN** el usuario puede editar directamente el campo Monto Cobrado en la Orden de Servicio y guardarlo

#### Scenario: Bloqueo de edición de monto cobrado en modo automático
- **WHEN** la empresa tiene configurada la modalidad `Automatic`
- **THEN** el campo Monto Cobrado se muestra no editable / solo lectura en el formulario y cualquier valor manual enviado en la actualización de la orden es ignorado por la API

### Requirement: Detalle de Tareas Presupuestadas
El formulario de la OS DEBE incluir un campo de texto libre multilinea denominado **"Detalle de Tareas Presupuestadas"** (`BudgetedTasksDetail`).
- Es un textarea amplio sin restricción de formato estructurado.
- Su propósito es describir las tareas incluidas en el presupuesto, siendo la fuente de contenido principal para la generación del **PDF del presupuesto**.
- El campo es opcional al guardar la orden.

#### Scenario: Carga del detalle de tareas presupuestadas
- **WHEN** el usuario completa el campo "Detalle de Tareas Presupuestadas" y guarda la orden
- **THEN** el contenido se almacena y queda disponible como fuente de texto para la generación del PDF del presupuesto

### Requirement: Historial de Observaciones (Bitácora y Línea de Tiempo Enriquecida)
El sistema DEBE mantener un historial inmutable de observaciones (bitácora) asociado a cada Orden de Servicio, presentado en una interfaz moderna de línea de tiempo dentro de su acordeón correspondiente.

**Modelo de datos:**
- Existirá la entidad `ServiceOrderObservation` (o `ServiceOrderObservations`) con los siguientes campos: 
  - `Id` (Guid)
  - `ServiceOrderId` (Guid, FK)
  - `Text` (string, texto libre multilinea)
  - `ObservationType` (string o enum para clasificar, ej: Nota General, Alerta Operativa, Novedad Contable, Hito Clave)
  - `UserId` (Guid, FK del usuario que creó la nota, tomado automáticamente)
  - `CreatedAt` (DateTime UTC, fecha y hora exacta, automática)
- Las observaciones son de solo inserción: no se editan ni eliminan para garantizar la trazabilidad.

**Interfaz de usuario - Sección de Carga Mejorada:**
- En el acordeón de "Bitácora y Observaciones" al pie del formulario de edición, el formulario de carga debe incluir:
  - Un campo de texto multilinea (textarea) para la observación.
  - Un combo desplegable (`mat-select`) para seleccionar el "Tipo de Observación". La opción **"Nota General"** debe estar seleccionada por defecto.
  - Los tipos de observación permitidos para la primera versión y sus identificadores visuales son:
    - `Nota General` (Color por defecto / Azul)
    - `Alerta Operativa` (Color Amarillo / Naranja)
    - `Novedad Contable` (Color Rojo)
    - `Hito Clave` (Color Verde)
- Al presionar **"Guardar Observación"**, el sistema debe tomar automáticamente la Fecha/Hora actual y el Usuario de la sesión activa (desde el token JWT). El usuario no los ingresa manualmente.
- Esta sección de carga estará habilitada desde el momento de la creación de la Orden de Servicio y también en modo edición, siempre y cuando el textarea no esté vacío. Al guardar la Orden de Servicio o la observación, el formulario se limpia automáticamente.

**Interfaz de usuario - Visualización en Línea de Tiempo Vertical (Vertical Timeline):**
- Debajo de la sección de carga, el historial de observaciones debe mostrarse en un formato de línea de tiempo vertical.
- **Orden cronológico inverso:** Las notas deben renderizarse estrictamente en orden DESC por fecha (las más nuevas arriba).
- **Tarjetas de Eventos:** Cada observación debe renderizarse como una tarjeta que contenga:
  - El Nombre del Usuario (real).
  - La Fecha y Hora formateada.
  - El Tipo de Nota (visualizado como una etiqueta o *badge* de color correspondiente).
  - El Contenido (texto) de la observación.
- **Eje de la Línea de Tiempo:** El eje vertical de la línea de tiempo debe tener puntos (dots) de colores dinámicos que correspondan al tipo de observación.
- **Scroll Vertical:** Se debe implementar un área con scroll vertical interno (`overflow-y: auto`) y altura máxima para la línea de tiempo si la lista de observaciones se extiende, evitando desbordes en el formulario general de la OS.

#### Scenario: Carga de bitácora durante creación
- **WHEN** el usuario crea una nueva Orden de Servicio y llena el campo de bitácora
- **THEN** la bitácora se guarda junto con la orden y aparece en la línea de tiempo

### Requirement: Formato Numérico Local (Argentina)
El sistema DEBE mostrar visualmente en todas las interfaces los campos monetarios y numéricos utilizando el formato local argentino: separador de miles con punto (.) y separador de decimales con coma (,). Sin embargo, estos datos se almacenarán estructuradamente como valores `decimal` estándar en la base de datos.

#### Scenario: Visualización de montos en formato argentino
- **WHEN** el sistema muestra un campo monetario o numérico en cualquier interfaz de la Orden de Servicio
- **THEN** el valor se presenta con separador de miles con punto y separador decimal con coma, mientras se almacena internamente como un `decimal` estándar

### Requirement: Distribución de Cobros Dinámica y Porcentajes
La lógica de distribución de ingresos DEBE ser dinámica a partir de un catálogo (Amortización Gastos, Capitalización, Honorarios, Utilidad, etc.).
- El sistema DEBE validar de forma obligatoria y estricta que la sumatoria de todos los porcentajes asignados a la orden dé exactamente 100%. No se pueden repetir conceptos.
- El "Monto Esperado" para cada ítem debe ser calculado automáticamente basado en el porcentaje y usando el siguiente monto base por orden de prioridad:
  - **Prioridad 1:** "Total Final" (`TotalAmount`) de la orden de servicio si tiene un valor cargado mayor a 0.
  - **Prioridad 2:** Si el "Total Final" está en 0 o vacío, utilizar el "Monto Presupuestado" (`BudgetedAmount`) base.
- El sistema debe contar con el campo "Monto Real Destinado" por cada ítem. Este campo será editable en la interfaz para que el usuario cargue el valor real definitivo una vez confirmado el cobro.
- **Fila Totalizadora**: En la sección del formulario de Distribución de Cobro, si existe al menos un registro, debe mostrarse una fila final a modo informativo que sume y totalice el "Porcentaje", "Monto Esperado" y "Monto Real Destinado".
- **Resaltado de Alerta**: Si el total de los porcentajes sumados en esta fila no es exactamente 100%, el valor debe resaltarse visualmente para indicar la discrepancia.
- **Copiado desde Otra Orden**: 
  - La sección debe incluir un botón "Copiar de otra orden" que abra un modal de búsqueda.
  - Al seleccionar una orden existente, se deben previsualizar sus conceptos de cobro y porcentajes.
  - Al confirmar, los conceptos de la orden actual se reemplazarán completamente por los conceptos copiados, y el sistema recalculará automáticamente los montos esperados en base a la orden de servicio actual.

#### Scenario: Validación de porcentajes de distribución al 100%
- **WHEN** el usuario intenta guardar una orden con líneas de distribución de cobro cuya suma de porcentajes no es exactamente 100%
- **THEN** el sistema rechaza el guardado y resalta visualmente la discrepancia en la fila totalizadora

### Requirement: Gestión de Actividades de la Orden
El sistema DEBE permitir asociar múltiples actividades operativas a cada OS.
- Las actividades tendrán: Detalle corto, Detalle largo, Estado (Pendiente, En Proceso, Cancelado, Finalizado).
- Contarán con un "Porcentaje de Avance" numérico (1 al 100). Dicho campo solo estará habilitado para su edición si la actividad está en estado "En Proceso". Si la actividad pasa a "Finalizado", el porcentaje tomará el valor 100 de forma automática.
- **Alineación Visual**: El valor numérico del porcentaje de progreso debe estar alineado a la derecha en la interfaz del formulario.

#### Scenario: Progreso automático al finalizar una actividad
- **WHEN** el usuario cambia el estado de una actividad operativa a "Finalizado"
- **THEN** el "Porcentaje de Avance" de esa actividad se establece automáticamente en 100

### Requirement: Validaciones Generales y de Interfaz al Guardar
El sistema DEBE realizar verificaciones estrictas antes de permitir guardar (crear o editar) la Orden de Servicio:
- **Campos Obligatorios Principales**: Nro. de Orden, Cliente, Tipo de Servicio, Estado, Prioridad, Monto Presupuestado y Responsables (mínimo uno).
- **Fechas Obligatorias**: Fecha de Solicitud, Inicio Presupuestado y Fin Presupuestado son obligatorias. Las fechas reales (Inicio Real, Fin Real) y la Fecha de Cobro son **opcionales**.
- **Unicidad**: El Nro. de Orden no debe estar duplicado en el sistema.
- **Distribución de Cobro**: Si existe al menos una línea de distribución agregada, la suma de todos los porcentajes de los ítems de distribución DEBE ser exactamente 100%.
- **Limpieza de Interfaz**: Visualmente solo debe existir una única línea separadora entre la sección de "Datos Principales" y "Fechas".

#### Scenario: Rechazo por número de orden duplicado
- **WHEN** el usuario intenta guardar una Orden de Servicio con un Nro. de Orden ya utilizado por otra orden
- **THEN** el sistema rechaza el guardado indicando que el número de orden ya está en uso

### Requirement: Gestión de Responsables (Catálogo Maestro y Relación)
La gestión de responsables requiere de un modelo desacoplado y una tabla intermedia para su vinculación con las Órdenes de Servicio.
- **Tabla Maestra Independiente**: Existirá una tabla `Responsible` autónoma (sin relación directa ni campo `ServiceOrderId`). Tendrá su propio CRUD.
- **Atributos del Responsable**: Id, Nombre, Cargo, Título, Especialidades, y `UserId`.
- **Validaciones de Usuario**: Si se asigna un `UserId` a un Responsable, dicho usuario NO debe tener el rol de 'Cliente', y **tampoco puede estar ya asignado a otro Responsable** (relación 1 a 1 entre Usuario del sistema y Responsable).
- **Vinculación a la Orden (Tabla Intermedia)**: Existirá una tabla de unión (ej. `ServiceOrderResponsible`) que contenga el `ServiceOrderId` y el `ResponsibleId`.
- **Interfaz de la Orden de Servicio**: En el formulario de la OS, los responsables se agregarán o quitarán mediante un selector dinámico (dropdown). El sistema debe impedir que un mismo responsable sea agregado más de una vez a la misma orden.

#### Scenario: Restricción de un usuario a un único Responsable
- **WHEN** se intenta asignar un `UserId` a un Responsable cuando ese usuario ya está vinculado a otro Responsable existente
- **THEN** el sistema rechaza la asignación para preservar la relación uno a uno entre Usuario y Responsable

### Requirement: Gestionar Estado de la Orden
El sistema DEBE gestionar el flujo de estados de una Orden de Servicio (Alta, Presupuestada, Aprobada, Iniciada, Entregada, Cobrada, Cancelada).
- **Hito Cobrada**: Cuando el usuario registre el estado a 'Cobrada', ingresará la fecha de cobro y se habilitará la carga de los "Montos Reales Destinados".

#### Scenario: Creación exitosa de una Orden de Servicio
- **WHEN** el usuario proporciona detalles válidos, incluyendo la moneda (con cotización si aplica) y las distribuciones sumando 100%
- **THEN** el sistema crea la OS en estado de 'Alta' con su propio número identificador alfanumérico.

### Requirement: Autocompletado Reactivo en Modales de Búsqueda
El sistema DEBE proveer un comportamiento reactivo e instantáneo en todos los modales de búsqueda que utilizan autocompletado integrados en la Orden de Servicio (ej. copiar de otra orden en Distribución de Cobros, búsqueda de Actividades Operativas, Detalles de Tareas).

- **Visualización Inmediata:** Al tipear cualquier carácter en el campo de búsqueda de los modales, la lista desplegable de resultados DEBE mostrarse y filtrarse automáticamente de manera instantánea.
- **Sin clics adicionales:** El usuario NO DEBE necesitar hacer un clic fuera del input ni ejecutar ninguna otra acción para visualizar las opciones coincidentes.
- **Selección Instantánea:** Al seleccionar una opción del autocompletado, el sistema DEBE reflejar el valor copiado/seleccionado de forma inmediata sin demoras, cierres abruptos bloqueantes, o requerir clics adicionales en otras áreas.

#### Scenario: Búsqueda reactiva en modal
- **WHEN** el usuario escribe en un campo de búsqueda dentro de un modal
- **THEN** el dropdown se abre y filtra los resultados instantáneamente

#### Scenario: Selección inmediata
- **WHEN** el usuario hace clic en una opción del dropdown
- **THEN** la información se selecciona/copia inmediatamente sin requerir acciones adicionales

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

### Requirement: Marcar Orden de Servicio como Entregada desde el Listado
El sistema MUST permitir a los usuarios marcar una Orden de Servicio como entregada directamente desde la tabla de listado general, agilizando el flujo operativo y garantizando la consistencia de fechas y trazabilidad.

- **Disponibilidad y Visibilidad**: La opción "Marcar como entregada" MUST aparecer en la columna de acciones exclusivamente para aquellas órdenes cuyo estado actual sea `"Iniciada"`. Para órdenes en cualquier otro estado (Alta, Presupuestada, Aprobada, Entregada, Cobrada, Cancelada) el botón no debe renderizarse ni estar disponible.
- **Confirmación Obligatoria**: Al presionar la acción, el sistema MUST desplegar un diálogo modal de confirmación advirtiendo al usuario que la orden pasará a estado "Entregada" y se completarán las fechas reales correspondientes.
- **Asignación Automática de Fechas Reales**:
  - Si la orden no posee fecha de entrega real (`actualEndDate`), el sistema MUST asignarle automáticamente la fecha actual.
  - Si la orden no posee fecha de inicio real (`actualStartDate`), el sistema MUST asignarle la fecha de inicio presupuestada (`estimatedStartDate`). Si esta última tampoco estuviera definida, se tomará la fecha actual.
- **Actualización de Estado**: El estado de la orden MUST actualizarse a `"Entregada"`.
- **Registro en Bitácora y Trazabilidad**: El sistema MUST registrar automáticamente una observación en el historial (`ServiceOrderObservation`) con el tipo `Hito Clave` y el usuario autenticado, indicando que la orden fue marcada como entregada junto con las fechas reales de inicio y entrega asignadas.
- **Validación de Integridad**: Si la orden no cumple con los requisitos mínimos de integridad para el estado "Entregada" (cliente asignado, proyecto asignado, al menos un responsable en el equipo de trabajo, montos presupuestado y total mayores a cero), la operación MUST ser rechazada informando al usuario el motivo específico.

#### Scenario: Visualización del botón solo en estado Iniciada
- **WHEN** el usuario visualiza el listado de órdenes de servicio
- **THEN** la acción "Marcar como entregada" solo es visible en las filas de órdenes con estado "Iniciada"

#### Scenario: Confirmación y transición exitosa a Entregada
- **WHEN** el usuario confirma la acción en una orden en estado "Iniciada" que no tiene fechas reales cargadas
- **THEN** la orden actualiza su estado a "Entregada", asigna la fecha actual a "Fin Real", asigna el "Inicio Presupuestado" a "Inicio Real", registra un "Hito Clave" en la bitácora y refresca la lista

#### Scenario: Orden con fecha de fin real previa
- **WHEN** el usuario confirma marcar como entregada una orden en estado "Iniciada" que ya contaba con una fecha de fin real válida
- **THEN** el sistema conserva la fecha de fin real existente sin sobrescribirla con la fecha actual y actualiza el estado a "Entregada"

#### Scenario: Rechazo por orden incompleta
- **WHEN** el usuario intenta marcar como entregada una orden en estado "Iniciada" que no posee proyecto asignado o equipo de trabajo
- **THEN** el sistema rechaza la operación, no modifica los datos y muestra una notificación indicando los datos obligatorios faltantes

### Requirement: Sincronización Automática de Cobros desde Movimientos Contables
En modalidad automática, el monto cobrado (`CollectedAmount`) de una Orden de Servicio DEBE ser igual a la sumatoria exacta de los montos de todos los movimientos contables de ingreso (`IsIncome == true`) asociados a dicha orden (`ServiceOrderId == order.Id`).
- Al registrar un nuevo movimiento de ingreso vinculado a una OS, el sistema DEBE actualizar automáticamente `CollectedAmount` de la orden sumando dicho importe.
- Al editar un movimiento contable (modificación de importe, cambio de tipo ingreso/egreso o cambio de OS asociada), el sistema DEBE recalcular y persistir el `CollectedAmount` de todas las órdenes involucradas.
- Al eliminar físicamente un movimiento contable vinculado a una OS, el sistema DEBE recalcular y actualizar el `CollectedAmount` de la orden descontando el movimiento suprimido.

#### Scenario: Registro de un cobro vinculado a una OS
- **WHEN** se crea un movimiento de ingreso por $50.000 vinculado a la orden OS-001
- **THEN** el campo `CollectedAmount` de OS-001 se actualiza automáticamente incrementándose en $50.000

#### Scenario: Reasignación de orden en un movimiento contable
- **WHEN** un movimiento de cobro de $20.000 cambia su vinculación de OS-001 a OS-002
- **THEN** `CollectedAmount` de OS-001 disminuye en $20.000 y `CollectedAmount` de OS-002 aumenta en $20.000

#### Scenario: Eliminación física de un movimiento de cobro
- **WHEN** se elimina físicamente un movimiento de cobro de $30.000 asociado a la orden OS-001
- **THEN** `CollectedAmount` de OS-001 se recalcula reflejando la deducción de $30.000

### Requirement: Transición Automática a Estado Cobrada y Asignación de Fecha de Cobro
El ciclo de vida de la Orden de Servicio DEBE transicionar automáticamente a estado **"Cobrada"** únicamente cuando la orden esté en estado **"Entregada"** y el monto cobrado acumulado cubra la totalidad del total presupuestado (`CollectedAmount >= TotalAmount`).
- **Fecha de Cobro (`CollectionDate`)**: Al transicionar a "Cobrada", el sistema DEBE establecer la fecha de cobro con la fecha del primer movimiento de cobro registrado (`Min(Date)` de los movimientos vinculados).
- **Cobros Previos al Entregar**: Si una orden en estado "Iniciada" recibe pagos o anticipos que cubren el total presupuestado, la orden permanecerá "Iniciada" hasta que operativamente sea marcada como "Entregada"; al marcarse como "Entregada", detectará que `CollectedAmount >= TotalAmount` y transicionará automáticamente a "Cobrada" con la fecha de su primer cobro.
- **Cobros Parciales**: Si una orden está en estado "Entregada" pero registra cobros parciales (`0 < CollectedAmount < TotalAmount`), la orden DEBE permanecer en estado "Entregada" registrando el monto acumulado.
- **Reversión por Eliminación o Modificación a la Baja**: Si una orden se encuentra en estado "Cobrada" y por eliminación física o modificación de movimientos el monto acumulado desciende por debajo del total (`CollectedAmount < TotalAmount`), el sistema DEBE revertir automáticamente el estado de la orden a **"Entregada"** y limpiar el campo `CollectionDate` (asignándolo en `null`).

#### Scenario: Cobro total sobre orden entregada
- **WHEN** una orden OS-001 está en estado "Entregada" con total de $100.000 y se registra un movimiento de cobro que completa los $100.000
- **THEN** el estado de OS-001 cambia automáticamente a "Cobrada" y `CollectionDate` se fija en la fecha del primer cobro

#### Scenario: Cobro parcial sobre orden entregada
- **WHEN** una orden OS-001 está en estado "Entregada" con total de $100.000 y se registra un cobro de $40.000
- **THEN** la orden acumula `CollectedAmount = 40000` pero su estado permanece en "Entregada"

#### Scenario: Entrega de orden con cobro anticipado completo
- **WHEN** una orden en estado "Iniciada" con cobros previos acumulados que cubren el 100% es marcada como "Entregada"
- **THEN** la orden pasa a estado "Cobrada" y su `CollectionDate` queda fijada con la fecha del primer cobro registrado

#### Scenario: Reversión automática a Entregada por eliminación de cobro
- **WHEN** se elimina físicamente un movimiento de cobro de una orden en estado "Cobrada" provocando que `CollectedAmount < TotalAmount`
- **THEN** el estado de la orden vuelve automáticamente a "Entregada" y `CollectionDate` pasa a ser null

### Requirement: Registro en Bitácora de Cada Cobro Vinculado

Toda alta, edición o eliminación de un movimiento contable de ingreso vinculado a una Orden de Servicio DEBE generar una observación de tipo `"Hito Clave"` en la bitácora de la orden, independientemente de si la operación dispara o no una transición de estado.

- **Alta de cobro**: Se registra una observación indicando el monto del cobro y la fecha del movimiento.
- **Edición de cobro**: Se registra una observación indicando el importe anterior y el nuevo importe.
- **Eliminación de cobro**: Se registra una observación indicando el monto eliminado y el `CollectedAmount` resultante.

#### Scenario: Observación al registrar un cobro
- **WHEN** se crea un movimiento de ingreso de $50.000 vinculado a la orden OS-001
- **THEN** se agrega una observación de tipo "Hito Clave" en la bitácora de OS-001 indicando el cobro registrado

#### Scenario: Observación al eliminar un cobro
- **WHEN** se elimina un movimiento de cobro de $30.000 asociado a la orden OS-001
- **THEN** se agrega una observación de tipo "Hito Clave" en la bitácora de OS-001 indicando el cobro eliminado y el nuevo `CollectedAmount`

### Requirement: Desglose de Movimientos de Cobro en la Orden de Servicio
El sistema DEBE proveer en la vista y edición de la Orden de Servicio una sección o tabla informativa que liste todos los movimientos contables de ingreso vinculados a la orden.
- Cada fila DEBE mostrar: Fecha, Monto, Cuenta Financiera (Caja/Banco), Medio de Pago y Descripción.
- Debe incluir un totalizador que coincida con `CollectedAmount`.

#### Scenario: Visualización de movimientos asociados
- **WHEN** el usuario visualiza el detalle o formulario de una Orden de Servicio que registra cobros
- **THEN** el sistema presenta la tabla con el desglose de movimientos de ingreso vinculados y el total consolidado
