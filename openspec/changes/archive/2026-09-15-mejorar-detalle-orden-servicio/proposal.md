## Why

La pantalla de Detalle de Orden de Servicio (`service-order-detail`) es la vista de consulta más utilizada del ciclo de vida de una OS, pero hoy subutiliza severamente el modelo de datos y los componentes ya construidos:

1. **Información financiera incompleta y engañosa**: solo se muestran "Monto Total" y "Monto Cobrado"; faltan Monto Presupuestado, Descuento, Monto en Moneda Extranjera y cotizaciones. Peor aún, los montos se formatean con el pipe genérico `currency` de Angular (moneda/locale del navegador) **ignorando por completo** `currencyCode`/`currencySymbol` de la orden, mostrando cifras potencialmente incorrectas para órdenes presupuestadas en moneda extranjera.
2. **Fechas del ciclo de vida incompletas**: de los 7 campos de fecha del modelo (`requestDate`, `createdAt`, `estimatedStartDate`, `estimatedEndDate`, `actualStartDate`, `actualEndDate`, `collectionDate`, `canceledAt`) solo se muestran 2 ("Inicio Estimado" y "Fin Real"), dificultando entender en qué etapa real está la orden.
3. **Prioridad sin jerarquía visual**: a diferencia del Estado (que sí tiene badge de color e ícono), la Prioridad se muestra como texto plano, perdiendo la señal visual de urgencia que sí existe en el resto de la aplicación.
4. **Funcionalidad ya construida pero no conectada a esta vista**:
   - El componente de Bitácora/Observaciones (`ServiceOrderObservationsComponent`), con línea de tiempo por colores y alta de notas, está completamente implementado y sólo se usa en el formulario de edición.
   - Las Actividades Operativas (`ServiceOrderActivity[]`) existen en el modelo y se cargan en el formulario, pero no tienen ninguna vista de solo lectura.
   - El endpoint `GET /api/service-orders/{id}/movements` y el método `ServiceOrderService.getMovements()` ya existen en el backend/servicio pero **ningún componente los invoca**. Esto es además una brecha de cumplimiento con el requisito ya aprobado "Desglose de Movimientos de Cobro en la Orden de Servicio" (`openspec/specs/service-orders/spec.md`), que exige explícitamente esta tabla "en la vista... de la Orden de Servicio".
   - La pestaña "Costos Directos" del detalle sólo muestra 6 de las columnas del modelo (omite Fecha, Pagado por, Medio de Pago, Estado y Observaciones) y no implementa el badge "Vía Movimientos", el candado de bloqueo ni el desglose de subtotales por origen (Manual vs. Vía Movimientos) que el requisito "Desglose de Subtotales por Origen" y "Protección Integral de Costos Directos Originados en Movimientos" (`openspec/specs/service-orders/direct-costs/spec.md`) ya exigen para la grilla de la Orden de Servicio.
5. **Distribución Financiera incompleta**: se muestra el porcentaje y el "Monto Esperado" de cada concepto, pero no el "Monto Real Destinado" (`actualAmount`) ni una fila totalizadora, a diferencia del formulario de edición.
6. **Equipo de Trabajo recortado**: solo se listan nombre y cargo de cada responsable; se omiten título, especialidades y el usuario del sistema vinculado.
7. **Sin acciones rápidas desde el detalle**: para marcar una orden "Iniciada" como "Entregada" el usuario debe volver al listado, aunque ya está viendo el detalle completo de esa misma orden.
8. **Organización visual plana**: las dos únicas tarjetas ("Información General" y "Finanzas y Fechas") mezclan conceptos de distinta naturaleza (datos descriptivos, fechas y montos en la misma tarjeta), y no existe ninguna señal visual del avance del ciclo de vida de la orden (Alta → Presupuestada → Aprobada → Iniciada → Entregada → Cobrada) ni del progreso de cobro.

## What Changes

