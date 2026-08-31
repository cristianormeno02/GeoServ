## Purpose

Dashboard personal centrado en el usuario autenticado que muestra únicamente las órdenes de servicio en las que el usuario figura como responsable, junto con el estado, progreso de actividades y observaciones recientes de esas órdenes, sin exponer información financiera ni operativa global de la empresa.

## Requirements

### Requirement: Vinculación de usuario a responsable

El sistema SHALL resolver el perfil de `Responsible` vinculado al `userId` del token JWT entrante para filtrar todos los datos del dashboard.

#### Scenario: Usuario vinculado a un responsable

- **WHEN** el usuario autenticado tiene un `Responsible` con `UserId` igual a su `User.Id`
- **THEN** el sistema devuelve los datos del dashboard filtrados a las órdenes de servicio en las que ese `Responsible` figura en la colección `ServiceOrderResponsible`

#### Scenario: Usuario sin responsable vinculado

- **WHEN** el usuario autenticado no tiene ningún `Responsible` con `UserId` igual a su `User.Id`
- **THEN** todos los endpoints de `/api/dashboard/general/*` devuelven HTTP 200 con un payload de estado vacío y el campo `hasResponsible: false`
- **THEN** el frontend muestra un estado vacío amistoso con el mensaje "Tu perfil no está vinculado a ningún responsable. Contactá al administrador." sin errores ni redirecciones

---

### Requirement: KPIs personales del usuario

El sistema SHALL exponer métricas de resumen contando únicamente las órdenes donde el usuario logueado es responsable.

#### Scenario: Cálculo de contadores por estado

- **WHEN** se consulta `GET /api/dashboard/general/kpis`
- **THEN** la respuesta incluye: `ordeneActivas` (estados Alta, Aprobada, Iniciada), `ordenesEntregadas` (estado Entregada), `ordenesCobradas` (estado Cobrada), `ordenesCanceladas` (estado Cancelada) y `totalOrdenes` (todas, excluyendo Canceladas)

#### Scenario: Distribución por prioridad

- **WHEN** se consulta `GET /api/dashboard/general/kpis`
- **THEN** la respuesta incluye el conteo de órdenes activas agrupadas por `Priority` (Alta, Media, Baja)

#### Scenario: Progreso personal promedio

- **WHEN** se consulta `GET /api/dashboard/general/kpis`
- **THEN** la respuesta incluye `progresoPromedio`: el promedio del campo `ProgressPercentage` de todas las `ServiceOrderActivity` pertenecientes a las órdenes activas del usuario

---

### Requirement: Lista de órdenes activas del responsable

El sistema SHALL exponer la lista detallada de órdenes activas (estados Alta, Presupuestada, Aprobada, Iniciada, Entregada) donde el usuario es responsable.

#### Scenario: Datos de cada orden en la lista

- **WHEN** se consulta `GET /api/dashboard/general/active-orders`
- **THEN** cada ítem de la respuesta incluye: `id`, `orderNumber`, `clientName` (de `Client.CompanyName`), `serviceTypeName`, `statusName`, `priority`, `estimatedEndDate`, `progressPercentage` (promedio de actividades), `alertLevel` (`ok`, `warning`, `overdue`)

#### Scenario: Cálculo de alertLevel

- **WHEN** la orden activa tiene `EstimatedEndDate` >= hoy + 8 días
- **THEN** `alertLevel = "ok"`
- **WHEN** la orden activa tiene `EstimatedEndDate` entre hoy y hoy + 7 días (inclusive)
- **THEN** `alertLevel = "warning"`
- **WHEN** la orden activa tiene `EstimatedEndDate` < hoy y no está en estado Entregada ni Cobrada
- **THEN** `alertLevel = "overdue"`

#### Scenario: Orden sin fecha estimada de entrega

- **WHEN** una orden activa no tiene `EstimatedEndDate`
- **THEN** `alertLevel = "ok"` y `estimatedEndDate` se devuelve como `null`

