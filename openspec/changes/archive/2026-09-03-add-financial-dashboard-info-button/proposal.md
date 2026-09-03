## Why

Es necesario proveer claridad a los usuarios sobre la información que se presenta en cada informe del Dashboard Financiero. Al mostrar una explicación detallada bajo demanda, se reduce la confusión, se facilita la toma de decisiones y se mejora la experiencia del usuario sin sobrecargar la interfaz con texto adicional.

## What Changes

- Se agregará un botón de información (icono de ayuda o info) en la parte inferior derecha de cada informe dentro del Dashboard Financiero.
- Al hacer clic en el botón, se mostrará un modal o cuadro de mensaje.
- Dicho modal contendrá el texto explicativo correspondiente a los datos del informe en el que se hizo clic.
- Se agregará el logo de la empresa centrado dentro de un círculo blanco en la parte superior del Dashboard Financiero.

## Capabilities

### New Capabilities

- `dashboard-financiero/info-informes`: Capacidad de visualizar explicaciones detalladas y contexto sobre los datos presentados en los diferentes informes del dashboard financiero mediante un botón interactivo.

### Modified Capabilities



## Impact

- Interfaz de usuario del Dashboard Financiero (frontend).
- Componentes de los informes (gráficos/tablas/tarjetas) del dashboard, que ahora requerirán soporte para renderizar el botón y el modal con el texto explicativo correspondiente.
