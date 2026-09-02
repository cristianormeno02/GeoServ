## 1. Ajustes Interfaz Login y Validaciones (auth)

- [x] 1.1 Personalizar mensaje de bienvenida utilizando el subdominio para determinar la empresa, y verificar visualmente que se muestre "Ingresa a tu cuenta de {Empresa}" en la vista de Login.
- [x] 1.2 Implementar validación en el frontend para asegurar que tanto correo como contraseña estén presentes antes de enviar, y verificar que aparezca un mensaje de campos requeridos.
- [x] 1.3 Modificar el manejador de error (HTTP 401) en el componente de Login para mostrar un mensaje de "credenciales incorrectas" en lugar de "sesión finalizada", y comprobarlo ingresando datos inválidos.
- [x] 1.4 Actualizar el diseño del componente de alerta de error en el login para que utilice la paleta de error (rojo) en lugar de éxito (verde), y verificar el color visualmente.
- [x] 1.5 Corregir el estado del botón "Ingresar" para que tras un fallo recupere su estado normal (desactivando el estado de carga/Ingresando), y verificar que se pueda intentar de nuevo.

## 2. Inicio de Sesión con Google (google-sso)

- [x] 2.1 Agregar la dependencia o script necesario para Google Identity Services (GIS) en el proyecto, y comprobar que cargue sin errores de red.
- [x] 2.2 Integrar el botón de inicio de sesión con Google en la vista de Login, y verificar que su diseño se alinee con el resto del formulario.
- [x] 2.3 Implementar la lógica del frontend para invocar GIS, recuperar el token de identidad y enviarlo al backend, comprobando mediante los devtools que la petición se envíe con el token.
- [x] 2.4 Ajustar el manejador de éxito del login para redirigir al usuario al dashboard principal tras autenticarse con Google, y probar el flujo completo con una cuenta de prueba.

## 3. Flujo de Recuperación de Contraseña (password-recovery)

- [x] 3.1 Añadir un enlace "Olvidé contraseña" en el componente de Login y verificar que navegue o abra el componente de recuperación.
- [x] 3.2 Crear el componente de vista para solicitar la recuperación, con un input para el correo y botón de envío, comprobando la validación del correo.
- [x] 3.3 Implementar el servicio/petición de solicitud de restablecimiento hacia el backend y mostrar un mensaje de éxito, verificando en red que la petición se complete.
- [x] 3.4 (Opcional según backend actual) Crear la vista para ingresar la nueva contraseña usando un token recibido, y verificar que permita actualizar la contraseña.
