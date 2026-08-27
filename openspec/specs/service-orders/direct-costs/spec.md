# Spec: Costos Directos en Órdenes de Servicio

## System Behavior

### CRUD Órdenes de Servicio - Nueva Pestaña "Costos Directos"
- Se añade una sección/pestaña dentro del detalle de una Orden de Servicio.
- Muestra una grilla o listado de los costos cargados para la OS seleccionada.
- Permite crear, editar, y eliminar registros de costos asociados a la orden.

#### Modelo de Datos de Costos Directos
Cada registro de costo directo deberá tener los siguientes campos:
- **Orden de Servicio (FK):** Relacionado automáticamente por contexto.
- **Fecha:** Fecha del gasto/costo.
- **Categoría de Costos Directos (FK):** Selector proveniente de una tabla maestra separada.
- **Detalle:** Texto libre.
- **Proveedor (FK):** Selector proveniente de un mantenedor separado.
- **Cantidad:** Numérico decimal.
- **Unidad (FK):** Selector proveniente de tabla maestra (ej. horas, litros, cajas).
- **Precio Unitario:** Numérico decimal.
- **Importe Total:** Numérico (calculado usualmente como `Cantidad * Precio Unitario`, o ingresado manualmente si aplica).
- **Pagado por (Selector de responsables):** Referencia al responsable (empleado/usuario que realizó o gestionó el pago).
- **Medio de pago (FK):** Selector desde tabla independiente (ej. efectivo, tarjeta, transferencia).
- **Estado:** Selector con opciones ("pagado", "pendiente").
- **Observaciones:** Campo de texto amplio.

#### Scenario: Cargar costos directos en creación
- **WHEN** el usuario crea una nueva Orden de Servicio
- **THEN** puede ver la pestaña de Costos Directos y agregar registros antes de guardar la orden por primera vez

### Mantenedores Secundarios Requeridos
El sistema debe proveer (si no existen) mantenedores separados para:
- **Categorías de Costos Directos:** (ID, Nombre, Activo)
- **Proveedores:** (ID, Razón Social, RUT/CUIT, Datos de Contacto, etc.)
- **Unidades:** (ID, Nombre, Abreviatura)
- **Medios de Pago:** (ID, Nombre, Activo)
