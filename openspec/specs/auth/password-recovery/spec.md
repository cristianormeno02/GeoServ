# Password Recovery Specification

## Purpose
Permite a los usuarios recuperar el acceso a su cuenta solicitando y completando el restablecimiento de contraseña por correo, con tokens de un solo uso, mensajes neutros anti-enumeración y envío de correo en segundo plano.

## Requirements

### Requirement: Password Recovery Request

El sistema SHALL permitir a los usuarios solicitar el restablecimiento de contraseña por correo desde `/recover-password`, respondiendo siempre con un mensaje neutro que no revele si el correo está registrado.

#### Scenario: Solicitud exitosa con mensaje neutro
- **WHEN** el usuario ingresa un correo válido y envía el formulario
- **THEN** el sistema muestra "Si el correo está registrado, recibirás un enlace para restablecer tu contraseña", el correo ingresado, la vigencia del enlace (30 minutos) y una sugerencia de revisar la carpeta de spam
- **THEN** si el correo existe, el sistema envía un mensaje con un enlace de un solo uso; si no existe, no envía nada pero la respuesta al cliente es idéntica

#### Scenario: Correo inválido
- **WHEN** el usuario envía el formulario con el campo vacío o con formato de correo inválido
- **THEN** el sistema muestra un único mensaje de validación y no realiza la petición al servidor

#### Scenario: Reenvío con enfriamiento
- **WHEN** la solicitud fue exitosa
- **THEN** el botón "Reenviar correo" permanece deshabilitado durante 60 segundos mostrando el tiempo restante y luego se habilita

#### Scenario: Límite de solicitudes excedido
- **WHEN** el servidor responde HTTP 429
- **THEN** el sistema muestra "Demasiados intentos. Espera unos minutos antes de volver a intentar." y restablece el botón de envío

#### Scenario: Error de servidor o sin conexión
- **WHEN** la petición falla por error de servidor o sin conexión
- **THEN** el sistema muestra un mensaje amigable en español sin exponer texto técnico del backend y restablece el botón de envío

### Requirement: Token de restablecimiento de un solo uso

El sistema SHALL emitir un token aleatorio de un solo uso con vigencia de 30 minutos, almacenado únicamente como hash, e invalidar los tokens anteriores del mismo usuario al emitir uno nuevo.

#### Scenario: Token válido
- **WHEN** el usuario envía un token vigente y no usado junto con una contraseña válida a `POST /api/auth/reset-password`
- **THEN** el sistema actualiza la contraseña, marca el token como usado y revoca los refresh tokens del usuario

#### Scenario: Token vencido, usado o inexistente
- **WHEN** el token está vencido, ya fue usado o no existe
- **THEN** el sistema responde HTTP 400 con un mensaje genérico y no modifica la contraseña
- **THEN** el frontend indica que el enlace no es válido o venció e incluye un enlace a `/recover-password` para solicitar uno nuevo

### Requirement: Envío de correo desacoplado de la solicitud

El sistema SHALL enviar el correo de recuperación en segundo plano, sin que la duración o el fallo del servidor SMTP afecte el tiempo ni el resultado de la respuesta al cliente.

#### Scenario: SMTP lento o inaccesible
- **WHEN** el servidor SMTP tarda en responder o rechaza la conexión
- **THEN** la respuesta HTTP a `recover-password` se devuelve de inmediato con el mensaje neutro
- **THEN** el error queda registrado en el log con destinatario, host y puerto, sin incluir credenciales

#### Scenario: Configuración SMTP incompleta
- **WHEN** faltan claves SMTP en la configuración del tenant
- **THEN** no se encola ningún correo y el log indica las claves faltantes

### Requirement: Enlace de recuperación por tenant

El sistema SHALL construir el enlace del correo usando la URL base configurada y el subdominio del tenant, sin valores fijos de desarrollo en producción.

#### Scenario: Enlace en producción
- **WHEN** se envía un correo de recuperación para un usuario de un tenant
- **THEN** el enlace apunta al dominio del tenant configurado en `App:FrontendBaseUrl` y contiene el token en el parámetro `token`

### Requirement: Consistencia visual y accesibilidad de las páginas de autenticación

Las páginas de login, recuperar y restablecer contraseña SHALL compartir el mismo layout y estilos, y sus mensajes SHALL ser anunciados a tecnologías de asistencia.

#### Scenario: Layout unificado
- **WHEN** el usuario navega entre login, recuperar y restablecer contraseña
- **THEN** el logo, el panel de marca y el formulario mantienen la misma posición y estilo en las tres páginas

#### Scenario: Mensajes accesibles
- **WHEN** se muestra un error o un resultado de éxito
- **THEN** el contenedor usa `role="alert"` o `aria-live` y el mensaje es anunciado sin mover el foco fuera del formulario
