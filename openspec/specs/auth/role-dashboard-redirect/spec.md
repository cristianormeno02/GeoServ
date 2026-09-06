## Purpose

Define las reglas de redirección y resolución del dashboard inicial de cada usuario tras la autenticación o navegación a la ruta raíz según su rol y los permisos de acceso al menú.

## Requirements

### Requirement: Redirección Jerárquica de Dashboards por Rol
El sistema MUST determinar el dashboard por defecto al que debe acceder un usuario autenticado siguiendo estrictamente el siguiente orden de precedencia de acuerdo a los permisos y visibilidad de menú de su rol:
1. Dashboard General (`/dashboard`)
2. Dashboard Operativo (`/dashboard/operativo`)
3. Dashboard Cliente (`/dashboard/cliente`)

#### Scenario: Usuario con rol Administrador
- **WHEN** un usuario con rol Administrador inicia sesión o navega a la ruta raíz `/`
- **THEN** el sistema lo redirige al Dashboard General (`/dashboard`).

#### Scenario: Usuario con rol Operador
- **WHEN** un usuario con rol Operador inicia sesión o navega a la ruta raíz `/`
- **THEN** el sistema lo redirige al Dashboard General (`/dashboard`).

#### Scenario: Usuario con rol Cliente
- **WHEN** un usuario con rol Cliente inicia sesión o navega a la ruta raíz `/`
- **THEN** el sistema lo redirige al Dashboard Cliente (`/dashboard/cliente`).

#### Scenario: Usuario con acceso únicamente a Dashboard Operativo
- **WHEN** un usuario que no tiene acceso al Dashboard General pero sí al Dashboard Operativo inicia sesión o navega a la ruta raíz `/`
- **THEN** el sistema lo redirige al Dashboard Operativo (`/dashboard/operativo`).

### Requirement: Redirección al Iniciar Sesión
El sistema MUST redirigir automáticamente al usuario a su dashboard correspondiente inmediatamente después de completar exitosamente la autenticación (tanto mediante credenciales directas como con Google SSO).

#### Scenario: Inicio de sesión exitoso por credenciales
- **WHEN** un usuario envía credenciales válidas en el formulario de inicio de sesión
- **THEN** tras almacenar el token y cargar la configuración, el sistema navega al dashboard correspondiente a su rol.

#### Scenario: Inicio de sesión exitoso por Google SSO
- **WHEN** un usuario completa la autenticación a través de Google SSO
- **THEN** el sistema valida el token y navega al dashboard correspondiente a su rol.

### Requirement: Protección de Acceso a Dashboards
El sistema MUST impedir que usuarios sin el rol requerido accedan a dashboards para los cuales no tienen visibilidad o autorización, redirigiéndolos a su dashboard permitido correspondiente.

#### Scenario: Cliente intenta acceder al Dashboard General
- **WHEN** un usuario autenticado con rol Cliente intenta navegar manualmente a `/dashboard` o `/dashboard/operativo`
- **THEN** el sistema bloquea el acceso y lo redirige a `/dashboard/cliente`.

#### Scenario: Acceso directo a dashboard permitido
- **WHEN** un usuario navega a una ruta de dashboard para la que sí cuenta con permisos según su rol
- **THEN** el sistema permite la activación de la ruta y renderiza la vista solicitada.
