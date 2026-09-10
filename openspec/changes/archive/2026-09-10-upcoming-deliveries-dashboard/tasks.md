## 1. Backend - Endpoints de Próximas Entregas y Pruebas TDD

- [x] 1.1 Escribir pruebas unitarias iniciales (TDD Red) en `OperationalDashboardKpisTests.cs` para el endpoint `/api/dashboard/operational/upcoming-deliveries` validando la distribución en los 4 buckets semafóricos (≤7 días en rojo incluyendo vencidas, 8-14 días en amarillo, 15-30 días en verde, >30 días neutro) y la exclusión de órdenes en estado Entregada, Cobrada o Cancelada. Verificar que las pruebas fallen con `dotnet test`.
- [x] 1.2 Implementar el endpoint `/api/dashboard/operational/upcoming-deliveries` en `OperationalDashboardEndpoints.cs` para clasificar las órdenes no entregadas con `EstimatedEndDate` y verificar que las pruebas pasen en verde con `dotnet test`.
- [x] 1.3 Escribir pruebas e implementar el endpoint paginado `/api/dashboard/operational/upcoming-deliveries/details` para retornar el listado de órdenes correspondiente al rango seleccionado (Id, Nº Orden, Cliente, Tipo de Servicio, Fecha Estimada de Entrega, Días Restantes) y verificar su funcionamiento con `dotnet test`.

## 2. Frontend - Modelos, Servicios y Componente de Visualización

- [x] 2.1 Definir las interfaces `UpcomingDeliveriesBucket` y `UpcomingDeliveryOrder` en `operational-dashboard.model.ts` y verificar que los tipos compilen sin errores.
- [x] 2.2 Agregar las llamadas al servicio `operational-dashboard.service.ts` para obtener los datos consolidados y el detalle paginado por bucket, verificando que no existan errores de tipado.
- [x] 2.3 Extender `AgingBarChartComponent` con `@Input() isClickable` y `@Output() bucketClick` para soportar interacciones y estilos visuales al interactuar con las barras, verificando el comportamiento en pruebas o renderizado.

## 3. Frontend - Integración en Dashboard Operativo y Modal Interactivo

- [x] 3.1 Incorporar el widget de "Próximas Entregas (Compromisos pactados)" en `operational-dashboard.component.html` y enlazar su lógica de carga y actualización en `operational-dashboard.component.ts`.
- [x] 3.2 Implementar el manejador de clic en el dashboard para abrir el modal con el listado detallado de órdenes del bucket seleccionado, con chips semafóricos y botón para navegar a la orden de servicio.
- [x] 3.3 Verificar que el layout sea responsivo y consistente con los otros widgets del dashboard operativo ejecutando `npm run build` o verificando en navegador.

## 4. Verificación Integral y Revisión Final

- [x] 4.1 Ejecutar la suite completa de pruebas unitarias de backend con `dotnet test` y verificar que no existan regresiones.
- [x] 4.2 Ejecutar la verificación de frontend (`ng test` o `npm run build`) para garantizar integridad del build.
- [x] 4.3 Realizar revisión de código conforme a `superpowers-code-review` asegurando que todos los escenarios de la especificación delta queden cubiertos.
