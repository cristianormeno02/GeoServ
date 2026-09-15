## Context

`MenuFavoritesService` (frontend/src/app/core/services/menu-favorites.service.ts) guarda hoy los favoritos en `localStorage` bajo la clave `menu_favorites_<userId>`, con `userId` extraído del claim `NameIdentifier`/`sub` del JWT decodificado en el propio frontend. La estructura del menú lateral (`menuGroups: NavGroup[]`, con sus `NavItem` de `name`/`path`/`icon`/`description`) es estática y vive en `SidebarComponent`; el `path` de cada ítem ya se usa como clave de igualdad (`f.path === item.path`) para evitar duplicados y para comprobar si un ítem es favorito.

El backend (.NET 9, Minimal APIs) sigue un patrón uniforme por entidad: `Domain/Entities/*.cs`, `DbSet` en `GeoServDbContext`, un archivo `Endpoints/*Endpoints.cs` con `MapGroup(...).RequireAuthorization()`, y obtención del usuario autenticado vía `httpContext.User.FindFirstValue(ClaimTypes.NameIdentifier)` (ver `DirectCostEndpoints.cs`, `AccountingMovementEndpoints.cs`, `InventoryMovementEndpoints.cs`). Ver proposal.md - Why para la motivación del cambio.

## Goals / Non-Goals

**Goals:**
- Persistir el conjunto de `path` favoritos de cada usuario en la base de datos, con el usuario resuelto siempre desde el token (nunca desde un parámetro del cliente).
- Mantener la interfaz pública de `MenuFavoritesService` lo más parecida posible (`getFavorites$`, `addFavorite`, `removeFavorite`, `isFavorite`) para minimizar cambios en `HeaderComponent`/`SidebarComponent`.
- Degradar con gracia ante errores de red: la app sigue siendo usable aunque no se puedan leer o guardar favoritos.

**Non-Goals:**
- No se persisten `name`/`icon`/`description` del ítem en la base de datos; esos datos siguen resolviéndose desde `menuGroups` en el frontend a partir del `path` guardado. Si un `path` favorito ya no existe en el menú del rol actual, simplemente no se renderiza (se ignora, no se elimina de la base de datos).
- No se agrega reordenamiento manual de favoritos por parte del usuario (se conserva el orden de alta, como hoy).
- La migración transparente desde `localStorage` (ver Decisions) es de una sola vía y "mejor esfuerzo": si falla el envío al backend, simplemente no se migra y el `localStorage` se conserva para reintentar en la próxima carga; no se garantiza ni se bloquea la carga de la app por esto.

## Decisions

### Modelo de datos: tabla `UserMenuFavorites` con clave por `(UserId, MenuPath)`
Entidad `UserMenuFavorite`: `Id (Guid)`, `UserId (Guid, FK a Users, cascade delete)`, `MenuPath (string, requerido, `HasMaxLength(250)`)`, `CreatedAt (DateTime)`. Índice único compuesto `(UserId, MenuPath)` para evitar duplicados a nivel de base de datos (hoy la deduplicación ocurre solo en el cliente). El orden de la lista se determina por `CreatedAt` ascendente, igual que hoy con el array de `localStorage`.

El proyecto usa PostgreSQL (Npgsql) y, a diferencia de SQL Server, no falla al indexar una columna `text` sin longitud acotada. Aun así, se acota `MenuPath` a 250 caracteres explícitamente porque es una columna indexada (mantiene el índice compacto y evita valores patológicos), aunque el resto del esquema no use `HasMaxLength` por convención — es una excepción justificada por ser clave de índice, no un cambio de convención general.

Alternativa considerada: guardar un único registro por usuario con un JSON/array de paths (similar a `EmpresaConfiguracion` para otros ajustes). Se descarta porque una fila por favorito permite altas/bajas atómicas sin leer-modificar-escribir todo el conjunto, evita condiciones de carrera entre pestañas, y es el patrón más consistente con el resto del esquema (tablas de relación como `ServiceOrderResponsible`).

### Identidad del ítem: solo `path`, no el `NavItem` completo
Se persiste únicamente el `path` (string), no `name`/`icon`/`description`. Estos ya son estáticos en el frontend y duplicarlos en la base de datos los volvería una fuente de verdad paralela que podría desincronizarse (p. ej. si se traduce o renombra un ítem del menú). El frontend, al recibir la lista de `path` favoritos, resuelve cada uno para obtener el `NavItem` completo a mostrar.

Actualmente `menuGroups: NavGroup[]` es una propiedad `readonly` **privada** de `SidebarComponent`, por lo que ni `MenuFavoritesService` ni `HeaderComponent` pueden resolver un `path` a su `NavItem` (nombre/ícono/descripción) hoy — es un requisito bloqueante para esta propuesta, no solo un detalle interno. Se extrae `menuGroups` a un archivo de configuración compartido (p. ej. `core/config/menu.config.ts`) junto con un helper `findNavItemByPath(path: string): NavItem | undefined` que recorre todos los grupos. `SidebarComponent` pasa a importar `menuGroups` desde ahí en lugar de declararlo inline; `HeaderComponent` y `MenuFavoritesService` usan `findNavItemByPath` para reconstruir el `NavItem` de cada favorito.

