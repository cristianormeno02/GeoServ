## MODIFIED Requirements

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
- **Reordenamiento y Persistencia**: La grilla o lista de distribución de cobros DEBE permitir reordenar sus filas manualmente (drag and drop o flechas). El orden establecido por el usuario debe persistirse en la base de datos al guardar la Orden de Servicio, manteniendo la posición relativa al visualizarla nuevamente.

#### Scenario: Reordenar y persistir distribución de cobros
- **WHEN** el usuario cambia el orden de las filas en la distribución de cobros y guarda la Orden de Servicio
- **THEN** el sistema persiste el orden indicado, mostrándolo de la misma manera al volver a cargar la orden.

### Requirement: Gestión de Actividades de la Orden
El sistema DEBE permitir asociar múltiples actividades operativas a cada OS.
- Las actividades tendrán: Detalle corto, Detalle largo, Estado (Pendiente, En Proceso, Cancelado, Finalizado).
- Contarán con un "Porcentaje de Avance" numérico (1 al 100). Dicho campo solo estará habilitado para su edición si la actividad está en estado "En Proceso". Si la actividad pasa a "Finalizado", el porcentaje tomará el valor 100 de forma automática.
- **Alineación Visual**: El valor numérico del porcentaje de progreso debe estar alineado a la derecha en la interfaz del formulario.
- **Reordenamiento y Persistencia**: La lista de actividades operativas DEBE permitir cambiar manualmente el orden de las filas. Al guardar la Orden de Servicio, el sistema DEBE persistir este ordenamiento y respetarlo en futuras visualizaciones.

#### Scenario: Reordenar y persistir actividades operativas
- **WHEN** el usuario reordena las actividades operativas y guarda la Orden de Servicio
- **THEN** el nuevo orden se almacena y se respeta al consultar la orden.

### Requirement: Historial de Observaciones (Bitácora y Línea de Tiempo Enriquecida)
El sistema DEBE mantener un historial de observaciones (bitácora) asociado a cada Orden de Servicio, presentado en una interfaz moderna de línea de tiempo dentro de su acordeón correspondiente.

**Modelo de datos:**
- Existirá la entidad `ServiceOrderObservation` (o `ServiceOrderObservations`) con los siguientes campos: 
  - `Id` (Guid)
  - `ServiceOrderId` (Guid, FK)
  - `Text` (string, texto libre multilinea)
  - `ObservationType` (string o enum para clasificar, ej: Nota General, Alerta Operativa, Novedad Contable, Hito Clave)
  - `UserId` (Guid, FK del usuario que creó la nota, tomado automáticamente)
  - `CreatedAt` (DateTime UTC, fecha y hora exacta, automática)
- Las observaciones pueden insertarse y **eliminarse**. No se permite la edición del texto, pero sí la baja (física o lógica) de una observación existente para corregir errores.

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
  - **Botón de Eliminar**: Una opción accesible (por ejemplo, ícono de papelera) para eliminar la observación de la bitácora. El sistema debe solicitar confirmación antes de la eliminación.
- **Eje de la Línea de Tiempo:** El eje vertical de la línea de tiempo debe tener puntos (dots) de colores dinámicos que correspondan al tipo de observación.
- **Scroll Vertical:** Se debe implementar un área con scroll vertical interno (`overflow-y: auto`) y altura máxima para la línea de tiempo si la lista de observaciones se extiende, evitando desbordes en el formulario general de la OS.

#### Scenario: Carga de bitácora durante creación
- **WHEN** el usuario crea una nueva Orden de Servicio y llena el campo de bitácora
- **THEN** la bitácora se guarda junto con la orden y aparece en la línea de tiempo

#### Scenario: Eliminación de una observación en la bitácora
- **WHEN** el usuario hace clic en eliminar una observación y confirma la acción
- **THEN** el sistema elimina dicha observación de la base de datos y de la línea de tiempo visible.

## ADDED Requirements

### Requirement: Orden de Costos Directos
El sistema DEBE permitir asociar registros de costos directos a la orden, con soporte para ordenamiento persistente.
- **Reordenamiento y Persistencia**: La lista de costos directos en el formulario de la Orden de Servicio DEBE permitir reordenar sus filas. Al guardar la orden, el orden especificado debe almacenarse en la base de datos y reflejarse fielmente cada vez que se visualice la orden.

#### Scenario: Reordenar y persistir costos directos
- **WHEN** el usuario cambia el orden visual de la lista de costos directos y guarda los cambios
- **THEN** el orden es persistido y mostrado correctamente en el futuro.
