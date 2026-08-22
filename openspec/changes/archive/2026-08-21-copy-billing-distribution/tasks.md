# Tasks: Copiar Distribución de Cobro

- [x] **1. UI - Botón de Copiado**: Agregar el botón "Copiar de otra orden" en la sección de distribución de cobro (junto a "agregar concepto").
- [x] **2. Componente Modal**:
  - [x] Crear o adaptar un modal para la selección de órdenes de servicio, basado en el modal de "copiar detalles".
  - [x] Implementar la lista de órdenes a seleccionar.
  - [x] Al seleccionar una orden, obtener y mostrar en el modal la lista de conceptos y sus porcentajes asignados.
- [x] **3. Lógica Frontend - Reemplazo y Cálculo**:
  - [x] Implementar el evento de confirmación en el modal que emita los conceptos seleccionados.
  - [x] En el componente principal, escuchar el evento, eliminar los conceptos de distribución de cobro existentes y agregar los nuevos.
  - [x] Implementar la lógica para calcular el monto esperado de cada nuevo concepto en base al monto total actual de la orden y el porcentaje del concepto copiado.
- [x] **4. Pruebas y Validación**:
  - [x] Verificar que el modal se abre y carga las órdenes correctamente.
  - [x] Verificar que al confirmar se reemplacen todos los conceptos previos sin duplicar ni dejar remanentes.
  - [x] Validar que el cálculo del monto esperado es matemáticamente correcto de acuerdo a la orden destino.
