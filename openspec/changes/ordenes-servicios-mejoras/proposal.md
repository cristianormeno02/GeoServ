## Why

El objetivo de este cambio es mejorar la usabilidad y prevenir la pérdida de datos en la gestión de órdenes de servicio, respondiendo a problemas comunes experimentados por los usuarios al editar registros o cargar montos numéricos. Se introducen mejoras clave de interacción y usabilidad (como la advertencia al cancelar y la selección automática de texto), así como mayor flexibilidad en las grillas o listas de ítems relacionados (reordenamiento y copia manteniendo el orden) para optimizar el flujo de trabajo.

## What Changes

- Al editar una orden, si hubo modificaciones y se presiona "Cancelar", se agregará una confirmación antes de salir sin guardar.
- **Distribución de cobro**: Se permitirá modificar el orden de los registros y, al copiar de otra orden, se respetará el orden original.
- **Actividades operativas**: Se permitirá modificar el orden de los registros y, al copiar de otra orden, se respetará el orden original.
- **Costos directos**: Se permitirá modificar el orden de los registros, se agregará la funcionalidad de copiar desde otra orden (manteniendo el orden original).
- En campos de montos numéricos, la entrada de punto (`.`) o coma (`,`) se interpretará como separador decimal, manteniendo el formato visual de visualización con punto para miles y coma para decimales.
- Al tomar foco en un control de carga de valores numéricos, se seleccionará automáticamente todo el contenido para facilitar la sobreescritura.

## Capabilities

### New Capabilities
- `ordenes/mejoras-usabilidad`: Se agregan controles de advertencia al cancelar, selección automática en campos numéricos y flexibilización en el separador decimal (punto o coma).
- `ordenes/gestion-items`: Se introduce el reordenamiento de registros y copiado (con preservación de orden) para Distribución de cobro, Actividades operativas y Costos directos (este último suma la opción de copiar).

### Modified Capabilities

## Impact

- Interfaz de usuario (formularios de carga de órdenes de servicio y controles numéricos).
- Lógica de gestión de estados (para detectar si hay cambios sin guardar).
- Lógica de copiado de ítems (Distribución de cobro, Actividades operativas, Costos directos) y persistencia del orden (puede requerir ajustar los modelos de datos si el orden no se guardaba previamente).
