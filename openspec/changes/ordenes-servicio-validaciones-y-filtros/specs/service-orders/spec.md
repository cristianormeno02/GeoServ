## MODIFIED Requirements

### Requirement: Validaciones Generales y de Interfaz al Guardar
El sistema SHALL realizar verificaciones estrictas tanto en el frontend como en el backend antes de permitir guardar (crear o editar) la Orden de Servicio:
- **Campos Obligatorios Principales**: Nro. de Orden, Cliente, Tipo de Servicio, Estado, Prioridad, Monto Presupuestado y Responsables (mínimo uno).
- **Fechas Obligatorias Generales**: Fecha de Solicitud, Inicio Presupuestado y Fin Presupuestado son obligatorias. Las fechas reales (Inicio Real, Fin Real) y la Fecha de Cobro son opcionales en estados preliminares, pero sujetas a validación según el estado y coherencia cronológica.
- **Coherencia de Fechas Presupuestadas**: La fecha de Fin Presupuestado (`EstimatedEndDate`) SHALL NOT ser anterior a la fecha de Inicio Presupuestado (`EstimatedStartDate`).
- **Coherencia de Fechas Reales**: Cuando se cargue la fecha de Fin Real / Fecha de Entrega (`ActualEndDate`), SHALL NOT ser anterior a la fecha de Inicio Real (`ActualStartDate`).
- **Asociación de Fecha de Entrega con Estado**: Si se especifica una fecha de entrega / fin real (`ActualEndDate`), el estado de la orden SHALL ser "Entregada".
- **Completitud Estricta para Estado "Entregada"**: Cuando una orden se guarde o pase al estado "Entregada", el sistema SHALL requerir obligatoriamente:
  1. Proyecto asignado (`ProjectId` no nulo ni vacío).
  2. Cliente asignado (`ClientId` no nulo ni vacío).
  3. Todas las fechas completas excepto Fecha de Cobro (es decir, Fecha de Solicitud, Inicio Presupuestado, Fin Presupuestado, Inicio Real y Fin Real / Entrega deben estar presentes).
  4. Todos los montos requeridos excepto Monto Cobrado y Descuento (es decir, Monto Presupuestado y Total Final mayores a 0, y en caso de moneda extranjera, Monto Extranjero y Cotización al Presupuestar).
  5. Equipo de trabajo asignado (al menos un responsable vinculado).
- **Unicidad**: El Nro. de Orden SHALL NOT estar duplicado en el sistema.
- **Distribución de Cobro**: Si existe al menos una línea de distribución agregada, la suma de todos los porcentajes de los ítems de distribución SHALL ser exactamente 100%. No se pueden repetir conceptos.
- **Limpieza de Interfaz**: Visualmente solo debe existir una única línea separadora entre la sección de "Datos Principales" y "Fechas".

#### Scenario: Intento de guardar con fin presupuestado anterior a inicio presupuestado
- **WHEN** el usuario ingresa una fecha de fin presupuestado cronológicamente anterior a la fecha de inicio presupuestado y presiona guardar
- **THEN** el sistema bloquea el guardado e informa un mensaje de error indicando que el fin presupuestado no puede ser anterior al inicio presupuestado

#### Scenario: Intento de guardar con fin real anterior a inicio real
- **WHEN** el usuario ingresa una fecha de fin real anterior a la fecha de inicio real y presiona guardar
- **THEN** el sistema bloquea el guardado e informa que la fecha de fin real no puede ser anterior a la fecha de inicio real

#### Scenario: Carga de fecha de entrega con estado distinto a Entregada
- **WHEN** el usuario especifica una fecha de fin real / entrega pero mantiene la orden en un estado distinto a "Entregada"
- **THEN** el sistema bloquea el guardado e indica que al definir una fecha de entrega el estado debe ser "Entregada"

#### Scenario: Intento de guardar en estado Entregada con datos incompletos
- **WHEN** el usuario intenta guardar la orden en estado "Entregada" pero carece de proyecto, o de inicio real, o de fin real, o de equipo de trabajo, o de total presupuestado
- **THEN** el sistema bloquea la operación y notifica detalladamente los requisitos faltantes obligatorios para el estado Entregada

