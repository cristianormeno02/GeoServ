## ADDED Requirements

### Requirement: Registro de Transferencias Internas entre Cuentas
El formulario de movimientos contables DEBE ofrecer, además de Ingreso y Egreso, un tercer modo "Transferencia entre Cuentas" que reemplace la selección de categoría y origen polimórfico por dos selectores: Cuenta Origen y Cuenta Destino. Al confirmar, el sistema DEBE crear ambos movimientos (Egreso en origen, Ingreso en destino) de forma atómica y vinculada mediante un identificador de grupo (`TransferGroupId`) común, sin requerir que el usuario cargue cada pata por separado.

#### Scenario: Usuario registra una transferencia entre dos cuentas propias
- **WHEN** el usuario selecciona "Transferencia entre Cuentas", elige Cuenta Origen "Caja" y Cuenta Destino "Banco", ingresa monto y fecha, y confirma
- **THEN** el sistema crea un movimiento de Egreso en "Caja" y uno de Ingreso en "Banco", ambos con el mismo `TransferGroupId`, mismo monto y fecha, y actualiza el saldo de ambas cuentas en consecuencia

#### Scenario: Usuario intenta transferir a la misma cuenta seleccionada como origen
- **WHEN** el usuario selecciona la misma cuenta como Origen y como Destino
- **THEN** el sistema rechaza la operación con un mensaje de validación explícito, sin crear ningún movimiento

#### Scenario: Usuario intenta transferir entre cuentas de distinta moneda
- **WHEN** la Cuenta Origen y la Cuenta Destino seleccionadas tienen monedas (`CurrencyId`) diferentes
- **THEN** el sistema rechaza la operación con un mensaje de validación explícito, sin crear ningún movimiento

### Requirement: Integridad de edición y eliminación de Transferencias Internas
Un movimiento contable que forma parte de una Transferencia Interna (posee `TransferGroupId` asignado) NO DEBE poder editarse ni eliminarse de forma individual desde el flujo genérico de movimientos. Su eliminación DEBE realizarse únicamente a través de la acción dedicada que elimina ambas patas de la transferencia de forma atómica. Los movimientos que no forman parte de una transferencia (`TransferGroupId` nulo, incluyendo todo el histórico registrado antes de esta funcionalidad) conservan el comportamiento de edición y eliminación individual sin cambios.

#### Scenario: Usuario intenta editar individualmente una pata de una transferencia
- **WHEN** el usuario intenta editar o eliminar, desde el listado general, un movimiento que tiene `TransferGroupId` asignado
- **THEN** el sistema rechaza la operación e indica que debe eliminarse la transferencia completa

#### Scenario: Usuario elimina una transferencia completa
- **WHEN** el usuario elimina una transferencia desde el listado
- **THEN** el sistema elimina ambas patas (origen y destino) de forma atómica, y ninguna queda huérfana

#### Scenario: Movimiento histórico sin vínculo de transferencia
- **WHEN** el usuario edita o elimina un movimiento cargado antes de esta funcionalidad (sin `TransferGroupId`), incluyendo aquellos que usan las categorías "Transferencia Interna (Ingreso/Egreso)" cargadas manualmente
- **THEN** el sistema permite la edición/eliminación individual exactamente como lo hacía antes de este cambio

### Requirement: Visualización de Transferencias Internas en el listado
La tabla principal de movimientos contables DEBE mostrar, para los movimientos de tipo Transferencia Interna, una etiqueta identificable junto con la cuenta origen y la cuenta destino involucradas.

#### Scenario: Usuario visualiza una transferencia en la grilla de movimientos
- **WHEN** el usuario ingresa a la sección de Movimientos Contables y existe una Transferencia Interna registrada
- **THEN** observa en la columna Origen una etiqueta "Transferencia Interna" junto con la referencia "Cuenta Origen → Cuenta Destino"
