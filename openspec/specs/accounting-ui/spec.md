# accounting-ui Specification

## Purpose
Interfaces de usuario para visualizar y registrar movimientos contables con soporte para orígenes polimórficos.

## Requirements

### Requirement: Interfaz de registro polimórfico
El formulario de creación y edición de movimientos contables NO DEBE solicitar al usuario un "Tipo de Origen" (`SourceType`) de forma manual. En su lugar, el `SourceType` DEBE derivarse automáticamente de la categoría (`MovementCategory.LinkedSourceType`) seleccionada: si la categoría no tiene vínculo (`LinkedSourceType = null`), el movimiento es `Manual`; si lo tiene, el formulario DEBE abrir el buscador modal correspondiente a ese tipo de origen en lugar de un desplegable con el listado completo de la entidad relacionada.

#### Scenario: Usuario selecciona una categoría vinculada a Compra de Activo
- **WHEN** el usuario selecciona, en un movimiento de Egreso, una categoría cuyo `LinkedSourceType` es `AssetPurchase`
- **THEN** el sistema fija `SourceType = AssetPurchase` sin mostrar un selector de "Tipo de Origen", y habilita el botón para abrir el buscador modal de Activos

#### Scenario: Usuario selecciona una categoría sin vínculo de origen
- **WHEN** el usuario selecciona una categoría cuyo `LinkedSourceType` es `null`
- **THEN** el sistema fija `SourceType = Manual` y no muestra ningún buscador de origen específico

#### Scenario: Usuario registra movimiento de compra de activo
- **WHEN** el usuario selecciona, en un movimiento de Egreso, una categoría cuyo `LinkedSourceType` es `AssetPurchase`
- **THEN** el sistema fija `SourceType = AssetPurchase` y muestra un buscador modal de Activos (búsqueda por texto contra el backend) para asignar el `SourceId`, sin ofrecer un desplegable con el listado completo ni un buscador de Órdenes de Servicio

#### Scenario: Usuario registra o edita movimiento de pago de gasto fijo
- **WHEN** el usuario selecciona, en un movimiento de Egreso, una categoría cuyo `LinkedSourceType` es `FixedCostPayment`
- **THEN** el sistema fija `SourceType = FixedCostPayment` y abre el buscador modal de Gastos Fijos, que primero busca el `FixedCostItem` por texto y luego, si es recurrente, lista sus vencimientos para elegir el `SourceId`/`FixedCostPaymentId` puntual

#### Scenario: Persistencia al editar un movimiento con origen polimórfico
- **WHEN** el usuario edita y guarda un movimiento contable que tiene asignado un origen polimórfico (`SourceType` y `SourceId`)
- **THEN** el sistema preserva y persiste tanto el `SourceType` como el `SourceId` sin restablecer el origen a Manual

#### Scenario: Movimiento histórico con categoría sin `LinkedSourceType` configurado
- **WHEN** el usuario abre para edición un movimiento histórico cuyo `SourceType` no es `Manual` pero cuya categoría actual tiene `LinkedSourceType = null` (categoría creada antes de esta funcionalidad)
- **THEN** el sistema respeta el `SourceType`/`SourceId` ya guardados en el movimiento y permite editarlos mediante el buscador modal correspondiente, sin exigir que la categoría tenga el vínculo configurado para poder guardar sin cambios

### Requirement: Visualización de orígenes en listados
La tabla principal de movimientos contables DEBE mostrar información consolidada e inteligible para el usuario sobre el origen o destino del movimiento. En movimientos de egreso originados en Pagos de Costo Directo (`DirectCost`) asociados a una Orden de Servicio, la columna de origen DEBE mostrar tanto la referencia o concepto del costo directo como el número de la Orden de Servicio asociada (ej. "Canon Secretaria (OS: OS-2026-0012)").

#### Scenario: Usuario visualiza la grilla de movimientos
- **WHEN** el usuario ingresa a la sección de Movimientos Contables
- **THEN** observa una columna "Origen" que contiene una etiqueta del tipo de origen y el identificador de negocio de la entidad asociada (ej. "Orden de Servicio - OS-00123" o "Compra de Activo - Camioneta Hilux")

#### Scenario: Movimiento de pago de costo directo vinculado a Orden de Servicio
- **WHEN** el usuario visualiza un movimiento de tipo `DirectCost` que tiene un costo directo y una Orden de Servicio vinculada
- **THEN** el sistema muestra en la columna de origen la descripción o categoría del costo directo junto con el número de orden de servicio identificable

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

