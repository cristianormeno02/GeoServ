# Reglas de Agentes para GeoServ (AGENTS.md)

Este documento contiene las reglas de trabajo que todo agente de IA (Antigravity, Claude, etc.) DEBE respetar de manera permanente al operar en este repositorio.

## 1. Convenciones de Commits (Conventional Commits)

Es estrictamente **obligatorio** que todos los mensajes de commit generados directamente por el agente o sugeridos al usuario sigan la especificación de [Conventional Commits](https://www.conventionalcommits.org/).

### Estructura obligatoria
```
<tipo>(<alcance>): <descripción en imperativo y minúsculas>
```
*Nota: El alcance (scope) es opcional pero muy recomendado.*

### Tipos válidos (reconocidos por `.versionrc.json`)
El agente solo debe utilizar los siguientes prefijos:
* `feat`: Nuevas funcionalidades del sistema.
* `fix`: Correcciones de errores.
* `refactor`: Refactorizaciones de código que no corrigen errores ni añaden funcionalidades.
* `perf`: Mejoras de rendimiento.
* `docs`: Cambios en la documentación.
* `style`: Estilos (formateo, punto y coma, etc., no CSS).
* `test`: Adición o modificación de pruebas (TDD).
* `build`: Cambios en el sistema de compilación o dependencias externas.
* `ci`: Cambios en la configuración y scripts de integración continua.
* `chore`: Otras tareas menores (tooling, configuración) que no afectan el código fuente principal.

### Ejemplos en el dominio de GeoServ
* `feat(ordenes-servicio): agregar exportación a pdf en el detalle de la orden`
* `fix(auth): resolver expiración prematura del token JWT`
* `refactor(financiero): extraer lógica de validación de cuentas a servicio independiente`
* `test(insumos): agregar pruebas unitarias para el alta de insumos`

### Breaking Changes (Cambios incompatibles)
Cualquier commit que introduzca un cambio incompatible o que rompa el contrato de la API DEBE indicarlo en el footer como `BREAKING CHANGE: <descripción>` o agregando un `!` luego del tipo/alcance.
* Ejemplo: `feat(api)!: remover endpoint obsoleto de exportación legacy`
