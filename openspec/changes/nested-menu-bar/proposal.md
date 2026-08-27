## Why

Actualmente, la barra de menú de la aplicación muestra una lista plana de 12 elementos. Esta lista larga dificulta la búsqueda rápida de funcionalidades y satura visualmente la interfaz de navegación. Implementar un menú anidado y colapsable agrupará los elementos lógicamente, mejorando la usabilidad y la experiencia del usuario.

## What Changes

- Reestructuración del menú en 6 categorías principales colapsables (Inicio, Operaciones, Contactos, Recursos, Finanzas, Administración) y una opción de Salir, incorporando además nuevas secciones requeridas (Dashboard, Inventario, Activos, Resumen, Movimientos, Cheques, Cuentas Bancarias, Categorías de Movimiento).
- Implementación de un menú lateral colapsable (acordeón) donde las categorías principales se pueden expandir para revelar sus sub-elementos.
- Preservación de las rutas (routes) e íconos actuales de cada sección.

## Capabilities

### New Capabilities
- `frontend/layout/nested-menu`: Define el comportamiento y la estructura del nuevo menú lateral con estilo acordeón y agrupaciones lógicas en la interfaz de usuario.

### Modified Capabilities

## Impact

- Modificación del componente de layout principal (`main-layout.component.ts` y posiblemente su template).
- Afecta la navegación principal de toda la aplicación web.
- Dependencias de UI: uso de `MatExpansionModule` o menús anidados de Angular Material (`MatMenu` / custom sub-menus) para lograr el comportamiento colapsable.
