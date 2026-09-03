## 1. Usabilidad de controles numéricos

- [x] 1.1 Implementar la selección automática de texto al recibir el foco en los controles numéricos y verificar comportamiento visual.
- [x] 1.2 Interceptar el evento de ingreso de texto en los controles numéricos para interpretar punto y coma como separador decimal, validando que el formateo final se preserve.

## 2. Gestión de cambios y confirmación de salida

- [x] 2.1 Implementar mecanismo para rastrear estado modificado (`dirty`) en la edición de órdenes.
- [x] 2.2 Agregar captura del evento de "Cancelar" y disparar diálogo de advertencia si la orden está modificada, verificando que cancele el cierre si el usuario rechaza.

## 3. Manipulación de grillas (Distribución de cobro y Actividades operativas)

- [x] 3.1 Habilitar la reordenación de filas (drag & drop o botones arriba/abajo) para la grilla de Distribución de cobro y asegurar que persista.
- [x] 3.2 Modificar la lógica de "Copia" para Distribución de cobro asegurando que los registros se inserten en el orden original.
- [x] 3.3 Habilitar la reordenación de filas para la grilla de Actividades operativas y asegurar que persista.
- [x] 3.4 Modificar la lógica de "Copia" para Actividades operativas asegurando que los registros se inserten en el orden original.

## 4. Manipulación de grilla Costos directos

- [x] 4.1 Habilitar la reordenación de filas para la grilla de Costos directos y asegurar que persista.
- [x] 4.2 Agregar funcionalidad de "Copia desde otra orden" para Costos directos.
- [x] 4.3 Asegurar que la nueva copia de Costos directos respete el orden original de la orden de origen.
