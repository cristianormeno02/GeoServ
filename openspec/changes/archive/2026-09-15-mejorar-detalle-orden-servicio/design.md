## Context

El componente `service-order-detail` (`frontend/src/app/features/service-orders/components/service-order-detail/`) es una vista de solo lectura con 3 pestañas Material (`Detalles Generales`, `Documentos Adjuntos`, `Costos Directos`) alimentada por `GET /api/service-orders/{id}`. El modelo `ServiceOrder` (`models/service-order.model.ts`) expone ~30 campos, de los cuales el detalle sólo renderiza una fracción reducida (ver `proposal.md`).

Existen tres piezas ya construidas y probadas en el formulario de edición que este cambio reutiliza en modo lectura, sin modificar su lógica interna:
- `ServiceOrderObservationsComponent`: línea de tiempo de bitácora con alta de notas, ya conectada a `POST/DELETE /{id}/observations`.
- El bloque de Actividades Operativas dentro de `service-order-form` (FormArray + `CopyOperativeActivitiesDialogComponent`), del cual solo se reutiliza el criterio visual (badges de estado, barra de progreso alineada a la derecha), no el formulario editable.
- `ServiceOrderService.getMovements(orderId)`, que ya golpea `GET /{id}/movements` (`ServiceOrderEndpoints.cs:786`) y devuelve `{ Items: [{Date, Amount, Description, FinancialAccountName, PaymentMethodName}], Total }`.

El detalle actualmente usa el pipe genérico `| currency` de Angular en 4 lugares (líneas 70, 74, 120, 213 del template), que no recibe el código de moneda de la orden. El modelo sí expone `currencyCode`/`currencySymbol`/`foreignAmount`/`exchangeRateAtBudget`/`exchangeRateAtCollection`, por lo que la corrección es de presentación, no requiere cambios de API.

## Goals / Non-Goals

**Goals:**
- Elevar la vista de detalle al mismo nivel de completitud de datos que el formulario de edición, sin convertirla en editable (salvo la alta de notas de bitácora, que ya es un flujo independiente y aditivo).
- Reutilizar exclusivamente componentes/servicios ya existentes; no se crean nuevos endpoints ni se modifican contratos de API.
- Dar jerarquía visual clara al estado y prioridad de la orden, y visibilidad inmediata del avance financiero (% cobrado) y de ciclo de vida (stepper).
- Cerrar las brechas de cumplimiento ya identificadas contra `service-orders` y `service-orders/direct-costs` (movimientos vinculados, subtotales de costos directos por origen, badges "Vía Movimientos").

**Non-Goals:**
- No se implementa generación/descarga de PDF de presupuesto (mencionada como uso futuro de `budgetedTasksDetail` en el spec de `service-orders`, pero sin endpoint ni diseño definidos hoy); queda fuera de alcance de este cambio.
- No se rediseña el formulario de creación/edición (`service-order-form`); los cambios son exclusivos de la vista de solo lectura.
- No se agrega edición inline de Actividades ni de Movimientos de Cobro desde el detalle; ambas secciones son de solo lectura en esta vista (la única excepción es la alta de notas de Bitácora, que ya funciona así en el formulario).
- No se modifica el modelo de datos ni se agregan campos nuevos al backend: todos los campos usados ya existen en `ServiceOrder`/`ServiceOrderActivity`/`ServiceOrderObservation`/el DTO de movimientos.

## Decisions

