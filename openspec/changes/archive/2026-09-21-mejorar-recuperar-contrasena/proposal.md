## Why

La página de recuperar contraseña (`/recover-password`) funciona a nivel visual, pero tiene problemas de experiencia y, sobre todo, el flujo completo **no es seguro ni funcional de punta a punta**:

- **Backend incompleto**: `POST /api/auth/recover-password` genera un `Guid` que nunca se guarda, y `POST /api/auth/reset-password` es un stub que siempre responde "Contraseña actualizada con éxito" sin validar el token ni cambiar la contraseña.
- **Enlace del correo fijo a `http://localhost:4200`** en `MailerService`, inutilizable fuera de desarrollo y sin considerar el subdominio (tenant) de la empresa.
- **Mensaje de éxito engañoso**: el frontend dice "Hemos enviado un enlace" aunque el backend responde igual cuando el correo no existe (anti-enumeración correcta), por lo que el texto debe ser neutro.
- **UX inconsistente con el login**: el logo va en posición absoluta arriba a la izquierda (el login lo centra), el CSS está triplicado (~300 líneas casi idénticas en `login`, `recover-password` y `reset-password`), el estado `isError` arranca en `true`, el error se muestra dos veces (banner + `mat-error`) y se expone `err.error.title` crudo al usuario.
- **Sin reenvío ni protección**: si el correo no llega no hay forma de reintentar sin recargar, y no hay límite de solicitudes.
- **Pruebas**: el spec de `RecoverPassword` solo verifica `should create` (y sin proveedores HTTP/router).

## What Changes

- **Backend (necesario para que la página sea real)**:
  - Persistir un token de restablecimiento de un solo uso (guardado como hash, con vencimiento de 30 minutos) asociado al usuario.
  - Implementar `reset-password`: validar token (existe, no vencido, no usado), actualizar la contraseña con el mismo mecanismo de hash del login e invalidar el token y los refresh tokens vigentes.
  - Construir el enlace del correo con la URL base del tenant (configurable) en lugar de `localhost:4200`.
  - Limitar solicitudes de recuperación por correo/IP (HTTP 429) manteniendo la respuesta neutra anti-enumeración.
- **Frontend – página `recover-password`**:
  - Unificar layout y estilos con el login mediante una hoja de estilos compartida para las tres páginas de auth (elimina la duplicación).
  - Formulario más claro: `autocomplete="email"`, foco automático, `trim` del valor, envío con Enter, un único punto de mensaje de error, estado inicial correcto.
  - Estado de éxito neutro ("Si el correo está registrado, recibirás un enlace…") mostrando el correo ingresado, la vigencia del enlace (30 min) y sugerencia de revisar spam.
  - Botón **Reenviar** con enfriamiento de 60 s y contador visible.
  - Mensajes de error amigables y diferenciados (validación, 429, error de servidor/SMTP, sin conexión) sin exponer texto crudo del backend.
  - Accesibilidad: `aria-live`/`role="alert"` en mensajes y contraste correcto.
- **Página `reset-password`** (ajuste mínimo por coherencia): manejar token inválido/vencido con mensaje claro y enlace para solicitar uno nuevo; reglas de contraseña alineadas con el backend.
- **Pruebas**: cobertura del componente (validación, éxito, error, 429, cooldown de reenvío) y de los endpoints (token válido, vencido, reutilizado, correo inexistente).

## Capabilities

### New Capabilities
- (Ninguna)

### Modified Capabilities
- `auth/password-recovery`: se amplía con emisión y validación real de tokens, mensajes neutros, reenvío con enfriamiento, límite de solicitudes y manejo de token inválido/vencido.

## Impact

- **Frontend**: `features/auth/recover-password/*`, `features/auth/reset-password/*`, estilos compartidos de auth (archivo nuevo) y ajuste de `login.component.css` para consumirlos; `AuthService` (manejo de errores).
- **Backend/API**: `AuthEndpoints.cs` (`recover-password`, `reset-password`), `MailerService.cs`, nueva entidad/tabla de tokens de restablecimiento + migración EF Core, configuración de rate limiting y de URL base.
- **Seguridad**: se cierra un endpoint que hoy acepta cualquier token; requiere revisión antes de desplegar.
- **Sin cambios de contrato incompatibles**: las rutas y cuerpos de request existentes se mantienen.
