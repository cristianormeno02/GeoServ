## Context

Se debe integrar la API de Google Maps en una aplicación Angular y agregar capacidades espaciales a la entidad `Proyecto`. Las coordenadas serán ingresadas por los usuarios desde la interfaz o provistas por el mapa interactivo. (Ver proposal.md)

## Goals / Non-Goals

**Goals:**
- Extender la entidad `Proyecto` sin romper datos existentes.
- Integrar `@angular/google-maps` de manera eficiente en la aplicación.
- Diferenciar visualmente los proyectos con Órdenes de Servicio (OS) activas frente a los que no tienen en el dashboard.

**Non-Goals:**
- Soporte para geocodificación inversa (convertir automáticamente coordenadas en texto de dirección).
- Representación de áreas (polígonos), se utilizarán exclusivamente puntos (latitud/longitud).

## Decisions

**1. Extensión del Modelo de Datos:**
Se agregarán las columnas `latitud` (tipo decimal con precisión adecuada, ej: decimal(10, 8)) y `longitud` (decimal(11, 8)) a la entidad `Proyecto`.
- *Alternativas consideradas*: Crear una tabla/entidad `Ubicacion` separada. Se descartó por simplicidad, dado que un proyecto actualmente se representa con una ubicación única.

**2. Librería Frontend:**
Se utilizará `@angular/google-maps`, el paquete oficial de Angular components.
- *Alternativas consideradas*: Usar Leaflet/OpenStreetMap u otros wrappers. Se optó por Google Maps por el requerimiento explícito y por `@angular/google-maps` para mayor integración con el ecosistema de Angular y buen tipado.

**3. Gestión de API Key y Carga del Script:**
La API Key se configurará en los archivos `environment.ts`. Se recomienda cargar el script de Google Maps dinámicamente en los componentes que lo requieran o mediante un mecanismo que consuma la API Key del environment, para no exponer la key fija en el `index.html` del repositorio de forma directa.

## Risks / Trade-offs

- **Costo de API de Google Maps:** El uso extensivo del mapa puede incrementar costos. → *Mitigación*: Asegurarse de restringir la API Key por dominios/IPs permitidos desde la consola de Google Cloud.
- **Rendimiento con exceso de marcadores (Dashboard):** Mostrar miles de marcadores simultáneamente puede ralentizar el DOM. → *Mitigación*: Actualmente se renderizarán directamente. Si el volumen crece drásticamente en el futuro, se evaluará implementar *Marker Clustering* (fuera del alcance actual).
