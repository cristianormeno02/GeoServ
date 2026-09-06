## MODIFIED Requirements

### Requirement: Control de Acceso por Roles
El sistema MUST restringir la visibilidad y los enlaces de navegación de los ítems del menú lateral según los roles del usuario autenticado, asegurando que "Dashboard Cliente" dirija a `/dashboard/cliente`.

#### Scenario: Acceso de Operador
- **WHEN** un usuario con rol Operador accede al sistema
- **THEN** el sidebar solo muestra el ítem "Mi Dashboard" bajo el grupo Inicio, y oculta el resto de opciones que requieren rol Administrador o Cliente.

#### Scenario: Acceso de Cliente
- **WHEN** un usuario con rol Cliente accede al sistema
- **THEN** el sidebar solo muestra el ítem "Dashboard Cliente" bajo el grupo Inicio y su enlace dirige a `/dashboard/cliente`.
