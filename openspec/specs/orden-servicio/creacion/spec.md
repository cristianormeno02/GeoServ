# orden-servicio/creacion Specification

## Purpose
El proceso de creación de Órdenes de Servicio debe adaptarse para soportar formatos de numeración configurables por empresa.

## Requirements

### Requirement: REQ-OS-001
Al crear una nueva orden de servicio, el sistema DEBE evaluar la configuración de numeración (os_number_format) de la empresa.

#### Scenario: Evaluación de formato
- **WHEN** se crea una OS
- **THEN** se lee la configuración de la empresa

### Requirement: REQ-OS-002
Si la configuración indica auto-incremental, el sistema DEBE obtener el valor máximo actual de OS para la empresa, incrementarlo en 1, y formatearlo a 8 dígitos (ej.  0000001). Este valor se asignará automáticamente sin requerir entrada del usuario.

#### Scenario: Creación auto-incremental
- **WHEN** os_number_format es auto
- **THEN** se asigna el número automático de 8 dígitos correlativo

### Requirement: REQ-OS-003
Si la configuración indica ingreso manual, el sistema DEBE requerir que el usuario ingrese el número de OS manually, validando que sea único para la empresa.

#### Scenario: Creación manual exitosa
- **WHEN** os_number_format es manual y se provee número único
- **THEN** se crea la OS con el número ingresado
