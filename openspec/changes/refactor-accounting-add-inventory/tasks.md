## 1. Modelo y migración de AccountingMovement

- [x] 1.1 Agregar enum `MovementSourceType` (Manual, DirectCost, FixedCostPayment, AssetPurchase, ServiceOrderIncome) y configurar conversión de tipo en `OnModelCreating` (verificar compilación de la entidad).
- [x] 1.2 Agregar `SourceId` nullable, eliminar la restricción obligatoria de `ServiceOrderId` y agregar índice compuesto `(SourceType, SourceId)` (verificar que EF Core genere el modelo correctamente).
- [x] 1.3 Crear la migración inicial de EF Core que aplica los cambios de esquema para `AccountingMovement` y verificar con `dotnet ef migrations script`.

## 2. Vista SQL y mapeo keyless

- [x] 2.1 Escribir el script SQL para crear la vista `vw_AccountingMovementDetail` con los LEFT JOIN polimórficos correspondientes (verificar su sintaxis).
- [x] 2.2 Crear la entidad C# para representar la vista mapeándola con `HasNoKey().ToView(...)` en EF Core (verificar compilación de DbContext).
- [x] 2.3 Agregar la creación de la vista SQL a la migración generada en la fase 1 (verificar el script resultante).

## 3. Modelo y migración de InventoryMovement

- [x] 3.1 Crear la entidad `InventoryMovement` con las propiedades Id, ConsumableId, Cantidad, MovementType, ServiceOrderId, Motivo, Fecha, UserId (verificar modelo).
- [x] 3.2 Remover cualquier campo estático de cálculo de stock en la tabla `Consumable` (verificar limpieza de modelo).
- [x] 3.3 Generar migración de EF Core para la creación de `InventoryMovement` y ajustes en `Consumable` (verificar con script de migración).

## 4. Validaciones de dominio

- [x] 4.1 Implementar validaciones en `InventoryMovement` (ej: ServiceOrderId requerido si UsoEnOS, Motivo si Ajuste*) en servicios/entidad (verificar mediante unit tests o aserciones de dominio).
- [x] 4.2 Asegurar que el cálculo de stock se realice de forma dinámica con `SUM(Cantidad)` (verificar con tests de repositorios/servicios).

## 5. Actualización de servicios de aplicación

- [x] 5.1 Refactorizar la creación de `AccountingMovement` en los servicios de negocio para usar el origen polimórfico correcto según el contexto de creación, y no inyectar nulls accidentalmente (verificar compilación y tests funcionales).
- [x] 5.2 Centralizar el valor del Monto en `AccountingMovement` evitando actualizar campos equivalentes en tablas secundarias a menos que representen datos distintos (verificar lógicas de actualización).

## 6. Plan de migración de datos existentes por tenant

- [x] 6.1 Escribir script o paso de migración que convierta los `ServiceOrderId` existentes de `AccountingMovement` hacia la convención `SourceType = ServiceOrderIncome` y `SourceId` sin pérdida de datos (verificar lógica de actualización SQL).
- [x] 6.2 Proveer las instrucciones sobre cómo aplicar iterativamente esta migración en la base de datos de cada tenant, documentando el procedimiento (verificar instrucciones provistas en documentación de despliegue).
