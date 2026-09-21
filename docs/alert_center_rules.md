# Reglas de Cálculo y Prioridad del Centro de Alertas

El módulo de Centro de Alertas (`AlertCenterService`) unifica tareas y notificaciones pendientes basadas en reglas de negocio transversales al sistema (Órdenes, Inventario, Finanzas).

## Tipos de Alertas y Condiciones

| Tipo | Origen | Condición | Prioridad |
|------|--------|-----------|-----------|
| **ServiceOrderDueSoon** | Orden de Servicio | `EstimatedEndDate` <= 7 días vista. No debe estar Entregada, Cobrada o Cancelada. | **Crítica** si la orden ya venció. **Alta** si está por vencer en <= 7 días. |
| **ServiceOrderUncollected** | Orden de Servicio | `Status == "Entregada"` y `TotalAmount > CollectedAmount`. | **Crítica** si han pasado > 30 días desde la entrega. **Alta** en caso contrario. |
| **LowStock** | Insumo / Inventario | Stock Consolidado (suma de movimientos) < `MinimumStock`. | **Crítica** si el stock actual es < 0. **Alta** si está entre 0 y el stock mínimo. |
| **CheckDueSoon** | Cheques | Estado `InPortfolio` o `Deposited`, y `DueDate` <= 7 días vista. | **Crítica** si ya venció. **Alta** si vence en <= 7 días. |
| **FixedCostPending** | Gastos Fijos | `IsPaid == false` y `DueDate` <= 15 días vista. | **Crítica** si ya venció. **Alta** si vence en <= 7 días. **Media** si vence entre 8 y 15 días. |
| **ServiceOrderStagnant** | Orden de Servicio | `UpdatedAt` <= hace 7 días, sin estar Entregada, Cobrada o Cancelada. | **Crítica** si lleva estancada > 14 días. **Alta** si lleva entre 7 y 14 días. |

## Estados de Alerta y Ciclo de Vida
Las alertas son inmutables desde su origen, pero el sistema rastrea el estado local por usuario (`AlertState`):
- **New (Nueva)**: Alerta recién detectada.
- **Read (Leída)**: Alerta que ha sido interactuada por el usuario o vista de forma pasiva.
- **Snoozed (Pospuesta)**: Alerta pausada temporalmente hasta la fecha `SnoozedUntil`.
- **Resolved (Resuelta)**: Alerta gestionada que no volverá a aparecer (a menos que se repita la condición desde un origen distinto).

## Acciones Directas
Las alertas incluyen atajos para la resolución:
- `view-order`, `register-payment`, `create-movement` (Órdenes de servicio).
- `mark-delivered` (Órdenes estancadas o por vencer).
- `view-inventory`, `view-consumable` (Inventario).
- `view-check`, `pay-fixed-cost` (Finanzas).
