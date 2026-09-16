## Why

Actualmente, al abrir una Orden de Servicio existente en modo edición cuya moneda es la base (ARS), el campo "Monto Presupuestado (Base)" aparece erróneamente deshabilitado (`readonly`) debido a una condición de carrera entre la carga de la orden y la resolución del catálogo de monedas, requiriendo cambiar la moneda y volver a colocar la original para poder editarlo. Por otro lado, la coexistencia del interceptor y overlay global de carga (`LoadingSpinnerComponent`) con spinners locales en componentes como `CrudTableComponent` y vistas de detalle genera un molesto "doble spinner" visible a través del fondo translúcido.

## What Changes

- **Corrección de inicialización de moneda en edición de OS**: Asegurar que al cargar una orden en `ServiceOrderFormComponent`, el código de la moneda seleccionada (`selectedCurrencyCode`) se resuelva de inmediato y de forma reactiva (tanto al recibir los datos de la orden como al completarse la carga de los catálogos), permitiendo la edición inmediata del "Monto Presupuestado (Base)" cuando corresponda a ARS.
- **Eliminación y coordinación del doble spinner de carga**:
  - Evitar la superposición de spinners visuales concurrentes entre el overlay global (`LoadingSpinnerComponent`) y los componentes con estados de carga locales (como `CrudTableComponent`, `ServiceOrderDetailComponent`, entre otros).
  - Configurar bypass de carga en el interceptor global para peticiones en segundo plano silenciosas (como la verificación periódica de versión en `VersionCheckService`).

## Capabilities

### New Capabilities

*(Ninguna)*

### Modified Capabilities

- `service-orders`: Corrección del comportamiento de edición del "Monto Presupuestado (Base)" garantizando que sea inmediatamente editable al abrir una OS en moneda base (ARS).
- `ui/crud-table`: Coordinación del estado de carga visual para evitar spinners superpuestos con el cargador global de la aplicación.

## Impact

- **Frontend**:
  - `ServiceOrderFormComponent`: Inicialización sincronizada y reactiva de `selectedCurrencyCode` frente a la carga concurrente de catálogos y orden.
  - `CrudTableComponent` y vistas con spinners locales: Coordinación de presentación para no renderizar indicadores duplicados con el `LoadingService`.
  - `LoadingInterceptor` / `LoadingService`: Mecanismo para omitir (`skipLoading` / `HttpContextToken`) peticiones secundarias o en segundo plano (p. ej. `VersionCheckService`).
