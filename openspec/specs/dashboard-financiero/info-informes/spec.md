# info-informes Specification

## Purpose
Permite a los usuarios obtener explicaciones detalladas y contextuales sobre los datos mostrados en los informes del Dashboard Financiero de manera interactiva.

## Requirements

### Requirement: Logo de la empresa en el encabezado
El sistema DEBE mostrar el logo de la empresa centrado dentro de un círculo blanco en la parte superior del Dashboard Financiero.

#### Scenario: Visualización del logo
- **WHEN** el usuario accede al Dashboard Financiero
- **THEN** el sistema muestra el logo de la empresa centrado en la parte superior dentro de un círculo con fondo blanco

### Requirement: Botón de información en informes
El sistema DEBE proveer un botón de información interactivo en la parte inferior derecha de cada informe dentro del Dashboard Financiero.

#### Scenario: Visualización de información
- **WHEN** el usuario hace clic en el botón de información de un informe específico
- **THEN** el sistema muestra un modal o cuadro de mensaje con la explicación pertinente a los datos de ese informe

### Requirement: Ocultamiento de la explicación
El sistema DEBE permitir al usuario cerrar la explicación para continuar visualizando el dashboard.

#### Scenario: Cierre del modal
- **WHEN** el usuario hace clic en el botón de cerrar del modal o hace clic fuera de él
- **THEN** el sistema oculta la explicación y devuelve el foco al informe
