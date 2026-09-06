## Context

Se debe modificar el menú de navegación lateral (Sidebar) para incorporar nuevas vistas (Inventario, Dashboard Cliente, Resumen), agrupar los ítems lógicamente con separadores, y aplicar restricciones de visualización de acuerdo a los roles de los usuarios (Administrador, Operador, Cliente). Además, es necesario corregir el color del ícono de colapso para que sea más visible.

## Goals / Non-Goals

**Goals:**
- Actualizar el array o configuración de rutas del sidebar para reflejar el nuevo orden y agrupaciones.
- Implementar renderizado condicional de los ítems del menú basado en los roles extraídos del contexto de autenticación o sesión.
- Crear rutas y páginas "en blanco" básicas para los tres nuevos endpoints (Inventario, Dashboard Cliente, Resumen).
- Ajustar las clases de Tailwind (o CSS) del ícono de colapso del menú para que su color contraste con el fondo.

**Non-Goals:**
- Implementar la lógica o el contenido funcional de las nuevas páginas "en blanco" (Inventario, Dashboard Cliente, Resumen).
- Modificar la estructura general del layout más allá del contenido del Sidebar.

## Decisions

- **Configuración centralizada del Menú:** Se actualizará el archivo de configuración del menú (generalmente un array de objetos con las propiedades de ruta, nombre, icono y roles permitidos) para incluir la propiedad oles en cada ítem.
- **Manejo de permisos en componentes:** El componente Sidebar (o equivalente) iterará sobre la configuración del menú y verificará si el rol del usuario actual se encuentra dentro del array oles del ítem. Si no está, el ítem no se renderiza.
- **Separadores visuales:** Se agregarán ítems de tipo "separador" en la configuración del menú, los cuales el componente Sidebar renderizará como un divisor visual (<hr> o borde inferior) en lugar de un enlace.

## Risks / Trade-offs

- **Risk:** Rutas accesibles por URL. Si solo se oculta el ítem en el menú, un usuario podría acceder a la URL manualmente.
  - **Mitigation:** Asegurar que los componentes de las rutas (Router) también verifiquen los roles (Auth Guard) antes de renderizar la página.
- **Risk:** Conflicto de colores con el tema claro/oscuro (si aplica).
  - **Mitigation:** Usar clases de utilidad de color adaptativas (ej. clases de Tailwind estándar del diseño actual) para el botón de colapsar.
