## Context

El proyecto utiliza `commit-and-tag-version` para versionado automático y generación de changelog en español. Para que este cálculo funcione sin fricciones, todos los commits deben adherir a la especificación de Conventional Commits. Ver `proposal.md` para la motivación general.

## Goals / Non-Goals

**Goals:**
- Proporcionar una regla permanente para los agentes de IA (`AGENTS.md`) que detalle tipos permitidos, scopes y estructura de mensajes.
- Añadir una directriz en `openspec/config.yaml` (`operations.apply.guidance`) para que en cada tarea de OpenSpec se use Conventional Commits junto a Superpowers.
- Establecer un guardarraíl técnico local mediante un hook de Git (`commit-msg`) que valide la expresión regular de Conventional Commits de forma instantánea y multiplataforma (Windows/PowerShell y Unix/Bash).
- Proveer un script npm opcional (`npm run check-commit` o hook instalable) para inicializar fácilmente el hook en cualquier clon del repositorio.

**Non-Goals:**
- Bloquear commits por estilo de código o linters pesados (eslint, prettier) dentro de este hook específico; el hook se enfoca únicamente en el formato del mensaje del commit.
- Forzar scopes específicos o taxonomías cerradas e inflexibles; se validan tipos principales reconocidos por `.versionrc.json`.

## Decisions

### 1. Guardarraíl de Git: Hook `commit-msg` nativo y ligero
En lugar de instalar herramientas pesadas como `husky` y `@commitlint/cli` con docenas de dependencias npm en la raíz, se implementa un script de hook `commit-msg` basado en Node.js (aprovechando que Node ya está presente en el entorno de desarrollo).
*Alternativas consideradas*:
- Husky + @commitlint/cli: Se consideró, pero añade dependencias considerables y complejidad de configuración para una regla de regex simple.
- Hook puramente bash en `.git/hooks`: En Windows puede presentar problemas si el shell por defecto o las rutas de Git difieren. Un script Node o bash estándar ejecutable por el Git sh de Windows es suficiente.
*Decisión final*: Crear un script de validación `scripts/validate-commit-msg.cjs` y un hook en `.githooks/commit-msg` (o script instalable en `.git/hooks/commit-msg` vía script npm `prepare`) para que se active automáticamente o con un solo comando.

### 2. Regla permanente para Agentes en `AGENTS.md`
Se coloca `AGENTS.md` en la raíz del repositorio. Las herramientas y agentes de IA (Antigravity, Claude, etc.) cargan automáticamente las instrucciones de `AGENTS.md`.
*Contenido clave*:
- Formato: `<tipo>(<alcance>): <descripción breve en minúsculas>`
- Tipos válidos mapeados a `.versionrc.json`: `feat`, `fix`, `perf`, `refactor`, `docs`, `style`, `test`, `build`, `ci`, `chore`.
- Regla de breaking changes: Uso de `BREAKING CHANGE:` o `!`.

### 3. Integración con OpenSpec en `openspec/config.yaml`
Se agrega una nueva entrada a `operations.apply.guidance` complementando `superpowers-tdd`, `superpowers-debugging` y `superpowers-code-review`.
*Texto*: "Conventional Commits: Al realizar commits o sugerir comandos de git, utilizar estrictamente el formato Conventional Commits (feat, fix, refactor, perf, chore, etc.) para mantener la coherencia con el versionado automático."

## Risks / Trade-offs

- **[Riesgo] Los hooks de Git en `.git/hooks` no se versionan directamente**: Git no sincroniza la carpeta `.git/hooks`.
  - *Mitigación*: Mantener el hook en una carpeta versionada (`.githooks/commit-msg` o `scripts/`) y agregar un comando en `package.json` (`"prepare": "node scripts/install-hooks.cjs"` o configuración de `core.hooksPath`) para activarlo fácilmente.
- **[Riesgo] Mensajes de merge o rebase bloqueados accidentalmente**: Git genera mensajes automáticos como `Merge branch ...` o `Revert ...`.
  - *Mitigación*: El validador ignora mensajes que comiencen con `Merge `, `Revert ` o comentarios/líneas vacías.
