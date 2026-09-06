## MODIFIED Requirements

### Requirement: Interfaz de registro polimórfico
El formulario de creación y edición de movimientos contables debe solicitar al usuario el tipo de origen antes de permitirle seleccionar el origen específico, cargando las entidades correspondientes según el tipo seleccionado y ocultando campos no relevantes.

#### Scenario: Usuario registra movimiento de compra de activo
- **WHEN** el usuario selecciona AssetPurchase como Tipo de Origen (SourceType)
- **THEN** el sistema muestra un buscador/desplegable exclusivamente de Activos para asignar al campo SourceId, y oculta el buscador de Órdenes de Servicio.

#### Scenario: Usuario registra o edita movimiento de pago de gasto fijo
- **WHEN** el usuario selecciona FixedCostPayment ("Pago de Gasto Fijo") como Tipo de Origen (SourceType) en un movimiento de egreso
- **THEN** el sistema consulta los gastos fijos activos (`GET /api/fixed-cost-items`) y muestra el desplegable de Origen Específico con el listado de gastos fijos para seleccionar su identificador (`SourceId`).

#### Scenario: Persistencia al editar un movimiento con origen polimórfico
- **WHEN** el usuario edita y guarda un movimiento contable que tiene asignado un origen polimórfico (`SourceType` y `SourceId`)
- **THEN** el sistema preserva y persiste tanto el `SourceType` como el `SourceId` sin restablecer el origen a Manual.
