# Tareas de Implementación

- [x] **1. Backend: Búsqueda de Órdenes**
  - Revisar y/o crear endpoint `GET` para buscar órdenes de servicio por coincidencia, asegurando que retorne el campo del detalle de tareas (`taskDetails` o equivalente) para la previsualización y copia.
- [x] **2. Frontend: Modal de Copia (Componente)**
  - Crear el componente para el modal (ej. `CopyOrderDetailsDialogComponent`).
  - Implementar el input con `matAutocomplete` para buscar las órdenes.
  - Conectar el input con el servicio de API para realizar la búsqueda en tiempo real.
  - Implementar el área de previsualización de solo lectura que se llena al seleccionar una opción.
- [x] **3. Frontend: Formulario de Orden de Servicio**
  - Agregar el botón "Copiar de otra orden" en la UI del formulario principal, debajo del campo de detalle de tareas.
  - Implementar el método para abrir el modal.
  - Recibir el resultado del modal y actualizar el `FormControl` del detalle (implementar lógica para añadir el texto sin sobrescribir o consultar al usuario si ya hay contenido previo).
