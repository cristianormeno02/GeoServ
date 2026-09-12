## Why

La barra de navegación lateral actual carece de capacidades de personalización y eficiencia para usuarios que trabajan con muchas opciones de menú. Los usuarios necesitan acceder rápidamente a las secciones que usan con frecuencia, entender el propósito de cada ítem sin necesidad de navegar a él, y filtrar opciones cuando el menú es extenso. Estas mejoras reducen la fricción operativa y mejoran la experiencia diaria de uso de la plataforma.

## What Changes

- **Nuevo — Menú Favoritos**: Los ítems del menú lateral podrán marcarse o desmarcarse como favoritos por el usuario. En el header de la aplicación aparecerá un acceso directo "Favoritos" que, al hacer clic, desplegará un panel con los ítems favoritos del usuario y la opción de desmarcarlos.
- **Nuevo — Descripciones de ítems de menú**: Cada ítem del menú lateral tendrá asociada una descripción de hasta 100 caracteres, que se mostrará como tooltip al pasar el mouse por encima del ítem.
- **Nuevo — Búsqueda en menú**: En la barra lateral, debajo del nombre del usuario y antes de los grupos de menú, se incorporará un campo de búsqueda de texto que filtre en tiempo real los ítems del menú según el nombre y la descripción del ítem.

## Capabilities

### New Capabilities

- `ui/menu-favorites`: Gestión de favoritos del menú lateral por usuario, con acceso desde el header y capacidad de marcar/desmarcar ítems.
- `ui/menu-search`: Campo de búsqueda en tiempo real dentro del menú lateral que filtra por nombre y descripción de los ítems.

### Modified Capabilities

- `ui/sidebar-menu`: Se extiende el contrato del menú lateral para incluir descripciones por ítem (tooltip), soporte a favoritos y al campo de búsqueda integrado.

## Impact

- **Frontend (Angular)**: Componentes del sidebar (`SidebarMenuComponent`, `HeaderComponent`) y posiblemente el modelo de definición de ítems de menú.
- **Estado/Persistencia**: Las preferencias de favoritos del usuario deben persistirse por usuario (localStorage o API de preferencias).
- **Definición de menú**: La configuración estática o dinámica de los ítems de menú debe extenderse para incluir el campo `description`.
- **Sin impacto en API de negocio**: Esta mejora es puramente de capa UI/UX; no afecta endpoints de dominio existentes.
