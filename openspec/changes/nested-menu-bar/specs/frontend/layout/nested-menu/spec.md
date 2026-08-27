## Purpose

Define el comportamiento y la estructura del nuevo menú lateral con estilo acordeón y agrupaciones lógicas para la aplicación web.

## ADDED Requirements

### Requirement: Categorías principales del menú
El sistema MUST agrupar los elementos del menú en 6 categorías principales colapsables (Inicio, Operaciones, Contactos, Recursos, Finanzas, Administración) y mantener un botón visible para Salir en la parte inferior.

#### Scenario: Visualización inicial del menú
- **WHEN** el usuario abre la aplicación y visualiza el menú lateral
- **THEN** se muestran las categorías principales contraídas por defecto (o la categoría activa expandida) de acuerdo a la nueva disposición jerárquica

### Requirement: Navegación mediante menú colapsable
El sistema MUST permitir expandir y contraer cada categoría de menú para acceder a las opciones de navegación secundarias.

#### Scenario: Expandir una categoría
- **WHEN** el usuario hace clic en una categoría colapsada
- **THEN** la categoría se expande revelando sus sub-elementos y las otras categorías pueden permanecer expandidas o contraerse (según diseño)

#### Scenario: Navegar a una opción
- **WHEN** el usuario hace clic en un sub-elemento dentro de una categoría expandida
- **THEN** la aplicación navega a la ruta correspondiente preservando el estado de expansión de la categoría actual
