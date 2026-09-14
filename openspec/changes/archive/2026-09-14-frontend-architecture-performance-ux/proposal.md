## Why

La plataforma frontend de GeoServ presenta cuellos de botella en rendimiento, fallas de accesibilidad y usabilidad móvil, inconsistencias de diseño y deuda técnica acumulada:
1. La variable CSS `--text-primary` está invertida semánticamente (`#FFFFFF` en modo claro), forzando parches con `!important` y generando severos problemas de contraste.
2. El layout principal (`main-layout`) utiliza un sidenav rígido (`mode="side"`, siempre abierto) sin soporte responsive ni `BreakpointObserver`, haciendo la plataforma inutilizable en dispositivos móviles y tablets.
3. 16 features realizan eliminaciones de registros utilizando el diálogo bloqueante nativo del navegador `window.confirm()` en lugar de utilizar el componente compartido `ConfirmDialogComponent`.
4. Múltiples formularios (como `service-order-form`) ejecutan cargas secuenciales ("waterfall") de catálogos mediante múltiples `.subscribe()` en vez de paralelizar con `forkJoin`, carecen de gestión de ciclo de vida de suscripciones (`takeUntilDestroyed`), y no implementan `OnPush`.
5. 21 vistas duplican manualmente la lógica de tablas CRUD con `MatTableDataSource`, paginadores y filtros, junto con scripts de codemod huérfanos y `console.log` de depuración olvidados en producción.

Abordar estos puntos moderniza la arquitectura hacia estándares sólidos de Angular 22, estabiliza el diseño visual y la responsividad, y optimiza la velocidad de carga y navegación para los usuarios.

## What Changes

- **Corrección semántica de tokens de color y contraste**: Corregir `--text-primary` en `styles.scss` (para que represente texto oscuro sobre superficie clara en modo claro, y claro en modo oscuro), introducir variables explícitas para superficies oscuras (`--on-dark-surface`) y sanear referencias en `header.component.css` y `sidebar.component.css`.
- **Layout responsive adaptativo**: Integrar Angular CDK `BreakpointObserver` en `MainLayoutComponent` para alternar entre `mode="side"` (escritorio) y `mode="over"` (móvil/tablet), cerrando o abriendo el menú según el tamaño de pantalla y evento de navegación.
- **Unificación de confirmación de borrado**: Reemplazar todas las invocaciones a `confirm()` nativo del navegador en los 16 módulos/componentes por `ConfirmDialogComponent`, garantizando coherencia visual con Material Design y diálogos accesibles.
- **Optimización de rendimiento y reactividad**:
  - Paralelizar la carga de catálogos en formularios mediante `forkJoin` (comenzando por `service-order-form.component.ts`).
  - Implementar `takeUntilDestroyed()` / desuscripción automática en suscripciones reactivas persistentes (como `valueChanges`).
  - Preparar componentes clave hacia la estrategia de detección de cambios `ChangeDetectionStrategy.OnPush`.
- **Componente compartido de tabla CRUD**: Crear un componente compartido reutilizable (`CrudTableComponent`) que encapsule tabla Material, búsqueda/filtro con debounce, paginación, ordenamiento y estados de carga/vacío para reducir la duplicación en las 21 vistas.
- **Limpieza de código y scripts huérfanos**:
  - Eliminar los scripts huérfanos de la raíz del frontend (`update_crud_lists.js`, `update_mov_form.js`, `update_snackbars.js`, `write_mov.js`, `angular_dump.txt`, `replace.js`, `consumable-list.html`).
  - Remover llamadas `console.log` de depuración en producción (`client-dialog`, `inventario`, `service-order-detail`, `dashboard`).

## Capabilities

### New Capabilities
- `ui/responsive-layout`: Layout adaptable a diferentes tamaños de pantalla (móvil, tablet, escritorio) mediante BreakpointObserver y drawer colapsable/superpuesto en pantallas estrechas.
- `ui/consistent-deletion`: Experiencia de confirmación de eliminación unificada mediante diálogos modales Angular Material (`ConfirmDialogComponent`) con variantes destructivas estandarizadas.
- `ui/crud-table`: Componente unificado de tabla CRUD reutilizable con paginación, filtrado rápido, estados de vacío/carga y proyección de plantillas para columnas.
- `frontend-core/performance-optimization`: Patrón de paralelización reactiva de catálogos HTTP mediante forkJoin y desuscripción automática con takeUntilDestroyed para prevenir memory leaks.

### Modified Capabilities
- `ui/color-palette`: Corrección semántica de tokens de color de texto y superficies para asegurar contraste accesible WCAG AA y evitar parches con `!important`.

## Impact

- **Frontend Core & Layout**: `styles.scss`, `main-layout.component.*`, `header.component.*`, `sidebar.component.*`.
- **Componentes Feature**: 16 módulos afectados por confirmación de borrado (`users`, `units`, `service-types`, `direct-cost-categories`, `finance/movimientos`, `company-types`, `finance/cuentas-financieras`, `finance/cheques`, `clients`, `finance/categorias-movimiento`, `service-orders`, `finance/activos`, `responsibles`, `providers`, `projects`, `payment-methods`).
- **Formularios y Servicios**: `service-order-form.component.ts` y catálogos vinculados.
- **Archivos y Scripts**: Limpieza de 7 archivos obsoletos en `frontend/` y `frontend/src/`.
- **Compatibilidad**: Sin cambios en contratos de API backend (.NET). Compatible hacia atrás.
