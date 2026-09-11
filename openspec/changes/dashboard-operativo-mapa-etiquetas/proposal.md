## Why

Actualmente, los mapas interactivos en el Dashboard Operativo y en el modal de gestión (CRUD) de proyectos están configurados para mostrarse por defecto en vista satelital pura (`satellite`), lo cual oculta nombres de calles, rutas, localidades y puntos de referencia clave. Para mejorar la ubicación contextual rápida, la precisión al seleccionar coordenadas y la toma de decisiones sobre las operaciones en campo, se requiere que la vista por defecto en ambos mapas combine la fotografía satelital con las etiquetas geográficas correspondientes (`hybrid`).

## What Changes

- Configurar las opciones por defecto del componente Google Maps en el Dashboard Operativo (`OperationalDashboardComponent`) para utilizar el tipo de mapa híbrido (`hybrid`), asegurando que las imágenes satelitales y las etiquetas (rutas, calles, ciudades) se muestren activadas de forma predeterminada al cargar la vista.
- Configurar las opciones por defecto del componente Google Maps en el diálogo de creación y edición del CRUD de proyectos (`ProjectDialogComponent`) para utilizar el tipo de mapa híbrido (`hybrid`), facilitando la identificación visual de referencias urbanas y viales al georreferenciar proyectos.
- Mantener la funcionalidad de selección y controles de tipo de mapa para que el usuario pueda alternar entre vistas según sus preferencias.

## Capabilities

### New Capabilities
<!-- None -->

### Modified Capabilities
- `project-geolocation`: Actualización de los requerimientos de captura de coordenadas en el formulario de proyecto y del mapa interactivo en el dashboard operativo para especificar que deben inicializarse por defecto en vista satélite con etiquetas visibles activadas (modo híbrido).

## Impact

- **Frontend**:
  - `OperationalDashboardComponent` (`frontend/src/app/features/dashboard-operativo/operational-dashboard.component.ts`).
  - `ProjectDialogComponent` (`frontend/src/app/features/projects/components/project-dialog/project-dialog.component.ts`).
- **APIs/Backend**: Sin impacto ni cambios en el backend o base de datos.
- **Riesgo de Regresión**: Nulo; solo afecta la configuración inicial de visualización del tipo de mapa en los componentes frontend correspondientes.
