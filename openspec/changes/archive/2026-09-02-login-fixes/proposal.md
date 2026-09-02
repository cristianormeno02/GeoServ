## Why

Mejorar la experiencia de usuario y la robustez del proceso de inicio de sesión en GeoServ. Esto soluciona problemas actuales de retroalimentación en la interfaz (mensajes de error confusos, colores incorrectos, estados de botones que no se restauran) y añade funcionalidades clave como el inicio de sesión con Google y la recuperación de contraseña, mejorando significativamente la accesibilidad y seguridad para los usuarios.

## What Changes

- **Personalización de Bienvenida**: El título del login cambiará de "Ingresa a tu cuenta de GeoServ" a "Ingresa a tu cuenta de {Empresa}", extrayendo el nombre de la empresa del workspace (subdominio).
- **Validación Front-end**: Si falta el correo o la contraseña al intentar ingresar, se mostrará un mensaje indicando qué datos faltan antes de enviar la petición.
- **Corrección de Mensaje de Error**: El error de credenciales inválidas (ej. 401) dejará de decir "El usuario ha finalizado su sesión" y mostrará un mensaje claro de credenciales incorrectas.
- **Corrección de Colores en Alertas**: Las alertas de error del login utilizarán el color designado para error (rojo) en lugar del color de éxito actual (verde).
- **Corrección de Estado del Botón**: El botón "Ingresar" recuperará su estado inicial y dejará de decir "Ingresando..." después de un error en la autenticación.
- **Login con Google**: Integración de Single Sign-On (SSO) con Google.
- **Olvidé Contraseña**: Nuevo flujo para que los usuarios puedan solicitar el restablecimiento de su contraseña.

## Capabilities

### New Capabilities
- `auth/google-sso`: Permite a los usuarios iniciar sesión utilizando sus credenciales de Google.
- `auth/password-recovery`: Flujo para la solicitud de restablecimiento y cambio de contraseña olvidada.

### Modified Capabilities
- `auth`: Ajustes en la interfaz del login, validaciones de los campos del formulario y manejo correcto de estados y errores de autenticación.

## Impact

- **UI/Componentes**: Modificaciones en la vista principal de Login (textos dinámicos, validaciones, gestión de estado de botones, nuevos enlaces y botones para Google y recuperación).
- **Servicios/API**:
  - Ajuste en el manejo de códigos de error HTTP en la respuesta del login.
  - Requisito de nuevos endpoints para el login con Google y para iniciar/completar el flujo de recuperación de contraseña (si aún no están implementados en el backend).
- **Dependencias**: Posible integración de librería oficial o configuración de cliente para Google OAuth.
