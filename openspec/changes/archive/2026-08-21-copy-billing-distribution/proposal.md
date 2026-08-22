# Proposal: Copiar Distribución de Cobro de Otra Orden

## 1. What
Se agregará una nueva funcionalidad en la pantalla de Órdenes de Servicios que permitirá al usuario "Copiar de otra orden" la distribución de cobro (conceptos y porcentajes). Esta funcionalidad operará de forma análoga a la copia de detalles, desplegando un modal de selección.

## 2. Why
Esta característica busca agilizar el proceso de carga de la distribución de cobro en nuevas órdenes de servicios, reduciendo la entrada manual de datos y posibles errores humanos cuando existen distribuciones de cobro repetitivas o estandarizadas entre diferentes órdenes.

## 3. Scope and Impact
- **In Scope**:
  - Agregar un botón "Copiar de otra orden" en la sección de distribución de cobro.
  - Crear un modal que liste las órdenes disponibles para seleccionar.
  - Mostrar los conceptos cargados y sus porcentajes al seleccionar una orden en el modal.
  - Al confirmar, reemplazar los conceptos actuales de la orden por los copiados.
  - Calcular automáticamente el monto esperado para cada concepto en base a su porcentaje y al monto total de la orden actual.
- **Out of Scope**:
  - Modificar la lógica de copia de detalles de la orden (ya existente).
  - Cambiar el modelo de datos subyacente de la distribución de cobro.

## 4. Non-goals
- No se busca fusionar los conceptos actuales con los de la orden copiada; se reemplazarán en su totalidad.
