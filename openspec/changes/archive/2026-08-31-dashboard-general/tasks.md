## 1. Endpoints de Lectura del Dashboard General (Backend)

- [x] 1.1 Crear `GeneralDashboardEndpoints.cs` con el grupo `/api/dashboard/general/` con `.RequireAuthorization()`, y registrarlo en `Program.cs`. Verificar que `dotnet build` pase sin errores.
- [x] 1.2 Implementar `GET /api/dashboard/general/profile`: extraer `userId` del JWT, buscar el `Responsible` con `UserId == userId`, devolver `hasResponsible`, `userName`, `responsibleName`, `position`, `title`, `specialties`. Si no hay Responsible, devolver `hasResponsible: false`. Verificar respuesta HTTP 200.
- [x] 1.3 Implementar `GET /api/dashboard/general/kpis`: usando el `responsibleId` resuelto, contar órdenes por estado (`ordeneActivas`, `ordenesEntregadas`, `ordenesCobradas`, `ordenesCanceladas`, `totalOrdenes`), calcular distribución `byStatus` y `byPriority`, y calcular `progresoPromedio` del `ProgressPercentage` de actividades de las órdenes activas. Si `hasResponsible == false` devolver payload vacío con `hasResponsible: false`. Verificar respuesta HTTP 200.
- [x] 1.4 Implementar `GET /api/dashboard/general/active-orders`: devolver lista de órdenes en estados Alta, Presupuestada, Aprobada, Iniciada, Entregada con: `id`, `orderNumber`, `clientName`, `serviceTypeName`, `statusName`, `priority`, `estimatedEndDate`, `progressPercentage` (promedio de actividades, 0 si no tiene), `alertLevel` ("ok"/"warning"/"overdue") calculado con la fecha del servidor. Verificar respuesta HTTP 200.
- [x] 1.5 Implementar `GET /api/dashboard/general/pending-activities`: devolver las `ServiceOrderActivity` en estado `Pendiente` o `EnProceso` de las órdenes activas del responsable, incluyendo: `id`, `orderNumber`, `shortDetail`, `state`, `progressPercentage`. Verificar respuesta HTTP 200.
- [x] 1.6 Implementar `GET /api/dashboard/general/recent-observations`: devolver `ServiceOrderObservation` de los últimos 7 días en órdenes del responsable, incluyendo: `id`, `orderNumber`, `text`, `observationType`, `createdAt`, `authorName`, `isOwnObservation`. Verificar respuesta HTTP 200.
- [x] 1.7 Confirmar que ningún endpoint expone campos financieros (`BudgetedAmount`, `TotalAmount`, `CollectedAmount`, etc.). Verificar con `dotnet build` (0 errores, 0 advertencias).

## 2. Modelos e Interfaces TypeScript (Frontend)

- [x] 2.1 Crear `src/app/features/dashboard/models/general-dashboard.model.ts` con interfaces: `UserProfileResponse`, `GeneralKpisResponse`, `ActiveOrderItem`, `PendingActivityItem`, `RecentObservationItem`.

## 3. Servicio Angular del Dashboard General (Frontend)

- [x] 3.1 Crear `src/app/features/dashboard/services/general-dashboard.service.ts` que consulte los 5 endpoints con `HttpClient`. Verificar que el servicio compile sin errores.

## 4. Componente Principal del Dashboard General (Frontend)

- [x] 4.1 Reemplazar completamente `dashboard.component.ts` con el componente `DashboardComponent` reactivo: suscribirse a `/profile` primero; si `hasResponsible == false`, mostrar solo el estado vacío amistoso; si es true, despachar las demás solicitudes en paralelo. Verificar que `npm run build` pase sin errores.
- [x] 4.2 Escribir `dashboard.component.html` con el layout completo: sección de bienvenida con nombre y cargo, KPI cards (`SparklineCardComponent`), dos donas de distribución (`DonutChartComponent`), tabla/lista de órdenes activas con barra de progreso inline, chip de estado con color semántico e ícono de alerta (`warning`, `overdue`), lista de actividades pendientes y lista de observaciones recientes. Verificar renderizado visual sin errores de consola.
- [x] 4.3 Escribir `dashboard.component.css` respetando la estética BI de los dashboards previos (colores, tipografía, cards, chips). Verificar que el layout sea responsivo en pantallas de al menos 1280px de ancho.
- [x] 4.4 Implementar el estado vacío amistoso en el HTML: mensaje "Tu perfil no está vinculado a ningún responsable. Contactá al administrador." con ícono de Material, centrado en la pantalla, sin errores ni redirecciones. Verificar comportamiento cuando `hasResponsible == false`.
- [x] 4.5 Verificar que `npm run build` finalice con 0 errores y que el chunk de `dashboard-component` aparezca en la salida del build.
