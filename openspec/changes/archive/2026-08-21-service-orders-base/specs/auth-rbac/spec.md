## Purpose

Define las capacidades del Módulo de Autenticación y Control de Accesos por Roles (RBAC), estableciendo la seguridad del sistema mediante perfiles específicos. Prepara el terreno para la implementación de autenticación con JWT en ASP.NET Core y las guardas de rutas (Route Guards) en Angular.

## ADDED Requirements

### Requirement: Autenticación de Usuarios
El sistema DEBE permitir a los usuarios iniciar sesión de forma segura utilizando credenciales válidas y proporcionando un token JWT para mantener la sesión.

#### Scenario: Inicio de sesión exitoso
- **WHEN** el usuario proporciona credenciales válidas
- **THEN** el sistema autentica al usuario y devuelve un token JWT con la información de su rol

### Requirement: Control de Accesos por Roles (RBAC)
El sistema DEBE restringir el acceso a las funcionalidades y datos del sistema basándose en el rol asignado al usuario (Administrador, Operativo/Geólogo, Administrativo, Cliente).

#### Rol: Administrador
- **Permisos**: Acceso total al sistema. Esto incluye finanzas, costos, distribución de ingresos, honorarios y operaciones completas.
- **Restricciones**: Ninguna.

#### Rol: Operativo/Geólogo
- **Permisos**: Gestión de órdenes de servicio, carga de costos directos asociados a las OS e informes de avance.
- **Restricciones**: Sin acceso a finanzas globales, contabilidad general o distribución de ingresos.

#### Rol: Administrativo
- **Permisos**: Carga de movimientos contables, registro de cobros, pagos de insumos y servicios fijos.
- **Restricciones**: No puede modificar la información técnica de las órdenes de servicio ni descargar/modificar informes geológicos finales.

#### Rol: Cliente
- **Permisos**: Acceso exclusivo a un Portal Externo para consultar el estado de sus propias órdenes de servicio y descargar informes asociados a las mismas.
- **Restricciones**: No tiene acceso a datos de otros clientes, costos internos, finanzas, ni creación de nuevas órdenes de servicio.
