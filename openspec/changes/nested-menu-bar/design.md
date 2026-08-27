## Context

Actualmente el menú se implementa en `main-layout.component.ts` usando un arreglo plano de `menuItems`. El layout emplea Angular Material (como se evidencia por `MatSidenavModule` y `MatIcon`). Se necesita un componente que soporte anidación.

## Goals / Non-Goals

**Goals:**
- Agrupar lógicamente las rutas en un menú lateral de varios niveles (padre-hijo).
- Implementar la funcionalidad utilizando componentes existentes de Angular Material para mantener la consistencia visual.

**Non-Goals:**
- Cambiar la estructura de enrutamiento (rutas en el router).
- Modificar componentes de páginas o cabecera (header).

## Decisions

**1. Estructura de Datos del Menú**
- **Decisión:** Transformar la propiedad plana `menuItems` en un arreglo de categorías, donde cada categoría contenga una propiedad `children` con las opciones finales.
- **Alternativas:** Mantener el arreglo plano y agrupar visualmente con separadores. Se rechazó porque no soporta comportamiento colapsable, manteniendo una lista larga.

**2. Componente UI para el Menú Colapsable**
- **Decisión:** Usar `MatExpansionModule` (específicamente `mat-accordion` y `mat-expansion-panel`) dentro de la barra lateral (`sidebar.component.html` o `main-layout.component.html`). Cada categoría será un panel que al expandirse mostrará un `mat-nav-list` con las rutas correspondientes.
- **Alternativas:**
  - Construir un componente personalizado con animaciones CSS. Se rechazó porque Angular Material ya provee `MatExpansionModule` probado y accesible.
  - Usar `MatMenu` anidado. Se rechazó porque `MatMenu` funciona mejor como un menú emergente (dropdown/popover) y no encaja bien en un layout fijo tipo barra lateral.

## Risks / Trade-offs

- **[Riesgo]** Pérdida de estado de expansión al cambiar de ruta si el componente se recarga por completo. → **Mitigación:** Configurar el enrutamiento para que el layout no se destruya al navegar entre módulos.
- **[Trade-off]** Más clics para alcanzar una funcionalidad (si la categoría está cerrada). → Se compensa con una interfaz mucho menos saturada.
