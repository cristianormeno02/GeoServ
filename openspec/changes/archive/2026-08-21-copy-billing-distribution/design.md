# Design: Copiar Distribución de Cobro

## 1. Arquitectura Frontend (UI)

1. **Componente de Distribución de Cobro (`BillingDistributionComponent` o equivalente)**:
   - Añadir el botón `Copiar de otra orden` junto a la acción `Agregar concepto`.
   - Manejar el estado del modal (abierto/cerrado) y la orden seleccionada.

2. **Componente Modal (`CopyBillingOrderModalComponent`)**:
   - Reutilizar o extender el componente del modal utilizado para "copiar detalles", adaptándolo para listar órdenes y, al seleccionar una, desplegar los detalles de la distribución de cobro (conceptos y porcentajes).
   - Necesitará realizar una llamada a la API (o usar el store de estado) para recuperar los conceptos de la orden seleccionada.

## 2. Lógica de Estado y Cálculo

1. **Reemplazo de Conceptos**:
   - Al emitir el evento de confirmación desde el modal, el componente padre reemplazará el arreglo de `conceptos` (o `distribucion_cobro`) actual por el nuevo arreglo proveniente de la orden seleccionada.

2. **Cálculo del Monto**:
   - Se debe iterar sobre los conceptos copiados.
   - Fórmula: `Monto Esperado = (Porcentaje del Concepto / 100) * Monto Total de la Orden Actual`.
   - Se debe actualizar el estado del formulario o entidad subyacente para reflejar estos nuevos montos esperados en tiempo real.

## 3. Consideraciones de API (Backend)
- Si los datos de distribución de cobro de las órdenes anteriores no se recuperan en el listado principal, se requerirá asegurar que el endpoint de consulta de la orden (por ej. `GET /api/service-orders/:id`) incluya la distribución de cobro y sus conceptos/porcentajes, para que el modal pueda previsualizarlos y pasarlos al componente padre.
- La persistencia de los nuevos conceptos reemplazados será manejada por el endpoint estándar de actualización de la orden (`PUT/PATCH /api/service-orders/:id`).
