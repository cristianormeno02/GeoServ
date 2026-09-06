## Purpose

Permite gestionar y visualizar la ubicación geográfica de los proyectos en la plataforma a través de mapas.

## ADDED Requirements

### Requirement: Captura de coordenadas en el formulario de proyecto
El sistema SHALL permitir al usuario ingresar la latitud y longitud de un proyecto al crearlo o editarlo, ya sea ingresando los valores manualmente o seleccionando la ubicación en un mapa interactivo.

#### Scenario: Selección de ubicación en el mapa
- **WHEN** el usuario hace clic o arrastra el marcador en el mapa del formulario
- **THEN** los campos de texto de latitud y longitud se actualizan automáticamente con las coordenadas seleccionadas.

#### Scenario: Ingreso manual de coordenadas
- **WHEN** el usuario ingresa manualmente la latitud y longitud en los campos de texto
- **THEN** el marcador en el mapa se reubica automáticamente en la nueva posición.

### Requirement: Validación de coordenadas geográficas
El sistema SHALL validar que las coordenadas ingresadas se encuentren dentro de los rangos geográficos válidos.

#### Scenario: Coordenadas válidas
- **WHEN** el usuario ingresa una latitud entre -90 y 90, y una longitud entre -180 y 180
- **THEN** el sistema permite guardar el proyecto.

#### Scenario: Coordenadas inválidas
- **WHEN** el usuario ingresa una latitud fuera del rango [-90, 90] o una longitud fuera del rango [-180, 180]
- **THEN** el sistema muestra un error de validación y bloquea el guardado.

### Requirement: Visualización de ubicación en detalle de proyecto
El sistema SHALL mostrar la ubicación geográfica guardada en la vista de detalle del proyecto.

#### Scenario: Visualización de mapa en detalle
- **WHEN** el usuario accede a la vista de detalle de un proyecto que tiene coordenadas guardadas
- **THEN** el sistema muestra un mapa centrado en dichas coordenadas con un marcador indicando la ubicación.

### Requirement: Mapa interactivo en dashboard operativo
El sistema SHALL mostrar un mapa interactivo en el dashboard operativo con la ubicación de todos los proyectos, diferenciándolos por su estado de actividad.

#### Scenario: Diferenciación de proyectos por actividad
- **WHEN** el usuario visualiza el mapa en el dashboard operativo
- **THEN** los proyectos con órdenes de servicio activas se muestran con un color de marcador específico, y los proyectos sin órdenes activas se muestran con un color diferente.
