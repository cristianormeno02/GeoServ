## ADDED Requirements

### Requirement: Visualización amigable de tipos de cuentas bancarias
La grilla de cuentas financieras en el Resumen Financiero DEBE presentar las tipologías de cuenta con etiquetas comprensibles en español. No se deben mostrar en la interfaz de usuario cadenas técnicas en inglés o con erratas (`BankAccount`, `Cash`, `DigitalWallet`). Las etiquetas legibles DEBEN ser: "Cuenta Bancaria" para `BankAccount`, "Efectivo" para `Cash` y "Billetera Digital" para `DigitalWallet`.

#### Scenario: Visualización de cuentas en la tabla de resumen
- **WHEN** el usuario consulta el listado de cuentas en el Resumen Financiero
- **THEN** la columna "Tipo" muestra "Cuenta Bancaria", "Efectivo" o "Billetera Digital" según corresponda en lugar del valor de enumeración técnico
