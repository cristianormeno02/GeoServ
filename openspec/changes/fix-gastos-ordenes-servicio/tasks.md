## 1. Migraciones de Base de Datos y Modelo (Backend)

- [x] 1.1 Añadir propiedad `OrderIndex` (entero) a la entidad `ServiceOrderCollectionDistribution` (o equivalente) y generar migración. Verificar que la base de datos se actualice correctamente.
- [x] 1.2 Añadir propiedad `OrderIndex` a la entidad `ServiceOrderActivity` (o equivalente) y generar migración. Verificar la creación de la columna en base de datos.
- [x] 1.3 Añadir propiedad `OrderIndex` a la entidad `ServiceOrderDirectCost` (o equivalente) y generar migración. Verificar que el script de migración sea válido.

## 2. Corrección de Gastos Fijos (Backend y Frontend)

- [x] 2.1 Modificar el mapeo o servicio de inserción de `FixedExpense` para asegurar que los vencimientos asociados (colección de fechas) se persistan correctamente en base de datos. Verificar guardando un gasto fijo y revisando la tabla en DB.
- [x] 2.2 Modificar el endpoint GET y repositorio de `FixedExpense` para incluir (e.g. `.Include(x => x.Expirations)`) la colección de vencimientos. Verificar mediante un request HTTP directo que el JSON de respuesta contenga el arreglo.
- [x] 2.3 Ajustar o verificar en el Frontend (Angular/React) que el formulario envíe los vencimientos correctamente y que la vista de detalle los muestre a partir del JSON recibido. Verificar operando en la UI de creación y edición.

## 3. Persistencia de Orden en Órdenes de Servicio (Backend y Frontend)

- [x] 3.1 Backend: Modificar los endpoints de lectura (`GET /api/service-orders/{id}` y `GET /.../direct-costs`) para que ordenen las colecciones (`Distributions`, `Activities`, `DirectCosts`) usando la columna `OrderIndex` (ej. `.OrderBy(x => x.OrderIndex)`). Verificar mediante un request de prueba.
- [x] 3.2 Backend: Modificar el endpoint de creación y actualización de Orden de Servicio y el de Costos Directos para que mapeen y guarden el campo `OrderIndex` que provenga del DTO. Verificar con Swagger que los índices se persistan.
- [x] 3.3 Frontend: Modificar el submit de la orden (`service-order-form.component.ts`) para asignar explícitamente el índice del array como `orderIndex` a cada elemento de `distributions`, `activities` y `directCosts` (si aplican en batch) antes de enviarlos. Si los costos directos se guardan en el acto tras reordenar (drag & drop arrows), invocar al backend para actualizar el orden, o asegurar que el guardado general lo contemple. Verificar moviendo filas en UI y recargando la página para confirmar que el orden se mantiene.

## 4. Borrado de Observaciones de la Bitácora (Backend y Frontend)

- [x] 4.1 Backend: Crear un nuevo endpoint `DELETE /api/service-orders/{id}/observations/{observationId}` en `ServiceOrderEndpoints.cs`. Debe recibir ambos IDs, verificar existencia y pertenencia (u obligar a que sea rol Administrador/responsable) y eliminar el registro de base de datos.
- [x] 4.2 Frontend: Modificar `service-order.service.ts` para invocar al endpoint DELETE.
- [x] 4.3 Frontend: Modificar `service-order-observations.component.ts` (o `service-order-form.component.ts` si está incrustado) añadiendo un botón de 'Eliminar' (ícono basurero) en cada observación. Añadir la lógica de llamado al servicio, confirmación (`window.confirm` o dialog), y remover de la lista local en caso de éxito. Verificar borrando una observación de prueba y recargando la página.
