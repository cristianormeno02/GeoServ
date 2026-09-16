# financial-summary

## Purpose

Permite consultar la situación financiera consolidada de la empresa (cuentas bancarias, saldos y cheques en cartera) en una sola vista.

## Requirements

### Requirement: Consulta de Resumen Financiero
El sistema SHALL exponer la información consolidada de cuentas financieras y cheques para la toma de decisiones.

#### Scenario: Obtener datos consolidados exitosamente
- **WHEN** un usuario autenticado solicita el resumen financiero
- **THEN** el sistema devuelve la lista de cuentas con sus saldos calculados, el detalle de cheques y un resumen agrupado por estado de cheque

### Requirement: Visualización amigable de tipos de cuentas bancarias
La grilla de cuentas financieras en el Resumen Financiero DEBE presentar las tipologías de cuenta con etiquetas comprensibles en español. No se deben mostrar en la interfaz de usuario cadenas técnicas en inglés o con erratas (`BankAccount`, `Cash`, `DigitalWallet`). Las etiquetas legibles DEBEN ser: "Cuenta Bancaria" para `BankAccount`, "Efectivo" para `Cash` y "Billetera Digital" para `DigitalWallet`.

#### Scenario: Visualización de cuentas en la tabla de resumen
- **WHEN** el usuario consulta el listado de cuentas en el Resumen Financiero
- **THEN** la columna "Tipo" muestra "Cuenta Bancaria", "Efectivo" o "Billetera Digital" según corresponda en lugar del valor de enumeración técnico
