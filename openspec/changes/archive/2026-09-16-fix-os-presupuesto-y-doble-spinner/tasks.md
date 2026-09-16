## 1. Corrección de Editabilidad de Monto Presupuestado en Orden de Servicio

- [x] 1.1 En `ServiceOrderFormComponent`, actualizar `loadOrderData()` para inicializar `selectedCurrencyCode` inmediatamente utilizando `order.currencyCode`, asegurando que no dependa de que el catálogo de monedas haya terminado de cargar en paralelo.
- [x] 1.2 En `loadCatalogs()`, agregar la resolución de `selectedCurrencyCode` una vez recibido el catálogo de monedas basándose en el `currencyId` actual del formulario, garantizando sincronización bidireccional independientemente del orden de respuesta HTTP.
- [x] 1.3 Verificar que al cargar una Orden de Servicio existente en modo edición con moneda ARS, el campo "Monto Presupuestado (Base)" se muestra editable de inmediato sin requerir alterar la moneda.

## 2. Coordinación de Indicadores de Carga y Supresión de Doble Spinner

- [x] 2.1 En `loading.interceptor.ts`, incorporar el token de contexto HTTP `SKIP_GLOBAL_LOADING` y excluir peticiones estáticas o marcadas con bypass para que no incrementen el contador de `LoadingService`.
- [x] 2.2 En `VersionCheckService`, configurar la petición a `assets/version.json` con el contexto `SKIP_GLOBAL_LOADING` para evitar apariciones imprevistas del overlay de carga en segundo plano.
- [x] 2.3 En `CrudTableComponent` y vistas con indicadores locales (como `ServiceOrderDetailComponent`), coordinar la presentación para suprimir spinners circulares locales redundantes cuando el overlay global se encuentre activo.
- [x] 2.4 Validar visualmente en las pantallas CRUD y formularios que durante las llamadas a la API se presente un único indicador de carga consistente sin duplicaciones.
