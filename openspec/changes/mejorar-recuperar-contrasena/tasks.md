## 1. Backend: flujo real de restablecimiento

- [x] 1.1 Crear entidad `PasswordResetToken`, configuración EF y migración. Verificar que la migración se aplica y crea la tabla con índice por `TokenHash`.
- [x] 1.2 `recover-password`: generar token aleatorio, guardar su hash con vencimiento de 30 min, invalidar tokens previos del usuario y enviar el correo. Verificar con prueba de integración que solo se guarda el hash y que un correo inexistente responde 200 sin crear registros.
- [x] 1.3 `reset-password`: validar token (existente, no vencido, no usado) y reglas de contraseña, actualizar el hash de contraseña, marcar el token como usado y revocar refresh tokens. Verificar casos válido, vencido, reutilizado e inexistente (400 con mensaje genérico).
- [x] 1.4 `MailerService`: construir el enlace con `App:FrontendBaseUrl` y el subdominio del tenant; mejorar el cuerpo del correo (vigencia de 30 min, aviso "si no fuiste tú, ignora este mensaje"). Verificar que el enlace ya no apunta a `localhost:4200` en configuración de producción.
- [x] 1.5 Rate limiting en `recover-password` (por IP y por correo) con HTTP 429 y `Retry-After` (limitador en memoria por instancia). Verificar con prueba que la 6.ª solicitud en la ventana devuelve 429.

## 2. Frontend: estilos compartidos

- [ ] 2.1 Extraer `auth-shell.css` y consumirlo desde `login`, `recover-password` y `reset-password`, eliminando la duplicación. Verificar visualmente que las tres páginas se ven iguales (logo centrado) en escritorio y móvil. (Implementado y compilado; estilos comprobados por CSS computado en escritorio, falta revisión visual en móvil.)

## 3. Frontend: página recover-password

- [x] 3.1 Rediseñar el formulario: `autocomplete="email"`, foco automático, `trim`, Enter para enviar, único mensaje de error con `role="alert"`, corregir estado inicial de `isError`. Verificar con pruebas de componente.
- [x] 3.2 Estado de éxito neutro con correo ingresado, vigencia, sugerencia de spam y `aria-live`. Verificar en prueba que el texto no afirma que el correo existe.
- [x] 3.3 Botón "Reenviar" con enfriamiento de 60 s y contador; limpieza del intervalo en `ngOnDestroy`. Verificar con `fakeAsync` que se habilita a los 60 s.
- [x] 3.4 Mapear errores HTTP (0, 429, ≥500, otros) a mensajes en español sin exponer texto crudo del backend. Verificar cada caso en pruebas.

## 4. Frontend: reset-password (ajuste mínimo)

- [x] 4.1 Mostrar mensaje claro y enlace a `/recover-password` cuando el token falte o el backend lo rechace por inválido/vencido. Alinear la longitud mínima de contraseña con el backend. Verificar con pruebas de componente.

## 5. Verificación final

- [ ] 5.1 Ejecutar la suite completa (.NET y Angular; ya ejecutada: 80 y 57 pruebas en verde) y una prueba manual de punta a punta: solicitar, recibir correo, restablecer, iniciar sesión con la nueva contraseña y confirmar que el enlace no se puede reutilizar.
