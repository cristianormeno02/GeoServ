## 1. Modificaciones en el Backend

- [x] 1.1 Modificar el endpoint `/api/dashboard/operational/kpis` para retornar únicamente el valor actual de cada métrica (removiendo arreglos históricos) y verificar que los tests unitarios pasen.
- [x] 1.2 Ajustar el valor por defecto de `maxCapacity` a 10 en el endpoint `/api/dashboard/operational/team-capacity` (cuando no esté configurado o sea 0) y verificar los tests correspondientes.
- [x] 1.3 Modificar el endpoint `/api/dashboard/operational/inventory-alerts` para asumir un `MinimumStock` de 0 si no se encuentra configurado, comprobando el escenario mediante un test.

## 2. Ajustes de UI y Componentes

- [x] 2.1 Refactorizar el componente de las tarjetas KPI del Dashboard Operativo para eliminar la gráfica sparkline, centrar el valor con el color destacado correspondiente, y verificar la correcta visualización en la interfaz.
- [x] 2.2 Agregar un botón de ayuda (?) en la parte inferior derecha de las tarjetas/widgets, configurando la apertura de un tooltip o modal genérico, y comprobar su renderizado correcto.
- [x] 2.3 Implementar el contenido explicativo para cada widget del dashboard vinculándolo al modal/tooltip del botón de ayuda y comprobar en el navegador que al hacer clic se visualice el texto adecuado para cada informe.
- [x] 2.4 Agregar el logo de la empresa en la cabecera del Dashboard Operativo, asegurando que esté centrado y dentro de un círculo blanco, y verificar su correcta visualización.