- **Reorganizar las tarjetas de "Detalles Generales"** en tres bloques temáticos: Información General (datos descriptivos), Fechas (los 7 campos de fecha del ciclo de vida, formateados `dd/MM/yyyy` o "N/A"), y Finanzas (Presupuestado, Descuento, Total Final, Cobrado con barra de progreso de % cobrado, todo formateado con la moneda real de la orden).
- **Agregar un stepper/línea de tiempo del estado del ciclo de vida** (Alta → Presupuestada → Aprobada → Iniciada → Entregada → Cobrada, con tratamiento visual distinto para "Cancelada") en la cabecera del detalle.
- **Agregar badge de Prioridad con color e ícono**, con la misma convención visual que el badge de Estado existente.
- **Corregir el formateo monetario** para usar `currencyCode`/`currencySymbol` de la orden (con fallback a la moneda base) en todos los montos del detalle, y mostrar `foreignAmount`/cotizaciones cuando la orden esté presupuestada en moneda extranjera.
- **Ampliar "Equipo de Trabajo"** para mostrar título, especialidades y usuario vinculado de cada responsable, no solo nombre y cargo.
- **Completar "Distribución Financiera"** agregando "Monto Real Destinado" por fila y una fila totalizadora (Porcentaje / Esperado / Real) con resaltado si la suma de porcentajes no es 100%, replicando el comportamiento ya definido para el formulario.
- **Agregar una pestaña "Bitácora"** que reutiliza `ServiceOrderObservationsComponent` en modo lectura + alta de notas (sin editar/reordenar), disponible directamente desde el detalle sin tener que entrar a edición.
- **Agregar una pestaña "Actividades"** de solo lectura que liste las Actividades Operativas de la orden (detalle corto/largo, estado, barra de progreso alineada a la derecha).
- **Agregar una sección/tabla "Movimientos de Cobro Vinculados"** dentro de la pestaña "Detalles Generales" (o pestaña propia), consumiendo el endpoint ya existente `GET /{id}/movements`: Fecha, Monto, Cuenta Financiera, Medio de Pago, Descripción y totalizador que concilie con "Monto Cobrado". Esto cierra la brecha de cumplimiento descrita en la sección "Why".
- **Enriquecer la pestaña "Costos Directos"** agregando las columnas faltantes (Fecha, Pagado por, Medio de Pago, Estado, Observaciones), el badge "Vía Movimientos" con ícono de candado para filas `IsFromMovement == true`, y el desglose de subtotales por origen (Manual / Vía Movimientos / Total) en el pie de tabla — cerrando la brecha de cumplimiento con `service-orders/direct-costs`.
- **Agregar acción rápida "Marcar como Entregada"** en la cabecera del detalle, visible sólo cuando el estado actual es "Iniciada", reutilizando el mismo flujo de confirmación y lógica ya implementados para el listado.
- **Mejorar estados vacíos**: reemplazar los mensajes de texto plano ("Sin distribución definida.", "No hay responsables asignados.") por estados vacíos con ícono y mensaje guía, consistentes con el resto de la aplicación.

## Capabilities

### New Capabilities
- `service-orders/order-detail-view`: Define la organización visual, el contenido y las acciones rápidas de la vista de solo lectura "Detalle de Orden de Servicio", incluyendo el stepper de ciclo de vida, el formateo monetario consciente de moneda, y la integración de Bitácora, Actividades y Movimientos de Cobro Vinculados como secciones/pestañas de esta vista.

### Modified Capabilities
- Ninguna. Las mejoras a la pestaña de Costos Directos (columnas, badge "Vía Movimientos" y subtotales por origen) y a la tabla de Movimientos de Cobro Vinculados no modifican requisitos: implementan requisitos ya aprobados en `service-orders/direct-costs` y `service-orders` que actualmente no están cumplidos en esta vista (ver "Why").

## Impact

- **Frontend**: `service-order-detail.component.ts/html/scss` (reestructuración de tarjetas, nuevo stepper, nuevas pestañas), reutilización de `ServiceOrderObservationsComponent` en modo lectura, nuevo componente de lista de Actividades (o adaptación del bloque ya usado en `service-order-form`), nuevo componente/tabla de Movimientos Vinculados, ampliación de `directCostsColumns`/`directCostsDataSource`.
- **Servicios existentes reutilizados sin cambios de contrato**: `ServiceOrderService.getMovements()`, `ServiceOrderService.markAsDelivered()` (o equivalente ya usado en `service-order-list`), `ServiceOrderService.addObservation()`/`deleteObservation()`.
- **Sin cambios de API/backend**: todos los endpoints necesarios (`GET /{id}`, `GET /{id}/movements`, observaciones, costos directos) ya existen.
- **Compatibilidad**: sin cambios en contratos de datos; es una mejora exclusivamente de UI/UX sobre datos ya disponibles.
