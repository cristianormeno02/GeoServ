## MODIFIED Requirements

### Requirement: Captura de coordenadas en el formulario de proyecto
El sistema SHALL permitir al usuario ingresar la latitud y longitud de un proyecto al crearlo o editarlo, ya sea ingresando los valores manualmente o seleccionando la ubicación en un mapa interactivo. El mapa del formulario SHALL inicializarse por defecto en vista satelital con etiquetas visibles (modo híbrido), permitiendo visualizar las calles, rutas y nombres de lugares sobre las imágenes satelitales.

#### Scenario: Selección de ubicación en el mapa
- **WHEN** el usuario hace clic o arrastra el marcador en el mapa del formulario
- **THEN** los campos de texto de latitud y longitud se actualizan automáticamente con las coordenadas seleccionadas.

#### Scenario: Ingreso manual de coordenadas
- **WHEN** el usuario ingresa manualmente la latitud y longitud en los campos de texto
- **THEN** el marcador en el mapa se reubica automáticamente en la nueva posición.

#### Scenario: Vista por defecto satélite con etiquetas en el formulario
- **WHEN** el usuario abre el diálogo de creación o edición de un proyecto
- **THEN** el mapa interactivo se renderiza por defecto utilizando el tipo de mapa híbrido (`hybrid`), presentando la fotografía satelital con los nombres de calles y referencias geográficas visibles.

### Requirement: Mapa interactivo en dashboard operativo
El sistema SHALL mostrar un mapa interactivo en el dashboard operativo con la ubicación de todos los proyectos, diferenciándolos por su estado de actividad. El mapa SHALL inicializarse por defecto en vista satelital con etiquetas visibles (modo híbrido), mostrando imágenes satelitales junto con las capas de información geográfica como nombres de calles, rutas y localidades.

#### Scenario: Diferenciación de proyectos por actividad
- **WHEN** el usuario visualiza el mapa en el dashboard operativo
- **THEN** los proyectos con órdenes de servicio activas se muestran con un color de marcador específico, y los proyectos sin órdenes activas se muestran con un color diferente.

#### Scenario: Vista por defecto satélite con etiquetas
- **WHEN** el usuario accede o recarga el dashboard operativo
- **THEN** el mapa de proyectos se renderiza por defecto utilizando el tipo de mapa híbrido (`hybrid`), presentando la fotografía satelital con los nombres de calles y localidades visibles.
