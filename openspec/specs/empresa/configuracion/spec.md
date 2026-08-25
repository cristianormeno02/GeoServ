# empresa/configuracion Specification

## Purpose
Se introduce la capacidad de gestionar configuraciones dinámicas a nivel de empresa.

## Requirements

### Requirement: REQ-CONF-001
El sistema DEBE permitir asociar configuraciones de tipo clave-valor a una empresa.

#### Scenario: Asociación exitosa
- **WHEN** se guarda una configuración válida
- **THEN** la configuración queda persistida en la empresa

### Requirement: REQ-CONF-002
Cada configuración DEBE tener una clave (identificador único por empresa), un valor, un tipo de valor (ej. boolean, string, number) y una descripción.

#### Scenario: Creación con datos completos
- **WHEN** se provee clave, valor, tipo de valor y descripción
- **THEN** la configuración se guarda correctamente

### Requirement: REQ-CONF-003
DEBE existir una configuración específica para determinar el formato de numeración de las Órdenes de Servicio (ej. os_number_format).

#### Scenario: Presencia de os_number_format
- **WHEN** se consulta la configuración
- **THEN** está disponible la clave os_number_format

### Requirement: REQ-CONF-004
La configuración de numeración de OS DEBE soportar al menos dos modalidades: auto-incremental de 8 dígitos y manual.

#### Scenario: Modalidades soportadas
- **WHEN** se configura el formato de numeración
- **THEN** se permiten los valores auto o manual

### Requirement: REQ-CONF-005
La pantalla de configuración de empresa DEBE permitir visualizar y editar las configuraciones existentes.

#### Scenario: Edición de configuraciones
- **WHEN** el usuario accede a la pantalla de configuración
- **THEN** puede editar las configuraciones

### Requirement: REQ-CONF-006
La configuración de formato de numeración de OS SOLO DEBE ser editable si la empresa no posee ninguna orden de servicio creada.

#### Scenario: Bloqueo por OS existentes
- **WHEN** el usuario intenta cambiar el formato y existen órdenes de servicio
- **THEN** el sistema devuelve error y no permite el cambio
