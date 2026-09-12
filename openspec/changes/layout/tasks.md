## 1. Extensión del modelo de ítems de menú

- [x] 1.1 Agregar el campo opcional `description?: string` (máximo 100 caracteres) a la interfaz/tipo `NavItem` (o equivalente) que define los ítems del menú lateral, y verificar que el compilador de TypeScript no reporte errores en los sitios de uso existentes.
- [x] 1.2 Actualizar la definición estática de ítems de menú para agregar una descripción representativa a cada ítem, y verificar que la aplicación compile sin errores y los ítems sin descripción no produzcan advertencias en consola.

## 2. Tooltips de descripción en el menú lateral

- [x] 2.1 Agregar la directiva `matTooltip` a cada ítem del `SidebarMenuComponent` para mostrar `item.description` cuando el campo está definido. Verificar que al pasar el mouse sobre un ítem con descripción aparece el tooltip correctamente.
- [x] 2.2 Verificar el comportamiento del tooltip en estado colapsado del sidebar: el tooltip MUST mostrar nombre y descripción del ítem cuando el sidebar está colapsado (solo íconos visibles).
- [x] 2.3 Verificar que los ítems sin campo `description` no muestran ningún tooltip.

## 3. Servicio de gestión de favoritos

- [x] 3.1 Crear `MenuFavoritesService` como servicio singleton Angular con métodos `getFavorites(userId): NavItem[]`, `addFavorite(userId, item)`, `removeFavorite(userId, item)` e `isFavorite(userId, item): boolean`. Persistir en `localStorage` con clave `menu_favorites_<userId>`. Verificar que los métodos agregan y eliminan correctamente ejecutando pruebas unitarias del servicio.
- [x] 3.2 Exponer un Observable o signal reactivo `favorites$` que emita la lista actualizada de favoritos cada vez que cambia. Verificar que los suscriptores reciben la nueva lista al agregar o quitar un favorito.

## 4. Toggle de favoritos en el menú lateral

- [x] 4.1 Agregar un ícono/botón de toggle de favorito a cada ítem del `SidebarMenuComponent` (ej. estrella o corazón) que muestre visualmente si el ítem es favorito. Verificar que el indicador visual es correcto al renderizar el menú con ítems favoritos y no favoritos.
- [x] 4.2 Conectar el toggle al `MenuFavoritesService` de modo que al hacer clic: si el ítem no es favorito lo agrega, si ya es favorito lo quita. Verificar que el estado visual se actualiza inmediatamente sin necesidad de recargar.

## 5. Campo de búsqueda en el menú lateral

- [x] 5.1 Agregar un campo de texto de búsqueda en la parte superior del área de ítems del `SidebarMenuComponent`, debajo del nombre del usuario y antes del primer grupo de menú. Verificar que el campo es visible cuando el sidebar está expandido.
- [x] 5.2 Implementar el filtrado reactivo en tiempo real: al escribir en el campo, el menú muestra solo los ítems cuyo `name` o `description` contiene el texto ingresado (sin distinción de mayúsculas/minúsculas). Verificar que al ingresar un término que coincide solo con la descripción de un ítem, ese ítem aparece en los resultados.
- [x] 5.3 Mostrar un mensaje "Sin resultados" cuando el texto ingresado no coincide con ningún ítem. Verificar que el mensaje aparece correctamente al ingresar texto sin coincidencias.
- [x] 5.4 Verificar que al borrar el texto del campo de búsqueda se restaura el menú completo con todos los grupos y separadores.

## 6. Panel de favoritos en el header

- [x] 6.1 Agregar el botón/acceso "Favoritos" en el `HeaderComponent`. Verificar que el botón es visible en el header para usuarios autenticados.
- [x] 6.2 Implementar el panel desplegable (dropdown con `mat-menu` o Angular CDK overlay) que lista los ítems favoritos del usuario con ícono y nombre, suscribiéndose al `favorites$` del `MenuFavoritesService`. Verificar que al hacer clic en "Favoritos" se despliega el panel con los ítems favoritos del usuario.
- [x] 6.3 Agregar la opción de quitar favorito desde cada ítem del panel del header, y verificar que al quitarlo el ítem desaparece del panel inmediatamente y el indicador en el menú lateral refleja el estado inactivo.
- [x] 6.4 Verificar que cuando el usuario no tiene favoritos el panel muestra un mensaje informativo (ej. "Aún no tienes favoritos seleccionados").

## 7. Verificación de integración y regresión

- [x] 7.1 Verificar que los tres roles (Administrador, Operador, Cliente) continúan viendo únicamente los ítems que les corresponden según sus permisos (no regresión en el control de acceso por roles).
- [x] 7.2 Verificar que los favoritos persisten al recargar la aplicación: marcar un ítem, recargar la página y confirmar que el ítem sigue marcado como favorito y aparece en el panel del header.
- [x] 7.3 Verificar que el namespacing por `userId` en localStorage previene que los favoritos de un usuario se muestren a otro usuario en el mismo navegador.
