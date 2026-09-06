# Diseño Técnico: Carga y Persistencia de Costos Directos en Origen de Movimientos

## Contexto y Diagnóstico
En `MovimientoFormComponent`, cuando el usuario elige la categoría de egreso y selecciona el tipo de origen "Costo Directo" (`DirectCost`), se ejecuta:
```typescript
this.http.get<any[]>(environment.apiUrl + '/direct-costs')
```
El backend no exponía `/api/direct-costs` (solo `/api/service-orders/{serviceOrderId}/direct-costs`), resultando en un 404 HTTP y dejando vacía la lista de opciones.

## Decisiones Técnicas

1. **Exponer `/api/direct-costs` en `DirectCostEndpoints.cs`**:
   - Mapear `group = app.MapGroup("/api/direct-costs").RequireAuthorization();`
   - Implementar `GET /api/direct-costs` proyectando:
     - `Id`, `Description`, `TotalAmount`, `Date`, `Status`, `ServiceOrderId`
     - `ServiceOrderNumber = c.ServiceOrder != null ? c.ServiceOrder.OrderNumber : null`
     - `CategoryName = c.Category != null ? c.Category.Name : null`
     - `ProviderName = c.Provider != null ? c.Provider.Name : null`
   - Implementar `GET /api/direct-costs/{id:guid}` para lectura individual.
   - Mantener sin ninguna alteración las rutas existentes `/api/service-orders/{serviceOrderId}/direct-costs`.

2. **Sincronización Relacional en `AccountingMovementEndpoints.cs`**:
   - En `POST /api/movements`: Cuando `SourceType == MovementSourceType.DirectCost` y `SourceId` es un GUID válido, asignar `movement.DirectCostId = directCostId`. Asimismo, asignar `FixedCostId`, `ServiceOrderId` y `AssetId` para sus respectivos tipos.
   - En `PUT /api/movements/{id}`: Preservar la asignación de `movement.DirectCostId` cuando `sourceType == MovementSourceType.DirectCost`.
   - En `GET /api/movements`: Incluir `.Include(m => m.DirectCost).ThenInclude(dc => dc!.ServiceOrder)`.

3. **Formateo Amigable en `movimiento-form.component.ts`**:
   - Para `type === 'DirectCost'`, construir la etiqueta:
     `[OS #<ServiceOrderNumber>] <Description> (<CategoryName>) - $<TotalAmount>`
   - Mantener las funciones de mapeo de `ServiceOrderIncome`, `FixedCostPayment` y `AssetPurchase` exactamente como están.
