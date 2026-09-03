## MODIFIED Requirements

### Requirement: Vinculación de usuario a responsable

El sistema SHALL resolver el perfil de `Responsible` vinculado al `userId` del token JWT entrante para filtrar todos los datos del dashboard. Si el usuario no tiene un `Responsible` vinculado, se debe denegar explícitamente el acceso.

#### Scenario: Usuario vinculado a un responsable
- **WHEN** el usuario autenticado tiene un `Responsible` con `UserId` igual a su `User.Id`
- **THEN** el sistema devuelve los datos del dashboard filtrados a las órdenes de servicio en las que ese `Responsible` figura en la colección `ServiceOrderResponsible`

#### Scenario: Usuario sin responsable vinculado
- **WHEN** el usuario autenticado no tiene ningún `Responsible` con `UserId` igual a su `User.Id`
- **THEN** todos los endpoints de `/api/dashboard/general/*` devuelven HTTP 403 Forbidden con un mensaje de error que indica que el usuario no tiene un perfil de responsable vinculado
- **THEN** el frontend captura la respuesta 403 y muestra de forma segura el mensaje "Tu perfil no está vinculado a ningún responsable. Contactá al administrador.", evitando renderizar la estructura interna del dashboard

### Requirement: KPIs personales del usuario

El sistema SHALL exponer métricas de resumen contando únicamente las órdenes donde el usuario logueado es responsable, incluyendo los nuevos formatos visuales (sparklines e iconos de información) recientemente incorporados al dashboard operativo.

#### Scenario: Cálculo de contadores por estado e íconos de información
- **WHEN** se consulta `GET /api/dashboard/general/kpis`
- **THEN** la respuesta incluye: `ordeneActivas` (estados Alta, Aprobada, Iniciada), `ordenesEntregadas` (estado Entregada), `ordenesCobradas` (estado Cobrada), `ordenesCanceladas` (estado Cancelada) y `totalOrdenes` (todas, excluyendo Canceladas)
- **THEN** la respuesta también incluye las mismas KPI cards e iconos de información presentes en el dashboard operativo (como Órdenes Estancadas y Cumplimiento de Plazos), adaptados para devolver los valores y series temporales limitadas a las órdenes del responsable

#### Scenario: Distribución por prioridad
- **WHEN** se consulta `GET /api/dashboard/general/kpis`
- **THEN** la respuesta incluye el conteo de órdenes activas agrupadas por `Priority` (Alta, Media, Baja)

#### Scenario: Progreso personal promedio
- **WHEN** se consulta `GET /api/dashboard/general/kpis`
- **THEN** la respuesta incluye `progresoPromedio`: el promedio del campo `ProgressPercentage` de todas las `ServiceOrderActivity` pertenecientes a las órdenes activas del usuario
