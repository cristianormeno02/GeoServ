## Purpose

Define las capacidades principales para crear, gestionar y realizar el seguimiento de las Órdenes de Servicio (OS) dentro del sistema de consultoría geológica, contemplando un manejo completo del ciclo de vida financiero y operativo.

## ADDED Requirements

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

### Requirement: Historial de Observaciones
El sistema DEBE mantener un historial inmutable de observaciones asociado a cada Orden de Servicio.

**Modelo de datos:**
- Existirá la entidad `ServiceOrderObservation` con los campos: `Id` (Guid), `ServiceOrderId` (Guid, FK), `Text` (string, texto libre), `CreatedAt` (DateTime UTC).
- Las observaciones son de solo inserción: no se editan ni eliminan.

**Interfaz de usuario (formulario de edición):**
- Se incorpora una sección "Observaciones" al pie del formulario de edición de la OS.
- Contiene un campo de texto multilinea (textarea) para ingresar una "Nueva Observación".
- Un botón **"Guardar Observación"** que solo estará habilitado cuando la OS ya esté persistida (modo edición) y el textarea no esté vacío.
- Al guardar, la observación se persiste y el textarea se limpia automáticamente.
- Debajo del formulario de ingreso, se muestra un listado de solo lectura con el historial completo de observaciones ordenado por `CreatedAt` **descendente** (más reciente primero), mostrando: Fecha y hora formateada + Texto de la observación.
- Esta sección **no se muestra** en el formulario de creación de una nueva OS (solo aparece en modo edición).

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