### 1. Reestructuración de tarjetas en "Detalles Generales"
- Se reemplazan las 2 tarjetas actuales (`Información General`, `Finanzas y Fechas`) por 3 tarjetas: `Información General` (Cliente, Proyecto, Tipo de Servicio, Estado, Prioridad, Descripción — igual que hoy más el badge de Prioridad), `Fechas` (Fecha de Solicitud, Fecha de Alta, Inicio/Fin Presupuestado, Inicio/Fin Real, Fecha de Cobro, Fecha de Cancelación si `canceledAt` no es nulo) y `Finanzas` (Monto Presupuestado, Descuento, Monto Total, Monto Cobrado con barra de progreso `collectedAmount / totalAmount`, moneda y, si `currencyCode !== monedaBase`, Monto en Moneda Extranjera y cotizaciones).
- **Alternativa considerada**: mantener 2 tarjetas y solo agregar filas. Rechazada porque mezclar 11+ campos heterogéneos en una sola tarjeta reduce el escaneo visual; 3 tarjetas temáticas siguen el patrón de acordeones ya usado en el formulario (`Cronograma y Trazabilidad` separado de `Gestión Financiera y Presupuesto`).

### 2. Stepper de ciclo de vida
- Se agrega un stepper horizontal (Angular Material `mat-stepper` en modo lineal deshabilitado, solo lectura) en la cabecera con los estados `Alta, Presupuestada, Aprobada, Iniciada, Entregada, Cobrada`, resaltando el estado actual. Si `status === 'Cancelada'`, se reemplaza el stepper por un badge de estado terminal distintivo en lugar de intentar ubicarla en la secuencia lineal.
- **Alternativa considerada**: badges de texto en línea ("Alta > Presupuestada > ..."). Rechazada por menor legibilidad y por no aprovechar el componente Material ya usado en otras partes de la suite (ver spec `ui/crud-table` y convenciones Material 3 del proyecto).

### 3. Formateo monetario consciente de moneda
- **Decisión final (más simple que la explorada inicialmente)**: la aplicación ya registra el locale `es-AR` globalmente (`LOCALE_ID` y `registerLocaleData(localeEsAr, 'es-AR')` en `app.config.ts`), que formatea con separador de miles con punto y decimales con coma para cualquier código de moneda ISO. El problema no era el locale sino que el pipe se invocaba sin parámetros (`{{ monto | currency }}`), heredando en silencio el `DEFAULT_CURRENCY_CODE` global (`'ARS'`) en vez del código real de la orden. La corrección es parametrizar cada uso existente como `{{ monto | currency:(order.currencyCode || 'ARS'):'symbol':'1.2-2':'es-AR' }}`, sin necesidad de un pipe propio.
- Cuando `currencyCode` de la orden sea distinto de `'ARS'` y `foreignAmount` tenga valor, se muestra una línea secundaria "Monto en moneda extranjera: {{foreignAmount}} {{currencyCode}} (cotización {{exchangeRateAtBudget}})" bajo el campo Moneda.
- **Alternativa considerada**: escribir un pipe/helper de formateo propio. Descartada tras confirmar que el locale `es-AR` ya está registrado globalmente y que Angular's `currency` pipe, parametrizado con el código de moneda de la orden, ya produce el formato correcto sin código adicional que mantener.

### 4. Nuevas pestañas "Bitácora" y "Actividades"
- `Bitácora`: se monta `ServiceOrderObservationsComponent` tal cual, sin flags nuevos — el componente ya soporta alta/eliminación de notas de forma independiente al modo edición del formulario padre; se agrega como 4ª pestaña.
- `Actividades`: se crea una lista de solo lectura (no un nuevo `FormArray`) que consume `order.activities`, mostrando Detalle corto, Estado (badge) y Porcentaje de Avance con barra de progreso alineada a la derecha, replicando el criterio visual ya usado en `service-order-form.component.html:344-388` pero sin controles de edición ni reordenamiento.
- **Alternativa considerada**: embeber Bitácora y Actividades como secciones colapsables dentro de "Detalles Generales" en vez de pestañas nuevas. Rechazada por el volumen potencial de contenido (bitácora con muchas notas, actividades con muchos ítems) y para mantener consistencia con el patrón de pestañas ya usado por "Costos Directos" y "Documentos Adjuntos".

