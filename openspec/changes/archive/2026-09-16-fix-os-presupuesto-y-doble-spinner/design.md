## Context

Ver `proposal.md` para la motivación general del cambio.

En el frontend Angular de GeoServ coexisten dos problemas de interacción y experiencia de usuario:
1. En `ServiceOrderFormComponent`, la resolución de la moneda de la orden ocurre en paralelo a la carga del catálogo de monedas (`loadCatalogs()` con `forkJoin` vs `loadOrderData(id)`). Cuando `loadOrderData` finaliza antes que `loadCatalogs`, `currencies.find()` falla y `selectedCurrencyCode` queda como cadena vacía `''`. Como la plantilla evalúa `[readonly]="selectedCurrencyCode !== 'ARS'"`, el campo "Monto Presupuestado (Base)" queda bloqueado como solo lectura hasta que el usuario conmuta manualmente la moneda.
2. Desde la incorporación del interceptor de carga global (`loadingInterceptor` y `LoadingSpinnerComponent`), cualquier petición HTTP levanta un overlay a pantalla completa con fondo translúcido (`rgba(30, 41, 59, 0.5)`) y un `<mat-spinner diameter="60">`. Simultáneamente, componentes como `CrudTableComponent`, `ServiceOrderDetailComponent`, diálogos modales (`UpcomingDeliveriesModalComponent`, `KpiDetailModalComponent`) y subtablas de la OS mantienen sus propios `<mat-spinner>`, provocando que se vean dos spinners girando en simultáneo (uno local debajo del overlay y uno global encima). Además, tareas en segundo plano como la verificación de versión en `VersionCheckService` disparan inadvertidamente el spinner global.

## Goals / Non-Goals

**Goals:**
- Asegurar que `selectedCurrencyCode` en `ServiceOrderFormComponent` se resuelva de forma determinística y reactiva sin importar el orden de resolución de las peticiones asíncronas, garantizando que el campo "Monto Presupuestado (Base)" sea editable inmediatamente al abrir una OS en ARS.
- Evitar la concurrencia visual de múltiples spinners simultáneos en la interfaz.
- Permitir que peticiones en segundo plano (como `VersionCheckService`) se ejecuten silenciosamente sin disparar el overlay de carga global.

**Non-Goals:**
- No se modifican los contratos de API ni endpoints del backend.
- No se altera la regla de negocio que vuelve de solo lectura el monto presupuestado cuando la moneda es extranjera (ya que en ese caso el monto base se calcula a partir de `foreignAmount * exchangeRateAtBudget`).

## Decisions

### Decisión 1: Resolución robusta de `selectedCurrencyCode` en `ServiceOrderFormComponent`
- **Elección**:
  1. Aprovechar que el DTO devuelto por `getServiceOrderById(id)` ya incluye la propiedad `currencyCode`. Al recibir la orden en `loadOrderData`, inicializar directamente `this.selectedCurrencyCode = order.currencyCode || 'ARS'`.
  2. Al resolverse `loadCatalogs()`, si el formulario ya tiene un `currencyId` cargado, sincronizar `this.selectedCurrencyCode` con el código del elemento encontrado en `this.currencies`.
  3. Mantener el listener reactivo de `currencyId.valueChanges` para cambios manuales por parte del usuario.
- **Alternativas consideradas**:
  - *Encadenar secuencialmente `loadCatalogs()` antes de `loadOrderData()`*: Aumentaría el tiempo percibido de carga de la pantalla innecesariamente, ya que `loadCatalogs` hace 8 peticiones en `forkJoin`. La solución elegida mantiene la carga en paralelo y garantiza sincronización bidireccional.

### Decisión 2: Supresión de doble spinner y token para peticiones silenciosas
- **Elección**:
  1. **Bypass de carga global para peticiones de fondo**: Crear un `HttpContextToken<boolean>` (`SKIP_GLOBAL_LOADING` / `SILENT_HTTP`) en `loading.interceptor.ts`. Peticiones a `assets/` o marcadas explícitamente (como `VersionCheckService.fetchVersion()`) no incrementarán el contador de `LoadingService`.
  2. **Deduplicación de spinner local en `CrudTableComponent` y vistas**: Inyectar `LoadingService` en `CrudTableComponent` (o coordinar vía template/signal) para que, si el overlay global ya se encuentra activo (`isLoading$ | async`), la tabla no dibuje el `<mat-spinner>` local redundante sobre su propia área, o bien delegar la carga al spinner global de manera unificada y limpia.
  3. **Revisión de `ServiceOrderDetailComponent` y modales**: Ocultar el spinner local redundante si el interceptor global ya está cubriendo la vista.
- **Alternativas consideradas**:
  - *Eliminar por completo el cargador global*: Dejaría operaciones sin feedback visual en pantallas que no implementaron spinners locales. El overlay global es útil pero debe estar coordinado.
  - *Hacer el fondo del overlay global 100% opaco*: Bloquearía toda la pantalla y empeoraría la experiencia visual.

## Risks / Trade-offs

- **[Riesgo]** Si una petición falla silenciosamente con `SKIP_GLOBAL_LOADING`, el usuario podría no saber que está ocurriendo un reintento.
  → *Mitigación*: Solo se usará para comprobaciones de fondo (como polling de versión de la app o requests que ya cuentan con indicador de estado contextual discreto).
- **[Riesgo]** Parpadeo de interfaz si la condición de carrera de moneda tarda unos milisegundos en resolverse.
  → *Mitigación*: Al tomar `order.currencyCode` directamente del endpoint de la orden, la asignación es instantánea al llegar los datos de la orden.
