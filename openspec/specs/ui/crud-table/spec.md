## Purpose

Provee un componente reutilizable de tabla para operaciones CRUD que unifica filtrado, paginación, ordenamiento, estado de carga y estado vacío en toda la plataforma GeoServ.

## Requirements

### Requirement: Estandarización de Tablas de Gestión
El sistema DEBE disponer de un componente compartido de tabla para operaciones CRUD (`CrudTableComponent`) que encapsule los comportamientos estándar de presentación tabular de datos.

#### Scenario: Búsqueda y filtrado reactivo
- **WHEN** el usuario ingresa un término de búsqueda en la barra de filtro de la tabla
- **THEN** la tabla DEBE aplicar el filtro de manera inmediata o con debounce, actualizando el conjunto de filas visibles y reseteando la página a la primera página si es necesario.

#### Scenario: Paginación y ordenamiento consistentes
- **WHEN** se presentan más registros que el tamaño de página configurado
- **THEN** el paginador DEBE mostrar selector de tamaño de página estandarizado (ej. 5, 10, 25, 50), botones de navegación entre páginas, y permitir ordenar columnas numéricas y de texto al hacer clic en sus encabezados.

#### Scenario: Presentación de estado de carga y vacío
- **WHEN** los datos se están recuperando de la API o la consulta devuelve una lista sin resultados
- **THEN** la tabla DEBE mostrar un indicador de carga coordinado sin duplicar spinners visuales superpuestos con el indicador global, y un mensaje ilustrativo claro ("No se encontraron registros") cuando la lista esté vacía.

#### Scenario: Coordinación visual sin doble spinner
- **WHEN** se realiza una petición de datos a la API donde el cargador global (`LoadingSpinnerComponent`) se encuentra activo
- **THEN** la tabla y vistas asociadas SHALL evitar superponer un spinner circular local sobre el overlay translúcido global, garantizando que el usuario perciba un único indicador de carga unificado.

#### Scenario: Proyección de columnas de acción personalizadas
- **WHEN** una vista requiere acciones específicas por fila (editar, ver detalle, eliminar, descargar)
- **THEN** la tabla DEBE permitir proyectar plantillas personalizadas para las celdas y columnas de acción manteniendo alineación y estilos homogéneos.
