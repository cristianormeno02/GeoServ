## 1. Preparación de Modelos y Servicios

- [x] 1.1 Verificar y enriquecer `ConsumableService` y el modelo `Consumable` si es necesario para asegurar que proveen los datos requeridos (Stock actual, mínimo, costo, unidad). Verificación: Ejecutar una petición al backend o revisar los logs de red del servicio existente para confirmar que están los campos.

## 2. Desarrollo del UI: KPIs y Filtros

- [x] 2.1 Actualizar `inventario.component.ts` agregando la lógica para calcular y almacenar el Valor Total, Insumos Críticos, Insumos Agotados y Total Activos. Verificación: Imprimir los valores calculados por consola y corroborar que coinciden con los datos esperados.
- [x] 2.2 Diseñar y codificar en `inventario.component.html` las tarjetas (cards) superiores para mostrar los KPIs. Verificación: Observar visualmente que las tarjetas renderizan correctamente en el navegador con estilos de Angular Material.
- [x] 2.3 Implementar la barra de herramientas de filtrado (Buscador por texto, Selector de Clase, Selector de Estado). Verificación: Los controles renderizan correctamente en el UI y capturan el valor de búsqueda.

## 3. Desarrollo del UI: Tabla de Datos

- [x] 3.1 Implementar la `mat-table` con las columnas requeridas (Insumo, Clase, Stock Actual, Stock Mínimo, Unidad, Costo Unitario, Valorización Total, Estado Visual, Acciones) y configurar el paginador y ordenador. Verificación: La tabla muestra correctamente los datos.
- [x] 3.2 Aplicar lógica de semaforización en la columna de Estado (Verde > Mínimo, Amarillo <= Mínimo, Rojo == 0) utilizando estilos CSS o Angular Material Chips. Verificación: Observar que filas con stock bajo o cero muestran el estado correcto.
- [x] 3.3 Conectar los filtros del paso 2.3 con el `MatTableDataSource` para que filtren los registros visibles y actualicen dinámicamente los KPIs. Verificación: Ingresar un texto en el buscador y verificar que los registros disminuyen y los KPIs se recalculan solos.

## 4. Acciones Adicionales y Exportación

- [x] 4.1 Integrar la acción "Ver Historial" en cada fila para abrir el `InventoryHistoryDialogComponent` correspondiente al id de insumo. Verificación: Hacer clic en la acción y confirmar que el modal se abre con los movimientos del insumo.
- [x] 4.2 Implementar la función de Exportar a CSV conectada a un botón, tomando los datos renderizados actualmente en la tabla. Verificación: Hacer clic en Exportar y verificar que se descarga un archivo CSV con las columnas correctas.
