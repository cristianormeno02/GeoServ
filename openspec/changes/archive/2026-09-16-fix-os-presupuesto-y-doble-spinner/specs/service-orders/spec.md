## MODIFIED Requirements

### Requirement: Manejo Multimoneda y Catálogo de Monedas
El sistema DEBE soportar presupuestación y cobranza dinámica utilizando múltiples monedas.
- **Catálogo de Monedas**: Debe existir una tabla maestra de monedas (`Currency`) que almacene su `Code` (ej. USD, CLP, ARS), su `Symbol` (ej. $) y su `Name` (ej. Dólar, Peso Chileno).
- Al crear o editar el presupuesto en la Orden de Servicio, la moneda presupuestada se seleccionará obligatoriamente desde este catálogo a través de un combo/selector.
- Si la moneda seleccionada es la moneda base (ej. ARS), el campo "Monto Presupuestado (Base)" SHALL ser editable directamente por el usuario de forma inmediata tanto en creación como en edición de la orden, sin requerir cambiar o re-seleccionar la moneda.
- Si la moneda seleccionada es distinta a la moneda base (ej. ARS), el sistema debe habilitar el campo "Monto en Moneda Extranjera" y requerir la "Cotización al Presupuestar" para calcular automáticamente el "Monto Presupuestado" en la moneda base.
- Al registrar el cobro, el sistema debe permitir ingresar el monto cobrado y la "Cotización a la Fecha de Cobro" si aplica.

#### Scenario: Presupuesto en moneda extranjera
- **WHEN** el usuario selecciona una moneda distinta a la moneda base al presupuestar la orden
- **THEN** el sistema habilita el campo "Monto en Moneda Extranjera" y requiere la "Cotización al Presupuestar" para calcular el Monto Presupuestado en moneda base

#### Scenario: Edición de monto presupuestado en moneda base al abrir orden existente
- **WHEN** el usuario abre una Orden de Servicio existente cuya moneda asignada es la moneda base (ej. ARS) para su edición
- **THEN** el sistema SHALL habilitar de forma inmediata el campo "Monto Presupuestado (Base)" como editable, manteniendo resuelta la moneda sin requerir cambio manual de divisa
