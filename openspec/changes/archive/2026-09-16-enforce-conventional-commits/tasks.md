## 1. Reglas de Agente e Integración con OpenSpec

- [x] 1.1 Crear `AGENTS.md` en la raíz del repositorio detallando la estructura obligatoria de Conventional Commits (`tipo(alcance)?: descripción`), los tipos reconocidos por `.versionrc.json` (`feat`, `fix`, `refactor`, `perf`, `docs`, `style`, `test`, `build`, `ci`, `chore`), ejemplos específicos del dominio GeoServ y la sintaxis de breaking changes.
- [x] 1.2 Actualizar `openspec/config.yaml` agregando en `operations.apply.guidance` la directiva obligatoria de redactar o sugerir commits exclusivamente en formato Conventional Commits.

## 2. Guardarraíl Técnico en Git (Hook commit-msg)

- [x] 2.1 Crear `scripts/validate-commit-msg.cjs` con la lógica de validación de mensajes por expresión regular, permitiendo commits especiales automáticos (merges, reverts) y mostrando mensajes de error didácticos ante fallos de formato.
- [x] 2.2 Crear el script del hook `.githooks/commit-msg` y agregar el script de instalación o configuración en `package.json` (por ejemplo `"init-hooks": "node scripts/install-hooks.cjs"`) para activar los hooks locales en `.git/hooks/`.
- [x] 2.3 Ejecutar pruebas del validador de commits confirmando que rechace mensajes inválidos (código de salida 1) y apruebe mensajes conformes (código de salida 0).
