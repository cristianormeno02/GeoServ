## Why

Es necesario visualizar geográficamente la ubicación de los proyectos para mejorar la logística, el seguimiento y la gestión operativa en terreno. Esto permitirá ver rápidamente en un mapa la distribución de los proyectos y diferenciar su estado en base a la actividad de las órdenes de servicio.

## What Changes

- **Modelo y Base de Datos**: Agregar columnas `latitud` y `longitud` (tipo decimal) a la entidad de proyectos.
- **Librería Frontend**: Instalar y configurar `@angular/google-maps` y la API Key de Google Maps en los entornos (`environment`).
- **Formulario (Crear/Editar)**: Incluir campos para latitud y longitud, junto con un mapa interactivo (marcador arrastrable y colocable) para autocompletar las coordenadas, admitiendo también entrada manual.
- **Vista de Detalle**: Mostrar la ubicación guardada en un mapa (estático o interactivo).
- **Validaciones**: Validar que latitud esté entre -90 y 90, y longitud entre -180 y 180.
- **Dashboard Operativo**: Agregar un mapa interactivo que muestre todos los proyectos. Se debe diferenciar por colores los proyectos con órdenes activas de los que no tienen órdenes activas.

## Capabilities

### New Capabilities
- `project-geolocation`: Funcionalidades relacionadas con la geolocalización de proyectos, incluyendo visualización en formularios, detalles y dashboards operativos interactivos.

### Modified Capabilities

## Impact

- Entidad y migraciones de `Proyecto` en el backend para admitir coordenadas.
- Módulo Frontend (`@angular/google-maps`) a instalar.
- Componentes de Angular (Formulario de proyecto, vista de detalle, dashboard).
- Configuración de variables de entorno (API Key de Google Maps).
