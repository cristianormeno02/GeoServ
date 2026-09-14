## Purpose

Estandariza la experiencia de confirmación previa a la eliminación o anulación de registros en todas las secciones de la plataforma GeoServ mediante diálogos consistentes de Angular Material.

## Requirements

### Requirement: Confirmación de Eliminación Mediante Diálogo Material
Todas las vistas, tablas y formularios de la plataforma DEBEN solicitar confirmación del usuario antes de ejecutar cualquier eliminación o acción destructiva mediante el componente `ConfirmDialogComponent` de Angular Material, quedando prohibido el uso del método nativo `window.confirm()`.

#### Scenario: Solicitud de eliminación en listas CRUD
- **WHEN** un usuario hace clic en el botón de eliminar o anular cualquier entidad en las vistas de la plataforma (usuarios, unidades, tipos de servicio, categorías de costo, movimientos, cuentas, cheques, clientes, órdenes de servicio, activos, responsables, proveedores, proyectos, métodos de pago)
- **THEN** el sistema DEBE abrir un diálogo modal `ConfirmDialogComponent` mostrando título contextual, mensaje descriptivo con el nombre del elemento a eliminar, botón de confirmación con estilo destructivo (rojo) y botón para cancelar.

#### Scenario: Cancelación de la eliminación
- **WHEN** el usuario presiona el botón Cancelar o cierra el diálogo de confirmación
- **THEN** el sistema DEBE cerrar el diálogo sin emitir peticiones HTTP de eliminación ni alterar el estado de la entidad.

#### Scenario: Confirmación de la acción destructiva
- **WHEN** el usuario confirma la eliminación en el diálogo
- **THEN** el sistema DEBE invocar el servicio correspondiente, mostrar notificación de éxito o error vía Snackbar/Toast, y actualizar la lista en pantalla.
