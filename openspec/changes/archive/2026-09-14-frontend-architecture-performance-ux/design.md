## Context

El frontend de GeoServ está construido sobre Angular 22.1.2 (arquitectura standalone) y Angular Material 22.1.2 (misma versión que el core) con tokens Material 3.
A pesar de contar con un empaquetado modular optimizado (80+ chunks lazy loaded con un bundle inicial ligero de ~252KB), la experiencia de usuario y la mantenibilidad sufren por deficiencias estructurales:
- **Tokens CSS invertidos**: `--text-primary` en `styles.scss:73` se configuró como `#FFFFFF` en modo claro, generando bugs de contraste en sidebar/header y forzando sobreescrituras manuales con `!important`.
- **Layout no responsivo**: `main-layout.component.html` mantiene `mat-sidenav` fijado en `mode="side"` siempre abierto, sin detección de resolución ni colapso en pantallas móviles.
- **Inconsistencia en borrado**: Al menos 16 componentes de módulos clave usan `window.confirm()` del navegador en vez del componente unificado `ConfirmDialogComponent`.
- **Peticiones HTTP en cascada y fugas de memoria**: En formularios centrales como `service-order-form.component.ts`, se ejecutan múltiples suscripciones independientes a servicios de catálogo en vez de una consulta combinada paralela, y los observables de `valueChanges` no se desuscriben al destruir el componente.
- **Duplicación de tablas**: Existen 15 implementaciones de tablas con paginadores y filtros duplicados (`grep -rl MatTableDataSource`), además de archivos temporales/scripts de migración residuales en el repositorio. El número exacto debe reverificarse al iniciar la tarea 6, ya que nuevas features podrían sumarse antes de la implementación.

## Goals / Non-Goals

**Goals:**
- Corregir de raíz la semántica de tokens de color (`--text-primary` para texto sobre superficies claras/oscuras según el tema, y `--on-dark-surface` para contenedores oscuros) eliminando parches de contraste.
- Hacer responsivo el layout principal mediante `BreakpointObserver`, adaptando dinámicamente el `mat-sidenav` (`side` vs `over`) y cerrándolo automáticamente tras la navegación en pantallas móviles.
- Migrar las 16 features identificadas que utilizan `window.confirm()` al diálogo Material reutilizable `ConfirmDialogComponent`.
- Refactorizar la inicialización de catálogos en `service-order-form.component.ts` usando `forkJoin` con manejo de errores resiliente, y asegurar la limpieza de suscripciones con `takeUntilDestroyed()`.
- Diseñar e implementar un componente compartido `CrudTableComponent` para estandarizar la paginación, búsqueda, estados de carga y ordenamiento.
- Eliminar de forma definitiva los 7 archivos huérfanos/scripts de codemod y los `console.log` de depuración en producción.

**Non-Goals:**
- Migración inmediata a Zoneless (Angular 22 lo soporta experimentalmente, pero requiere auditoría de interoperabilidad con Angular CDK y librerías auxiliares antes de retirar `zone.js`).
- Refactorización total de los 81 componentes a `OnPush` en un solo paso (se aplicará en layout, componentes compartidos y el formulario refactorizado).
- Implementación de un interceptor global de reintentos HTTP exponencial (se planificará en una fase posterior de resiliencia de red).

## Decisions

### 1. Reestructuración Semántica de Tokens de Color
- **Decisión**:
  - En `:root` (modo claro):
    - `--text-primary`: `#1E293B` (Slate 800)
    - `--text-secondary`: `#475569` (Slate 600 — no Slate 500/`#64748B`: ese valor da ~4.49:1 de contraste sobre `#FAF8F5`, al límite del mínimo WCAG AA de 4.5:1. Slate 600 da ~7.15:1, con margen seguro)
    - `--on-dark-surface`: `#FFFFFF`
    - `--on-dark-surface-secondary`: `#CBD5E1`
  - En `html.dark-theme` / `[data-theme="dark"]`:
    - `--text-primary`: `#F8FAFC`
    - `--text-secondary`: `#94A3B8`
    - `--on-dark-surface`: `#F8FAFC`
    - `--on-dark-surface-secondary`: `#CBD5E1`
  - Reemplazar en `sidebar.component.css` y `header.component.css` las referencias erróneas de `--text-primary` por `--on-dark-surface` y eliminar las reglas `!important` artificiales.
  - **Corregir el consumidor global de `--text-secondary`**: `styles.scss:115` define `html, body { color: var(--text-secondary); }`, es decir, el texto por defecto de TODA la aplicación (no solo sidebar/header) usa hoy `--text-secondary`, que en modo claro vale `#1E293B` (oscuro, por eso la app se lee bien a pesar del bug). Si solo se corrige `--text-primary` y se deja esta línea intacta, el body pasaría a heredar el nuevo `--text-secondary` (`#475569`), lo cual sigue siendo accesible por el ajuste anterior, pero de todos modos es un cambio de significado no intencional. Por eso esta línea DEBE actualizarse a `color: var(--text-primary);` para que el texto de cuerpo use el token semánticamente correcto ("texto principal"), dejando `--text-secondary` libre para su rol real de texto secundario/atenuado.
  - **Alcance de `--on-dark-surface-secondary`**: além de introducirlo, migrar los valores hardcodeados `rgba(255,255,255,0.4|0.5|0.7)` usados hoy en `sidebar.component.css` para texto/íconos secundarios (buscador, mensaje "sin resultados", ícono de favorito inactivo) a este nuevo token, para que quede realmente en uso y no como una variable declarada sin consumidores.