### 5. Sección "Movimientos de Cobro Vinculados"
- Se agrega como tarjeta propia en la columna principal (no dentro de la tarjeta `Finanzas`, que quedó en la barra lateral): tabla con Fecha, Cuenta Financiera, Medio de Pago, Descripción, Monto, y fila totalizadora que debe coincidir con `collectedAmount`. Se carga con `ServiceOrderService.getMovements(order.id)` en `ngOnInit`, en paralelo con la orden y los costos directos, siguiendo el mismo patrón de carga ya usado por `loadDirectCosts()` en este componente (carga eager, no perezosa por pestaña) — se prefirió consistencia con el patrón existente del componente por sobre la carga perezosa originalmente explorada, dado el bajo volumen esperado de filas.
- **Alternativa considerada**: pestaña dedicada "Cobros". Rechazada por bajo volumen esperado de filas (movimientos de ingreso por orden) frente a Costos Directos; una tarjeta dentro de la pestaña "Detalles Generales" mantiene el contexto financiero unificado sin agregar una pestaña adicional.

### 6. Enriquecimiento de la grilla de Costos Directos
- Se agregan columnas `date`, `paidByName`, `paymentMethodName`, `status`, `observations` a `directCostsColumns`/`directCostsDataSource`.
- Filas con `isFromMovement === true` reciben clase CSS distintiva, badge "Vía Movimientos" e ícono de candado (`mat-icon: lock`) con `matTooltip` explicativo, sin acciones de editar/eliminar (ya es de solo lectura, por lo que no hay acciones que bloquear, pero el badge/candado deben mostrarse igual por consistencia visual con el formulario).
- El pie de tabla agrega 3 filas/columnas totalizadoras: "Costo Manual", "Costo Vía Movimientos", "Costo Directo Total" (ya definidas en el requisito "Desglose de Subtotales por Origen").
- **Alternativa considerada**: dejar la grilla del detalle simplificada como está y solo enriquecer el formulario. Rechazada porque el requisito de `service-orders/direct-costs` ya exige estas columnas/badges "en la Orden de Servicio" sin distinguir formulario de detalle, y porque el detalle es la vista más consultada para auditar costos.

### 7. Acción rápida "Marcar como Entregada"
- Se agrega un botón en la cabecera del detalle, visible solo si `order.statusName === 'Iniciada'`, que reutiliza el mismo diálogo de confirmación y el mismo método de servicio ya usados en `service-order-list.component.ts`, y refresca `order` localmente tras la confirmación (sin recargar toda la página).
- **Alternativa considerada**: mantener la acción solo en el listado. Rechazada porque obliga a un flujo de ida y vuelta innecesario cuando el usuario ya está viendo el detalle completo de la orden que quiere marcar como entregada.

## Risks / Trade-offs

- **[Riesgo de regresión visual en clientes con moneda base ARS sin conversión]** → **Mitigación**: el nuevo formateador debe comportarse de forma idéntica al actual cuando `currencyCode` coincide con la moneda base (caso mayoritario hoy), verificado con capturas antes/después.
- **[Riesgo de carga adicional por la tabla de Movimientos Vinculados en órdenes con muchos cobros parciales]** → **Mitigación**: la carga es perezosa (solo al visualizar la pestaña, igual que Costos Directos hoy) y el endpoint ya soporta paginación (`Items`/`Total`) si se requiere en el futuro.
- **[Riesgo de duplicar lógica visual de Actividades entre el formulario y la nueva vista de solo lectura]** → **Mitigación**: extraer los estilos de badge de estado y barra de progreso a clases/componentes compartidos reutilizables desde ambos lugares, en vez de copiar CSS.
- **[Riesgo de que el stepper de ciclo de vida confunda estados no lineales, como una orden "Cancelada" desde "Presupuestada"]** → **Mitigación**: tratar "Cancelada" como estado terminal fuera de la secuencia del stepper (ver Decisión 2), mostrando desde qué etapa se canceló solo como dato textual si se dispone de esa información en la bitácora.
