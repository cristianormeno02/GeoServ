## MODIFIED Requirements

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

## ADDED Requirements

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
