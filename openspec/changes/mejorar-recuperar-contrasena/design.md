## Context

- Rutas: `/recover-password` y `/reset-password?token=…` (`app.routes.ts`), standalone con carga diferida.
- `RecoverPassword` usa Reactive Forms + Angular Material y `AuthService.recoverPassword(email, tenantId)` (envía el tenant como header).
- El backend es multi-tenant por subdominio; el SMTP se lee de `EmpresaConfiguracion` vía `IMailerService`.
- Los tres CSS de auth son casi idénticos (el login difiere solo en logo centrado y ancho del formulario).

## Decisiones

### 1. Token de un solo uso persistido como hash
Nueva entidad `PasswordResetToken { Id, UserId, TokenHash, ExpiresAt, UsedAt, CreatedAt }`. Se genera con `RandomNumberGenerator` (32 bytes, base64url), se envía en claro solo por correo y se guarda su SHA-256. Vigencia: 30 min. Al emitir uno nuevo se invalidan los anteriores del usuario. *Alternativa descartada*: JWT firmado sin estado; no permite un solo uso ni revocación.

### 2. Respuesta neutra siempre
`recover-password` responde 200 con el mismo mensaje exista o no el correo (ya es así). **Decidido**: los fallos SMTP se registran en log y la respuesta sigue siendo 200; devolver 500 solo cuando el usuario existe habría revelado la existencia del correo.

### 2.b Envío de correo en segundo plano
La solicitud ya no espera al SMTP. `IMailerService.PreparePasswordRecoveryEmailAsync` arma el correo dentro de la solicitud (necesita el tenant y su configuración SMTP) y `IEmailQueue` lo encola; `EmailQueueService` (`BackgroundService` con `Channel`) lo envía mediante `IEmailSender`/`SmtpEmailSender`. Los errores se registran con destinatario, host y puerto (sin credenciales) y no detienen la cola. Si la configuración SMTP está incompleta, el mensaje del log lista las claves faltantes. Limitación: la cola es en memoria, por lo que un reinicio del servicio pierde los correos pendientes (el usuario puede reenviar).

### 2.c Proveedor de correo por API HTTP (Brevo)
Los logs de producción mostraron `TimeoutException` al conectar con `smtp.gmail.com:587`: Render bloquea el SMTP saliente en su plan gratuito. `ConfiguredEmailSender` usa `BrevoEmailSender` (POST a `https://api.brevo.com/v3/smtp/email`, puerto 443) cuando existe `Brevo:ApiKey`, y SMTP en caso contrario. La API key se define solo como variable de entorno (`Brevo__ApiKey`); el remitente sigue siendo `smtp_from` del tenant y debe estar verificado en Brevo. Con Brevo solo se exige `smtp_from` en la configuración del tenant.

### 3. Rate limiting
Limitador de ventana fija propio y en memoria (`PasswordRecoveryRateLimiter`, singleton, con `TimeProvider` para pruebas): 5 solicitudes / 15 min por IP y 3 / 15 min por correo. Se prefirió sobre el middleware nativo `AddRateLimiter` porque este no permite limitar por el correo del cuerpo de la petición. Limitación conocida: el contador es por instancia (no se comparte entre réplicas). Excedido → 429 con `Retry-After`. El frontend mapea 429 a un mensaje propio.

### 4. Enlace con URL del tenant
Se reemplaza `http://localhost:4200` por la configuración `App:FrontendBaseUrl` con plantilla de subdominio (`https://{tenant}.dominio`), con fallback a `localhost:4200` solo en desarrollo.

### 5. Reenvío con enfriamiento en el cliente
Tras el éxito se muestra "Reenviar correo" deshabilitado 60 s (contador). El límite real lo impone el backend; el enfriamiento evita solicitudes innecesarias. Se implementa con `interval` de RxJS cancelado en `ngOnDestroy`.

### 6. Estilos compartidos de auth
Se extrae `features/auth/auth-shell.css` importado por las tres páginas. El logo pasa a centrado como en el login. *Alternativa*: componente `AuthShell` con `ng-content`; se prefiere solo CSS para no tocar las plantillas del login y poder evolucionarlo después.

### 7. Manejo de errores en el componente
Mapa `HttpErrorResponse.status` → mensaje en español (0 sin conexión, 429 demasiados intentos, ≥500 servicio no disponible, otro genérico). Se deja de mostrar `err.error.detail/title` crudo. Un único `errorMessage` con `role="alert"`.

### 8. Hallazgo durante la implementación
Las plantillas de `recover-password` y `reset-password` usaban clases (`login-container`, `login-left-panel`…) que no existían en su CSS, por lo que la página se veía sin layout. Se reescribieron sobre la estructura del login (`login-wrapper`, `branding-section`, `form-section`) con `auth-shell.css` compartido vía `@import`. Además `reset-password` no enviaba `X-Tenant-Id`, por lo que habría consultado el tenant por defecto; ahora `AuthService.resetPassword` lo recibe y lo envía.

## Riesgos / Trade-offs

- **Alcance backend**: sin arreglar el backend, las mejoras visuales ocultarían un flujo roto. Si se prefiere acotar, la sección 1 de `tasks.md` puede separarse en un cambio propio.
- **Migración EF Core** nueva; probar en staging por ser multi-tenant.
- Revocar refresh tokens al restablecer cierra sesiones activas del usuario (comportamiento deseado).
