# Design

## Context
Implementación de configuración a nivel empresa para el formato de numeración de órdenes de servicio, permitiendo modalidad manual y auto-incremental.

## Architecture

No hay cambios mayores en la arquitectura. Se introducirá un nuevo modelo y tabla en la base de datos para almacenar la configuración de las empresas.

## Data Model

### Tabla: empresa_configuracion (o equivalente)
Columnas sugeridas:
- id (PK)
- empresa_id (FK a empresa)
- key (String, UK por empresa). Ej: os_number_format
- alue (String)
- alue_type (String: string, oolean, 
umber, json, etc.)
- description (String, opcional)

Valores esperados para os_number_format: uto o manual.

## UI / UX

1. **Pantalla de Configuración de Empresa:** Agregar una nueva sección o pestaña para gestionar las configuraciones. Para la clave os_number_format, mostrar un combo o radio button con opciones Auto-incremental (8 dígitos) y Manual.
2. **Formulario de Nueva OS:**
   - Si os_number_format es uto, ocultar el campo de número de OS o mostrarlo deshabilitado indicando "Se generará automáticamente".
   - Si os_number_format es manual, mostrar el campo requerido.

## Error Handling

- Si se intenta cambiar la configuración os_number_format y existen OS creadas para la empresa, lanzar una excepción indicando: "No se puede modificar el formato de numeración porque ya existen órdenes de servicio".
- Si no existe la configuración para una empresa, asumir un valor por defecto (ej. manual).

## Security

- La edición de estas configuraciones debe estar restringida a roles de administrador o similares con permisos sobre la configuración de la empresa.

## Edge Cases
- Concurrencia al crear OS auto-incrementales: Usar una transacción o bloqueo a nivel de base de datos (SELECT MAX(...) FOR UPDATE) o una secuencia específica por empresa para evitar números duplicados.
