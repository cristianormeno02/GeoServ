## 1. Reestructuración de "Detalles Generales" (Tarjetas y Prioridad)

- [x] 1.1 Dividir la tarjeta actual "Finanzas y Fechas" en dos tarjetas separadas ("Fechas" y "Finanzas") y completar "Fechas" con los 7 campos del ciclo de vida (`requestDate`, `createdAt`, `estimatedStartDate`, `estimatedEndDate`, `actualStartDate`, `actualEndDate`, `collectionDate`, más `canceledAt` condicional), formateados `dd/MM/yyyy` o "N/A".
- [x] 1.2 Completar la tarjeta "Finanzas" agregando `budgetedAmount` y `discount`, y una barra de progreso `collectedAmount / totalAmount` (implementada en la fila de KPIs).
- [x] 1.3 Reemplazar el texto plano de Prioridad por un badge de color e ícono, reutilizando el patrón visual del badge de Estado (`getStatusClass`) con un mapeo equivalente para prioridad (`getPriorityClass`).

## 2. Formateo Monetario Consciente de Moneda

- [x] 2.1 Parametrizar el pipe `currency` de Angular con `order.currencyCode` (fallback `'ARS'`) y el locale `es-AR` ya registrado globalmente en `app.config.ts`, en reemplazo del pipe genérico `| currency` sin parámetros usado en las 4 ubicaciones originales del template (ver design.md, Decisión 3 — no fue necesario un pipe propio).
- [x] 2.2 Mostrar, cuando corresponda, la línea de "Monto en Moneda Extranjera" y la cotización (`foreignAmount`, `exchangeRateAtBudget`) junto al campo Moneda.

## 3. Stepper de Ciclo de Vida

- [x] 3.1 Implementar el stepper de solo lectura (`Alta → Presupuestada → Aprobada → Iniciada → Entregada → Cobrada`) en la cabecera del detalle, resaltando la etapa actual según `order.statusName`.
- [x] 3.2 Manejar el caso "Cancelada" como estado terminal distintivo fuera de la secuencia del stepper.

## 4. Equipo de Trabajo y Distribución Financiera

- [x] 4.1 Ampliar la sección "Equipo de Trabajo" para mostrar `title`, `specialties` y `userName` de cada responsable cuando estén disponibles, con avatar de iniciales.
- [x] 4.2 Agregar `actualAmount` ("Monto Real Destinado") a cada fila de "Distribución Financiera" y una fila totalizadora (Porcentaje / Esperado / Real) con resaltado visual si la suma de porcentajes no es 100%.

## 5. Pestaña "Bitácora"

- [x] 5.1 Agregar la pestaña "Bitácora" al `mat-tab-group` del detalle, montando `ServiceOrderObservationsComponent` en modo lectura + alta de notas (reutilización directa, sin bifurcar el componente).
- [ ] 5.2 Verificar en runtime que el alta de una nueva observación desde el detalle actualiza la línea de tiempo sin recargar toda la página. *(Implementado siguiendo el mismo patrón que `service-order-form`; pendiente de QA manual — ver nota al final de este archivo.)*

## 6. Pestaña "Actividades"

- [x] 6.1 Crear un listado de solo lectura de `order.activities` (Detalle corto, Estado con badge, Porcentaje de Avance con barra), reutilizando los estados visuales (`getStatusClass`) ya usados en el resto del componente.
- [x] 6.2 Agregar la pestaña "Actividades" al `mat-tab-group`, incluyendo estado vacío con ícono y mensaje guía cuando `order.activities` esté vacío.

## 7. Movimientos de Cobro Vinculados

- [x] 7.1 Invocar `ServiceOrderService.getMovements(order.id)` en `ngOnInit` (carga eager, igual que `loadDirectCosts()`, en vez de la carga perezosa por pestaña explorada inicialmente — ver design.md, Decisión 5) y renderizar la tabla (Fecha, Cuenta Financiera, Medio de Pago, Descripción, Monto) con totalizador en una tarjeta propia de la columna principal.
- [ ] 7.2 Verificar en runtime que el totalizador de movimientos concilia exactamente con `collectedAmount` de la orden en casos reales con cobros parciales y con cobro total. *(Pendiente de QA manual.)*

## 8. Enriquecimiento de la Grilla de Costos Directos

- [x] 8.1 Agregar las columnas faltantes (`date`, `paidByName`/`paymentMethodName` como subtexto, `status`) a `directCostsColumns` y a la tabla del detalle.
- [x] 8.2 Agregar el badge "Vía Movimiento" con ícono de candado y `matTooltip` explicativo para filas con `isFromMovement === true`, y estilo de fila diferenciado (`row-linked`).
- [x] 8.3 Agregar el desglose de subtotales por origen en el pie de tabla ("Costo Manual", "Costo Vía Movimiento", "Costo Directo Total"), cerrando la brecha de cumplimiento con `service-orders/direct-costs`.

## 9. Acción Rápida "Marcar como Entregada"

- [x] 9.1 Agregar el botón "Marcar como Entregada" en la cabecera del detalle, visible solo cuando `order.statusName === 'Iniciada'` (`canDeliver`), reutilizando el diálogo de confirmación y el método de servicio ya usados en `service-order-list.component.ts`.
- [ ] 9.2 Verificar en runtime que, tras confirmar, el detalle refresca el estado, el stepper y las fechas reales sin recargar la página completa. *(El código llama a `loadOrderDetails()` tras la confirmación, sin `window.location`/navegación; pendiente de QA manual contra la API real.)*

## 10. Estados Vacíos y Verificación General

- [x] 10.1 Reemplazar los mensajes de texto plano de estados vacíos (Equipo de Trabajo, Distribución Financiera, Documentos, Costos Directos, Actividades, Movimientos) por un patrón visual consistente con ícono y mensaje guía (clase `.empty`).
- [ ] 10.2 Verificar visualmente en viewport móvil/tablet. *(Se agregó `@media (max-width: 860px)` colapsando el layout de 2 columnas a 1 columna; pendiente de verificación visual real — ver nota al final.)*
- [x] 10.3 Ejecutar el build de producción del frontend (`ng build --configuration development`) y verificar ausencia de errores de compilación TypeScript/plantillas. Confirmado sin errores (solo warnings preexistentes NG8107 en otros componentes, no relacionados a este cambio).

---

**Nota sobre QA manual pendiente (5.2, 7.2, 9.2, 10.2):** el entorno de desarrollo local del frontend (`localhost:4300`) apunta al API de producción desplegado (`environment.ts` → `https://geoserv-api.onrender.com/api`), no a una base de datos de prueba local. Verificar estos puntos requiere iniciar sesión con una cuenta real, algo que no corresponde realizar de forma automática. Los puntos 1–4, 6, 8, 9.1 y 10.1 fueron confirmados mediante build de producción exitoso (10.3) y revisión manual exhaustiva de plantilla/estilos/bindings; los puntos marcados arriba requieren que alguien con acceso a la cuenta abra el detalle de una orden real y confirme el comportamiento en el navegador.
