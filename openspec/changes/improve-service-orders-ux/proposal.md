## Why

Actualmente, al crear una nueva Orden de Servicio, los usuarios no tienen acceso a las pestañas de costos directos, bitácora y observaciones, lo cual impide cargar esta información de forma inmediata. Además, la experiencia en los modales de búsqueda (para copiar detalles de tareas, repartición de cobros y actividades operativas) es deficiente: al tipear un valor de búsqueda, las opciones no se despliegan automáticamente; el usuario debe hacer clic fuera del campo o esperar sin certidumbre para poder ver y seleccionar el resultado. Esta demora y falta de respuesta visual causa fricción y confusión durante el uso diario.

## What Changes

- Habilitar las pestañas o secciones de **Costos Directos**, **Bitácora** y **Observaciones** desde el momento de la creación de una Orden de Servicio (actualmente solo disponibles o visibles en modo edición).
- Corregir el comportamiento de los modales de autocompletado y búsqueda (ej. copia de tareas, repartición de cobros, actividades):
  - El menú desplegable de resultados debe abrirse y actualizarse instantáneamente a medida que el usuario escribe, sin necesidad de hacer clic fuera del input.
  - Eliminar los retrasos o bloqueos visuales al seleccionar una opción para que el valor copiado se refleje de inmediato.

## Capabilities

### New Capabilities

- Ninguna capacidad nueva de dominio.

### Modified Capabilities

- `service-orders`: Se modifica el requisito visual del formulario para permitir la visualización de la bitácora/observaciones y demás secciones desde el modo creación. Además, se actualiza el requisito de comportamiento de los modales de búsqueda integrados en la orden (distribución de cobro, actividades) para garantizar actualización reactiva inmediata en la interfaz.
- `service-orders/direct-costs`: Se modifica el requerimiento de visualización para asegurar que la pestaña/sección esté disponible en el alta de la OS.

## Impact

- Interfaz de usuario (UI): Modificaciones en los componentes del formulario de Orden de Servicio y en los componentes de tipo Modal/Autocomplete compartidos o específicos de la OS (React/Angular o el framework usado).
- Experiencia de usuario (UX): Flujo más directo para crear una OS con todos sus detalles desde el inicio. Búsqueda predecible y rápida.
