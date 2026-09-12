## 1. Backend: Endpoint de Entrega y Reglas de Negocio

- [ ] 1.1 Implementar el endpoint `POST /api/service-orders/{id}/deliver` en `backend/GeoServ.Api/Endpoints/ServiceOrderEndpoints.cs` que resuelva las fechas reales (`actualEndDate` en fecha actual si es nula, `actualStartDate` en fecha presupuestada o actual si es nula), asigne el estado "Entregada", ejecute la validación con `ValidateServiceOrderRules`, cree la observación de auditoría tipo "Hito Clave" y guarde los cambios atómicamente. Verificar compilando con `dotnet build backend/GeoServ.Api`.
- [ ] 1.2 Añadir pruebas unitarias en `backend/GeoServ.Api.Tests/ServiceOrderValidationTests.cs` (o nueva clase de pruebas de entrega) para validar la resolución de fechas por defecto, el rechazo ante datos incompletos y la transición exitosa. Verificar ejecutando `dotnet test backend/GeoServ.Api.Tests`.

## 2. Frontend: Servicio y Acción en Listado

- [ ] 2.1 Extender `frontend/src/app/features/service-orders/services/service-order.service.ts` agregando el método `markAsDelivered(id: string)` apuntando a `/api/service-orders/${id}/deliver`. Verificar compilación del servicio.
- [ ] 2.2 Actualizar `frontend/src/app/features/service-orders/components/service-order-list/service-order-list.component.html` y `.ts` para incorporar el botón de acción "Marcar como entregada" (icono `task_alt` con tooltip explicativo), condicionado estrictamente a `row.statusName === 'Iniciada'`. Integrar apertura de `ConfirmDialogComponent`, invocación a `markAsDelivered`, feedback vía `MatSnackBar` (éxito y manejo de error descriptivo) y recarga de órdenes mediante `loadOrders()`. Verificar compilando con `npm run build` en el directorio `frontend`.

## 3. Verificación Integral

- [ ] 3.1 Ejecutar prueba manual o integrada verificando que al marcar como entregada una orden en estado "Iniciada" se complete la fecha de entrega real con la fecha actual, se establezca la fecha de inicio real con la presupuestada, el estado pase a "Entregada", se genere el hito en la bitácora y el botón de acción deje de estar visible para dicha fila.
