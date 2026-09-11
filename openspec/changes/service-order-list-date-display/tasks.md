## 1. Lógica de Resolución y Datos en Componente Frontend

- [x] 1.1 Implementar el método auxiliar `getOrderDateInfo(row)` en `ServiceOrderListComponent` con el orden de prioridad (`actualEndDate` > `estimatedEndDate` > `createdAt`), asignando fecha, icono de Material, texto explicativo para tooltip y clase visual.
- [x] 1.2 Configurar el `sortingDataAccessor` en `MatTableDataSource` para que la columna de fecha ordene adecuadamente por el valor temporal resuelto de cada orden y verificar agregando tests unitarios en `service-order-list.component.spec.ts`.

## 2. Actualización de Plantilla y Estilos Visuales

- [x] 2.1 Modificar `service-order-list.component.html` para actualizar la cabecera a "Fecha" y renderizar en la celda el icono, la fecha formateada en `dd/MM/yyyy` y el tooltip descriptivo con `matTooltip`.
- [x] 2.2 Ajustar en `service-order-list.component.scss` la alineación flex, espaciado y colores de los iconos para entrega real, presupuestada y fecha de alta.

## 3. Verificación Integral

- [x] 3.1 Ejecutar las pruebas unitarias del frontend (`npm test -- --watch=false`) y comprobar que la lógica de resolución, filtrado y ordenamiento responde según la especificación.
- [x] 3.2 Ejecutar la compilación del frontend (`npm run build`) para verificar que no existan errores de tipos ni de plantillas.
