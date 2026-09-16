## MODIFIED Requirements

### Requirement: Visualización de orígenes en listados
La tabla principal de movimientos contables DEBE mostrar información consolidada e inteligible para el usuario sobre el origen o destino del movimiento. En movimientos de egreso originados en Pagos de Costo Directo (`DirectCost`) asociados a una Orden de Servicio, la columna de origen DEBE mostrar tanto la referencia o concepto del costo directo como el número de la Orden de Servicio asociada (ej. "Canon Secretaria (OS: OS-2026-0012)").

#### Scenario: Usuario visualiza la grilla de movimientos
- **WHEN** el usuario ingresa a la sección de Movimientos Contables
- **THEN** observa una columna "Origen" que contiene una etiqueta del tipo de origen y el identificador de negocio de la entidad asociada (ej. "Orden de Servicio - OS-00123" o "Compra de Activo - Camioneta Hilux")

#### Scenario: Movimiento de pago de costo directo vinculado a Orden de Servicio
- **WHEN** el usuario visualiza un movimiento de tipo `DirectCost` que tiene un costo directo y una Orden de Servicio vinculada
- **THEN** el sistema muestra en la columna de origen la descripción o categoría del costo directo junto con el número de orden de servicio identificable

## ADDED Requirements

### Requirement: Filtro de período con controles independientes y persistencia
El Libro Diario DEBE proveer selectores de fecha independientes para "Fecha Desde" y "Fecha Hasta" con sus respectivos calendarios. El formulario DEBE validar que la Fecha Desde no sea posterior a la Fecha Hasta, mostrando un mensaje de error y deshabilitando la acción de filtrar si las fechas son inconsistentes. Asimismo, el rango de fechas seleccionado DEBE persistir en el almacenamiento local del navegador (`localStorage`) y restablecerse automáticamente al recargar la vista o volver a ingresar al módulo.

#### Scenario: Usuario selecciona rango de fechas válido
- **WHEN** el usuario ingresa una "Fecha Desde" menor o igual a "Fecha Hasta" y presiona Filtrar
- **THEN** el sistema consulta los movimientos en dicho rango y persiste las fechas en `localStorage`

#### Scenario: Usuario ingresa fechas inconsistentes
- **WHEN** el usuario selecciona una "Fecha Desde" posterior a la "Fecha Hasta"
- **THEN** el sistema marca el error de validación en el formulario, impide la búsqueda y notifica la incoherencia

#### Scenario: Usuario recarga o reingresa al Libro Diario
- **WHEN** el usuario ingresa nuevamente a la pantalla de Movimientos Contables habiendo seleccionado previamente un rango
- **THEN** el sistema recupera automáticamente el período guardado en `localStorage` y ejecuta la carga con dicho filtro

### Requirement: Visualización y edición de Orden de Servicio en Pagos de Costo Directo
En el formulario modal de edición de movimientos contables, cuando el movimiento corresponde a un Pago de Costo Directo (`sourceType = DirectCost`), el campo etiquetado como "Orden de Servicio" DEBE exhibir el número identificador de la Orden de Servicio vinculada (obtenido a través de la API en `serviceOrderNumber`) y no la descripción o concepto del costo directo.

#### Scenario: Usuario edita un movimiento de costo directo con orden asociada
- **WHEN** el usuario abre para edición un movimiento de egreso de costo directo asociado a la orden "OS-2026-0005"
- **THEN** el campo "Orden de Servicio" muestra el valor "OS-2026-0005" como referencia de la orden seleccionada
