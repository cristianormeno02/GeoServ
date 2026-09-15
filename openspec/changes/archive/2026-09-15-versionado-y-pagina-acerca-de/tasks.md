## 1. Versionado SemVer y Release Automático

- [x] 1.1 Crear `package.json` en la raíz del repo (versión `1.0.0`, scripts `release`/`release:minor`/`release:major`/`release:patch`) e instalar `commit-and-tag-version` como devDependency.
- [x] 1.2 Configurar `.versionrc.json` con `bumpFiles` apuntando a `package.json`, `frontend/package.json` y `backend/GeoServ.Api/GeoServ.Api.csproj`, y tipos de commit en español para el `CHANGELOG.md`.
- [x] 1.3 Implementar `scripts/csproj-version-updater.cjs` (updater custom de `commit-and-tag-version` para leer/escribir `<Version>` en el `.csproj`).
- [x] 1.4 Fijar `<Version>1.0.0</Version>` en `backend/GeoServ.Api/GeoServ.Api.csproj` y `"version": "1.0.0"` en `frontend/package.json`.
- [x] 1.5 Crear `CHANGELOG.md` inicial en la raíz con la entrada `[1.0.0]` resumiendo el estado del sistema al momento del release formal.

## 2. Endpoint de Versión del Backend

- [x] 2.1 Crear `Endpoints/VersionEndpoints.cs` con `GET /api/system/version` (público) retornando `version` (desde `Assembly.GetName().Version`) y `buildDate` (desde `File.GetLastWriteTimeUtc` del assembly).
- [x] 2.2 Registrar `MapVersionEndpoints` en `Program.cs`.

## 3. Generación de Metadata de Build en el Frontend

- [x] 3.1 Crear `frontend/scripts/generate-build-info.mjs`: escribe `src/assets/version.json` (`version`, `buildDate`, `commit` vía `git rev-parse --short HEAD`) y `src/assets/changelog.json` (últimas entradas parseadas de `CHANGELOG.md`).
- [x] 3.2 Encadenar el script en `frontend/package.json` (`build-info` + `prebuild` efectivo antes de `start`/`build`/`watch`).
- [x] 3.3 Ignorar `frontend/src/assets/version.json` y `frontend/src/assets/changelog.json` en `.gitignore` (se regeneran en cada build).

## 4. Detección de Nueva Versión y Actualización Automática

- [x] 4.1 Crear `VersionCheckService` (`core/services/version-check.service.ts`): captura el fingerprint (`version:buildDate`) al iniciar, sondea cada 5 minutos y al volver a la pestaña (`visibilitychange`), y expone `currentVersion` como signal para la UI.
- [x] 4.2 Al detectar un fingerprint distinto, mostrar `MatSnackBar` ("Hay una nueva versión disponible. Actualizando…") y ejecutar `window.location.reload()` tras ~2.5s.
- [x] 4.3 Iniciar el servicio desde `AppComponent` al arrancar la aplicación.
- [x] 4.4 Agregar variante de estilo `.snackbar-info` en `styles.scss`, consistente con `.snackbar-success` / `.snackbar-error` / `.snackbar-warning` ya existentes.

## 5. Página "Acerca de"

- [x] 5.1 Crear `AboutComponent` (`features/about/`) con: título fijo "Acerca de GeoServ" (no el nombre del tenant), descripción breve de la aplicación, versión y build del frontend, novedades recientes desde `assets/changelog.json`, y datos de soporte (correo/teléfono de la empresa vía `EmpresaConfigService`).
- [x] 5.2 Registrar la ruta `acerca-de` (lazy-loaded) dentro de los hijos del layout principal en `app.routes.ts`.
- [x] 5.3 Agregar enlace "Acerca de" y número de versión visibles al pie del menú lateral (`sidebar.component.*`).

## 6. Verificación

- [x] 6.1 Compilar el backend con `dotnet build` sin errores.
- [x] 6.2 Compilar el frontend con `npm run build` sin errores, confirmando que `version.json`/`changelog.json` quedan en `dist/`.
- [x] 6.3 Verificar en el dev server del usuario que `assets/version.json` se sirve correctamente y sin errores de consola.
