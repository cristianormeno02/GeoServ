## Context

Ver `proposal.md` para la motivación. Actualmente, las secciones de Costos Directos y Bitácora solo están habilitadas cuando la Orden de Servicio (OS) ya existe en la base de datos (modo edición). Para habilitarlas en modo creación, debemos resolver cómo se vinculan estos registros hijos (que requieren un `ServiceOrderId`) a una OS que aún no ha sido persistida.

Además, los modales de búsqueda requieren optimización para ser reactivos, lo que implica ajustar el manejo de eventos y estado local en el frontend.

## Goals / Non-Goals

**Goals:**
- Permitir la carga de Costos Directos y Observaciones (Bitácora) en el formulario de creación de una OS.
- Implementar autocompletado reactivo e instantáneo en los modales de búsqueda.

**Non-Goals:**
- Modificar el modelo de datos backend de Costos Directos o Bitácora.
- Refactorizar otros modales que no sean de autocompletado/búsqueda.

## Decisions

### 1. Manejo del Estado de Entidades Hijas en Creación
**Decisión:** Generar el `Id` (Guid) de la nueva Orden de Servicio en el frontend al inicializar el formulario de creación, o bien, mantener los registros hijos en memoria (estado del componente) y enviarlos juntos en el payload de creación de la OS.
- **Rationale:** Como el backend probablemente soporte crear la OS junto con sus colecciones, o al menos el frontend puede agrupar la información, mantener el estado local permite al usuario llenar todo sin hacer llamadas parciales al backend.
- **Alternativa Considerada:** Auto-guardar la OS apenas se ingresan los primeros datos. Descartado por complejidad y posible generación de datos basura o "huérfanos" si el usuario cancela la creación.

### 2. Reactividad en Modales de Búsqueda
**Decisión:** Eliminar las condiciones de "click out" (onBlur) o botones explícitos de búsqueda. Utilizar el evento `onInput` / `onChange` del campo de texto junto con un debounce mínimo (ej. 300ms) para disparar la búsqueda y renderizar las opciones instantáneamente.
- **Rationale:** Mejora directamente la UX reportada, dando feedback rápido.

## Risks / Trade-offs

- **Risk:** Pérdida de datos si el usuario llena muchos Costos Directos y luego cancela la creación de la OS.
  - **Mitigation:** Mantener los datos en el estado local del componente hasta que se presione "Guardar" en la OS principal.
- **Risk:** Sobrecarga de peticiones al backend por el autocompletado reactivo.
  - **Mitigation:** Implementar debounce en el input de búsqueda.
