## Purpose

Define las capacidades principales para crear, gestionar y realizar el seguimiento de las Órdenes de Servicio (OS) dentro del sistema de consultoría geológica, contemplando un manejo completo del ciclo de vida financiero y operativo.

## ADDED Requirements

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

### Requirement: Manejo Multimoneda y Catálogo de Monedas
El sistema DEBE soportar presupuestación y cobranza dinámica utilizando múltiples monedas.
- **Catálogo de Monedas**: Debe existir una tabla maestra de monedas (`Currency`) que almacene su `Code` (ej. USD, CLP, ARS), su `Symbol` (ej. $) y su `Name` (ej. Dólar, Peso Chileno).
- Al crear o editar el presupuesto en la Orden de Servicio, la moneda presupuestada se seleccionará obligatoriamente desde este catálogo a través de un combo/selector.
- Si la moneda seleccionada es distinta a la moneda base (ej. ARS), el sistema debe habilitar el campo "Monto en Moneda Extranjera" y requerir la "Cotización al Presupuestar" para calcular automáticamente el "Monto Presupuestado" en la moneda base.
- Al registrar el cobro, el sistema debe permitir ingresar el monto cobrado y la "Cotización a la Fecha de Cobro" si aplica.

### Requirement: Monto Cobrado
El formulario financiero de la OS DEBE incluir el campo numérico **"Monto Cobrado"** (`CollectedAmount`).
- Este campo es **independiente** del "Total Final" (`TotalAmount`): representa lo efectivamente cobrado al cliente, no el monto presupuestado.
- Se usa para disparar la lógica de distribución real de ingresos (regla de los tercios/porcentajes).
- El campo debe aplicar el formato numérico local argentino (separador de miles con punto, decimales con coma).

### Requirement: Detalle de Tareas Presupuestadas
El formulario de la OS DEBE incluir un campo de texto libre multilinea denominado **"Detalle de Tareas Presupuestadas"** (`BudgetedTasksDetail`).
- Es un textarea amplio sin restricción de formato estructurado.
- Su propósito es describir las tareas incluidas en el presupuesto, siendo la fuente de contenido principal para la generación del **PDF del presupuesto**.
- El campo es opcional al guardar la orden.

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

### Requirement: Gestión de Actividades de la Orden
El sistema DEBE permitir asociar múltiples actividades operativas a cada OS.
- Las actividades tendrán: Detalle corto, Detalle largo, Estado (Pendiente, En Proceso, Cancelado, Finalizado).
- Contarán con un "Porcentaje de Avance" numérico (1 al 100). Dicho campo solo estará habilitado para su edición si la actividad está en estado "En Proceso". Si la actividad pasa a "Finalizado", el porcentaje tomará el valor 100 de forma automática.
- **Alineación Visual**: El valor numérico del porcentaje de progreso debe estar alineado a la derecha en la interfaz del formulario.

### Requirement: Validaciones Generales y de Interfaz al Guardar
El sistema DEBE realizar verificaciones estrictas antes de permitir guardar (crear o editar) la Orden de Servicio:
- **Campos Obligatorios Principales**: Nro. de Orden, Cliente, Tipo de Servicio, Estado, Prioridad, Monto Presupuestado y Responsables (mínimo uno).
- **Fechas Obligatorias**: Fecha de Solicitud, Inicio Presupuestado y Fin Presupuestado son obligatorias. Las fechas reales (Inicio Real, Fin Real) y la Fecha de Cobro son **opcionales**.
- **Unicidad**: El Nro. de Orden no debe estar duplicado en el sistema.
- **Distribución de Cobro**: Si existe al menos una línea de distribución agregada, la suma de todos los porcentajes de los ítems de distribución DEBE ser exactamente 100%.
- **Limpieza de Interfaz**: Visualmente solo debe existir una única línea separadora entre la sección de "Datos Principales" y "Fechas".

### Requirement: Gestión de Responsables (Catálogo Maestro y Relación)
La gestión de responsables requiere de un modelo desacoplado y una tabla intermedia para su vinculación con las Órdenes de Servicio.
- **Tabla Maestra Independiente**: Existirá una tabla `Responsible` autónoma (sin relación directa ni campo `ServiceOrderId`). Tendrá su propio CRUD.
- **Atributos del Responsable**: Id, Nombre, Cargo, Título, Especialidades, y `UserId`.
- **Validaciones de Usuario**: Si se asigna un `UserId` a un Responsable, dicho usuario NO debe tener el rol de 'Cliente', y **tampoco puede estar ya asignado a otro Responsable** (relación 1 a 1 entre Usuario del sistema y Responsable).
- **Vinculación a la Orden (Tabla Intermedia)**: Existirá una tabla de unión (ej. `ServiceOrderResponsible`) que contenga el `ServiceOrderId` y el `ResponsibleId`.
- **Interfaz de la Orden de Servicio**: En el formulario de la OS, los responsables se agregarán o quitarán mediante un selector dinámico (dropdown). El sistema debe impedir que un mismo responsable sea agregado más de una vez a la misma orden.

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
