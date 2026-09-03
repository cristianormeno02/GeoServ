## Context

Ver `proposal.md` y `specs/dashboard-general/spec.md`. El dashboard general requiere mostrar las mismas tarjetas KPI (sparklines y métricas de información) que el dashboard operativo, pero filtradas por el responsable asociado al usuario logueado. Además, es indispensable bloquear el acceso de forma segura (HTTP 403) si el usuario no tiene un responsable vinculado.

## Goals / Non-Goals

**Goals:**
- Reutilizar en el Frontend los componentes visuales de KPI (con sparklines) construidos previamente para el dashboard operativo.
- Extender la respuesta del backend (`/api/dashboard/general/kpis`) para suministrar las series temporales (sparklines) requeridas sin romper compatibilidad.
- Asegurar que la falta de un perfil "Responsable" devuelva un error 403 que el frontend manejará amigablemente.

**Non-Goals:**
- No se unificarán los dashboards (general y operativo); se mantienen como vistas separadas, solo compartiendo componentes de UI.

## Decisions

### 1. Manejo Seguro del Usuario Sin Responsable
- **Decisión:** Retornar explícitamente HTTP 403 Forbidden desde el controlador o servicio subyacente de todos los endpoints de `/api/dashboard/general/*` cuando el `userId` no tenga un `Responsible` asociado.
- **Alternativa Considerada:** Mantener el comportamiento anterior de retornar HTTP 200 OK con un flag `hasResponsible: false`. Se descartó por buenas prácticas de seguridad de acceso y autorización (RBAC/ABAC).
- **Impacto Frontend:** El layout del dashboard general debe atrapar el error 403 al inicializar y montar una pantalla de "Perfil Incompleto", evitando la carga de los componentes hijos (gráficos, tablas).

### 2. Generación de Series Temporales (Sparklines)
- **Decisión:** Ampliar el DTO de respuesta actual en `/api/dashboard/general/kpis` para incluir las propiedades de series históricas (ej. arrays numéricos) para las métricas de Órdenes Estancadas y Cumplimiento, reutilizando la lógica base del dashboard operativo pero aplicando el filtro de `ResponsibleId`.
- **Alternativa Considerada:** Crear nuevos endpoints individuales. Se descartó porque sumaría latencia y complejidad al requerir múltiples llamadas simultáneas al inicializar el dashboard.

## Risks / Trade-offs

- **[Riesgo] Manejo global de HTTP 403 en frontend:** Si el cliente HTTP (ej. Axios) tiene un interceptor global que desloguea o redirige ante un 403, el usuario podría verse imposibilitado de navegar a otras partes del sistema donde sí tiene acceso.
  - **Mitigación:** Asegurar que el manejo del 403 para el dashboard sea local a estos endpoints, o si es global, que discrimine el tipo de error ("MissingResponsibleProfile") para renderizar la pantalla informativa sin forzar logout.
