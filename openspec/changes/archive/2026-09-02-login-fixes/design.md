## Context

El componente de Login actual carece de retroalimentación precisa al usuario y requiere integración de Single Sign-On (SSO) y recuperación de contraseña. Las especificaciones detallan el comportamiento esperado para la personalización de la vista, validaciones y nuevos flujos (ver `proposal.md` y `specs/`).

## Goals / Non-Goals

**Goals:**
- Implementar validaciones precisas y reactivas en el formulario de login.
- Integrar la API/SDK de Google Identity Services para autenticación por SSO de forma segura.
- Establecer un flujo seguro y rastreable para la recuperación de contraseñas.
- Asegurar que la interfaz responda correctamente a los errores (ej. HTTP 401), actualizando el estado de los componentes sin romper la experiencia del usuario.

**Non-Goals:**
- No se contempla la integración de otros proveedores de identidad SSO (ej. Microsoft, Apple) en esta iteración.
- No se refactorizará el sistema de manejo de sesión interno (tokens) más allá de lo necesario para incorporar Google SSO.

## Decisions

- **Personalización de Bienvenida:**
  - **Decisión:** Extraer el subdominio de la URL o configuración del entorno para determinar el `tenant` (empresa) antes de renderizar el título.
  - **Alternativas:** Realizar una llamada al backend para obtener el nombre de la empresa basado en un identificador general, pero extraer el subdominio es más eficiente si la aplicación ya es multi-tenant por URL.
- **Validación y Manejo de Estados (Frontend):**
  - **Decisión:** Utilizar el sistema de formularios reactivos (ej. Angular Reactive Forms o similar, dependiendo del framework actual) para validar la presencia de campos antes del envío. Restablecer los indicadores de carga (`isLoading = false`) de manera explícita en el bloque `catch` o manejador de errores de la petición.
- **Login con Google (SSO):**
  - **Decisión:** Utilizar Google Identity Services (GIS) en el frontend para obtener el token de identidad, el cual será enviado al backend de GeoServ para validar y generar la sesión del sistema.
  - **Alternativas:** Flujo OAuth tradicional con redirección completa, pero GIS ofrece una mejor UX integrada (ej. One Tap o botón nativo).
- **Recuperación de Contraseña:**
  - **Decisión:** Implementar un flujo clásico: 1) Solicitud con email, 2) Envío de correo con token JWT de corta duración, 3) Interfaz para ingresar la nueva contraseña usando el token.

## Risks / Trade-offs

- **[Riesgo] Dependencia Externa (Google):** Cambios en la API de Google podrían romper el login SSO. → **Mitigación:** Usar la librería oficial más reciente y monitorizar actualizaciones de GIS.
- **[Riesgo] Seguridad en Recuperación:** Los tokens de recuperación podrían ser interceptados. → **Mitigación:** Asegurar que los tokens de restablecimiento expiren en un tiempo corto (ej. 15 minutos) y sean de un solo uso.