---

### Requirement: Actividades pendientes del responsable

El sistema SHALL listar las actividades (`ServiceOrderActivity`) en estado `Pendiente` o `EnProceso` pertenecientes a las órdenes activas del usuario.

#### Scenario: Contenido de cada actividad

- **WHEN** se consulta `GET /api/dashboard/general/pending-activities`
- **THEN** cada ítem incluye: `id`, `orderNumber`, `shortDetail`, `state`, `progressPercentage`

#### Scenario: Sin actividades pendientes

- **WHEN** el usuario no tiene actividades en estado Pendiente o EnProceso en sus órdenes activas
- **THEN** la respuesta es un arreglo vacío `[]`

---

### Requirement: Observaciones recientes en órdenes del responsable

El sistema SHALL exponer las observaciones (`ServiceOrderObservation`) de los últimos 7 días en órdenes donde el usuario es responsable.

#### Scenario: Contenido de cada observación

- **WHEN** se consulta `GET /api/dashboard/general/recent-observations`
- **THEN** cada ítem incluye: `id`, `orderNumber`, `text`, `observationType`, `createdAt`, `authorName` (del `User` que la creó), `isOwnObservation` (true si `UserId` de la observación = userId del token)

#### Scenario: Sin observaciones en los últimos 7 días

- **WHEN** no hay observaciones en los últimos 7 días en órdenes del usuario
- **THEN** la respuesta es un arreglo vacío `[]`

---

### Requirement: Bienvenida personalizada

El sistema SHALL exponer los datos de saludo del usuario logueado.

#### Scenario: Datos del perfil del usuario

- **WHEN** se consulta `GET /api/dashboard/general/profile`
- **THEN** la respuesta incluye: `userName` (de `User.Name`), `responsibleName` (de `Responsible.Name`), `position` (de `Responsible.Position`), `title` (de `Responsible.Title`), `specialties` (de `Responsible.Specialties`), `hasResponsible: true`

---

### Requirement: Distribución visual por estado y prioridad

El sistema SHALL exponer los datos necesarios para renderizar dos gráficos de dona: uno con la distribución de órdenes por estado y otro por prioridad, limitados a las órdenes del responsable.

#### Scenario: Distribución por estado

- **WHEN** se consulta `GET /api/dashboard/general/kpis` 
- **THEN** la respuesta incluye el campo `byStatus` con el conteo de órdenes agrupadas por `StatusName`

#### Scenario: Distribución por prioridad

- **WHEN** se consulta `GET /api/dashboard/general/kpis`
- **THEN** la respuesta incluye el campo `byPriority` con el conteo de órdenes agrupadas por `Priority`

---

### Requirement: Aislamiento de datos financieros

El sistema SHALL asegurar que ningún endpoint de `/api/dashboard/general/*` devuelva datos financieros.

#### Scenario: Ausencia de campos financieros en la respuesta

- **WHEN** se consulta cualquier endpoint de `/api/dashboard/general/*`
- **THEN** la respuesta NO incluye campos como `BudgetedAmount`, `TotalAmount`, `CollectedAmount`, `ForeignAmount`, montos de distribución, ni movimientos de caja

---

### Requirement: Seguridad del filtrado por identidad

El sistema SHALL filtrar todos los datos exclusivamente usando el `userId` del JWT, sin aceptar ningún parámetro de usuario en la URL ni en el cuerpo de la solicitud.

#### Scenario: Filtrado imperativo por JWT

- **WHEN** se realiza cualquier solicitud a `/api/dashboard/general/*`
- **THEN** el backend extrae el `userId` de `ClaimTypes.NameIdentifier` del token JWT
- **THEN** el backend busca el `Responsible` cuyo `UserId == userId` para filtrar órdenes
- **THEN** no se acepta ningún parámetro externo que permita acceder a datos de otro usuario