### Requirement: Vínculo entre Categoría de Movimiento y tipo de origen
Toda `MovementCategory` DEBE admitir un campo opcional `LinkedSourceType` que indique con qué tipo de origen polimórfico se relaciona. Las categorías de Ingreso (`IsIncome = true`) SOLO pueden tener `LinkedSourceType` en `{null, ServiceOrderIncome}`. Las categorías de Egreso (`IsIncome = false`) SOLO pueden tener `LinkedSourceType` en `{null, AssetPurchase, FixedCostPayment, DirectCost}`. El backend DEBE rechazar cualquier combinación fuera de estas reglas al crear o editar una categoría.

#### Scenario: Usuario vincula una categoría de Ingreso a Cobro de Orden de Servicio
- **WHEN** el usuario crea o edita una categoría de Ingreso y selecciona "Cobro de Orden de Servicio" como vínculo
- **THEN** el sistema guarda `LinkedSourceType = ServiceOrderIncome` para esa categoría

#### Scenario: Usuario intenta vincular una categoría de Ingreso a Compra de Activo
- **WHEN** el usuario intenta guardar una categoría con `IsIncome = true` y `LinkedSourceType = AssetPurchase`
- **THEN** el sistema rechaza la operación con un mensaje de validación explícito

#### Scenario: Usuario vincula una categoría de Egreso a Pago de Gasto Fijo
- **WHEN** el usuario crea o edita una categoría de Egreso y selecciona "Pago de Gasto Fijo" como vínculo
- **THEN** el sistema guarda `LinkedSourceType = FixedCostPayment` para esa categoría

#### Scenario: Usuario visualiza el vínculo en el listado de categorías
- **WHEN** el usuario ingresa a la sección de Categorías de Movimiento
- **THEN** observa, para cada categoría, una indicación de su vínculo con origen (o "Sin vínculo" si `LinkedSourceType` es `null`)

### Requirement: Filtrado de categorías por tipo de movimiento
El selector de Categoría en el formulario de movimientos DEBE mostrar únicamente categorías activas cuyo `IsIncome` coincida con el modo de movimiento elegido (Ingreso/Egreso) y que no sean de sistema (`IsSystemDefault`).

#### Scenario: Usuario carga un Ingreso
- **WHEN** el usuario selecciona "Ingreso" como Tipo de Movimiento
- **THEN** el selector de Categoría muestra únicamente categorías con `IsIncome = true`, activas y no reservadas del sistema

### Requirement: Buscador modal de Orden de Servicio para Cobros
Cuando el `SourceType` derivado sea `ServiceOrderIncome`, el formulario de movimientos DEBE ofrecer un buscador modal de Órdenes de Servicio con búsqueda por texto contra el backend (no un desplegable con el listado completo), permitiendo localizar la orden por número o por cliente.

#### Scenario: Usuario busca una Orden de Servicio para vincular un cobro
- **WHEN** el usuario, con una categoría de Ingreso vinculada a `ServiceOrderIncome`, abre el buscador y escribe parte del número de orden o del nombre del cliente
- **THEN** el sistema consulta el backend con ese texto y muestra hasta 20 resultados coincidentes, permitiendo seleccionar uno como `SourceId`

### Requirement: Buscador modal de Activos para Compras
Cuando el `SourceType` derivado sea `AssetPurchase`, el formulario de movimientos DEBE ofrecer un buscador modal de Activos con búsqueda por texto contra el backend, en vez de un desplegable con el listado completo de activos.

#### Scenario: Usuario busca un Activo para vincular una compra
- **WHEN** el usuario, con una categoría de Egreso vinculada a `AssetPurchase`, abre el buscador y escribe parte del nombre del activo
- **THEN** el sistema consulta el backend con ese texto y muestra los activos coincidentes, permitiendo seleccionar uno como `SourceId`

### Requirement: Buscador modal de Costo Directo y visualización de su Orden asociada
Cuando el `SourceType` derivado sea `DirectCost`, el formulario de movimientos DEBE ofrecer un buscador modal de Costos Directos con búsqueda por texto (descripción, proveedor, categoría o número de orden) contra el backend. Al seleccionar un costo directo, el modal DEBE mostrar, en modo solo lectura, la Orden de Servicio a la que ese costo directo pertenece, sin permitir seleccionarla de forma independiente.

