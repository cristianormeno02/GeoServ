## Why

Los ítems de menú marcados como favoritos se guardan hoy únicamente en `localStorage` del navegador (`MenuFavoritesService`), namespaced por `userId`. Esto hace que los favoritos no viajen entre navegadores ni dispositivos, y se pierdan si el usuario borra los datos del sitio o usa una sesión privada, contradiciendo la expectativa (y el requisito ya documentado) de que los favoritos persistan "por usuario". Deben guardarse en la base de datos, asociados al usuario autenticado, para que sean realmente persistentes y consistentes en cualquier navegador o dispositivo donde el usuario inicie sesión.

## What Changes

- Nueva tabla `UserMenuFavorites` (backend) que asocia `UserId` con la ruta (`path`) del ítem de menú favorito y su orden.
- Nuevo endpoint REST `/api/user-menu-favorites` (GET, POST, DELETE) protegido con `RequireAuthorization()`, que opera siempre sobre el usuario autenticado (tomado del claim `NameIdentifier` del JWT), nunca sobre un `userId` recibido del cliente.
- `MenuFavoritesService` (frontend) se reescribe para consumir la API en lugar de `localStorage`: carga los favoritos del usuario autenticado al iniciar sesión y sincroniza cada alta/baja contra el backend.
- El ítem favorito se identifica y persiste por su `path` (clave ya usada para comparar duplicados); el nombre/ícono/descripción se siguen resolviendo desde la definición estática del menú, no se duplican en la base de datos. La definición del menú (`menuGroups`, hoy privada dentro de `SidebarComponent`) se extrae a un archivo de configuración compartido para que tanto `SidebarComponent` como `HeaderComponent` y `MenuFavoritesService` puedan resolver un `path` a su `NavItem` completo.
- Migración transparente: si al cargar los favoritos la API devuelve una lista vacía y el navegador tiene favoritos guardados en `localStorage` de una sesión previa, el servicio los envía una única vez al backend y limpia el `localStorage`, evitando que el usuario pierda sus favoritos existentes.

## Capabilities

### New Capabilities
(ninguna — se reutiliza la capability existente)

### Modified Capabilities
- `ui/menu-favorites`: el requisito "Persistencia de favoritos por usuario" cambia de persistencia local (`localStorage`) a persistencia en base de datos vía API, incluyendo el comportamiento ante errores de red/API al cargar o guardar favoritos.

## Impact

- **Backend**: nueva entidad `UserMenuFavorite`, `DbSet` en `GeoServDbContext`, migración EF Core, nuevo `UserMenuFavoriteEndpoints.cs`, registro en `Program.cs`.
- **Frontend**: `MenuFavoritesService` (reescritura de la fuente de datos, misma API pública `getFavorites$`/`addFavorite`/`removeFavorite`/`isFavorite` donde sea posible, con reseteo del estado en memoria al cerrar sesión), `HeaderComponent` y `SidebarComponent` (consumidores del servicio, posible ajuste por la naturaleza asíncrona de la carga inicial), y una nueva definición compartida del menú (`menuGroups` deja de ser privada de `SidebarComponent`).
- **Base de datos**: nueva tabla con FK a `Users` (borrado en cascada al eliminar el usuario).
- Sin impacto en otras capabilities ni en datos existentes de otras tablas.
