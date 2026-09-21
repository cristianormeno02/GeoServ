## Why

GeoServ ya cuenta con datos operativos y financieros suficientes para detectar situaciones que requieren accion inmediata, pero hoy esas senales se encuentran distribuidas entre dashboards, listados y modulos especificos. Esto obliga al usuario a revisar manualmente ordenes, inventario, cheques y gastos fijos para decidir que atender primero.

Se propone incorporar un Centro de Alertas y Tareas como inbox operativo centralizado, orientado a mostrar alertas accionables por prioridad, con navegacion directa y acciones rapidas sobre las entidades afectadas.

## What Changes

- Agregar una nueva capability `centro-alertas-tareas`.
- Crear un endpoint consolidado para listar alertas operativas y financieras del tenant autenticado.
- Detectar y exponer alertas para:
  - Ordenes de Servicio por vencer.
  - Ordenes entregadas sin cobrar.
  - Insumos bajo stock minimo.
  - Cheques proximos a vencimiento.
  - Gastos fijos pendientes.
  - Ordenes estancadas.
- Incorporar estados de gestion de alerta: nueva, leida, pospuesta y resuelta.
- Incorporar acciones directas segun tipo de alerta: ver orden, registrar cobro, crear movimiento, marcar entregada, ver insumo, ver cheque, pagar gasto fijo, etc.
- Agregar una vista de inbox en el frontend con filtros por tipo, prioridad, estado, fecha y entidad relacionada.
- Agregar un indicador global de alertas pendientes en el layout/header.

## Capabilities

### New Capabilities

- `centro-alertas-tareas`: Inbox operativo y financiero con alertas accionables, priorizacion, gestion de estado y acciones directas sobre entidades del sistema.

### Modified Capabilities

- `service-orders`: Expondra acciones y navegacion desde alertas relacionadas a vencimientos, estancamiento, entrega y cobro.
- `inventory-ui`: Expondra acciones y navegacion desde alertas de insumos bajo stock minimo.
- `accounting-ui`: Expondra acciones y navegacion desde alertas de cobros, cheques y gastos fijos.
- `dashboard-operativo`: Podra enlazar KPIs criticos hacia el Centro de Alertas filtrado por tipo.

## Impact

- Backend: nuevo servicio de agregacion de alertas, endpoints REST, DTOs y pruebas.
- Frontend: nueva pagina de inbox, indicador global, chips/filtros y acciones por alerta.
- Seguridad: las alertas deben respetar tenant, roles y permisos existentes.
- Auditoria: registrar cambios de estado de alertas cuando corresponda.

## Non-goals

- No se implementan notificaciones push, email o WhatsApp en esta primera etapa.
- No se implementa asignacion colaborativa avanzada entre usuarios.
- No se delegan acciones automaticas sin confirmacion del usuario.
