## Why

El versionado SemVer unificado y la generación automática del `CHANGELOG.md` implementados en `app-versioning` dependen al 100% de que los mensajes de commit sigan estrictamente la especificación de [Conventional Commits](https://www.conventionalcommits.org/) (`feat:`, `fix:`, `refactor:`, etc.). Sin embargo, actualmente no existe un mecanismo preventivo (guardarraíl técnico) ni reglas explícitas de agente en el repositorio que garanticen que cada commit mantenga la convención. Un commit con mensaje libre (ej. `ajustes de interfaz`) rompería la categorización de cambios y el cálculo de la siguiente versión en `npm run release`.

## What Changes

- **Modificación a la capacidad `app-versioning`**: Se añade el requerimiento de validación y cumplimiento estricto de Conventional Commits para todos los commits del repositorio.
- **Regla permanente para Agentes de IA (`AGENTS.md`)**: Define como estándar obligatorio el uso de Conventional Commits con tipos y scopes válidos (`feat`, `fix`, `refactor`, `perf`, `chore`, `test`, `docs`) para cualquier commit o comando sugerido por el asistente.
- **Integración con OpenSpec (`openspec/config.yaml`)**: Se actualiza `operations.apply.guidance` para instruir el uso de Conventional Commits en cada tarea completada del ciclo de vida de OpenSpec junto a Superpowers.
- **Guardarraíl técnico en Git (`commit-msg` hook)**: Se configura la validación automática del mensaje de commit (mediante un script de hook o herramienta de linting), rechazando cualquier commit local que no cumpla la sintaxis `tipo(alcance)?: descripción`.

## Capabilities

### New Capabilities
<!-- Ninguna nueva capacidad; se extiende la existente -->

### Modified Capabilities
- `app-versioning`: Se incorpora el requerimiento de validación y estandarización estricta de mensajes de commit bajo Conventional Commits para garantizar la integridad del release automático y changelog.

## Impact

- **Raíz del repo**: `package.json`, scripts de hooks de Git.
- **Herramientas de Agente**: `AGENTS.md`.
- **OpenSpec**: `openspec/config.yaml` (`operations.apply.guidance`).
- **Desarrollo**: Sin impacto en código de producción ni APIs públicas; afecta únicamente el flujo de trabajo de Git y calidad de commits.
