## MODIFIED Requirements

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

## ADDED Requirements

### Requirement: Descripción de ítems de menú como tooltip
El sistema SHALL asociar una descripción de hasta 100 caracteres a cada ítem del menú lateral. Esta descripción SHALL mostrarse como tooltip al pasar el mouse por encima del ítem en el menú, tanto en el estado expandido como colapsado del sidebar.

#### Scenario: Visualización del tooltip en menú expandido
- **WHEN** el usuario posiciona el mouse sobre un ítem del menú lateral estando el sidebar en estado expandido
- **THEN** se muestra un tooltip con la descripción del ítem (máximo 100 caracteres)

#### Scenario: Visualización del tooltip en menú colapsado
- **WHEN** el usuario posiciona el mouse sobre un ítem del menú lateral estando el sidebar en estado colapsado (solo íconos)
- **THEN** se muestra un tooltip con el nombre y la descripción del ítem

#### Scenario: Ítem sin descripción configurada
- **WHEN** un ítem de menú no tiene descripción definida y el usuario pasa el mouse por encima
- **THEN** no se muestra ningún tooltip (el comportamiento es equivalente al estado actual)
