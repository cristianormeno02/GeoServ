## Purpose
Libro de movimientos de stock (InventoryMovement) para trazar compras, usos en OS, ajustes (positivos/negativos) y consumos internos, calculando el stock actual dinámicamente.

## ADDED Requirements

### Requirement: Registro de libro de movimientos
El sistema debe registrar todas las variaciones de stock en la tabla InventoryMovement, detallando el tipo de movimiento y el responsable.

#### Scenario: Ajuste negativo de inventario sin OS
- **WHEN** un insumo es mermado, dañado o hay un faltante de stock, y se realiza un ajuste negativo
- **THEN** el sistema guarda un movimiento con MovementType = AjusteNegativo, con un Motivo obligatorio, sin necesidad de especificar ServiceOrderId.

#### Scenario: Consumo interno de un insumo
- **WHEN** un insumo se utiliza para fines internos de la empresa y no para una Orden de Servicio específica
- **THEN** el sistema guarda un movimiento con MovementType = ConsumoInterno, y el ServiceOrderId no está presente.

### Requirement: Cálculo dinámico de stock
El sistema debe calcular el stock disponible de un consumible de manera dinámica sumando sus movimientos.

#### Scenario: Consulta de stock disponible de un insumo
- **WHEN** un usuario consulta el stock de un Consumable
- **THEN** el stock actual es igual a SUM(Cantidad) de todos los InventoryMovement relacionados a dicho consumible, y no proviene de un campo persistido en la tabla Consumable.
