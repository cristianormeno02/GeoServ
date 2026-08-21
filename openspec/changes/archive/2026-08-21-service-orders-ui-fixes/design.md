# Design: Service Orders UI Fixes

## Architecture
Los cambios son puramente de frontend en Angular (UI y TypeScript).

## Components
- **ServiceOrderFormComponent (HTML)**: 
  - Refactorizar las clases CSS / flexbox \div.row\ en la sección de fechas para acomodar la nueva estructura de 4 filas.
  - Refactorizar el \div.row\ que envuelve a \collectedAmount\ para que ocupe el espacio correcto o usar una clase para alinearlo con \udgetedAmount\.
- **ServiceOrderFormComponent (TypeScript)**:
  - Modificar el \alueChanges\ de \estimatedStartDate\ y \estimatedEndDate\ para quitar la condición \!this.isEditMode\.

## Data Model
Sin cambios en el backend ni en la base de datos.
