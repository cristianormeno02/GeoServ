## Context

El sidebar de navegación lateral es un componente Angular compartido (`SidebarMenuComponent`) que renderiza la estructura de menú a partir de una definición estática o semi-dinámica. Actualmente cada ítem contiene: nombre, ruta, ícono y restricción de roles. El header principal de la aplicación contiene el nombre del usuario y algunas acciones globales. No existe actualmente un sistema de preferencias por usuario ni un mecanismo de búsqueda en el menú.

## Goals / Non-Goals

**Goals:**
- Extender el modelo de ítems de menú con un campo `description` (string, max 100 caracteres).
- Implementar tooltip sobre ítems del menú que muestre su descripción.
- Implementar el marcado/desmarcado de favoritos por ítem, con persistencia por usuario.
- Agregar un panel de favoritos accesible desde el header.
- Agregar un campo de búsqueda en la parte superior del sidebar que filtre ítems por nombre y descripción en tiempo real.

**Non-Goals:**
- Crear un backend dedicado para preferencias de usuario (se usa localStorage en esta iteración).
- Reordenar visualmente los favoritos (drag & drop).
- Sincronización de favoritos entre múltiples dispositivos o sesiones simultáneas.
- Búsqueda global de contenido fuera del menú.

## Decisions

### D1 — Persistencia de favoritos en localStorage
**Decisión**: Las preferencias de favoritos se almacenarán en `localStorage` con una clave namespaced por ID de usuario (`menu_favorites_<userId>`).

**Alternativas consideradas**:
- *API de preferencias en backend*: Permite sincronización entre dispositivos, pero agrega complejidad de infraestructura para una primera iteración. Se puede migrar en el futuro sin cambiar la spec de comportamiento.
- *NgRx / estado global*: Útil si el estado de favoritos debiera ser consumido por muchos componentes desconectados; por ahora solo lo consumen el sidebar y el header, lo cual hace suficiente un servicio Angular singleton con Subject.

**Rationale**: localStorage es simple, no requiere cambios en backend, y la experiencia es idéntica para el usuario en el 99% de los casos de uso.

---

### D2 — Tooltip con Angular Material `matTooltip`
**Decisión**: Usar la directiva `matTooltip` de Angular Material para mostrar la descripción de cada ítem.

**Alternativas consideradas**:
- *Tooltip custom HTML*: Mayor control visual, pero agrega complejidad de accesibilidad y posicionamiento.
- *title attribute nativo HTML*: Simple pero no es consistente entre navegadores ni respeta el design system.

**Rationale**: El proyecto ya usa Angular Material; `matTooltip` es la solución de menor coste con mejor accesibilidad y consistencia.

---

### D3 — Filtrado en tiempo real con pipe Angular o computed signal
**Decisión**: La búsqueda filtrará el arreglo de ítems usando un Observable/signal derivado del campo de búsqueda, sin debounce agresivo (< 300ms de reactividad).

**Alternativas consideradas**:
- *Filtrado en backend*: No aplica; la definición de menú es local al frontend.
- *Pipe Angular impuro*: Conveniente pero con riesgo de re-renders excesivos. Se prefiere un filtrado reactivo explícito en el componente o un `computed` signal.

**Rationale**: El menú tiene un número acotado de ítems (< 50); el filtrado en memoria es inmediato y no requiere optimización adicional.

---

### D4 — Modelo de definición de ítems de menú
**Decisión**: Extender la interfaz/tipo existente de ítems de menú (`NavItem` o equivalente) agregando el campo opcional `description?: string`.

**Rationale**: Un campo opcional es retrocompatible y no obliga a actualizar todos los ítems en el mismo PR. Los ítems sin descripción simplemente no muestran tooltip.

---

### D5 — Panel de favoritos en el header como dropdown
**Decisión**: El panel de favoritos se implementará como un dropdown (`mat-menu` o overlay de Angular CDK) anclado al botón "Favoritos" del header, con la misma presentación visual de ítems que el sidebar (ícono + nombre, con opción de quitar favorito).

**Alternativas consideradas**:
- *Sidebar secundario / drawer*: Más espacio pero interrumpe el layout; el comportamiento esperado es un overlay rápido tipo dropdown.

**Rationale**: El dropdown es consistente con el patrón de otros menús del header y no desplaza el contenido principal.

## Risks / Trade-offs

- **[Riesgo] Desincronización entre localStorage y sesión de usuario** → Si dos usuarios comparten el mismo navegador sin cerrar sesión, los favoritos del segundo usuario podrían heredar los del primero. *Mitigación*: namespacing por `userId` en la clave de localStorage.
- **[Trade-off] Sin sincronización multi-dispositivo** → Los favoritos no se replican entre dispositivos. Aceptado explícitamente como Non-Goal en esta iteración; la migración a backend en el futuro no requiere cambios de especificación.
- **[Riesgo] Regresión visual en menú colapsado con tooltip** → El tooltip del ítem en modo colapsado debe mostrar también el nombre (hoy puede ser el único identificador visible). *Mitigación*: cubrir ambos estados (expandido/colapsado) en las pruebas de componente.

## Migration Plan

1. Extender el tipo de ítems de menú con `description?: string` (retrocompatible).
2. Actualizar la definición estática de ítems para agregar descripciones (no bloquea el resto).
3. Implementar `MenuFavoritesService` (singleton) con persistencia en localStorage.
4. Actualizar `SidebarMenuComponent`: tooltips, toggle favorito, campo de búsqueda.
5. Actualizar `HeaderComponent`: botón + panel de favoritos.
6. No se requiere migración de datos en backend ni rollback de schema. El rollback consiste en revertir los commits de frontend.
