# accounting-ui Specification

## Purpose
Interfaces de usuario para visualizar y registrar movimientos contables con soporte para orígenes polimórficos.

## Requirements

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

### Requirement: Visualización de orígenes en listados
La tabla principal de movimientos contables debe mostrar información consolidada e inteligible para el usuario sobre de dónde provino o hacia dónde fue el movimiento.

#### Scenario: Usuario visualiza la grilla de movimientos
- **WHEN** el usuario ingresa a la sección de Movimientos Contables
- **THEN** observa una columna "Origen" que contiene una etiqueta del tipo de origen y el identificador de negocio de la entidad asociada (ej. "Orden de Servicio - OS-00123" o "Compra de Activo - Camioneta Hilux").

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

### Requirement: Conversión de un movimiento individual a Transferencia Interna
El formulario de edición de un movimiento contable que NO forma parte de una Transferencia Interna (`TransferGroupId` nulo, incluyendo Ingresos o Egresos manuales que usan las categorías "Transferencia Interna" sin estar vinculados) DEBE permitir cambiar su "Tipo de Movimiento" a "Transferencia entre Cuentas". Al confirmar dicho cambio, el sistema DEBE eliminar el movimiento individual original y crear en su lugar una Transferencia Interna nueva (ambas patas, vinculadas por `TransferGroupId`) con los datos ingresados en el formulario.

#### Scenario: Usuario convierte un Ingreso manual en una Transferencia Interna
- **WHEN** el usuario edita un movimiento de Ingreso existente (categoría "Transferencia Interna (Ingreso)", sin `TransferGroupId`), cambia el "Tipo de Movimiento" a "Transferencia entre Cuentas", completa Cuenta Origen y Cuenta Destino, y confirma
- **THEN** el sistema elimina el movimiento de Ingreso original y crea una Transferencia Interna nueva (dos movimientos vinculados) con el monto, fecha y cuentas indicados

#### Scenario: Advertencia antes de convertir
- **WHEN** el usuario selecciona "Transferencia entre Cuentas" mientras edita un movimiento existente
- **THEN** el formulario muestra un aviso indicando que el movimiento actual se eliminará y se creará una Transferencia Interna nueva en su lugar

### Requirement: Categorías reservadas del sistema para Transferencias Internas
Las categorías "Transferencia Interna (Ingreso)" y "Transferencia Interna (Egreso)" DEBEN marcarse como reservadas del sistema (`IsSystemDefault = true`) y asignarse automáticamente por el backend al crear una transferencia. Estas categorías NO DEBEN ofrecerse como opción seleccionable en el formulario de carga manual de Ingresos o Egresos, y NO DEBEN poder editarse ni eliminarse desde la interfaz de gestión de categorías de movimiento.

#### Scenario: Categorías de sistema ausentes en el selector de un movimiento manual
- **WHEN** el usuario abre el formulario para cargar un nuevo Ingreso o Egreso manual
- **THEN** el selector de Categoría no incluye "Transferencia Interna (Ingreso)" ni "Transferencia Interna (Egreso)"

#### Scenario: Intento de editar o eliminar una categoría de sistema
- **WHEN** el usuario intenta editar o eliminar, desde la sección de Categorías de Movimiento, una categoría marcada como `IsSystemDefault`
- **THEN** el sistema rechaza la operación (backend) y la interfaz oculta las acciones de editar/eliminar para esa categoría, mostrando en su lugar una indicación de que es una categoría reservada del sistema
