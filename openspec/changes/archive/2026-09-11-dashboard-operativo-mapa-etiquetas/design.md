## Context

Ver `proposal.md` y la especificación en `specs/project-geolocation/spec.md`. Actualmente, tanto `OperationalDashboardComponent` como `ProjectDialogComponent` inicializan la propiedad `mapOptions` con `{ mapTypeId: 'satellite' }`. En la API de Google Maps JavaScript, el valor `'satellite'` renderiza únicamente la ortofotografía sin rótulos cartográficos (nombres de calles, ciudades o rutas). Para incluir estas referencias, Google Maps define el tipo `'hybrid'`.

## Goals / Non-Goals

**Goals:**
- Configurar por defecto `mapTypeId: 'hybrid'` en las opciones del mapa de proyectos dentro del Dashboard Operativo (`OperationalDashboardComponent`).
- Configurar por defecto `mapTypeId: 'hybrid'` en las opciones del mapa interactivo del diálogo de creación y edición de proyectos (`ProjectDialogComponent`).
- Asegurar que al cargar la pantalla o abrir el diálogo de proyectos, los mapas se presenten en vista satelital con etiquetas visibles y funcionales.

**Non-Goals:**
- Implementar controles personalizados adicionales o persistencia de preferencias de mapas por usuario en base de datos.
- Modificar la lógica de marcadores, arrastre de marcador (`draggable`), cálculo de bounds (`fitBounds`) o validaciones de coordenadas.

## Decisions

### 1. Establecer `mapTypeId: 'hybrid'` en `OperationalDashboardComponent` y `ProjectDialogComponent`
- **Decisión**: Cambiar `mapOptions: google.maps.MapOptions = { mapTypeId: 'satellite' };` a `mapOptions: google.maps.MapOptions = { mapTypeId: 'hybrid' };` en ambos componentes.
- **Justificación**: En Google Maps JS API, `'hybrid'` representa exactamente la vista satelital fotográfica con la capa de etiquetas (caminos, nombres de lugares y fronteras) superpuesta y activa por defecto. Proporciona una experiencia consistente en toda la plataforma cuando se requiere vista aérea georreferenciada con nombres de calles.
- **Alternativas consideradas**:
  - *Mantener `'satellite'` y requerir que el usuario active manualmente las etiquetas desde los controles de Google Maps cada vez*: Descartado porque frustra la usabilidad esperada; el usuario necesita ver inmediatamente las calles para situar el proyecto o analizar las órdenes.
  - *Crear un servicio de configuración de mapas centralizado*: Descartado por ser sobrediseño innecesario en esta etapa para una propiedad estática de dos componentes.

## Risks / Trade-offs

- **[Riesgo] Legibilidad de marcadores sobre fondo híbrido**: Los marcadores (en el dashboard con contorno blanco y en el diálogo con el pin draggable estándar) deben contrastar adecuadamente.
  - *Mitigación*: Ambos marcadores poseen contornos o estilos contrastantes que destacan de forma nítida sobre la textura satelital y las etiquetas vectoriales de Google Maps.
