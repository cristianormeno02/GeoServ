## Context

GeoServ es un monorepo con frontend Angular (`frontend/`) y backend .NET (`backend/GeoServ.Api/`), desplegados de forma independiente (Vercel/estático + Render). No existía versionado formal (`frontend/package.json` seguía en `0.0.0`) ni ningún mecanismo para que un usuario con la pestaña abierta se enterara de que había una versión más nueva desplegada. Ver `proposal.md` para más detalle.

## Goals / Non-Goals

**Goals:**
- Un único número de versión SemVer, sincronizado entre frontend y backend, con incremento automático basado en Conventional Commits.
- Una página "Acerca de" accesible desde el menú que muestre versión, build y novedades recientes.
- Detección automática de una nueva versión del frontend desplegada y recarga silenciosa de la pestaña, sin depender de que el usuario limpie caché o refresque manualmente.

**Non-Goals:**
- Pipeline de CI/CD que ejecute el release automáticamente en cada push (el release se dispara manualmente con `npm run release`).
- Versionado independiente por módulo/feature; se usa una única versión de aplicación.
- Página de licencias de terceros o changelog completo histórico (se muestran solo las entradas más recientes).

## Decisions

### 1. Fuente de verdad de la versión y sincronización
La versión SemVer vive en `package.json` de la raíz del repo (usado por `commit-and-tag-version`) y se replica a `frontend/package.json` y a `<Version>` en `backend/GeoServ.Api/GeoServ.Api.csproj` mediante `.versionrc.json` (`bumpFiles`) y un updater custom (`scripts/csproj-version-updater.cjs`) que lee/escribe el tag `<Version>` del csproj con una expresión regular.

*Alternativas consideradas*: versionar frontend y backend de forma independiente. Se descartó porque para el usuario final (y para diagnosticar un reporte de bug) "la versión de GeoServ" es un concepto único, no dos.

### 2. Incremento automático vía Conventional Commits
Se adopta `commit-and-tag-version` (fork mantenido de `standard-version`) en vez de un script propio, para reutilizar el cálculo de bump semántico y la generación de `CHANGELOG.md` ya validados por la comunidad. Se ejecuta manualmente (`npm run release` / `release:minor` / `release:major` / `release:patch`) porque el repo no tiene pipeline de CI configurado; el equipo debe correrlo antes de pushear y desplegar.

### 3. Fingerprint de versión para detección de caché
`assets/version.json` se regenera en cada build (`scripts/generate-build-info.mjs`, encadenado antes de `ng build`/`ng serve` vía npm scripts) con `{ version, buildDate, commit }`. Se usa `version + buildDate` como fingerprint de comparación (no solo `version`) porque dentro de una misma versión SemVer puede haber múltiples deploys (ej. un hotfix sin bump de versión), y el `buildDate` distingue esos casos.

### 4. Estrategia de actualización: recarga automática silenciosa
`VersionCheckService` sondea `assets/version.json` cada 5 minutos y al volver a la pestaña (`visibilitychange`), con `Cache-Control: no-cache` y un parámetro `?t=timestamp` para evitar que el propio fetch sea servido desde caché. Al detectar un fingerprint distinto, se muestra un `MatSnackBar` breve ("Hay una nueva versión disponible. Actualizando…") y se recarga la página con `window.location.reload()` tras ~2.5s, sin requerir confirmación del usuario.

*Riesgo aceptado*: un usuario con un formulario a medio completar puede perder cambios no guardados si la recarga ocurre en ese momento. Se decidió igualmente por recarga automática (en vez de solo notificar) para garantizar que ningún usuario quede operando indefinidamente contra una versión vieja del frontend.

### 5. Contenido de la página "Acerca de"
Se optó por un contenido básico + novedades recientes: nombre y descripción de la aplicación (fijos, no del tenant), versión y build del frontend, y las últimas entradas de `CHANGELOG.md` (parseadas a `assets/changelog.json` en build time). Se excluye deliberadamente la versión del backend/API en la UI: es información operativa, no relevante para el usuario final de la página "Acerca de".

## Risks / Trade-offs

- **[Riesgo] Pérdida de datos no guardados en recarga automática**: mitigado parcialmente por el retraso de ~2.5s con aviso visible antes de recargar, dando una ventana breve para que el usuario termine una acción en curso.
- **[Riesgo] `assets/version.json` no se regenera si el comando de build de producción no pasa por `npm run build`**: el script está encadenado en el propio script `build` de `package.json`, pero si la plataforma de despliegue invoca `ng build` directamente evitando `npm`, el archivo quedará desactualizado. Se documentó como verificación pendiente.
- **[Riesgo] Cálculo de bump de versión mal etiquetado**: depende de que los mensajes de commit sigan la convención (`feat:`, `fix:`, etc.); un mensaje mal formado simplemente no se refleja en el changelog/bump, sin romper el build.
