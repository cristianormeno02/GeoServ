# Service Orders

## Requirements

### [MODIFIED] Formulario de Órdenes de Servicio
**Scenario:** Ajustes en la interfaz y comportamiento del formulario.

- **Diseño Visual (Fechas):**
  - La sección de fechas debe reorganizarse en 4 filas distintas:
    - Fila 1: Fecha de solicitud.
    - Fila 2: Inicio Presupuestado y Fin Presupuestado.
    - Fila 3: Inicio Real y Fin Real.
    - Fila 4: Fecha de cobro.
- **Diseño Visual (Finanzas):**
  - El campo 'Monto Cobrado' debe mostrarse en una fila propia y tener el mismo ancho visual que el campo 'Monto Presupuestado'.
- **Comportamiento Automático (Fechas):**
  - Al cambiar el valor de 'Inicio Presupuestado', el sistema debe copiar automáticamente ese valor a 'Inicio Real' sin importar si se está creando o editando la orden.
  - Al cambiar el valor de 'Fin Presupuestado', el sistema debe copiar automáticamente ese valor a 'Fin Real' sin importar si se está creando o editando la orden.
