## Why

El sistema no exponía su versión en ningún lugar visible, ni para los usuarios ni para el equipo, lo que dificultaba diagnosticar "qué versión de GeoServ estoy viendo" al reportar un problema. Tampoco existía un criterio formal de incremento de versión entre releases. Adicionalmente, al desplegar una nueva versión del frontend, los usuarios con la pestaña ya abierta seguían ejecutando el bundle cacheado por el navegador sin ningún aviso, operando contra una UI desactualizada hasta que recargaban manualmente por su cuenta.

## What Changes

- **Versionado SemVer unificado**: se fija la versión `1.0.0` como primer release formal, en `frontend/package.json` y `backend/GeoServ.Api/GeoServ.Api.csproj`, mantenidos sincronizados.
- **Incremento automático por Conventional Commits**: se incorpora `commit-and-tag-version` (`npm run release` en la raíz del repo) que analiza los commits desde el último tag, calcula el bump (`feat`→minor, `fix`→patch, `BREAKING CHANGE`→major), actualiza ambos archivos de versión y regenera `CHANGELOG.md`.
- **Endpoint de versión del backend**: `GET /api/system/version` (público) expone la versión y fecha de build de la API.
- **Página "Acerca de"** (`/acerca-de`): muestra el nombre y una descripción breve de la aplicación, la versión del frontend con fecha/commit de build, las novedades recientes extraídas del `CHANGELOG.md`, y los datos de soporte de la empresa (correo, teléfono).
- **Acceso desde el menú**: enlace "Acerca de" y número de versión visibles al pie del menú lateral.
- **Detección de nueva versión y actualización automática**: `VersionCheckService` sondea periódicamente (cada 5 min y al volver a la pestaña) `assets/version.json` —regenerado en cada build junto con `assets/changelog.json`—; si detecta una versión distinta a la cargada, notifica brevemente al usuario y recarga la página automáticamente, sin requerir que el usuario la refresque por su cuenta.

## Capabilities

### New Capabilities

- `app-versioning`: versionado SemVer del sistema (frontend + backend), página "Acerca de" y detección/actualización automática de nuevas versiones del frontend ante caché del navegador.

### Modified Capabilities

<!-- Ninguna capacidad existente se modifica -->

## Impact

- **Raíz del repo**: `package.json`, `.versionrc.json`, `scripts/csproj-version-updater.cjs`, `CHANGELOG.md` (nuevos).
- **Backend**: `GeoServ.Api.csproj` (propiedad `<Version>`), `Endpoints/VersionEndpoints.cs` (nuevo), `Program.cs` (registro del endpoint).
- **Frontend**: `package.json` (versión + scripts `build-info`), `scripts/generate-build-info.mjs` (nuevo), `app.component.ts` (arranque de `VersionCheckService`), `core/services/version-check.service.ts` (nuevo), `features/about/` (nuevo), `app.routes.ts` (ruta `/acerca-de`), `core/layout/sidebar/*` (enlace y versión visible), `styles.scss` (variante `snackbar-info`).
- **APIs y Contratos**: nuevo endpoint aditivo `GET /api/system/version`, no rompe contratos existentes.