#### Scenario: Usuario busca y selecciona un Costo Directo
- **WHEN** el usuario, con una categoría de Egreso vinculada a `DirectCost`, busca por el número de una Orden de Servicio en el buscador
- **THEN** el sistema muestra los costos directos de esa orden coincidentes con la búsqueda, y al seleccionar uno, el modal exhibe la Orden de Servicio asociada como dato de solo lectura

### Requirement: Buscador modal de Gasto Fijo con selección de vencimiento
Cuando el `SourceType` derivado sea `FixedCostPayment`, el formulario de movimientos DEBE ofrecer un buscador modal de Gastos Fijos (`FixedCostItem`) con búsqueda por texto contra el backend. Tras seleccionar un Gasto Fijo, si este es recurrente (`IsRecurring = true`), el modal DEBE listar sus vencimientos (`FixedCostPayment`) para que el usuario elija el vencimiento puntual que está pagando; si no es recurrente, el sistema DEBE usar directamente su único vencimiento sin requerir un paso adicional de selección. El listado de vencimientos SOLO DEBE ofrecer como seleccionables los que están pendientes (`IsPaid = false`), salvo el que ya está vinculado al movimiento que se está editando (que debe verse preseleccionado aunque figure como pagado).

#### Scenario: Usuario paga un vencimiento de un Gasto Fijo recurrente
- **WHEN** el usuario busca y selecciona un Gasto Fijo con `IsRecurring = true` que tiene varios vencimientos cargados
- **THEN** el sistema muestra el listado de vencimientos de ese Gasto Fijo (fecha e importe) para que el usuario seleccione a cuál corresponde el movimiento, y guarda ese vencimiento como `SourceId`/`FixedCostPaymentId`

#### Scenario: Usuario paga un Gasto Fijo no recurrente
- **WHEN** el usuario busca y selecciona un Gasto Fijo con `IsRecurring = false` cuyo único vencimiento está pendiente (`IsPaid = false`)
- **THEN** el sistema vincula el movimiento directamente a su único vencimiento sin mostrar un paso adicional de selección de vencimientos

#### Scenario: Vencimientos ya pagados no son seleccionables
- **WHEN** el usuario, al crear un nuevo movimiento, abre el listado de vencimientos de un Gasto Fijo recurrente
- **THEN** el sistema muestra deshabilitados (o excluye) los vencimientos con `IsPaid = true`, permitiendo seleccionar únicamente los pendientes

#### Scenario: Gasto Fijo no recurrente cuyo único vencimiento ya está pagado
- **WHEN** el usuario busca un Gasto Fijo con `IsRecurring = false` cuyo único vencimiento ya tiene `IsPaid = true` (y no es el vinculado al movimiento que se está editando)
- **THEN** el sistema muestra ese Gasto Fijo deshabilitado en los resultados de búsqueda con la indicación "Ya pagado", sin permitir seleccionarlo

#### Scenario: El vencimiento vinculado se marca como pagado
- **WHEN** el usuario guarda un movimiento de Egreso vinculado a un vencimiento (`FixedCostPaymentId`) de un Gasto Fijo
- **THEN** el sistema marca ese vencimiento como `IsPaid = true`, registra `PaymentDate` con la fecha del movimiento y `PaymentMethodId` con el medio de pago del movimiento (si fue informado)

#### Scenario: Eliminación de un movimiento revierte el estado del vencimiento
- **WHEN** el usuario elimina un movimiento contable vinculado a un vencimiento de Gasto Fijo que dicho movimiento había marcado como pagado
- **THEN** el sistema revierte ese vencimiento a `IsPaid = false` y limpia `PaymentDate`/`PaymentMethodId`, sin eliminar el vencimiento en sí

#### Scenario: Edición de un movimiento reasigna el vencimiento vinculado
- **WHEN** el usuario edita un movimiento vinculado al vencimiento A de un Gasto Fijo y, mediante el buscador, lo reasigna al vencimiento B del mismo u otro Gasto Fijo
- **THEN** el sistema revierte el vencimiento A a `IsPaid = false` (limpiando `PaymentDate`/`PaymentMethodId`) y marca el vencimiento B como `IsPaid = true` con los datos del movimiento

#### Scenario: Edición de un movimiento sin cambiar el vencimiento vinculado
- **WHEN** el usuario edita un movimiento vinculado a un vencimiento y guarda sin cambiar el origen específico seleccionado, pero modifica la Fecha o el Medio de Pago del movimiento
- **THEN** el sistema conserva `IsPaid = true` en el vencimiento (no lo reprocesa) pero sincroniza `PaymentDate` y `PaymentMethodId` del vencimiento con los nuevos valores del movimiento

