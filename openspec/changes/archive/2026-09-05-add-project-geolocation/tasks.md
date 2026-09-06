## 1. Configuración del Entorno y Dependencias

- [x] 1.1 Instalar la librería `@angular/google-maps` y sus dependencias necesarias en el proyecto Angular, y verificar que figure en `package.json`.
- [x] 1.2 Agregar la propiedad `googleMapsApiKey` a los archivos de configuración (`environment.ts` y `environment.prod.ts`) y verificar que el proyecto compile correctamente.
- [x] 1.3 Implementar la carga del script de la API de Google Maps utilizando la API Key provista en el entorno. Verificar abriendo la aplicación y comprobando que el objeto global `google.maps` esté disponible en la consola.

## 2. Actualización del Backend y Base de Datos

- [x] 2.1 Generar y aplicar una migración para agregar las columnas `latitud` y `longitud` (con precisión para decimales) a la tabla asociada a proyectos en la base de datos. Verificar ejecutando la migración sin errores.
- [x] 2.2 Actualizar el modelo/entidad de Proyecto, así como los DTOs para solicitudes de creación/edición, incluyendo validaciones de rango (Latitud: -90 a 90, Longitud: -180 a 180) en el backend. Verificar con tests de unidad o pruebas manuales en el endpoint que se rechacen valores fuera de rango.

## 3. Actualización del Frontend - Formulario

- [x] 3.1 Agregar los campos `latitud` y `longitud` al formulario reactivo del proyecto e incluir validadores de rango en Angular. Verificar que el estado del formulario cambie a inválido si los valores ingresados son incorrectos.
- [x] 3.2 Integrar los componentes `<google-map>` y `<map-marker>` en la vista del formulario. Configurar el marcador para que sea "arrastrable" (draggable) y se pueda ubicar con clics en el mapa. Verificar que al interactuar con el mapa, los controles del formulario se actualizan automáticamente.
- [x] 3.3 Sincronizar bidireccionalmente los inputs manuales con el mapa: verificar que al tipear una latitud y longitud válidas en los campos de texto, el marcador se reubique dinámicamente en el mapa.

## 4. Actualización del Frontend - Vistas

- [x] 4.1 En el componente de Detalle de Proyecto (o en su defecto, en el modal de edición/vista), agregar un mapa que muestre un marcador estático centrado en la ubicación guardada del proyecto. Verificar visualmente accediendo a un proyecto que posea coordenadas.
- [x] 4.2 En el componente de Dashboard Operativo, renderizar un `<google-map>` que cargue todos los proyectos con ubicación válida. Verificar que el mapa se posicione y contenga todos los marcadores correspondientes.
- [x] 4.3 Modificar el renderizado de los marcadores en el Dashboard para que cambien de color/icono según la actividad de sus órdenes de servicio (por ejemplo, verde para activas, rojo para inactivas). Verificar comprobando visualmente la distinción en la leyenda y marcadores.
