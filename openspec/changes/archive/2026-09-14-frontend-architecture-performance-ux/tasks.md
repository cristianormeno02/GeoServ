## 1. Limpieza de Archivos Huérfanos y Código Residual

- [x] 1.1 Eliminar los 7 archivos huérfanos y scripts de codemod no utilizados en frontend (`update_crud_lists.js`, `update_mov_form.js`, `update_snackbars.js`, `write_mov.js`, `angular_dump.txt`, `src/app/features/dashboard-financiero/replace.js`, `src/app/features/consumables/components/consumable-list/consumable-list.html`) y verificar su ausencia en el árbol de archivos.
- [x] 1.2 Remover llamadas informales `console.log` de depuración en `client-dialog.component.ts`, `inventario.component.ts`, `service-order-detail.component.ts` y `dashboard.component.ts`, verificando que no queden trazas en consola al interactuar con las vistas.

## 2. Corrección Semántica de Tokens de Color y Contraste

- [x] 2.1 Actualizar `styles.scss` corrigiendo `--text-primary` a `#1E293B` en tema claro (`#F8FAFC` en tema oscuro), fijando `--text-secondary` a `#475569` en tema claro (Slate 600, ~7.15:1 de contraste sobre `#FAF8F5` — evitar Slate 500 `#64748B`, que queda al límite del mínimo WCAG AA), e introduciendo el token explícito `--on-dark-surface: #FFFFFF` para superficies oscuras.
- [x] 2.2 **(Crítico)** Actualizar `styles.scss:115` (`html, body { color: var(--text-secondary); }`) para que use `var(--text-primary)`, ya que hoy el texto por defecto de toda la aplicación depende de `--text-secondary` y no debe heredar silenciosamente el nuevo valor de ese token. Verificar visualmente que el texto de cuerpo en vistas fuera del sidebar/header no cambie de forma no intencional.
- [x] 2.3 Actualizar `sidebar.component.css` y `header.component.css` sustituyendo las referencias incorrectas a `--text-primary` por `--on-dark-surface`, eliminando los parches `!important` artificiales y verificando legibilidad y contraste WCAG AA en modo claro y oscuro.
- [x] 2.4 Migrar en `sidebar.component.css` los valores hardcodeados `rgba(255,255,255,0.4|0.5|0.7)` usados en texto/íconos secundarios (buscador, mensaje "sin resultados", ícono de favorito inactivo) al nuevo token `--on-dark-surface-secondary`, para que quede efectivamente en uso.

## 3. Layout Responsive y Adaptabilidad Móvil

- [x] 3.1 Integrar `BreakpointObserver` en `MainLayoutComponent` para alternar dinámicamente entre `mode="side"` (escritorio > 960px) y `mode="over"` (móvil/tablet <= 960px), inicializando `opened` en `false` para dispositivos móviles.
- [x] 3.2 Implementar el cierre automático del `mat-sidenav` tras eventos `NavigationEnd` cuando la resolución activa sea móvil o tablet, verificando el comportamiento en resoluciones estrechas del navegador.
- [x] 3.3 Ajustar la plantilla de `MainLayoutComponent` y `HeaderComponent` para enlazar correctamente el botón hamburguesa con la apertura/cierre del menú lateral responsivo (el evento `toggleSidebar` ya existe y está conectado a `sidenav.toggle()`; el trabajo real es el binding dinámico de `mode`/`opened` según breakpoint, no construir el mecanismo desde cero).
- [x] 3.4 ~~Forzar el sidebar al estado expandido (deshabilitando el botón de colapsar) cuando el `mat-sidenav` esté en `mode="over"` (móvil/tablet)~~ — **No aplicable**: se verificó que `SidebarComponent` no implementa ningún toggle de colapsado a solo-íconos (ni propiedad ni botón en `.ts`/`.html`), pese a que el spec base `ui/sidebar-menu` lo describe. Se agregó y luego se removió un `@Input() isMobile` sin consumidores (código muerto) en `SidebarComponent`/`MainLayoutComponent`. Si esa funcionalidad de colapso se implementa a futuro, este punto debe revisitarse.

## 4. Unificación de Confirmación de Borrado con ConfirmDialogComponent

- [x] 4.1 Reemplazar llamadas a `window.confirm()` por `ConfirmDialogComponent` en las features de administración y configuración (`users`, `units`, `service-types`, `company-types`, `payment-methods`, `direct-cost-categories`, `responsibles`, `providers`, `projects`), verificando la apertura del modal Material y ejecución del borrado tras confirmación.
- [x] 4.2 Reemplazar llamadas a `window.confirm()` por `ConfirmDialogComponent` en las features financieras y operativas (`movimientos`, `cuentas-financieras`, `cheques`, `clients`, `categorias-movimiento`, `service-order-detail`, `activos`), verificando cancelación y confirmación destructiva.

## 5. Rendimiento de Catálogos y Prevención de Memory Leaks

- [x] 5.1 Refactorizar `loadCatalogs()` en `service-order-form.component.ts` agrupando las **8 peticiones reales** (`clients`, `serviceTypes`, `users`, `statuses`, `projects`, `distributionConcepts`, `currencies`, `responsiblesCatalog`) mediante `forkJoin`, agregando `.pipe(catchError(() => of([])))` a cada catálogo individual, preservando el efecto secundario de auto-selección de ARS al resolver `currencies` en modo creación, y verificando la carga concurrente en la pestaña de red de devtools.
- [x] 5.2 Incorporar `takeUntilDestroyed()` en `service-order-form.component.ts` para las 6 suscripciones a `form.valueChanges` del formulario raíz (líneas 262-281), y también para la suscripción a `percentage.valueChanges` que `addDistribution()` crea dinámicamente por cada fila agregada (línea 327), revisando si métodos equivalentes (`addActivity`, costos directos, etc.) tienen el mismo patrón y aplicando el mismo tratamiento; verificar la desuscripción automática y liberación de recursos al destruir el componente.

## 6. Componente Compartido CrudTableComponent y Verificación

- [x] 6.1 Crear el componente compartido standalone `CrudTableComponent` en `app/shared/components/crud-table/` con soporte para datos genéricos, paginación, barra de filtro con debounce, ordenamiento y estados visuales de carga y vacío.
- [x] 6.2 Integrar `CrudTableComponent` en una vista piloto (ej. `service-types` o `units`), validando que la paginación, búsqueda y acciones por fila funcionen idénticamente con menor código duplicado.
- [x] 6.3 Ejecutar el build de producción del frontend (`npm run build`) para verificar la ausencia de errores de compilación TypeScript o de plantillas Angular.
