## 1. Módulos y Servicios de Angular

- [x] 1.1 Crear/Actualizar el DTO MovementSourceType en el modelo TypeScript de la API de Angular (verificar mapeo con el enum de C#).
- [x] 1.2 Actualizar el servicio AccountingMovementService para enviar los campos sourceType y sourceId en los métodos de POST y PUT (verificar payloads).
- [x] 1.3 Crear el modelo `InventoryMovement` y actualizar `Consumable` eliminando el mapeo explícito de `.quantity` estático desde el modelo base (verificar tipado).
- [x] 1.4 Crear `InventoryMovementService` para consumir (GET) y enviar (POST) movimientos de inventario de un insumo (verificar que los métodos HTTP estén correctamente definidos).

## 2. Formularios de Movimientos Contables

- [x] 2.1 Modificar el componente del formulario de Movimientos Contables para reemplazar el listado único de Órdenes por un `<mat-select>` (o equivalente) del tipo de origen (`MovementSourceType`).
- [x] 2.2 Implementar lógica condicional mediante `valueChanges` del control anterior para hacer la petición HTTP correspondiente (ej. al elegir `DirectCost`, pedir la lista de Costos Directos) y volcar los resultados en un segundo `<mat-select>` (verificar UX de carga de datos).
- [x] 2.3 Adaptar la tabla de grilla general de Movimientos Contables para mostrar las nuevas columnas de tipo y detalle leyendo del objeto aplanado que devuelve el nuevo GET.

## 3. Interfaces de Inventario

- [x] 3.1 Remover del formulario de Insumos (`ConsumableFormComponent`) la edición directa del campo Cantidad en caso de ser actualización; opcionalmente dejarlo solo para inicializar en un alta nueva.
- [x] 3.2 Crear el componente modal `InventoryMovementHistoryComponent` con una tabla que liste los movimientos de un insumo seleccionado.
- [x] 3.3 Integrar un botón "Ver Historial" en cada fila de la grilla principal de insumos que lance el modal anterior (verificar apertura correcta con paso de ID).

## 4. Registro de Movimientos Manuales

- [x] 4.1 En el modal (o un sub-componente dialog), agregar la opción para "Registrar Movimiento Manual".
- [x] 4.2 Crear un pequeño `FormGroup` con `MovementType` (AjustePositivo, AjusteNegativo, ConsumoInterno), `Cantidad` y `Motivo` (requerido dinámicamente si es Ajuste) (verificar estado y validación del form).
- [x] 4.3 Al someter el formulario manual, enviar la llamada vía el `InventoryMovementService`, cerrar el modal y refrescar la tabla/stock general.