- **Alternativas consideradas**:
  - *Mantener `--text-primary: #FFFFFF` y crear `--text-dark`*: Rechazado porque rompe la convención estándar de Material Design y causa que nuevos desarrolladores sigan introduciendo fallos de contraste.
  - *Usar Slate 500 (`#64748B`) para `--text-secondary`*: Rechazado por quedar al límite del contraste mínimo WCAG AA sobre el fondo `#FAF8F5`; se prefiere Slate 600 con margen de seguridad.

### 2. Responsividad en MainLayout con BreakpointObserver
- **Decisión**:
  - En `MainLayoutComponent`, inyectar `BreakpointObserver` de `@angular/cdk/layout`.
  - Definir un breakpoint móvil en `(max-width: 960px)`.
  - En pantallas `> 960px`: `sidenav.mode = 'side'` y `sidenav.opened = true`.
  - En pantallas `<= 960px`: `sidenav.mode = 'over'` y `sidenav.opened = false`.
  - Escuchar eventos `NavigationEnd` del enrutador para invocar `sidenav.close()` cuando esté en modo móvil.
  - **Interacción con el estado de colapsado/expandido existente**: el capability `ui/sidebar-menu` ya define un estado de colapsado (solo íconos) independiente del `mode` del `mat-sidenav`. En viewport móvil (`<= 960px`), el sidebar DEBE forzarse siempre al estado expandido (no colapsado) mientras esté en `mode="over"`, ignorando/deshabilitando el botón de colapsar; el colapsado manual solo tiene sentido en `mode="side"` de escritorio. Esto evita el estado combinado indefinido de "sidenav superpuesto + solo íconos" en pantallas chicas.
- **Alternativas consideradas**:
  - *Solo media queries CSS*: Insuficiente porque `MatSidenav` de Angular Material controla el backdrop y el posicionamiento del layout mediante propiedades de componente (`mode="side|over"`).

### 3. Migración Sistemática a ConfirmDialogComponent
- **Decisión**:
  - Utilizar el patrón estándar:
    ```typescript
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Confirmar Eliminación',
        message: '¿Está seguro de que desea eliminar este registro?',
        confirmText: 'Eliminar',
        cancelText: 'Cancelar',
        isDestructive: true
      },
      width: '400px'
    });
    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed) { this.executeDelete(id); }
    });
    ```
  - Actualizar sistemáticamente los 16 archivos identificados:
    `user-list`, `unit-list`, `service-type-list`, `direct-cost-category-list`, `movimientos`, `company-type-list`, `cuentas-financieras`, `cheques`, `client-list`, `categorias-movimiento`, `service-order-detail`, `activos`, `responsible-list`, `provider-list`, `project-list`, `payment-method-list`.
- **Alternativas consideradas**:
  - *Mantener confirm() nativo*: Rechazado por degradar la experiencia visual y romper la accesibilidad.

