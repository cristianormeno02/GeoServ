## Purpose

Provee mejoras de usabilidad en la interfaz de gestión de órdenes de servicio, previniendo pérdida de datos y agilizando la entrada de datos numéricos.

## ADDED Requirements

### Requirement: Advertencia al cancelar con modificaciones no guardadas
El sistema SHALL solicitar confirmación al usuario antes de salir si presiona "Cancelar" habiendo realizado modificaciones en la orden actual.

#### Scenario: Cancelar con cambios
- **WHEN** el usuario edita cualquier ítem de una orden y presiona "Cancelar"
- **THEN** el sistema despliega un mensaje consultando si desea salir sin guardar los datos
- **THEN** si el usuario acepta, sale sin guardar; si rechaza, permanece en la vista de edición

#### Scenario: Cancelar sin cambios
- **WHEN** el usuario presiona "Cancelar" sin haber realizado ninguna modificación en la orden
- **THEN** el sistema sale inmediatamente sin solicitar confirmación

### Requirement: Selección automática de texto en controles numéricos
El sistema SHALL seleccionar automáticamente todo el texto contenido al recibir foco en un control numérico.

#### Scenario: Foco en control numérico
- **WHEN** el control numérico recibe foco
- **THEN** todo el texto existente en el control queda seleccionado, de modo que la entrada de un nuevo carácter sobrescriba el contenido previo

### Requirement: Flexibilidad en el separador decimal
El sistema SHALL permitir el ingreso indistinto de punto o coma como separador decimal en controles numéricos, manteniendo el formato visual estándar (punto para miles, coma para decimales).

#### Scenario: Ingreso de punto o coma
- **WHEN** el usuario ingresa un punto o una coma en un campo de monto
- **THEN** el sistema lo interpreta como separador decimal
- **THEN** el campo mantiene la visualización mostrando punto para miles y coma para decimales
