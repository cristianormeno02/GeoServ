## Purpose
Soporte para movimientos contables de distintos orígenes (ServiceOrderIncome, AssetPurchase, etc.) e independencia de órdenes de servicio, incluyendo vistas planas para reportes.

## ADDED Requirements

### Requirement: Registro polimórfico de movimientos contables
El sistema debe permitir registrar movimientos contables asociados a diversos orígenes, eliminando la dependencia obligatoria de una Orden de Servicio.

#### Scenario: Movimiento contable sin ServiceOrder
- **WHEN** se registra un movimiento por una compra de activo (AssetPurchase) o un costo fijo (FixedCostPayment)
- **THEN** el sistema registra el movimiento con SourceType igual al tipo correspondiente y SourceId apuntando a la tabla origen, y el movimiento no tiene un ServiceOrderId obligatorio.

### Requirement: Consulta a través de vista consolidada
El sistema debe proveer una vista aplanada para facilitar la consulta de reportes financieros sin recurrir a joins complejos a nivel de aplicación.

#### Scenario: Reporte financiero consulta vista consolidada
- **WHEN** un reporte financiero requiere los datos de los movimientos contables
- **THEN** la consulta se realiza a la entidad keyless mapeada contra la vista SQL w_AccountingMovementDetail, la cual devuelve el contexto de negocio según el SourceType y SourceId.