### Requirement: Obligatoriedad del origen específico para categorías vinculadas
Si la categoría seleccionada tiene `LinkedSourceType` distinto de `null`, el formulario de movimientos NO DEBE permitir guardar el movimiento sin haber seleccionado un origen específico (`SourceId`) a través del buscador modal correspondiente. El backend DEBE rechazar con `400` cualquier intento de crear o editar un movimiento en esa condición sin `SourceId`.

#### Scenario: Usuario intenta guardar sin seleccionar el origen específico
- **WHEN** el usuario elige una categoría con `LinkedSourceType` distinto de `null` y no completa la selección en el buscador modal correspondiente
- **THEN** el sistema impide guardar el movimiento (backend rechaza con `400`, y el frontend deshabilita el botón "Guardar" hasta que se seleccione un origen)

### Requirement: Autocompletado de Monto y Descripción desde el origen seleccionado
Al seleccionar un origen específico que tenga su propio importe y descripción (vencimiento de Gasto Fijo o Costo Directo), el formulario DEBE autocompletar los campos Monto y Descripción del movimiento con los valores de esa entidad, únicamente si el usuario no cargó previamente un valor en esos campos (Monto vacío o en 0; Descripción vacía).

#### Scenario: Autocompletado al seleccionar un vencimiento de Gasto Fijo
- **WHEN** el usuario, con el campo Monto en blanco, selecciona un vencimiento de un Gasto Fijo
- **THEN** el formulario completa el Monto con el importe del vencimiento y sugiere una Descripción que incluye el nombre del Gasto Fijo y la fecha de vencimiento

#### Scenario: No se sobrescribe un Monto ya cargado manualmente
- **WHEN** el usuario ya escribió un Monto distinto de 0 y luego selecciona un origen específico con importe propio
- **THEN** el formulario conserva el Monto ingresado manualmente sin sobrescribirlo

### Requirement: Corrección de la referencia de origen mostrada para pagos de Gasto Fijo
La consulta de listado de movimientos (`GET /api/movements`) DEBE construir la referencia de origen (`SourceReference`) de un movimiento con `SourceType = FixedCostPayment` a partir de `FixedCostPaymentId` (nombre del Gasto Fijo y fecha de vencimiento), en lugar del campo `FixedCostId` legado, que no resuelve a ningún registro real bajo la mecánica anterior.

#### Scenario: Usuario visualiza en el listado un pago de Gasto Fijo vinculado a un vencimiento
- **WHEN** el usuario visualiza en el listado de movimientos un Egreso con `SourceType = FixedCostPayment` y `FixedCostPaymentId` asignado
- **THEN** la columna Origen muestra el nombre del Gasto Fijo y la fecha del vencimiento pagado, en vez de un valor vacío

### Requirement: Visualización inmediata del origen al editar un movimiento
Al abrir el formulario de edición de un movimiento con origen polimórfico asignado (`ServiceOrderIncome`, `AssetPurchase`, `DirectCost` o `FixedCostPayment`), el sistema DEBE mostrar de inmediato una referencia descriptiva del origen específico (ej. nombre del activo, número de orden, o Gasto Fijo con su vencimiento), sin requerir que el usuario abra el buscador modal para verla.

#### Scenario: Usuario abre para edición un movimiento vinculado a un vencimiento de Gasto Fijo
- **WHEN** el usuario abre el formulario de edición de un Egreso con `SourceType = FixedCostPayment` y `FixedCostPaymentId` asignado
- **THEN** el sistema muestra de inmediato el nombre del Gasto Fijo y la fecha del vencimiento vinculado en el campo de origen específico, sin necesidad de abrir el buscador

### Requirement: Filtro de período con controles independientes y persistencia
El Libro Diario DEBE proveer selectores de fecha independientes para "Fecha Desde" y "Fecha Hasta" con sus respectivos calendarios. El formulario DEBE validar que la Fecha Desde no sea posterior a la Fecha Hasta, mostrando un mensaje de error y deshabilitando la acción de filtrar si las fechas son inconsistentes. Asimismo, el rango de fechas seleccionado DEBE persistir en el almacenamiento local del navegador (`localStorage`) y restablecerse automáticamente al recargar la vista o volver a ingresar al módulo.

#### Scenario: Usuario selecciona rango de fechas válido
- **WHEN** el usuario ingresa una "Fecha Desde" menor o igual a "Fecha Hasta" y presiona Filtrar
- **THEN** el sistema consulta los movimientos en dicho rango y persiste las fechas en `localStorage`

