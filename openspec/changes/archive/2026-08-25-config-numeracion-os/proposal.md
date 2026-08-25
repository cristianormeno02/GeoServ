## Why

Actualmente los números de orden de servicio (OS) se ingresan manualmente. Esto es tedioso para clientes que necesitan una numeración auto-incremental de 8 dígitos (ej. 00000001). Otros clientes prefieren usar formatos manuales propios (ej. OS-0001). Se necesita una configuración a nivel de empresa para definir cómo se numeran las OS, facilitando la carga de datos y aportando flexibilidad.

## What Changes

- Se agregará una tabla de configuración genérica por empresa con columnas: key, alue, alueType y description.
- Se incorporará la configuración para el formato de numeración de OS.
- El proceso de creación de OS asignará automáticamente el próximo número de 8 dígitos si la empresa está configurada para numeración auto-incremental.
- Se permitirá el ingreso manual si la empresa está configurada para ello.
- Se agregará la posibilidad de modificar esta configuración desde la pantalla de configuración de la empresa.
- **Restricción**: Esta configuración solo podrá modificarse si la empresa no tiene órdenes de servicio cargadas.

## Capabilities

### New Capabilities
- empresa/configuracion: Gestión de configuraciones dinámicas a nivel de empresa.

### Modified Capabilities
- orden-servicio/creacion: El flujo de creación de OS cambia para soportar auto-numeración basada en la configuración de la empresa.

## Impact

- Base de datos: Nueva tabla para configuración de empresas.
- Backend: Lógica de creación de OS para obtener el próximo número y aplicar formato, y validación al modificar la configuración.
- Frontend: Pantalla de configuración de empresa y formulario de creación de OS.
