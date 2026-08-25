# Design: Tabs for Service Order Form

## Architecture
Los cambios son puramente de frontend en Angular (UI y TypeScript).

## Components
- **ServiceOrderFormComponent (HTML)**:
  - **Barra Superior**: Agregar una sección encima o al principio de `mat-card-content` con etiquetas (por ejemplo, usando `<mat-chip-set>` o `<div>` con estilos visuales destacados) que muestren el número de orden, el cliente y el proyecto seleccionados. Esto es especialmente útil en modo edición.
  - **Pestañas (Tabs)**: Reemplazar los agrupadores de secciones actuales por `<mat-tab-group>`.
  - Las secciones a agrupar en pestañas (p. ej. "Datos Principales", "Detalles", "Fechas", "Finanzas", etc.) se envolverán cada una en un `<mat-tab label="Nombre de la Sección">`.
  - La primera pestaña será la "Principal" y estará activa por defecto.
- **ServiceOrderFormComponent (TypeScript)**:
  - Añadir lógica para obtener los nombres del cliente y proyecto seleccionados para poder mostrarlos en las etiquetas de la barra superior.
  - Asegurar la importación del módulo `MatTabsModule` y `MatChipsModule` si se utilizan chips de Angular Material.

## Data Model
Sin cambios en el backend ni en la base de datos.
