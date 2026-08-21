## Purpose

Define las capacidades para gestionar la información de los clientes requerida para operar y vincular las Órdenes de Servicio.

## ADDED Requirements

### Requirement: Registrar un nuevo cliente
El sistema DEBE permitir a los usuarios registrar un nuevo cliente con la información esencial de contacto y facturación.

#### Scenario: Registro de cliente exitoso
- **WHEN** el usuario proporciona información válida del cliente (ej. nombre, detalles de contacto, identificación fiscal)
- **THEN** el sistema crea el registro del cliente y le asigna un identificador único

### Requirement: Listar clientes
El sistema DEBE permitir a los usuarios obtener una lista de todos los clientes registrados para facilitar la asignación de la Orden de Servicio.

#### Scenario: Obtener la lista de clientes
- **WHEN** el usuario solicita la lista de clientes
- **THEN** el sistema devuelve una lista paginada de registros de clientes
