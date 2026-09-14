## Purpose

Garantiza que la interfaz de usuario de la plataforma GeoServ sea completamente utilizable y adaptable en dispositivos móviles, tablets y escritorios mediante comportamiento responsivo del layout y menú lateral.

## Requirements

### Requirement: Adaptabilidad del Menú Lateral según Pantalla
El sistema DEBE ajustar automáticamente el modo y comportamiento del menú lateral (`mat-sidenav`) en función del ancho del viewport del dispositivo detectado mediante `BreakpointObserver`.

#### Scenario: Visualización en pantallas de escritorio
- **WHEN** el usuario accede desde una pantalla de resolución de escritorio (ancho mayor a 960px)
- **THEN** el sidenav DEBE posicionarse en modo `side`, permanecer abierto por defecto y permitir alternar colapsado/expandido sin superponerse como modal.

#### Scenario: Visualización en pantallas móviles o tablets
- **WHEN** el usuario accede desde un dispositivo móvil o tablet (ancho menor o igual a 960px)
- **THEN** el sidenav DEBE configurarse en modo `over`, permanecer cerrado por defecto al cargar la vista y superponerse con backdrop oscurecido cuando se abra.

#### Scenario: Cierre automático al seleccionar una ruta en móvil
- **WHEN** el sidenav está desplegado en un dispositivo móvil y el usuario selecciona un enlace de navegación
- **THEN** el sistema DEBE navegar a la ruta destino y cerrar automáticamente el menú lateral para liberar el espacio visual.

#### Scenario: Interacción con el estado de colapsado/expandido existente
- **WHEN** el sidenav está en modo `over` (móvil o tablet, ancho menor o igual a 960px)
- **THEN** el sidebar DEBE forzarse al estado expandido (no colapsado de solo-íconos) y el control para colapsar/expandir manualmente DEBE deshabilitarse, evitando la combinación de sidenav superpuesto con menú colapsado.

### Requirement: Botón de Alternancia de Menú en Encabezado
El encabezado del sistema DEBE proveer un control visible y accesible que permita abrir y cerrar el menú lateral en cualquier resolución de pantalla.

#### Scenario: Activación de botón de menú en móvil
- **WHEN** un usuario en dispositivo móvil presiona el botón hamburguesa en el encabezado
- **THEN** el menú lateral DEBE abrirse o cerrarse según su estado previo sin romper la disposición de los elementos del encabezado.
