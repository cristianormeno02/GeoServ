## 1. Corrección del Listado de Movimientos en Historial de Insumos

- [x] 1.1 Actualizar `InventoryHistoryDialogComponent` para usar `MatTableDataSource<InventoryMovement>` y `ChangeDetectorRef`, asegurando la asignación reactiva de datos al cargar movimientos desde la API y verificando que la tabla renderice inmediatamente al abrir el diálogo.
- [x] 1.2 Agregar plantilla de estado vacío en el modal de historial cuando la lista de movimientos esté vacía, verificando que se muestre un mensaje informativo adecuado.

## 2. Incorporación del Monto Cobrado en Listado de Órdenes de Servicio

- [x] 2.1 Agregar la columna `'collectedAmount'` a `displayedColumns` en `ServiceOrderListComponent` e insertar el contenedor `<ng-container matColumnDef="collectedAmount">` en `service-order-list.component.html` con encabezado "Cobrado" y pipe de moneda, verificando su correcta disposición.
- [x] 2.2 Ajustar el `colspan` en la fila `*matNoDataRow` de la tabla de órdenes de servicio a 8 columnas para mantener la consistencia del ancho al filtrar sin coincidencias.

## 3. Verificación Integral

- [x] 3.1 Ejecutar la compilación del frontend (`npm run build` o `ng build`) para validar que no existan errores de tipos o enlaces en las plantillas.
- [x] 3.2 Validar el comportamiento interactivo: apertura del historial de insumos mostrando movimientos sin guardar previamente, y visualización conjunta de monto presupuestado y cobrado en el listado de OS.
