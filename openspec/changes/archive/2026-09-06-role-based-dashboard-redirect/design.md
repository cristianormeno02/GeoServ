## Context

Ver `proposal.md` y las especificaciones en `specs/auth/role-dashboard-redirect/spec.md`.

Actualmente:
- El servicio `AuthService` decodifica los claims del token JWT y expone `getUserRole()`.
- En `SidebarComponent`, las opciones de dashboard dentro del grupo "Inicio" poseen configuración de roles:
  - "Mi Dashboard" (`/dashboard`): Administrador, Operador.
  - "Dashboard Operativo" (`/dashboard/operativo`): Administrador.
  - "Dashboard Cliente": Administrador, Cliente (apuntaba erróneamente a `/en-construccion`).
- Al iniciar sesión en `LoginComponent`, se realiza `this.router.navigate(['/'])`.
- En `app.routes.ts`, la ruta hija vacía redirige rígidamente con `{ path: '', redirectTo: 'dashboard', pathMatch: 'full' }`, forzando a todos los perfiles (incluidos Clientes) a entrar en el Dashboard General.
- Existe el componente `ClientDashboardComponent` en `frontend/src/app/features/dashboard-cliente/client-dashboard.component.ts`, pero la ruta `dashboard/cliente` cargaba `UnderConstructionComponent`.

## Goals / Non-Goals

**Goals:**
- Implementar un método centralizado en `AuthService` (`getDefaultDashboardRoute(): string`) que calcule la ruta de dashboard prioritario según la jerarquía establecida (General > Operativo > Cliente).
- Configurar la redirección funcional en `app.routes.ts` para que la ruta raíz (`''`) evalúe dinámicamente la ruta de dashboard del usuario en vez de usar una constante fija.
- Asegurar que `LoginComponent` redirija de inmediato al dashboard correspondiente tanto en login tradicional como en Google SSO.
- Implementar un guard funcional (`dashboardGuard` o verificación de roles en rutas) que proteja las rutas de dashboards (`/dashboard`, `/dashboard/operativo`, `/dashboard/cliente`), redirigiendo a la ruta permitida en caso de acceso no autorizado por URL directa.
- Asociar la ruta `/dashboard/cliente` a `ClientDashboardComponent` y corregir su ruta en `SidebarComponent`.

**Non-Goals:**
- Modificar el backend, la generación de claims o los endpoints de autenticación (el rol ya se transmite adecuadamente en el JWT).
- Implementar funcionalidades de negocio adicionales dentro de `ClientDashboardComponent` (se mantiene la plantilla base existente o su estado actual).

## Decisions

### Decisión 1: Resolución centralizada de ruta en `AuthService`
- **Elección**: Añadir el método `getDefaultDashboardRoute(): string` a `AuthService`.
- **Racionalidad**: `AuthService` ya centraliza la lectura y parseo del JWT y la obtención de `getUserRole()`. Conoce si el usuario está autenticado y soporta tanto roles en string como en arreglo.
- **Alternativas consideradas**: Definir la lógica directamente en `LoginComponent`. Descartado porque la ruta raíz (`/`) y la navegación directa también requieren conocer esta resolución.

### Decisión 2: Redirección dinámica mediante función en `app.routes.ts`
- **Elección**: Usar la capacidad de Angular Router de proporcionar una función a `redirectTo`:
  ```typescript
  { 
    path: '', 
    pathMatch: 'full', 
    redirectTo: () => inject(AuthService).getDefaultDashboardRoute() 
  }
  ```
- **Racionalidad**: Permite resolver la navegación en tiempo de ejecución sin necesidad de componentes dummy intermediarios para la ruta raíz.
- **Alternativas consideradas**: Crear un componente `RedirectComponent` vacío que redirija en `ngOnInit`. Descartado por ser innecesario y provocar saltos de renderizado.

### Decisión 3: Protección de rutas de dashboard (`dashboardRoleGuard`)
- **Elección**: Crear un guard funcional (`dashboardRoleGuard`) que verifique si el rol del usuario tiene permiso para la ruta de dashboard solicitada en su propiedad `data: { roles: [...] }`. Si no tiene permiso, lo redirige a `getDefaultDashboardRoute()`.
- **Racionalidad**: Impide que un Cliente acceda a `/dashboard` escribiendo la URL manualmente en el navegador, garantizando consistencia y seguridad de interfaz.
- **Alternativas consideradas**: Permitir el acceso por URL y solo ocultar en el menú. Descartado porque el usuario vería componentes para los cuales no tiene contexto ni datos.

### Decisión 4: Enrutamiento y visualización de Dashboard Cliente
- **Elección**: Actualizar `app.routes.ts` para que `dashboard/cliente` cargue `ClientDashboardComponent` y corregir en `SidebarComponent` la propiedad `path` a `/dashboard/cliente`.
- **Racionalidad**: Alinea la especificación del menú con las rutas del sistema y el componente ya existente en la base de código.

## Risks / Trade-offs

- **[Usuario sin rol definido o token inválido]** → **Mitigación**: `getDefaultDashboardRoute()` manejará un fallback seguro redirigiendo a `/dashboard/cliente` (o `/login` si no está autenticado).
- **[Roles devueltos como arreglo en lugar de string]** → **Mitigación**: El helper evaluará `Array.isArray(role)` de la misma forma que lo hace `SidebarComponent.hasAccess`.
