## Context

La interfaz de usuario de órdenes de servicio requiere mejoras en la entrada de datos numéricos y en el manejo de grillas de ítems. Ver proposal.md para la motivación. Se implementarán las mejoras a nivel de los componentes UI existentes.

## Goals / Non-Goals

**Goals:**
- Implementar controles de advertencia para cambios no guardados.
- Habilitar ordenamiento y copia (manteniendo orden) en grillas específicas.
- Flexibilizar la entrada del separador decimal en controles numéricos.
- Seleccionar el texto de controles numéricos al recibir el foco.

**Non-Goals:**
- No se modificarán las reglas de negocio subyacentes ni el modelo de datos de las órdenes, asumiendo que el campo de orden en las grillas (si aplica) ya existe o se agregará un campo simple de secuencia en la interfaz.

## Decisions

- **Advertencia de salida sin guardar**: Se utilizará el estado de los componentes (`dirty`/`modificado`) para rastrear si hubo cambios en los ítems y disparar un diálogo de confirmación estándar si el usuario hace clic en "Cancelar".
- **Separador decimal flexible**: Se interceptará el evento de entrada de teclado en los campos numéricos (como `KeyPress` o similar dependiendo del framework) para reemplazar el carácter de punto (.) por coma (,) internamente (o viceversa según la configuración regional), de manera que el motor de validación lo acepte, mientras el formateo visual se mantiene estándar.
- **Selección de texto automática**: Se suscribirá al evento `Focus` / `GotFocus` (o equivalente) de los controles numéricos para ejecutar el método de selección total del texto (e.g. `SelectAll()`), permitiendo la sobrescritura inmediata.
- **Orden de ítems y Copiado**: Si los registros no tienen un campo de orden, se agregará un manejo temporal del orden (secuencia) en la vista o se utilizará el índice de la lista, asegurándose de que al copiar de una orden existente, la inserción se haga ordenando previamente por el índice original.

## Risks / Trade-offs

- [Risk] Incompatibilidad de separador decimal con la configuración regional del sistema operativo (OS) → Asegurar que la interceptación de tecla sea transparente y luego delegue al formateo cultural correcto.
