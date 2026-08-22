# Diseño Técnico: Copiar Detalle de Tareas

## Frontend (Angular)

### 1. Modificaciones en el Componente de Órdenes de Servicio (Formulario)
*   Agregar un botón "Copiar de otra orden" (por ejemplo un `<button mat-button>` o `<button mat-icon-button>` con un ícono de "content_copy") debajo del campo "Detalle de Tareas".
*   Crear una función que abra un nuevo Dialog de Angular Material (`MatDialog`) al presionar este botón.

### 2. Nuevo Componente Modal (`CopyServiceOrderDetailsDialog`)
*   Se inyectará en el dialog la referencia para poder cerrarlo y devolver el texto copiado.
*   Contendrá un campo `<mat-form-field>` con un `<input>` y un `matAutocomplete` (similar al selector de cliente o proyecto).
*   Se deberá suscribir a los cambios (valueChanges) del input para llamar al backend y traer las órdenes que coincidan con la búsqueda.
*   **Previsualización:** Una vez seleccionada una orden en el autocompletar, se mostrará el detalle obtenido en un `div` o `<textarea readonly>` dentro del modal.
*   Tendrá botones de "Cancelar" y "Confirmar Copia".
*   Al "Confirmar", el dialog se cierra y devuelve el texto al componente padre.

### 3. Integración en el Padre
*   Al recibir el texto desde el dialog, el componente del formulario lo concatenará o reemplazará en el `FormControl` del detalle de tareas, actualizando la vista.

## Backend (C# / .NET)

### 1. Endpoint de Búsqueda de Órdenes
*   Verificar si ya existe un endpoint para buscar órdenes por un término (ej. número de orden, nombre del cliente, etc.) para poblar el combobox. Si no existe, se deberá crear uno ligero (ej. `GET /api/service-orders/search?q={query}`) que devuelva una lista de `{ id, orderNumber, clientName, taskDetails }`.
*   Asegurar que la respuesta traiga el texto del detalle de tareas para poder previsualizarlo y copiarlo sin requerir llamadas adicionales por cada selección (o crear un endpoint adicional si es muy pesado).
