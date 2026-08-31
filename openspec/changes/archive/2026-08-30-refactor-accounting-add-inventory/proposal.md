## Why

Actualmente, `AccountingMovement` asume una relación obligatoria y directa con `ServiceOrder`, lo cual es incorrecto, ya que no todos los movimientos financieros provienen de una orden de servicio (ej. compra de activos). Además, el cálculo de inventario se basa en "compras menos usos" (o contadores en la entidad `Consumable`), lo cual carece de trazabilidad para mermas, ajustes y consumos internos. Esta propuesta resuelve estos problemas mediante un origen polimórfico para los movimientos contables y un libro de movimientos de inventario (`InventoryMovement`).

## What Changes

- Modificar `AccountingMovement` para tener un origen polimórfico (`SourceType`, `SourceId`), permitiendo registrar movimientos que provienen de `ServiceOrder`, compras de activos, costos fijos o directos.
- Eliminar la dependencia obligatoria de `AccountingMovement` hacia `ServiceOrder`.
- Remover el campo de monto de otras tablas si solo duplica el de `AccountingMovement`, manteniendo campos locales solo si representan un valor de negocio distinto (ej. costo incurrido vs. pagado).
- Crear una vista SQL (`vw_AccountingMovementDetail`) mapeada como entidad keyless en EF Core para consultas en reportes financieros.
- Crear la entidad `InventoryMovement` para llevar un libro de movimientos de stock (compras, usos, ajustes, consumo interno), eliminando campos de stock estáticos en `Consumable`.
- **BREAKING**: El cálculo de stock de consumibles ahora debe hacerse sumando la cantidad en `InventoryMovement`, y los movimientos contables ya no tendrán el campo obligatorio `ServiceOrderId`.

## Capabilities

### New Capabilities
- ccounting: Soporte para movimientos contables de distintos orígenes (ServiceOrderIncome, AssetPurchase, etc.) e independencia de órdenes de servicio, incluyendo vistas planas para reportes.
- inventory: Libro de movimientos de stock (`InventoryMovement`) para trazar compras, usos en OS, ajustes (positivos/negativos) y consumos internos, calculando el stock actual dinámicamente.

### Modified Capabilities

## Impact

- **Modelo de Datos y EF Core**: Cambios de esquema en `AccountingMovement`, creación de `InventoryMovement` y `vw_AccountingMovementDetail`. Se requieren configuraciones en `OnModelCreating` (ej. índices, conversiones de enum).
- **Servicios de Aplicación**: Los servicios que registran movimientos contables y variaciones de inventario deberán adaptarse a las nuevas estructuras y validaciones polimórficas (ej. validación del `SourceId` en la capa de aplicación).
- **Consultas y Reportes**: Las vistas financieras deberán leer de la nueva vista keyless en lugar de hacer joins directamente o basarse en `ServiceOrderId`.
- **Migración de Datos**: Se requerirán scripts para migrar datos existentes a la nueva estructura en cada base de datos de los tenants.