### 4. Paralelización de Cargas HTTP y Ciclo de Vida Reactivo
- **Decisión**:
  - En `service-order-form.component.ts`, método `loadCatalogs()` (líneas 551-570), agrupar **las 8 llamadas reales** (no solo 4) mediante `forkJoin` con manejadores `catchError` individuales que devuelvan `of([])` para evitar bloqueos en cascada si un catálogo particular falla. El snippet siguiente es ilustrativo; la implementación debe incluir `statuses`, `projects`, `distributionConcepts` y `responsiblesCatalog` además de `clients`/`serviceTypes`/`users`/`currencies`, y preservar el efecto secundario de `currencies` (auto-selección de ARS en modo creación, líneas 560-568):
    ```typescript
    forkJoin({
      clients: this.clientService.getClients().pipe(catchError(() => of([]))),
      serviceTypes: this.serviceTypeService.getServiceTypes().pipe(catchError(() => of([]))),
      users: this.userService.getUsers().pipe(catchError(() => of([]))),
      statuses: this.serviceOrderService.getStatuses().pipe(catchError(() => of([]))),
      projects: this.serviceOrderService.getProjects().pipe(catchError(() => of([]))),
      distributionConcepts: this.serviceOrderService.getDistributionConcepts().pipe(catchError(() => of([]))),
      currencies: this.serviceOrderService.getCurrencies().pipe(catchError(() => of([]))),
      responsiblesCatalog: this.serviceOrderService.getResponsiblesCatalog().pipe(catchError(() => of([])))
    }).pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(result => {
      this.clients = result.clients;
      this.serviceTypes = result.serviceTypes;
      this.users = result.users;
      this.statuses = result.statuses;
      this.projects = result.projects;
      this.distributionConcepts = result.distributionConcepts;
      this.currencies = result.currencies;
      this.responsiblesCatalog = result.responsiblesCatalog;
      // Preservar efecto secundario existente: auto-seleccionar ARS en modo creación
      if (!this.isEditMode) {
        const ars = this.currencies.find(c => c.code === 'ARS');
        if (ars) {
          this.orderForm.get('currencyId')?.setValue(ars.id);
        }
      }
      this.isLoadingCatalogs = false;
    });
    ```
  - Aplicar `takeUntilDestroyed(this.destroyRef)` a las 6 suscripciones a `form.valueChanges` existentes en líneas 262-281 (cambio de moneda, cálculo de total por monto/tipo de cambio/descuento, y auto-copia de fecha de inicio).
  - **Suscripciones creadas dinámicamente**: `addDistribution()` (línea 327) crea una nueva suscripción a `percentage.valueChanges` por cada fila de distribución agregada por el usuario, fuera del ciclo de vida del formulario raíz. Estas también deben acotarse con `takeUntilDestroyed(this.destroyRef)` (se limpian igual al destruir el componente, aunque se acumulan durante la vida del componente si se agregan/quitan muchas filas). Revisar si existen patrones equivalentes en otros métodos `addX()` del mismo componente (actividades, costos directos) y aplicar el mismo tratamiento.
- **Alternativas consideradas**:
  - *ngOnDestroy con Subject manual*: Rechazado en favor de `takeUntilDestroyed()` que es la convención moderna y limpia de Angular.

### 5. Componente Compartido CrudTableComponent
- **Decisión**:
  - Crear `app/shared/components/crud-table/crud-table.component.ts` (standalone).
  - Capacidades:
    - Entradas `@Input()` / señales: `data`, `columns`, `displayedColumns`, `isLoading`, `filterPlaceholder`, `pageSizeOptions`.
    - Integración interna de `MatTable`, `MatPaginator` y `MatSort` con `MatTableDataSource`.
    - Proyección de celdas personalizadas mediante `ng-template` con directivas de columna.
    - Barra de búsqueda integrada con debounce.
- **Alternativas consideradas**:
  - *Dejar tablas duplicadas*: Rechazado por ser deuda técnica crítica (21 copias de la misma lógica).

### 6. Saneamiento y Eliminación de Archivos Basura
- **Decisión**:
  - Eliminar los archivos huérfanos: `update_crud_lists.js`, `update_mov_form.js`, `update_snackbars.js`, `write_mov.js`, `angular_dump.txt`, `src/app/features/dashboard-financiero/replace.js`, `src/app/features/consumables/components/consumable-list/consumable-list.html`.
  - Remover llamadas `console.log` de depuración en producción (`client-dialog`, `inventario`, `service-order-detail`, `dashboard`).

## Risks / Trade-offs

- **[Riesgo de regresión en vistas que dependían del valor anterior de `--text-primary`]** → **Mitigación**: Auditoría global con ripgrep de todas las apariciones de `--text-primary` y verificación de contraste visual en modo claro y oscuro.
- **[Riesgo de regresión en el color de texto por defecto de toda la app]** → El body global (`styles.scss:115`) usa hoy `var(--text-secondary)`, no `--text-primary`. Cambiar solo el valor del token sin redirigir este selector al token correcto alteraría silenciosamente el color de texto de toda la aplicación. **Mitigación**: actualizar explícitamente `styles.scss:115` a `var(--text-primary)` (tarea 2.1) y fijar `--text-secondary` en un valor con margen de contraste seguro (Slate 600, ~7.15:1) en vez de uno al límite del mínimo AA.
- **[Riesgo de estado indefinido entre el sidebar colapsable existente y el nuevo modo responsive]** → **Mitigación**: forzar el sidebar a estado expandido cuando `mode="over"` (móvil/tablet), deshabilitando el toggle de colapso en ese contexto; documentado como escenario explícito en `ui/responsive-layout`.
- **[Riesgo de que un error en un catálogo cancele todo el formulario en `forkJoin`]** → **Mitigación**: Añadir `.pipe(catchError(() => of([])))` a cada flujo individual del `forkJoin` para que la carga sea resiliente ante fallos parciales.
- **[Riesgo de ruptura de diseño en componentes de tabla existentes durante la migración a CrudTableComponent]** → **Mitigación**: Implementar el componente base de forma aislada en `shared`, verificar su funcionamiento en un módulo piloto y permitir adopción progresiva sin afectar vistas legadas.
