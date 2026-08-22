# Copiar detalle de tareas desde otra Orden de Servicio

## 1. Problema y Motivación
Actualmente, los usuarios deben escribir manualmente el "detalle de tareas presupuestadas" en cada Orden de Servicio. Muchas veces, este detalle es idéntico o muy similar al de órdenes anteriores, lo que genera trabajo repetitivo y pérdida de tiempo.

## 2. Propuesta
Incorporar una funcionalidad para copiar el detalle de tareas presupuestadas desde una Orden de Servicio existente hacia la orden actual.

### Flujo de Usuario
1. En la vista de creación/edición de Orden de Servicio, debajo (o a un lado) del componente de texto de "detalle de tareas", se agregará un botón con el ícono o texto "Copiar de otra orden".
2. Al presionar el botón, se abrirá un modal.
3. El modal contendrá un selector (combobox con autocompletar) para buscar órdenes de servicio previas (similar a cómo se buscan clientes o proyectos).
4. Al seleccionar una orden en el modal, se confirmará la acción y el texto se insertará en el campo de la orden actual.
5. El texto copiado es completamente editable por el usuario. Al guardar la orden, se guardará como cualquier otro texto.

## 3. Sugerencias de UX/UI
La propuesta de utilizar un botón y un modal es excelente para mantener la interfaz principal limpia. Como valor agregado propongo:
*   **Previsualización en el modal:** Al elegir una orden en el combobox del modal, mostrar un cuadro de solo lectura con el texto que se copiará. Así el usuario verifica que es la orden correcta antes de confirmar.
*   **Sobrescribir vs. Añadir:** Si el usuario ya había escrito algo en el campo, el texto copiado debería añadirse al final (o en la posición del cursor si es posible) para no hacerle perder su trabajo previo.

## 4. Fuera del Alcance (Non-goals)
*   No se copiarán otros datos de la orden (como montos, clientes o estado), esta acción es exclusiva para el texto del detalle de tareas.
