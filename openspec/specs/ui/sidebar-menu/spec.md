## Purpose

Establece la estructura, el orden, las agrupaciones visuales y los permisos de acceso para la barra de navegación lateral principal de la aplicación.

## Requirements

### Requirement: Agrupación y Orden del Menú
El sistema MUST mostrar el menú lateral organizado en los siguientes grupos lógicos en el orden especificado: Inicio, Operaciones, Contactos, Recursos, Finanzas, Administración. El menú MUST incluir separadores visuales donde esté especificado para mejorar la legibilidad.

#### Scenario: Visualización completa de grupos
- **WHEN** un usuario con rol Administrador accede al sistema
- **THEN** el sidebar muestra todos los grupos definidos (Inicio, Operaciones, Contactos, Recursos, Finanzas, Administración) y los separadores visuales entre subgrupos.

### Requirement: Control de Acceso por Roles
El sistema MUST restringir la visibilidad y los enlaces de navegación de los ítems del menú lateral según los roles del usuario autenticado, asegurando que "Dashboard Cliente" dirija a `/dashboard/cliente`.

#### Scenario: Acceso de Operador
- **WHEN** un usuario con rol Operador accede al sistema
- **THEN** el sidebar solo muestra el ítem "Mi Dashboard" bajo el grupo Inicio, y oculta el resto de opciones que requieren rol Administrador o Cliente.

#### Scenario: Acceso de Cliente
- **WHEN** un usuario con rol Cliente accede al sistema
- **THEN** el sidebar solo muestra el ítem "Dashboard Cliente" bajo el grupo Inicio y su enlace dirige a `/dashboard/cliente`.

### Requirement: Estilo del ícono de colapsado
El sistema MUST renderizar el ícono de colapsar/desplegar el menú con un color que contraste adecuadamente con el fondo del sidebar.

#### Scenario: Visibilidad del ícono
- **WHEN** el sidebar es renderizado en pantalla
- **THEN** el botón para colapsar/desplegar es claramente visible y respeta la paleta de colores del sistema.
