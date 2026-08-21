# Proposal: Service Orders UI Fixes

## What
Ajustes de UI/UX y lógica de fechas en el formulario de Órdenes de Servicio.
- **Lógica de fechas**: Al modificar la fecha de inicio o fin presupuestada, el valor seleccionado debe copiarse automáticamente a la fecha real correspondiente, tanto en modo creación como en modo edición.
- **Layout de fechas**: Reorganizar la sección de fechas en las siguientes filas:
  1. Fila 1: Fecha de solicitud.
  2. Fila 2: Fechas presupuestadas (inicio y fin).
  3. Fila 3: Fechas reales (inicio y fin).
  4. Fila 4: Fecha de cobro.
- **Layout financiero**: El campo 'Monto Cobrado' debe ocupar todo el ancho (o el mismo ancho que el monto presupuestado) para mantener la consistencia visual.

## Why
Mejorar la usabilidad y experiencia del usuario (UI/UX) al cargar o editar una orden de servicio, agrupando lógicamente las fechas y automatizando el autocompletado de fechas reales para reducir la carga manual.
