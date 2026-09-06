## Purpose

Permite consultar la situación financiera consolidada de la empresa (cuentas bancarias, saldos y cheques en cartera) en una sola vista.

## ADDED Requirements

### Requirement: Consulta de Resumen Financiero
El sistema SHALL exponer la información consolidada de cuentas financieras y cheques para la toma de decisiones.

#### Scenario: Obtener datos consolidados exitosamente
- **WHEN** un usuario autenticado solicita el resumen financiero
- **THEN** el sistema devuelve la lista de cuentas con sus saldos calculados, el detalle de cheques y un resumen agrupado por estado de cheque
