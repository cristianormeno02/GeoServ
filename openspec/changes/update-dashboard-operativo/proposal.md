## Why

El usuario necesita ajustes en el Dashboard Operativo para mejorar la visualización de los KPIs y corregir valores por defecto. Los KPIs actuales no se basan en una línea de tiempo, por lo que las gráficas de línea no son apropiadas. Además, es necesario ajustar valores por defecto como la capacidad máxima del equipo y el stock mínimo de insumos, y mejorar la usabilidad agregando explicaciones contextuales a los informes.

## What Changes

- Quitar la gráfica de línea de los 4 KPIs.
- Centrar el valor de cada KPI, usar un tamaño de fuente destacado (importante) y aplicar el mismo color que se usaba en la línea de curva.
- Modificar el valor de la capacidad máxima del equipo de 50 a 10.
- Establecer el stock mínimo de un insumo como 0 por defecto (dado que no hay lugar en la UI para cargarlo).
- Agregar un botón de ayuda en la parte inferior derecha de cada informe que, al hacer clic, muestre un modal o mensaje con la explicación de la información mostrada.
- Mostrar el logo de la empresa centrado dentro de un círculo blanco en la parte superior del dashboard.

## Capabilities

### New Capabilities

### Modified Capabilities
- `dashboard-operativo`: Cambios en la presentación de KPIs, ajustes de valores por defecto (capacidad del equipo a 10, stock mínimo a 0) y adición de descripciones interactivas (modal de explicación) en los informes.

## Impact

- Interfaz de usuario del Dashboard Operativo.
- Lógica de visualización y asignación de valores por defecto en frontend/backend según corresponda.