#### Scenario: Usuario ingresa fechas inconsistentes
- **WHEN** el usuario selecciona una "Fecha Desde" posterior a la "Fecha Hasta"
- **THEN** el sistema marca el error de validación en el formulario, impide la búsqueda y notifica la incoherencia

#### Scenario: Usuario recarga o reingresa al Libro Diario
- **WHEN** el usuario ingresa nuevamente a la pantalla de Movimientos Contables habiendo seleccionado previamente un rango
- **THEN** el sistema recupera automáticamente el período guardado en `localStorage` y ejecuta la carga con dicho filtro

### Requirement: Visualización y edición de Orden de Servicio en Pagos de Costo Directo
En el formulario modal de edición de movimientos contables, cuando el movimiento corresponde a un Pago de Costo Directo (`sourceType = DirectCost`), el campo etiquetado como "Orden de Servicio" DEBE exhibir el número identificador de la Orden de Servicio vinculada (obtenido a través de la API en `serviceOrderNumber`) y no la descripción o concepto del costo directo.

#### Scenario: Usuario edita un movimiento de costo directo con orden asociada
- **WHEN** el usuario abre para edición un movimiento de egreso de costo directo asociado a la orden "OS-2026-0005"
- **THEN** el campo "Orden de Servicio" muestra el valor "OS-2026-0005" como referencia de la orden seleccionada

### Requirement: Consulta de saldos por cuenta financiera en movimientos
Cuando el usuario filtre los movimientos financieros por una cuenta financiera específica (`financialAccountId`), el sistema DEBE calcular y retornar el saldo acumulado previo al período filtrado (`initialBalance`), la sumatoria de ingresos del período (`periodIncome`), la sumatoria de egresos del período (`periodExpense`) y el saldo al cierre del período (`finalBalance`), además del saldo resultante acumulado (`balanceAfter`) para cada movimiento listado.

#### Scenario: Usuario filtra por cuenta bancaria y período
- **WHEN** el usuario selecciona una cuenta financiera específica y un rango de fechas en el Libro Diario
- **THEN** el sistema calcula `initialBalance` sumando todos los movimientos de esa cuenta con fecha anterior a `startDate`
- **THEN** el sistema calcula los totales de ingresos y egresos dentro del rango de fechas
- **THEN** cada movimiento devuelto incluye `balanceAfter` reflejando el saldo acumulado tras la aplicación secuencial de dicho movimiento

#### Scenario: Usuario consulta sin filtrar por cuenta ("Todas las cuentas")
- **WHEN** el usuario consulta movimientos con el filtro de cuenta en "Todas"
- **THEN** el sistema no calcula saldo inicial ni saldo acumulado por fila, y la grilla oculta la columna de saldo para evitar inconsistencias entre cuentas heterogéneas

### Requirement: Barra de resumen de saldos en Libro Diario
La interfaz de usuario del Libro Diario DEBE mostrar un bloque de resumen de saldos destacado en la parte superior cuando se haya seleccionado una cuenta financiera específica.

#### Scenario: Visualización del bloque de resumen al seleccionar una cuenta
- **WHEN** el filtro de cuenta tiene seleccionada una cuenta financiera puntual
- **THEN** la interfaz muestra cuatro tarjetas o indicadores: "Saldo Inicial", "Ingresos (+)", "Egresos (-)" y "Saldo Final"
- **THEN** los montos se presentan con formato de moneda y colores semánticos correspondientes

#### Scenario: Ocultamiento del bloque de resumen en vista global
- **WHEN** el filtro de cuenta está en "Todas"
- **THEN** el bloque de resumen de saldos de cuenta se oculta automáticamente

### Requirement: Columna dinámica de saldo en grilla de movimientos
La grilla de movimientos DEBE incluir una columna "Saldo" únicamente cuando se encuentre filtrada una cuenta financiera puntual.

#### Scenario: Grilla con cuenta seleccionada
- **WHEN** el usuario aplica el filtro con una cuenta financiera seleccionada
- **THEN** la tabla incluye la columna "Saldo" mostrando el valor de `balanceAfter` formateado, con estilo visual de advertencia si el saldo es negativo

#### Scenario: Grilla sin cuenta seleccionada
- **WHEN** el usuario consulta con el selector de cuenta en "Todas"
- **THEN** la tabla excluye la columna "Saldo" de las columnas visibles
