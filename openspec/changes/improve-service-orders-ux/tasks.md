## 1. Habilitación de Pestañas en Creación de OS

- [x] 1.1 Modificar el componente principal del formulario de Creación/Edición de la Orden de Servicio para mostrar las pestañas/acordeones de "Costos Directos", "Bitácora" y "Observaciones" incondicionalmente, sin depender de si la OS tiene un ID guardado. Verificar visualmente en el navegador que las pestañas están visibles al clickear "Nueva Orden".
- [x] 1.2 Implementar la lógica para generar o manejar un ID temporal (o UUID en el frontend) para la nueva OS al inicializar el formulario, de modo que los componentes hijos puedan enlazar sus datos en el estado local. Verificar mediante React/Angular DevTools que el estado local agrupa correctamente los hijos con su padre.
- [x] 1.3 Ajustar la lógica de guardado final (`onSubmit` o similar de la OS) para asegurar que el payload envíe la OS junto con sus colecciones de Costos Directos y Bitácora al backend. Verificar que el request a la API contiene los datos anidados o se ejecuta en el orden correcto tras la persistencia.

## 2. Modales de Búsqueda Reactivos

- [x] 2.1 Identificar y modificar el componente Modal / Autocomplete utilizado para la búsqueda de "Copiado desde Otra Orden" (Distribución de Cobros), removiendo la necesidad de clic externo (`onBlur` o similar) e implementando un manejador `onChange/onInput` con debounce. Verificar que al tipear, los resultados se muestren automáticamente.
- [x] 2.2 Replicar el comportamiento de búsqueda reactiva (debounce + instant render) para el modal de "Detalles de Tareas". Verificar escribiendo texto y corroborando la aparición instantánea del dropdown.
- [x] 2.3 Replicar el comportamiento de búsqueda reactiva (debounce + instant render) para el modal de "Actividades Operativas". Verificar escribiendo texto y corroborando la aparición instantánea del dropdown.
- [x] 2.4 Ajustar el manejador de selección (`onSelect` u `onClick` de la opción) en todos los modales modificados para garantizar que el valor se copie al formulario padre inmediatamente y el modal se cierre (si aplica) sin bloqueos visuales. Verificar seleccionando una opción y validando que el valor se refleja al instante en el input principal.
