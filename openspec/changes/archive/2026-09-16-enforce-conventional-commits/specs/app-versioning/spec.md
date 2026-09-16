## ADDED Requirements

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
