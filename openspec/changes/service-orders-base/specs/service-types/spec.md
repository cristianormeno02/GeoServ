## Purpose

Define las capacidades para gestionar el catálogo de tipos de servicios geológicos ofrecidos, tales como servicios macroscópicos, petro-calcográficos y de campo.

## ADDED Requirements

### Requirement: Configurar tipos de servicio
El sistema DEBE proporcionar un conjunto predefinido de tipos de servicio (macroscópico, petro-calcográfico, de campo) que pueden vincularse a las Órdenes de Servicio.

#### Scenario: Listar tipos de servicio disponibles
- **WHEN** el usuario solicita los tipos de servicio disponibles
- **THEN** el sistema devuelve el catálogo que incluye los tipos de servicio macroscópico, petro-calcográfico y de campo
