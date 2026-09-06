---
name: superpowers-code-review
description: Protocolo de revisión de código en dos fases (Conformidad con la especificación de OpenSpec y Calidad/Arquitectura) antes de finalizar una tarea.
metadata:
  author: superpowers
  version: "1.0"
---

# Superpowers: Revisión de Código (Code Review)

Esta habilidad establece el estándar de auditoría de código antes de dar por finalizada cualquier tarea de implementación en GeoServ.

---

## Revisión en Dos Fases

### Fase 1: Conformidad con la Especificación (Spec Compliance)
El objetivo de esta fase es asegurar que el código resuelve **exactamente** lo que se diseñó en OpenSpec, ni más ni menos.

1. **Contraste contra `specs/<capability>/spec.md`:**
   - ¿Se implementaron todos los requisitos y escenarios definidos?
   - ¿Las validaciones y reglas de negocio coinciden con la especificación?
2. **Contraste contra `tasks.md`:**
   - ¿La tarea en curso cumple con los criterios de aceptación estipulados?
3. **Control de Alcance (Scope Creep):**
   - ¿Se agregaron dependencias o cambios fuera del alcance del cambio actual? Si es así, revertir o consultar.

### Fase 2: Calidad, Arquitectura y Robustez
El objetivo de esta fase es mantener la salud técnica del repositorio GeoServ.

1. **Backend (.NET / C#):**
   - Respeto de capas arquitectónicas (`Domain`, `Infrastructure`, `Endpoints`).
   - Uso correcto de Async/Await y `CancellationToken`.
   - Manejo adecuado de entidades EF Core, migraciones y transacciones.
   - Sin llamadas bloqueantes (`.Result` o `.Wait()`).
   - Respuestas HTTP semánticas y contratos claros.
2. **Frontend (Angular):**
   - Desuscripción adecuada de observables (`takeUntilDestroyed` o `async` pipe) para evitar fugas de memoria.
   - Tipado estricto en TypeScript (evitar `any`).
   - Componentes reactivos, separación limpia de lógica en servicios.
   - Manejo amigable de errores en la interfaz (notificaciones / snackbars).
3. **Documentación y Mantenibilidad:**
   - Comentarios y documentación estrictamente en español (regla de contexto de GeoServ).
   - Nombres claros y expresivos.

---

## Veredicto de Revisión
- **Aprobado:** El cambio cumple ambas fases y todas las pruebas automatizadas pasan. La tarea en `tasks.md` puede marcarse como `[x]`.
- **Requiere Ajustes:** Se detecta discrepancia con la spec o deuda técnica; se corrigen las observaciones antes de avanzar a la siguiente tarea.
