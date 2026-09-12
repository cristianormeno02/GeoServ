## Purpose

Proporciona un campo de búsqueda integrado en la barra lateral que filtra en tiempo real los ítems del menú por nombre y descripción, facilitando el acceso rápido cuando el menú contiene muchas opciones.

## ADDED Requirements

### Requirement: Campo de búsqueda en el menú lateral
El sistema SHALL mostrar un campo de texto en la parte superior del menú lateral, debajo del nombre del usuario y antes de los grupos de ítems, que permita ingresar texto para filtrar el menú.

#### Scenario: Visibilidad del campo de búsqueda
- **WHEN** el menú lateral está expandido y el usuario está autenticado
- **THEN** el campo de búsqueda es visible en la parte superior del área de navegación, debajo del nombre del usuario

### Requirement: Filtrado en tiempo real por nombre y descripción
El sistema SHALL filtrar en tiempo real los ítems del menú lateral para mostrar únicamente aquellos cuyo nombre o descripción contenga el texto ingresado en el campo de búsqueda (sin distinción de mayúsculas/minúsculas).

#### Scenario: Búsqueda por nombre de ítem
- **WHEN** el usuario escribe texto en el campo de búsqueda
- **THEN** el menú muestra solo los ítems cuyo nombre contenga el texto ingresado, ocultando los ítems y grupos que no coincidan

#### Scenario: Búsqueda por descripción de ítem
- **WHEN** el usuario escribe un término que coincide con la descripción de un ítem pero no con su nombre
- **THEN** ese ítem se muestra en los resultados de filtrado

#### Scenario: Sin resultados
- **WHEN** el texto ingresado no coincide con nombre ni descripción de ningún ítem
- **THEN** el menú muestra un mensaje indicando que no se encontraron resultados

### Requirement: Restauración del menú al limpiar búsqueda
El sistema SHALL restaurar la vista completa del menú lateral cuando el campo de búsqueda quede vacío.

#### Scenario: Limpiar búsqueda
- **WHEN** el usuario borra todo el texto del campo de búsqueda
- **THEN** el menú lateral muestra todos los ítems y grupos en su estructura original
