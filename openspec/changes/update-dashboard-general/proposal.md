## Why

Es necesario que el dashboard general presente la misma información visual y métricas que el dashboard operativo mediante la incorporación de los nuevos íconos de información. Además, existe un error de control de acceso donde los usuarios sin un responsable asociado pueden ver información en este dashboard, lo cual debe ser restringido.

## What Changes

- **Agregar iconos de información**: Incorporar en el dashboard general los mismos íconos/tarjetas de métricas o información que se encuentran en el dashboard operativo.
- **Validación de responsable**: Implementar una restricción para que si el usuario autenticado no tiene una entidad "responsable" vinculada, no pueda ver la información de este dashboard.

## Capabilities

### New Capabilities
- (Ninguna)

### Modified Capabilities
- `dashboard-general`: Se incorporan los nuevos íconos informativos y se agrega la restricción de visualización para usuarios sin responsable asociado.

## Impact

- **Frontend**: Modificación de la vista principal del dashboard general para agregar los iconos e implementar el bloqueo/renderizado condicional.
- **Backend/API**: (Posible) Ajustes en los endpoints que alimentan el dashboard general para verificar que el usuario tenga un responsable, o bien enviar error/datos vacíos.
