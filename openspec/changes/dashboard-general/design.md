## Context

El sistema ya cuenta con dos dashboards completamente implementados y archivados (`dashboard-operativo` y `dashboard-financiero`) que establecen el patrón arquitectónico de facto para dashboards en GeoServ: endpoints Minimal API bajo `/api/dashboard/<dominio>/`, servicios Angular desacoplados con `HttpClient`, y componentes de visualización SVG reutilizables en `shared/components/charts/`. La ruta `/dashboard` existe pero su componente es un placeholder vacío (`<h1>Bienvenido</h1>`). El dominio tiene la relación `User → Responsible → ServiceOrderResponsible → ServiceOrder` donde la vinculación usuario-responsable es opcional (`Responsible.UserId` nullable).

## Goals / Non-Goals

**Goals:**
- Reemplazar el placeholder de `/dashboard` por un dashboard centrado en el usuario autenticado.
- Filtrar todos los datos estrictamente por el `userId` del JWT (sin parámetros externos).
- Mostrar estado vacío amistoso cuando el usuario no tiene `Responsible` vinculado.
- Reutilizar al máximo los componentes visuales ya existentes (`SparklineCardComponent`, `DonutChartComponent`).
- Respetar la estética BI (colores, cards, chips) establecida en los otros dashboards.

**Non-Goals:**
- Exponer datos financieros de ningún tipo (montos, costos, movimientos).
- Crear nuevas entidades de dominio ni migraciones de base de datos.
- Crear sistema de roles o permisos; el filtrado es solo por identidad del JWT.

## Decisions

### Decisión 1: Extracción del userId en el backend (no en el frontend)
**Elegida:** El backend extrae el `userId` desde `HttpContext.User.FindFirst(ClaimTypes.NameIdentifier)` en cada endpoint. El frontend nunca envía el `userId` como parámetro.
**Alternativa descartada:** Pasar el `userId` como query param. Descartada porque permite que un usuario malintencionado acceda a los datos de otro si intercepta la solicitud.

### Decisión 2: Un endpoint `/profile` separado para los datos de bienvenida
**Elegida:** Endpoint `GET /api/dashboard/general/profile` que devuelve `hasResponsible`, nombre, cargo, título y especialidades. Esto permite que el frontend decida mostrar el estado vacío antes de realizar las demás solicitudes.
**Alternativa descartada:** Incluir `hasResponsible` en `/kpis`. Descartada porque genera una solicitud innecesaria si el usuario no tiene responsable.

### Decisión 3: Progreso de orden = promedio de ProgressPercentage de sus actividades
**Elegida:** Se calcula en el backend como `AVG(ServiceOrderActivity.ProgressPercentage)` agrupado por `ServiceOrderId`. Si la orden no tiene actividades, el progreso es 0.
**Razón:** Es la única fuente de verdad disponible en el modelo actual. La alternativa (que el frontend calcule) obliga a traer las actividades completas en la lista de órdenes.

### Decisión 4: Reemplazo in-place del DashboardComponent existente
**Elegida:** Se reemplaza el contenido de `dashboard.component.ts/html/css` en lugar de crear un componente nuevo. La ruta `/dashboard` y la referencia en `app.routes.ts` permanecen sin cambios.
**Razón:** El componente actual es un placeholder vacío sin lógica de negocio. No hay nada que preservar.

### Decisión 5: alertLevel calculado en el backend
**Elegida:** El campo `alertLevel` (`"ok"`, `"warning"`, `"overdue"`) se calcula en el backend con la fecha del servidor. El frontend solo aplica el color correspondiente.
**Razón:** Evita inconsistencias por diferencia de timezone entre cliente y servidor.

## Risks / Trade-offs

- **[Riesgo] Un usuario con múltiples `Responsible` vinculados** → No es posible con el modelo actual (la restricción de índice único en `Responsible.UserId` garantiza 1:1). El endpoint puede usar `.FirstOrDefault()` con seguridad.
- **[Riesgo] Órdenes sin actividades** → `ProgressPercentage` devuelve 0 como fallback. Es semánticamente correcto (sin actividades = 0% avanzado).
- **[Trade-off] El endpoint `/profile` es una solicitud adicional** → Aceptado. Permite al frontend renderizar el estado vacío inmediatamente sin esperar los demás endpoints.
