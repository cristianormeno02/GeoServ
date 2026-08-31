# accounting-ui Specification

## Purpose
Interfaces de usuario para visualizar y registrar movimientos contables con soporte para orígenes polimórficos.

## Requirements

### Requirement: Interfaz de registro polimórfico
El formulario de creación y edición de movimientos contables debe solicitar al usuario el tipo de origen antes de permitirle seleccionar el origen específico, ocultando campos no relevantes.

#### Scenario: Usuario registra movimiento de compra de activo
- **WHEN** el usuario selecciona AssetPurchase como Tipo de Origen (SourceType)
- **THEN** el sistema muestra un buscador/desplegable exclusivamente de Activos para asignar al campo SourceId, y oculta el buscador de Órdenes de Servicio.

### Requirement: Visualización de orígenes en listados
La tabla principal de movimientos contables debe mostrar información consolidada e inteligible para el usuario sobre de dónde provino o hacia dónde fue el movimiento.

#### Scenario: Usuario visualiza la grilla de movimientos
- **WHEN** el usuario ingresa a la sección de Movimientos Contables
- **THEN** observa una columna "Origen" que contiene una etiqueta del tipo de origen y el identificador de negocio de la entidad asociada (ej. "Orden de Servicio - OS-00123" o "Compra de Activo - Camioneta Hilux").
