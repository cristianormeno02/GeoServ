# app-versioning Specification

## Purpose
TBD - created by archiving change versionado-y-pagina-acerca-de. Update Purpose after archive.

## Requirements

### Requirement: Versionado SemVer unificado
El sistema DEBE exponer una única versión semántica (`MAJOR.MINOR.PATCH`) compartida entre el frontend y el backend, sincronizada por un mecanismo de release automático basado en Conventional Commits, con un `CHANGELOG.md` regenerado en cada release.

#### Scenario: Ejecución de un release
- **WHEN** un integrante del equipo ejecuta `npm run release` en la raíz del repositorio tras mergear commits siguiendo Conventional Commits
- **THEN** el sistema calcula el incremento de versión correspondiente (`feat`→minor, `fix`→patch, `BREAKING CHANGE`→major), actualiza la versión en `frontend/package.json` y en `backend/GeoServ.Api/GeoServ.Api.csproj` de forma sincronizada, regenera `CHANGELOG.md` y crea un commit y tag `vX.Y.Z`

### Requirement: Página "Acerca de"
El sistema DEBE proveer una página "Acerca de" (`/acerca-de`), accesible desde el menú principal para cualquier usuario autenticado, que muestre el nombre y una descripción breve de la aplicación (fijos, independientes del tenant actual), la versión del frontend con su fecha de build, y las novedades más recientes del `CHANGELOG.md`.

#### Scenario: Usuario visita la página Acerca de
- **WHEN** el usuario navega a `/acerca-de`
- **THEN** el sistema muestra el título "Acerca de GeoServ" (no el nombre de la empresa/tenant actual), una descripción de la aplicación, la versión actual del frontend con fecha de build, y una lista de las novedades más recientes

#### Scenario: Acceso desde el menú lateral
- **WHEN** el usuario abre el menú lateral
- **THEN** encuentra un enlace "Acerca de" y el número de versión de la aplicación visible al pie del menú

### Requirement: Detección y actualización automática de nueva versión del frontend
El frontend DEBE detectar cuando se ha desplegado una versión distinta a la que tiene cargada la pestaña actual (evitando el problema de caché del navegador) y actualizarse automáticamente sin requerir que el usuario refresque la página manualmente.

#### Scenario: Nueva versión desplegada mientras el usuario tiene la aplicación abierta
- **WHEN** el sistema detecta, mediante sondeo periódico o al volver a la pestaña, que la versión servida difiere de la que la pestaña tiene cargada
- **THEN** el sistema notifica brevemente al usuario que hay una nueva versión disponible y recarga la página automáticamente, sin requerir confirmación

#### Scenario: No hay una nueva versión disponible
- **WHEN** el sistema sondea la versión servida y coincide con la que la pestaña tiene cargada
- **THEN** no se muestra ninguna notificación ni se interrumpe la sesión del usuario

### Requirement: Estandarización y validación estricta de Conventional Commits
El repositorio DEBE / MUST exigir que todo commit realizado por desarrolladores o agentes de IA siga estrictamente la especificación de Conventional Commits (`tipo(alcance)?: descripción`), y DEBE / MUST rechazar de forma preventiva cualquier commit que no cumpla dicha estructura.

#### Scenario: Intento de commit con formato inválido
- **WHEN** un desarrollador o proceso intenta realizar un commit con un mensaje libre que no sigue Conventional Commits (por ejemplo, `arreglos varios`)
- **THEN** el hook de validación de Git interrumpe el commit con código de salida distinto de cero y muestra un mensaje de error explicativo indicando los tipos permitidos y la sintaxis esperada

#### Scenario: Commit con formato válido
- **WHEN** se realiza un commit siguiendo la estructura `tipo(alcance)?: descripción` (por ejemplo, `feat(ordenes-servicio): agregar exportación` o `fix(auth): corregir expiración de token`)
- **THEN** el hook valida exitosamente el mensaje y el commit es registrado en el historial de Git

#### Scenario: Directriz obligatoria para agentes de IA
- **WHEN** un agente de asistencia de código opera en el repositorio o ejecuta tareas bajo el flujo OpenSpec
- **THEN** el agente consulta y aplica las reglas mandatorias de Conventional Commits al redactar mensajes de commit y sugerencias de comandos Git
