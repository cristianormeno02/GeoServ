## Why

Actualmente, al autenticarse en el sistema o al ingresar a la raíz del sitio (`/`), todos los usuarios son redirigidos indiscriminadamente a `dashboard` (Dashboard General). Para usuarios como los que tienen el rol de Cliente u otros perfiles que no tienen permiso o visibilidad para el Dashboard General, esto ocasiona que se les dirija a una vista no autorizada o inaccesible en lugar de su dashboard correspondiente ("Dashboard Cliente").

Es necesario resolver este flujo de navegación inicial implementando una redirección inteligente basada en los permisos/visibilidad de dashboards del usuario según un orden de prioridad definido: Dashboard General, Dashboard Operativo y Dashboard Cliente.

## What Changes

- Implementación de una resolución centralizada de ruta de inicio/dashboard según los roles del usuario autenticado y la visibilidad de menú.
- Orden de prioridad de dashboards:
  1. **Dashboard General** (`/dashboard`)
  2. **Dashboard Operativo** (`/dashboard/operativo`)
  3. **Dashboard Cliente** (`/dashboard/cliente`)
- Redirección automática al iniciar sesión (tanto por credenciales estándar como por Google SSO) hacia el dashboard que le corresponda al usuario.
- Actualización del redireccionamiento de la ruta raíz (`/`) para que evalúe y resuelva dinámicamente el dashboard prioritario del usuario en lugar de apuntar de forma fija a `dashboard`.
- Corrección de la ruta del ítem "Dashboard Cliente" en el menú de navegación (`/dashboard/cliente`), asegurando que cargue el componente correspondiente (`ClientDashboardComponent`).
- Protección de consistencia en rutas de dashboards frente a accesos directos por URL.

## Capabilities

### New Capabilities
- `auth/role-dashboard-redirect`: Especifica las reglas de navegación y redirección inicial hacia el dashboard correspondiente según la visibilidad de menú y roles del usuario (General > Operativo > Cliente).

### Modified Capabilities
- `ui/sidebar-menu`: Se ajusta la definición de navegación del ítem "Dashboard Cliente" para asegurar que su ruta apunte a `/dashboard/cliente` y se mantenga coherente con la visibilidad por roles.

## Impact

- **Frontend**:
  - `frontend/src/app/core/services/auth.service.ts` o servicio especializado de navegación/permisos para resolver la ruta inicial.
  - `frontend/src/app/features/auth/login/login.component.ts` para redirigir según la ruta resuelta al autenticarse.
  - `frontend/src/app/app.routes.ts` para gestionar la redirección dinámica en la ruta raíz (`/`) y vincular `dashboard/cliente` a `ClientDashboardComponent`.
  - `frontend/src/app/core/layout/sidebar/sidebar.component.ts` para sincronizar la ruta de "Dashboard Cliente" con `/dashboard/cliente`.
- **Backend / APIs**: Sin impacto en endpoints del backend; utiliza los claims de rol ya presentes en el token JWT.
