## Purpose

Define las capacidades principales para crear, gestionar y realizar el seguimiento de las Órdenes de Servicio (OS) dentro del sistema de consultoría geológica, contemplando un manejo completo del ciclo de vida financiero y operativo.

## ADDED Requirements

### Requirement: Fechas de la Orden
El sistema DEBE gestionar las siguientes fechas clave en el ciclo de vida de la orden.
- **Manejo Visual y Formato**: Todos los campos de fecha en la interfaz de usuario deben mostrarse y validarse bajo el formato **`dd/mm/aaaa`** (día/mes/año).
- **Inicialización (Creación)**: Al crear una NUEVA Orden de Servicio, los campos "Fecha de Solicitud", "Fecha Estimada de Inicio" y "Fecha Estimada de Fin" deben inicializarse automáticamente con la **fecha actual** del sistema.
- **Inicialización (Edición)**: Al editar una orden existente, los campos de fecha deben mostrar los valores que ya se encuentran guardados en la base de datos sin sobrescribirse automáticamente.
- **Fecha de Solicitud**: Momento en que el cliente solicitó el servicio, la cual es independiente de la fecha de creación en el sistema (`CreatedAt`).
- **Fechas Estimadas**: Fecha estimada de inicio y fecha estimada de finalización.
- **Fechas Reales**: "Fecha Real de Inicio" y "Fecha Real de Finalización/Entrega", las cuales se actualizarán conforme avance o concluya el trabajo.

### Requirement: Manejo Multimoneda y Catálogo de Monedas
El sistema DEBE soportar presupuestación y cobranza dinámica utilizando múltiples monedas.
- **Catálogo de Monedas**: Debe existir una tabla maestra de monedas (`Currency`) que almacene su `Code` (ej. USD, CLP, ARS), su `Symbol` (ej. $) y su `Name` (ej. Dólar, Peso Chileno).
- Al crear o editar el presupuesto en la Orden de Servicio, la moneda presupuestada se seleccionará obligatoriamente desde este catálogo a través de un combo/selector.
- Si la moneda seleccionada es distinta a la moneda base (ej. ARS), el sistema debe habilitar el campo "Monto en Moneda Extranjera" y requerir la "Cotización al Presupuestar" para calcular automáticamente el "Monto Presupuestado" en la moneda base.
- Al registrar el cobro, el sistema debe permitir ingresar el monto cobrado y la "Cotización a la Fecha de Cobro" si aplica.

### Requirement: Formato Numérico Local (Argentina)
El sistema DEBE mostrar visualmente en todas las interfaces los campos monetarios y numéricos utilizando el formato local argentino: separador de miles con punto (.) y separador de decimales con coma (,). Sin embargo, estos datos se almacenarán estructuradamente como valores `decimal` estándar en la base de datos.

### Requirement: Distribución de Cobros Dinámica y Porcentajes
La lógica de distribución de ingresos DEBE ser dinámica a partir de un catálogo (Amortización Gastos, Capitalización, Honorarios, Utilidad, etc.).
- El sistema DEBE validar de forma obligatoria y estricta que la sumatoria de todos los porcentajes asignados a la orden dé exactamente 100%. No se pueden repetir conceptos.
- El "Monto Esperado" para cada ítem debe ser calculado automáticamente basado en el porcentaje y usando el siguiente monto base por orden de prioridad:
  - **Prioridad 1:** "Total Final" (`TotalAmount`) de la orden de servicio si tiene un valor cargado mayor a 0.
  - **Prioridad 2:** Si el "Total Final" está en 0 o vacío, utilizar el "Monto Presupuestado" (`BudgetedAmount`) base.
- El sistema debe contar con el campo "Monto Real Destinado" por cada ítem. Este campo será editable en la interfaz para que el usuario cargue el valor real definitivo una vez confirmado el cobro.

### Requirement: Gestión de Actividades de la Orden
El sistema DEBE permitir asociar múltiples actividades operativas a cada OS.
- Las actividades tendrán: Detalle corto, Detalle largo, Estado (Pendiente, En Proceso, Cancelado, Finalizado).
- Contarán con un "Porcentaje de Avance" numérico (1 al 100). Dicho campo solo estará habilitado para su edición si la actividad está en estado "En Proceso". Si la actividad pasa a "Finalizado", el porcentaje tomará el valor 100 de forma automática.

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
