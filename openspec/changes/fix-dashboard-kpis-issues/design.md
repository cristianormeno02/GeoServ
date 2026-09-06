## Context

Ver `proposal.md` para la motivación.
Actualmente:
1. El componente `KpiDetailModal` realiza una petición HTTP asíncrona mediante `HttpClient` en `loadData()`. Cuando la promesa/observable emite la respuesta y actualiza las propiedades locales (`items`, `loading = false`, etc.), la vista dentro del `MatDialog` no siempre gatilla un ciclo de detección de cambios inmediato (especialmente con `eventCoalescing: true`), quedando visualmente pausada hasta que un clic u otro evento del usuario despierta la detección de cambios.
2. En `OperationalDashboardEndpoints.cs`, la condición para filtrar "Entregadas sin cobrar" utilizaba la cláusula `(o.Status.Name == "Entregada" || o.ActualEndDate != null)`. Cuando una orden en estado "Iniciada" tiene asignada una fecha `ActualEndDate`, dicha orden era considerada erróneamente entregada y pendiente de cobro.

## Goals / Non-Goals

**Goals:**
- Asegurar que el modal `KpiDetailModal` notifique a Angular el cambio de estado inmediatamente al recibir los datos HTTP o en caso de error, refrescando la vista y la tabla sin requerir interacción del usuario.
- Garantizar que tanto el KPI, el aging como el detalle de "Órdenes entregadas sin cobrar" filtren estrictamente por `o.Status.Name == "Entregada"` y saldo pendiente (`o.TotalAmount > o.CollectedAmount`), ignorando órdenes en estado "Iniciada" u otros estados previos.

**Non-Goals:**
- No se modifican las estructuras de datos devueltas por los endpoints ni los contratos JSON existentes.
- No se altera la lógica de otros KPIs (órdenes activas, estancadas, insumos críticos, etc.) más allá del refresco del modal.

## Decisions

### 1. Inyección y uso de `ChangeDetectorRef` en `KpiDetailModal`
- **Decisión**: Inyectar `ChangeDetectorRef` en el constructor de `KpiDetailModal` y llamar a `this.cdr.markForCheck()` (o `this.cdr.detectChanges()`) en los callbacks `next` y `error` del observable HTTP dentro de `loadData()`.
- **Razón**: `MatDialog` crea componentes en un contenedor superpuesto fuera del flujo habitual del router. Forzar la detección de cambios asegura que `*ngIf="!loading"` y la tabla se actualicen inmediatamente tras la llegada de los datos.
- **Alternativa considerada**: Migrar todo el componente a Signals de Angular. Si bien es una buena práctica a futuro, inyectar `ChangeDetectorRef` resuelve el problema de inmediato y de forma segura sin romper la estructura actual del componente ni sus pruebas existentes.

### 2. Restricción estricta de estado en "Entregadas sin cobrar"
- **Decisión**: Reemplazar la condición `(o.Status.Name == "Entregada" || o.ActualEndDate != null)` por `o.Status != null && o.Status.Name == "Entregada"` en:
  - KPI de resumen (`/kpis` - `uncollectedOrdersCount`)
  - Aging de entregadas sin cobrar (`/aging-uncollected-orders`)
  - Detalle del KPI (`/kpis/uncollectedOrders/details`)
- **Razón**: El concepto de negocio "Entregada" es un estado explícito en el flujo de la orden (`ServiceOrderStatus`). La presencia de una fecha `ActualEndDate` no implica que el trabajo esté entregado si su estado es "Iniciada".
- **Alternativa considerada**: Limpiar `ActualEndDate` cuando una orden esté en "Iniciada". Esto no es recomendable porque podría perderse información histórica o estimada ingresada por el usuario en formularios. La regla de negocio debe basarse en el estado formal de la orden.

## Risks / Trade-offs

- **[Riesgo] Disminución del contador de entregadas sin cobrar en el tablero**: Al corregir el filtro, órdenes que antes sumaban por tener fecha pero no estar formalmente en estado "Entregada" dejarán de computarse.
  - **Mitigación**: Esto es el comportamiento correcto de negocio solicitado por el usuario y alinea el contador con la realidad operativa.
