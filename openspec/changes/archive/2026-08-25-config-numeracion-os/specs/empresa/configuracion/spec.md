# Delta Spec: empresa/configuracion

## Context
Se introduce la capacidad de gestionar configuraciones dinámicas a nivel de empresa.

## Requirements Changes

### 1. Modelo de Configuración de Empresa
- **[NEW]** REQ-CONF-001: El sistema DEBE permitir asociar configuraciones de tipo clave-valor a una empresa.
- **[NEW]** REQ-CONF-002: Cada configuración DEBE tener una clave (identificador único por empresa), un valor, un tipo de valor (ej. boolean, string, number) y una descripción.

### 2. Configuración de Numeración de OS
- **[NEW]** REQ-CONF-003: DEBE existir una configuración específica para determinar el formato de numeración de las Órdenes de Servicio (ej. os_number_format).
- **[NEW]** REQ-CONF-004: La configuración de numeración de OS DEBE soportar al menos dos modalidades: auto-incremental de 8 dígitos y manual.

### 3. Interfaz de Usuario
- **[NEW]** REQ-CONF-005: La pantalla de configuración de empresa DEBE permitir visualizar y editar las configuraciones existentes.
- **[NEW]** REQ-CONF-006: La configuración de formato de numeración de OS SOLO DEBE ser editable si la empresa no posee ninguna orden de servicio creada.
