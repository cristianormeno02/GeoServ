## Purpose

Permite la manipulación avanzada de ítems en una orden de servicio, incluyendo el reordenamiento manual de registros y la copia preservando el orden original.

## ADDED Requirements

### Requirement: Reordenamiento de ítems en grillas
El sistema SHALL permitir al usuario modificar el orden de los registros en las secciones de Distribución de cobro, Actividades operativas y Costos directos.

#### Scenario: Modificar orden de registros
- **WHEN** el usuario arrastra o cambia el orden de los registros en la lista
- **THEN** el sistema guarda y mantiene este nuevo orden para la orden actual

### Requirement: Copiado de ítems con preservación de orden
El sistema SHALL copiar los registros manteniendo el mismo orden en el que se guardaron en la orden de origen al copiar hacia otra orden.

#### Scenario: Copiar Distribución de cobro
- **WHEN** el usuario copia la Distribución de cobro desde otra orden
- **THEN** los ítems se insertan en la orden actual respetando el orden original guardado en la orden fuente

#### Scenario: Copiar Actividades operativas
- **WHEN** el usuario copia las Actividades operativas desde otra orden
- **THEN** los ítems se insertan en la orden actual respetando el orden original guardado en la orden fuente

### Requirement: Copiado de Costos directos
El sistema SHALL proveer la funcionalidad para copiar los ítems de Costos directos desde otra orden.

#### Scenario: Opción de copiar Costos directos
- **WHEN** el usuario se encuentra en la sección de Costos directos de una orden
- **THEN** está disponible la opción de copiar registros desde otra orden
- **THEN** al ejecutar la copia, los ítems se insertan manteniendo el orden de la orden original
