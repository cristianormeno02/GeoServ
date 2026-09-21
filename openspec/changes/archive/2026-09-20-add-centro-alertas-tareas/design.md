## Contexto

El Centro de Alertas y Tareas debe funcionar como una bandeja de entrada operativa. No reemplaza los dashboards: los complementa convirtiendo metricas criticas en elementos accionables, priorizados y gestionables.

La primera version debe calcular alertas bajo demanda desde los datos fuente y persistir solo el estado de gestion del usuario/tenant cuando sea necesario. Esto evita inconsistencias por duplicacion de informacion y permite que una alerta desaparezca automaticamente cuando la condicion de negocio deja de cumplirse.

## Modelo Conceptual

### AlertItemDto

- `id`: identificador estable calculado o persistido.
- `type`: tipo de alerta (`ServiceOrderDueSoon`, `ServiceOrderUncollected`, `LowStock`, `CheckDueSoon`, `FixedCostPending`, `ServiceOrderStagnant`).
- `title`: titulo corto.
- `description`: descripcion accionable.
- `priority`: `Critical`, `High`, `Medium`, `Low`.
- `state`: `New`, `Read`, `Snoozed`, `Resolved`.
- `sourceEntityType`: entidad origen (`ServiceOrder`, `Consumable`, `Check`, `FixedCostPayment`).
- `sourceEntityId`: identificador de entidad origen.
- `dueDate`: fecha relevante cuando aplique.
- `amount`: monto relevante cuando aplique.
- `createdAt`: fecha de generacion o primera deteccion.
- `actions`: lista de acciones disponibles para el usuario.

### AlertActionDto

- `key`: identificador de accion (`view-order`, `register-payment`, `create-movement`, `mark-delivered`, `view-inventory`, `view-check`, `pay-fixed-cost`).
- `label`: texto visible.
- `icon`: icono Material.
- `route`: ruta sugerida de navegacion cuando aplique.
- `requiresConfirmation`: indica si debe abrir dialogo antes de ejecutar.
- `enabled`: indica si el usuario puede ejecutar la accion segun rol/estado.

## Reglas de Priorizacion

- `Critical`: vencido o bloqueante, por ejemplo OS vencida, gasto fijo vencido, cheque vencido, insumo con stock negativo.
- `High`: vence dentro de 7 dias, OS entregada con saldo pendiente significativo, orden estancada por encima del umbral.
- `Medium`: vence entre 8 y 15 dias o stock bajo sin deficit critico.
- `Low`: informacion preventiva mayor a 15 dias cuando se configure.

## Persistencia de Estado

Se recomienda una tabla liviana, por ejemplo `AlertState`, con:

- `Id`
- `TenantId`
- `UserId` opcional si el estado es por usuario.
- `AlertKey` estable.
- `State`
- `SnoozedUntil`
- `ResolvedAt`
- `UpdatedAt`

`AlertKey` debe derivarse de `type + sourceEntityType + sourceEntityId + dueDate/periodo relevante` para poder reconciliar alertas calculadas con su estado persistido.

## Seguridad

Todas las consultas deben filtrar por tenant desde el backend. Las acciones disponibles deben calcularse segun rol y permisos del usuario autenticado. El frontend solo renderiza acciones recibidas por el backend, pero no debe confiar en ellas para autorizar operaciones.

## UI

La vista principal debe priorizar lectura rapida:

- contador por estado y prioridad;
- filtros por tipo, prioridad y estado;
- orden predeterminado por prioridad descendente y fecha mas urgente;
- acciones visibles en cada fila;
- chips semanticos de prioridad;
- navegacion directa a entidad origen.

El indicador global del layout debe mostrar el conteo de alertas `New` y `Read` no resueltas de prioridad `Critical` y `High`, con tooltip resumido.

## Decisiones Abiertas

- Definir si el estado de lectura/resolucion es por usuario o compartido por tenant.
- Definir ventanas configurables por empresa para vencimientos proximos.
- Definir si se incorporara asignacion de alertas a responsables en una etapa posterior.