### Endpoints: `/api/user-menu-favorites`
- `GET /api/user-menu-favorites` → `string[]` de `path` favoritos del usuario autenticado.
- `POST /api/user-menu-favorites` con body `{ path: string }` → agrega (idempotente: si ya existe, `204` sin duplicar).
- `DELETE /api/user-menu-favorites?path={path}` → quita el favorito, con `path` como **query parameter** (no como segmento de ruta). Un `path` de menú es en sí mismo una ruta con barras (p. ej. `/finance/movimientos`); pasarlo como segmento (`DELETE /api/user-menu-favorites/{path}`) obliga a URL-encodear las barras (`%2F`) dentro de un segmento de ruta, y tanto Kestrel como proxies intermedios pueden normalizar o rechazar esa forma antes de que llegue al endpoint. Usar query string evita por completo ese problema de encoding/decoding de segmentos.

Todos los endpoints usan `RequireAuthorization()` y derivan el `UserId` exclusivamente de `ClaimTypes.NameIdentifier` del `HttpContext.User` (igual que `DirectCostEndpoints.cs`), de modo que un usuario nunca puede leer ni modificar los favoritos de otro aunque manipule el request.

### Frontend: `MenuFavoritesService` pasa de síncrono a asíncrono
Hoy `getFavorites(userId)` y `isFavorite(userId, item)` son síncronos porque leen de `localStorage`. Con la API, la carga inicial es asíncrona: el servicio expondrá `getFavorites$(userId)` (ya asíncrono/reactivo, sin cambios de firma) respaldado por un `BehaviorSubject` que arranca vacío y se llena tras la primera respuesta HTTP al hacer login/bootstrap. `addFavorite`/`removeFavorite` aplican optimistic update sobre el `BehaviorSubject` y llaman a la API; si la llamada falla, revierten el estado local y se lo comunican al usuario (vía el mecanismo de notificaciones/snackbar ya usado en la app), conforme al escenario "Error al guardar un favorito" de la spec.

Alternativa considerada: mantener `isFavorite()` síncrono cacheando en memoria. Se conserva como método derivado del último valor del `BehaviorSubject` (no dispara HTTP), ya que sidebar/header solo lo usan para pintar el estado activo del ícono, no antes de que carguen los favoritos.

### Estado en memoria: reseteo en logout y migración transparente desde `localStorage`
El servicio mantiene, igual que hoy, un `Map<userId, BehaviorSubject<NavItem[]>>` en memoria (no un único subject global), por lo que dos usuarios distintos que inician sesión en la misma pestaña nunca comparten el mismo `BehaviorSubject` — cada `userId` obtiene el suyo. El riesgo real no es "ver los favoritos de otro", sino servir una copia **obsoleta** al mismo usuario: si el mismo usuario cierra sesión y vuelve a iniciar sesión en la misma pestaña (sin recargar el navegador) después de haber cambiado sus favoritos desde otro dispositivo, el `Map` seguiría teniendo su `BehaviorSubject` anterior en memoria y lo serviría sin volver a pedirlo al servidor. Por eso `AuthService` expone (o el servicio se suscribe a) el evento de logout, y `MenuFavoritesService` limpia el `Map` completo en ese momento, forzando una recarga desde la API en el siguiente login.

Además, en la primera carga exitosa (`GET` responde `200` con lista vacía) el servicio revisa si existen favoritos en `localStorage` bajo la clave legada `menu_favorites_<userId>`: si existen, los envía al backend uno por uno (o en lote, según lo que soporte el endpoint) y, solo si todos se guardaron correctamente, borra esa clave de `localStorage`. Esto convierte lo que antes se documentaba como pérdida de datos (BREAKING) en una migración transparente de una sola vez para los usuarios que ya tenían favoritos guardados localmente.

## Risks / Trade-offs

- [La migración transparente desde `localStorage` corre en dos navegadores distintos del mismo usuario] → Si el usuario tenía favoritos distintos guardados en dos navegadores/dispositivos, cada uno migrará los suyos por separado la primera vez que cargue con conexión al backend, y el resultado final es la **unión** de ambos conjuntos (el índice único evita duplicados). Se documenta como comportamiento esperado, no como bug: es preferible a perder datos.
- [Ítems favoritos "huérfanos" si cambia el menú de un rol] → El `path` favorito que ya no existe en el menú para el rol actual simplemente no se renderiza; no se limpia de la base de datos automáticamente. Riesgo bajo (filas extra sin impacto funcional); se puede limpiar con una tarea de mantenimiento futura si crece el volumen.
- [Llamadas HTTP adicionales en cada toggle de favorito] → Volumen esperado bajo (acción manual del usuario, no en bucle); no requiere debounce ni batching.
- [Migración transparente falla a mitad de camino (algunos `path` se guardan, otros no)] → El `localStorage` solo se borra si **todos** los `path` migraron con éxito; si falla alguno, se conserva íntegro para reintentar en la siguiente carga (puede producir favoritos duplicados entre lo ya migrado y un reintento, pero el índice único los deduplica sin error).

## Migration Plan

1. Migración EF Core que crea `UserMenuFavorites` con FK `OnDelete(DeleteBehavior.Cascade)` hacia `Users` y `MenuPath` acotado con `HasMaxLength(250)`.
2. Deploy de backend con el nuevo endpoint (no rompe nada existente).
3. Deploy de frontend con el nuevo `MenuFavoritesService`: en la primera carga por usuario, migra automáticamente los favoritos que hubiera en `localStorage` hacia la API (ver Decisions) antes de limpiar esa clave.
4. Sin rollback especial requerido: revertir el deploy de frontend vuelve a `localStorage` (los datos de la tabla nueva quedan sin uso pero no interfieren; si la migración ya había limpiado el `localStorage` de algún usuario antes del rollback, ese usuario re-marca sus favoritos una vez, igual que en el escenario original sin migración); revertir el backend requiere revertir también la migración si se desea eliminar la tabla, aunque puede dejarse sin uso sin riesgo.
