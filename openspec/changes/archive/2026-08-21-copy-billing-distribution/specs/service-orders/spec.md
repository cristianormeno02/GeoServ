# Spec Delta: Copiar Distribución de Cobro

## 1. Contexto
Se requiere permitir al usuario copiar la distribución de cobro de otra orden de servicio hacia la orden actual.

## 2. Requerimientos Funcionales

1. **Botón "Copiar de otra orden"**:
   - En la sección de distribución de cobro (donde se encuentra "agregar concepto"), debe existir un botón para "Copiar de otra orden".

2. **Modal de Selección**:
   - Al hacer clic en el botón, se debe abrir un modal de selección de órdenes, similar a la funcionalidad de "copiar detalle de otra orden".
   - Al seleccionar una orden del listado, el modal debe mostrar los conceptos cargados en dicha orden junto con sus respectivos porcentajes.

3. **Acción de Copiado**:
   - Una vez confirmada la selección, los conceptos de distribución de cobro actuales de la orden deben ser reemplazados completamente por los conceptos de la orden seleccionada.
   - El sistema debe recalcular y asignar automáticamente el monto esperado para cada concepto copiado, utilizando el porcentaje del concepto sobre el monto total de la orden de servicio actual.

## 3. Requerimientos No Funcionales
- La interfaz y experiencia de usuario (UI/UX) del modal debe mantener consistencia con la funcionalidad de "copiar detalle" ya existente.
