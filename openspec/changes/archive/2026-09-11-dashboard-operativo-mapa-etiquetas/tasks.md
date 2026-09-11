## 1. Configuración de Mapas en Frontend

- [x] 1.1 Actualizar `mapOptions` en `OperationalDashboardComponent` (`frontend/src/app/features/dashboard-operativo/operational-dashboard.component.ts`) configurando `mapTypeId: 'hybrid'` para mostrar por defecto la imagen satelital con etiquetas de calles y localidades.
- [x] 1.2 Actualizar `mapOptions` en `ProjectDialogComponent` (`frontend/src/app/features/projects/components/project-dialog/project-dialog.component.ts`) configurando `mapTypeId: 'hybrid'` para mostrar por defecto la vista satelital con etiquetas en el formulario de creación y edición de proyectos.

## 2. Pruebas y Validación

- [x] 2.1 Crear o actualizar pruebas unitarias para `OperationalDashboardComponent` y `ProjectDialogComponent` verificando que las opciones por defecto del mapa especifiquen `mapTypeId: 'hybrid'`.
- [x] 2.2 Ejecutar la compilación del frontend (`npm run build`) para verificar la ausencia de errores de tipado o compilación.
