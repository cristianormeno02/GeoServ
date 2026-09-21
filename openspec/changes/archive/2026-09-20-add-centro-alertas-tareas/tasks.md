## 1. Backend y Modelo de Alertas

- [x] 1.1 Definir DTOs para alertas (`AlertItemDto`, `AlertActionDto`, filtros y resumen de conteos) incluyendo tipo, prioridad, estado, entidad relacionada, vencimiento y acciones disponibles.
- [x] 1.2 Implementar un servicio agregador `AlertCenterService` que calcule alertas por tenant a partir de Ordenes de Servicio, inventario, cheques y gastos fijos.
- [x] 1.3 Implementar persistencia liviana para estado de gestion de alertas (`leida`, `pospuesta`, `resuelta`) sin duplicar innecesariamente los datos de origen.
- [x] 1.4 Crear endpoints `GET /api/alert-center`, `GET /api/alert-center/summary`, `PATCH /api/alert-center/{id}/state` y endpoints auxiliares necesarios.
- [x] 1.5 Aplicar validaciones de tenant y rol en todos los endpoints del Centro de Alertas.
- [x] 1.6 Agregar pruebas unitarias/integracion para cada tipo de alerta, filtros, conteos y cambio de estado.

## 2. Tipos de Alertas y Reglas de Deteccion

- [x] 2.1 Detectar Ordenes de Servicio por vencer segun `EstimatedEndDate`, excluyendo estados `Entregada`, `Cobrada` y `Cancelada`.
- [x] 2.2 Detectar Ordenes de Servicio entregadas sin cobrar con estado `Entregada` y saldo pendiente (`TotalAmount > CollectedAmount`).
- [x] 2.3 Detectar insumos bajo stock minimo comparando stock consolidado contra `MinimumStock`.
- [x] 2.4 Detectar cheques proximos a vencimiento segun fecha de vencimiento y estado pendiente/activo.
- [x] 2.5 Detectar gastos fijos pendientes con vencimiento vencido o proximo.
- [x] 2.6 Detectar Ordenes de Servicio estancadas segun permanencia en estado actual y umbral configurado por tipo de servicio o configuracion de empresa.

## 3. Frontend y Experiencia de Usuario

- [x] 3.1 Agregar ruta y menu para `Centro de Alertas` dentro del grupo Inicio u Operaciones segun convencion de navegacion.
- [x] 3.2 Crear vista de inbox con tabla/lista de alertas, filtros por tipo/prioridad/estado, busqueda y ordenamiento por prioridad y fecha.
- [x] 3.3 Agregar indicador global de alertas pendientes en el header o layout principal.
- [x] 3.4 Renderizar acciones directas por tipo de alerta con navegacion o dialogos de confirmacion segun corresponda.
- [x] 3.5 Implementar estados vacios, loading, errores y refresco manual.
- [x] 3.6 Verificar visualmente comportamiento responsive desktop/mobile.

## 4. Acciones Directas

- [x] 4.1 Permitir `ver orden` para alertas vinculadas a Ordenes de Servicio.
- [x] 4.2 Permitir `registrar cobro` o `crear movimiento` para Ordenes entregadas sin cobrar, precargando la OS cuando sea posible.
- [x] 4.3 Permitir `marcar entregada` para Ordenes por vencer o estancadas cuando el estado actual lo permita, reutilizando validaciones existentes.
- [x] 4.4 Permitir `ver insumo` o navegar al inventario filtrado para insumos bajo stock minimo.
- [x] 4.5 Permitir `ver cheque` o navegar al modulo de cheques filtrado por el registro afectado.
- [x] 4.6 Permitir `pagar gasto fijo` o navegar al gasto fijo pendiente afectado.

## 5. Calidad y Documentacion

- [x] 5.1 Documentar reglas de calculo y prioridad de alertas.
- [x] 5.2 Asegurar que las alertas no muestren informacion de otro tenant.
- [x] 5.3 Validar que los cambios no rompan dashboards existentes que calculan metricas similares.
- [x] 5.4 Ejecutar pruebas backend y frontend relevantes antes de cerrar la implementacion.
