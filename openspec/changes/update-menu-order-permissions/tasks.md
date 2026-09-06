## 1. Vistas y Rutas

- [x] 1.1 Crear componente básico en blanco para "Dashboard Cliente" y agregarlo a la tabla de rutas, verificando que la ruta exista en el router.
- [x] 1.2 Crear componente básico en blanco para "Inventario" y agregarlo a la tabla de rutas, verificando que la ruta exista en el router.
- [x] 1.3 Crear componente básico en blanco para "Resumen" de Finanzas y agregarlo a la tabla de rutas, verificando que la ruta exista en el router.

## 2. Configuración de Menú

- [x] 2.1 Actualizar el archivo de configuración del menú lateral para organizar los ítems en los grupos: Inicio, Operaciones, Contactos, Recursos, Finanzas, Administración. Verificar que la configuración cargue sin errores de sintaxis.
- [x] 2.2 Agregar la propiedad de 
oles a cada ítem del menú de acuerdo a los permisos especificados (Administrador, Operador, Cliente). Verificar que todos los ítems tengan su propiedad definida.
- [x] 2.3 Incluir separadores visuales dentro de los grupos del menú según lo especificado.

## 3. Renderizado y Lógica del Sidebar

- [x] 3.1 Modificar el componente Sidebar para verificar el rol del usuario (desde Auth o context) y renderizar únicamente los ítems permitidos. Verificar manualmente iniciando sesión con distintos roles (Administrador, Operador, Cliente).
- [x] 3.2 Modificar el componente Sidebar para que renderice los elementos de tipo "separador" como líneas divisorias en lugar de enlaces. Verificar visualmente la renderización de las divisiones.
- [x] 3.3 Ajustar la clase de estilo (color de fondo/texto) del botón/ícono de colapsar y desplegar el menú para que sea visible en modo oscuro. Verificar la legibilidad y contraste del ícono.
