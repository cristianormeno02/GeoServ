## Purpose
Gestionar y mantener un registro de los vencimientos asociados a cada Gasto Fijo creado en el sistema.

## ADDED Requirements

### Requirement: Listado y guardado de vencimientos de Gastos Fijos
El sistema debe permitir que, al crear o editar un Gasto Fijo, los vencimientos ingresados se persistan correctamente en la base de datos y se listen en la interfaz de usuario.

#### Scenario: Guardar un gasto fijo con vencimientos
- **WHEN** un usuario ingresa uno o más vencimientos al formulario de un gasto fijo y guarda los cambios
- **THEN** el sistema debe almacenar los vencimientos de manera persistente.

#### Scenario: Visualizar vencimientos guardados
- **WHEN** un usuario accede a la vista de detalle o edición de un gasto fijo previamente guardado
- **THEN** el sistema debe mostrar la lista de vencimientos asociados al mismo.
