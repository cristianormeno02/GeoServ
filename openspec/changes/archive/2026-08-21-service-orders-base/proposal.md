## Why

Iniciar el desarrollo del proyecto "GeoServ", un software integral de gestión para consultoras geológicas. Este cambio inicial establece el módulo base fundamental del sistema, el cual se enfoca en la Gestión de Órdenes de Servicio (OS) y las entidades principales que las soportan.

## What Changes

- Definición y capacidades de gestión para la entidad `Cliente`.
- Definición y capacidades de gestión para los `Tipos de Servicio` (específicamente: macroscópico, petro-calcográfico y de campo).
- Funcionalidades principales de gestión para las Órdenes de Servicio (OS), permitiendo a los usuarios crear, visualizar y organizar las solicitudes de servicio.
- Incorporación del Módulo de Autenticación y Control de Accesos por Roles (RBAC).
- Base de la arquitectura tecnológica (Frontend en Angular, backend en ASP.NET Core, base de datos PostgreSQL).
- **[ACTUALIZADO]** Historial de Observaciones por OS: entidad `ServiceOrderObservation` (insert-only) con UI de ingreso + listado de solo lectura en el formulario de edición.
- **[ACTUALIZADO]** Renombrado de etiquetas de fechas: "Inicio/Fin Estimado" → "Inicio/Fin Presupuestado". Lógica de precarga automática desde fechas presupuestadas hacia fechas reales.
- **[ACTUALIZADO]** Corrección de carga en edición: todos los campos (fechas, selectores) cargan correctamente los valores guardados.
- **[ACTUALIZADO]** Campo "Monto Cobrado" (`CollectedAmount`) en el formulario financiero, independiente del Total Final.
- **[ACTUALIZADO]** Campo "Detalle de Tareas Presupuestadas" (`BudgetedTasksDetail`): textarea libre para fuente de contenido del PDF del presupuesto.
- **[ACTUALIZADO]** Validaciones relajadas: fechas reales y fecha de cobro son opcionales al guardar.

## Capabilities

### New Capabilities
- `auth-rbac`: Autenticación de usuarios y Control de Accesos por Roles (Administrador, Operativo/Geólogo, Administrativo, Cliente).
- `service-orders`: Módulo base para el ciclo de vida y gestión de Órdenes de Servicio (OS).
- `clients`: Gestión de la información del cliente vinculada a las órdenes de servicio.
- `service-types`: Definición y configuración de los diferentes tipos de servicios geológicos ofrecidos (macroscópico, petro-calcográfico y de campo).

### Modified Capabilities

## Impact

- **Frontend**: Creación de la estructura inicial de la aplicación Angular, componentes de interfaz de usuario para la gestión de OS, clientes y tipos de servicio, e implementación de guardas de rutas (Route Guards). Nuevas secciones en el formulario de OS: Observaciones, Detalle de Tareas Presupuestadas, Monto Cobrado. Renombrado de etiquetas de fechas y lógica de auto-copia.
- **Backend**: Configuración de la Web API en ASP.NET Core con endpoints para manejar las operaciones CRUD de las entidades principales e implementación de autenticación con JWT. Nuevo endpoint para insertar y listar `ServiceOrderObservation`.
- **Database**: Esquema inicial de PostgreSQL (gestionado vía Supabase) para almacenar Clientes, Tipos de Servicio y Órdenes de Servicio. Nueva tabla `ServiceOrderObservations`. Nuevas columnas `BudgetedTasksDetail` (text) en `ServiceOrders`.
