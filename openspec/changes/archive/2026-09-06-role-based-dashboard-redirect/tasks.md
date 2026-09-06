## 1. Servicio de Autenticación y Resolución de Rutas

- [x] 1.1 Implementar el método `getDefaultDashboardRoute(): string` en `AuthService` respetando el orden de precedencia (Dashboard General > Dashboard Operativo > Dashboard Cliente) según los roles y verificar con pruebas unitarias en `auth.service.spec.ts`.
- [x] 1.2 Actualizar `LoginComponent` en `login.component.ts` para navegar a la ruta calculada por `authService.getDefaultDashboardRoute()` tanto en el login por credenciales como en Google SSO, y verificar con pruebas unitarias en `login.component.spec.ts`.

## 2. Enrutamiento, Protección y Navegación

- [x] 2.1 Crear el guard funcional `dashboardRoleGuard` (`dashboard-role.guard.ts`) para proteger las rutas de dashboards según roles autorizados y redirigir al dashboard permitido en caso de intento no autorizado; verificar con pruebas unitarias.
- [x] 2.2 Actualizar `app.routes.ts` para que la ruta raíz (`path: ''`) utilice una función dinámica en `redirectTo` basada en `getDefaultDashboardRoute()`, asociar `dashboard/cliente` a `ClientDashboardComponent`, y aplicar `dashboardRoleGuard` a las rutas de dashboard.
- [x] 2.3 Actualizar el ítem "Dashboard Cliente" en `sidebar.component.ts` para que su propiedad `path` apunte a `/dashboard/cliente` y verificar su correcta visibilidad y navegación con pruebas unitarias.

## 3. Verificación Integral

- [x] 3.1 Ejecutar los tests unitarios del frontend (`npm test -- --watch=false`) y verificar que todas las pruebas pasen satisfactoriamente.
- [x] 3.2 Ejecutar la compilación del frontend (`npm run build`) y verificar la ausencia de errores de compilación o tipado.
