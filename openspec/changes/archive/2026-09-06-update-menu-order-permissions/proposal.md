## Why

La actual estructura del menú requiere una reorganización para agrupar las funcionalidades por asociaciones lógicas y mejorar la experiencia de usuario. Además, se necesitan definir los permisos de acceso a las distintas opciones según los roles del sistema, y el ícono para colapsar/desplegar el menú necesita un ajuste de color para ser visible sin perder la armonía con la paleta de colores.

## What Changes

- Reordenar los elementos del menú en grupos lógicos (Inicio, Operaciones, Contactos, Recursos, Finanzas, Administración).
- Agregar separadores visuales dentro de los grupos del menú para mejorar la lectura.
- Aplicar restricciones de visibilidad a los ítems del menú basadas en los roles (Administrador, Operador, Cliente).
- Agregar nuevo ítem de menú "Dashboard Cliente" (acceso para Administrador y Cliente) que apunte a una página en blanco.
- Agregar nuevo ítem de menú "Inventario" bajo Recursos (acceso para Administrador) que apunte a una página en blanco.
- Agregar nuevo ítem de menú "Resumen" bajo Finanzas (acceso para Administrador) que apunte a una página en blanco.
- Modificar el color del ícono de colapsar/desplegar el sidebar para que contraste con el fondo oscuro, respetando la paleta de colores del sistema.

## Capabilities

### New Capabilities
- ui/sidebar-menu: Estructura, agrupaciones, y reglas de visibilidad por roles para la barra de navegación lateral.

### Modified Capabilities

## Impact

- Layout general de la aplicación (Sidebar).
- Componentes de navegación (rutas para las nuevas páginas en blanco).
- Control de acceso en la UI (Renderizado condicional basado en roles).
