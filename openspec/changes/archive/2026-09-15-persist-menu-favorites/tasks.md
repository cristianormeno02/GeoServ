## 1. Backend: modelo de datos

- [x] 1.1 Crear `Domain/Entities/UserMenuFavorite.cs` con `Id (Guid)`, `UserId (Guid)`, `User (navigation)`, `MenuPath (string)`, `CreatedAt (DateTime)`, y verificar que compila con `dotnet build`.
- [x] 1.2 Agregar `DbSet<UserMenuFavorite> UserMenuFavorites` a `GeoServDbContext` y configurar en `OnModelCreating`: `b.Property(f => f.MenuPath).HasMaxLength(250).IsRequired()`, FK a `User` con `OnDelete(DeleteBehavior.Cascade)` e índice único compuesto sobre `(UserId, MenuPath)`.
- [x] 1.3 Generar la migración EF Core (`dotnet ef migrations add AddUserMenuFavorites`) y aplicarla contra la base de datos local (`dotnet ef database update`); verificar que la tabla `UserMenuFavorites` se crea con el índice único esperado.

## 2. Backend: endpoints

- [x] 2.1 Crear `Endpoints/UserMenuFavoriteEndpoints.cs` con `MapGroup("/api/user-menu-favorites").RequireAuthorization()` y `MapGetUserMenuFavoriteEndpoints` registrado en `Program.cs` junto al resto de `Map*Endpoints`.
- [x] 2.2 Implementar `GET /api/user-menu-favorites`: devuelve `string[]` de `MenuPath` del usuario autenticado (resuelto desde `ClaimTypes.NameIdentifier`), ordenados por `CreatedAt` ascendente; verificar con una llamada autenticada que devuelve `200` y la lista esperada.
- [x] 2.3 Implementar `POST /api/user-menu-favorites` (body `{ path }`): crea el favorito si no existe (idempotente, sin duplicar por el índice único); devuelve `204`. Verificar que llamar dos veces con el mismo `path` no genera error ni fila duplicada.
- [x] 2.4 Implementar `DELETE /api/user-menu-favorites?path={path}` (`path` como **query parameter**, `[FromQuery] string path`, no como segmento de ruta, para evitar problemas de encoding de `/` en segmentos): elimina el favorito del usuario autenticado si existe; devuelve `400` si `path` es nulo o vacío, y `204` incluso si no existía (idempotente). Verificar que un usuario no puede eliminar favoritos de otro usuario (probar con dos usuarios distintos y confirmar aislamiento).
- [x] 2.5 Verificar mediante pruebas manuales o de integración que los tres endpoints exigen autenticación (`401` sin token) y que el `UserId` siempre se toma del token, nunca de un parámetro del request.

## 3. Frontend: servicio de favoritos

- [x] 3.0 Extraer `menuGroups` (hoy `readonly` privado en `SidebarComponent`) a un archivo de configuración compartido, p. ej. `core/config/menu.config.ts`, junto con un helper `findNavItemByPath(path: string): NavItem | undefined`; actualizar `SidebarComponent` para importar `menuGroups` desde ahí. Verificar que `SidebarComponent` sigue renderizando el menú igual que antes (pruebas existentes de `sidebar.component.spec.ts` en verde).
- [x] 3.1 Crear un `MenuFavoritesApiService` (o extender el existente) que llame a `GET/POST /api/user-menu-favorites` y `DELETE /api/user-menu-favorites?path=` usando el `HttpClient` con el interceptor de auth ya configurado; verificar con pruebas unitarias que arma las URLs (query param en el DELETE) y payloads correctos.
- [x] 3.2 Reescribir `MenuFavoritesService` (frontend/src/app/core/services/menu-favorites.service.ts) para respaldar el `BehaviorSubject` por usuario con datos de la API en lugar de `localStorage`: cargar favoritos al resolver el `userId` (login/bootstrap) y exponer `getFavorites$`/`isFavorite` con la misma firma pública, resolviendo cada `path` contra `findNavItemByPath` (tarea 3.0).
- [x] 3.3 Implementar `addFavorite`/`removeFavorite` con actualización optimista sobre el `BehaviorSubject` + llamada a la API; en caso de error HTTP, revertir el estado local y emitir una notificación de error visible al usuario. Verificar con pruebas unitarias (mock de `HttpClient`) ambos casos: éxito y fallo con reversión.
- [x] 3.4 Manejar el error de carga inicial (`GET` falla): el servicio debe emitir una lista vacía en `getFavorites$` sin lanzar excepción no controlada, dejando el resto de la app funcional. Verificar con una prueba unitaria que simula un error 500/timeout en la carga.
- [x] 3.5 Implementar la migración transparente: si el `GET` inicial devuelve una lista vacía y existe `localStorage['menu_favorites_' + userId]` con datos, enviar esos `path` al backend (uno por uno o en lote) y, solo si todos se guardan con éxito, eliminar esa clave de `localStorage`. Verificar con una prueba unitaria que simula favoritos previos en `localStorage` y confirma que se llama a la API y se limpia la clave únicamente en caso de éxito total.
- [x] 3.6 Suscribir `MenuFavoritesService` al evento de logout de `AuthService` (o invocar un método `clear()` explícito desde `logout()`) para vaciar el `Map<userId, BehaviorSubject>` en memoria, evitando servir datos obsoletos si el mismo usuario vuelve a iniciar sesión en la misma pestaña sin recargar el navegador. Verificar con una prueba unitaria que, tras `clear()`, una nueva llamada a `getFavorites$(userId)` dispara un nuevo `GET` a la API en lugar de reusar el `BehaviorSubject` anterior.
- [x] 3.7 Actualizar `menu-favorites.service.spec.ts` (si existe) o crear pruebas unitarias nuevas que cubran los escenarios de la spec: alta, baja, error al guardar (reversión), error al cargar, migración desde `localStorage`, reseteo en logout, y aislamiento entre dos `userId` distintos.

## 4. Frontend: integración en header y sidebar

- [x] 4.1 Revisar `HeaderComponent` y `SidebarComponent` para confirmar que siguen funcionando con la nueva naturaleza asíncrona del servicio (el primer render puede no tener favoritos hasta que resuelva la carga inicial) y que `HeaderComponent` resuelve el `NavItem` de cada favorito vía `findNavItemByPath` (tarea 3.0); ajustar si algún consumo asumía disponibilidad síncrona inmediata.
- [x] 4.2 Verificar manualmente en el navegador (`ng serve`) el flujo completo: marcar favorito → recargar página → favorito persiste; cerrar sesión, volver a loguearse → favorito persiste; loguearse con un usuario distinto → no ve los favoritos del primero; con favoritos previos guardados en `localStorage` de una versión anterior, loguearse → se migran automáticamente a la base de datos.

## 5. Validación final

- [x] 5.1 Ejecutar la suite de pruebas backend (`dotnet test`) y frontend (`ng test`) y confirmar que pasan sin regresiones.
- [x] 5.2 Ejecutar `openspec validate persist-menu-favorites --strict` y corregir cualquier hallazgo antes de marcar el change como listo para archivar.
