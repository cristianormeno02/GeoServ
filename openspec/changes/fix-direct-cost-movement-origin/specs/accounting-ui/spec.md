## MODIFIED Requirements

### Requirement: Interfaz de registro polimórfico
El formulario de creación y edición de movimientos contables debe solicitar al usuario el tipo de origen antes de permitirle seleccionar el origen específico, cargando las entidades correspondientes según el tipo seleccionado y ocultando campos no relevantes.

#### Scenario: Usuario registra o edita movimiento de costo directo
- **WHEN** el usuario selecciona DirectCost ("Costo Directo") como Tipo de Origen (SourceType) en un movimiento de egreso
- **THEN** el sistema consulta los costos directos (`GET /api/direct-costs`) y muestra el desplegable de Origen Específico con el listado de costos directos (incluyendo identificación de orden de servicio, descripción, categoría y monto) para seleccionar su identificador (`SourceId`).

#### Scenario: Persistencia relacional de movimiento con costo directo
- **WHEN** el usuario registra o edita un movimiento contable con `SourceType` igual a `DirectCost` y un `SourceId` válido
- **THEN** el backend persiste el movimiento asignando tanto el `SourceType` y `SourceId` como la clave foránea relacional `DirectCostId`.