#### Scenario: Guardado exitoso en estado Entregada con todos los requisitos
- **WHEN** el usuario guarda una orden en estado "Entregada" contando con proyecto, cliente, todas las fechas excepto cobro, montos válidos y al menos un responsable
- **THEN** el sistema persiste la orden exitosamente y redirige al listado

## ADDED Requirements

### Requirement: Filtros y Ordenamiento del Listado de Órdenes de Servicio
La vista de listado de Órdenes de Servicio SHALL proporcionar filtros avanzados y un ordenamiento predeterminado claro:
- **Filtro por Proyecto**: Selector desplegable que permite filtrar las órdenes pertenecientes a un proyecto específico o seleccionar "Todos los proyectos".
- **Filtro por Estado**: Selector desplegable que permite filtrar las órdenes por su estado. Al abrir o ingresar a la pantalla, este filtro SHALL estar seleccionado por defecto en **"Iniciada"**, mostrando únicamente las órdenes en dicho estado a menos que el usuario seleccione otro estado o "Todos los estados".
- **Ordenamiento Predeterminado**: La grilla de datos SHALL ordenarse inicialmente de manera ascendente por Número de Orden (`OrderNumber` ASC).

#### Scenario: Carga inicial del listado con filtro por defecto y orden ascendente
- **WHEN** el usuario navega a la vista de Órdenes de Servicio
- **THEN** el filtro de estado se inicializa en "Iniciada", la tabla muestra únicamente las órdenes con estado "Iniciada" y los registros se visualizan ordenados ascendentemente por su número de orden

#### Scenario: Filtrado combinado por Proyecto y Estado
- **WHEN** el usuario selecciona un proyecto particular y cambia el filtro de estado a "Todos" o a otro estado específico
- **THEN** la grilla actualiza inmediatamente los resultados mostrando solo las órdenes que cumplan ambos criterios de filtrado

### Requirement: Indicador Visual de Alertas por Inconsistencias de Datos en el Listado
El listado de Órdenes de Servicio SHALL evaluar y alertar visualmente cuando un registro posea inconsistencias o información mal cargada respecto a las reglas de integridad del negocio, contemplando especialmente órdenes históricas cargadas con anterioridad:
- **Criterios de Inconsistencia Evaluados**:
  1. Fechas presupuestadas invertidas (`EstimatedEndDate < EstimatedStartDate`).
  2. Fechas reales invertidas (`ActualEndDate < ActualStartDate`).
  3. Orden con fecha de entrega cargada (`ActualEndDate` no nulo) cuyo estado no sea "Entregada".
  4. Orden en estado "Entregada" que carezca de Proyecto, de Cliente, de cualquiera de las fechas requeridas (`RequestDate`, `EstimatedStartDate`, `EstimatedEndDate`, `ActualStartDate`, `ActualEndDate`), de montos requeridos (`BudgetedAmount <= 0` o `TotalAmount <= 0`), o de equipo de trabajo (sin responsables asignados).
- **Representación Visual**:
  - Para cada fila que incumpla alguna de estas condiciones, el sistema SHALL mostrar un icono/signo de alerta destacado (ej. icono de advertencia amarillo/ámbar).
  - Al posicionar el cursor sobre dicho icono (tooltip), el sistema SHALL mostrar la descripción específica de las inconsistencias detectadas.

#### Scenario: Visualización de alerta para orden con fechas incoherentes
- **WHEN** existe una orden previa donde la fecha de fin presupuestado es anterior a la de inicio presupuestado
- **THEN** la fila correspondiente en la tabla muestra un icono de alerta indicando al pasar el ratón que el fin presupuestado es anterior al inicio

#### Scenario: Visualización de alerta para orden entregada incompleta
- **WHEN** existe una orden histórica en estado "Entregada" que fue guardada sin proyecto o sin equipo de trabajo
- **THEN** la fila de la orden en el listado muestra el signo de alerta y el tooltip detalla los campos faltantes obligatorios para el estado Entregada
