## Context

Ver `proposal.md`. El módulo de finanzas (`AccountingMovement`) modela cada movimiento con un único `bool IsIncome` y una única `FinancialAccountId`: un movimiento solo puede afectar una cuenta. El saldo por cuenta se calcula al vuelo (nunca se persiste) como `Σ(IsIncome ? +Amount : -Amount)` filtrado por cuenta, tanto en `FinancialSummaryEndpoints.cs` como en `FinancialDashboardEndpoints.cs`. Esta fórmula ya es correcta para transferencias: si se registran como un par (egreso en origen + ingreso en destino) el saldo de ambas cuentas queda bien reflejado sin cambiar la fórmula.

Ya existen en la semilla de datos (`GeoServDbContext.cs`) dos `MovementCategory`: *"Transferencia Interna (Ingreso)"* y *"Transferencia Interna (Egreso)"*, usadas hoy de forma manual y desvinculada. Es decir, **es posible que ya existan movimientos históricos cargados con estas categorías**, sin ningún campo que los relacione entre sí.

`SourceType` se persiste como `string` (`HasConversion<string>()`), no como entero — agregar un valor nuevo al enum no reordena ni reinterpreta valores ya guardados en la base de datos.

## Goals / Non-Goals

**Goals:**
- Registrar una transferencia entre dos cuentas propias como una sola operación de usuario, generando ambas patas de forma atómica y vinculada.
- Evitar que el nuevo tipo de movimiento infle los KPIs brutos de ingresos/egresos del mes, sin afectar el resultado neto ni los saldos por cuenta (que deben seguir moviéndose igual que hoy).
- No alterar, reclasificar ni vincular retroactivamente ningún movimiento ya cargado.

**Non-Goals:**
- No se implementa conciliación bancaria ni importación de extractos.
- No se soportan transferencias entre cuentas de distinta moneda (se valida y rechaza; el tipo de cambio queda fuera de alcance de esta iteración).
- No se migran ni "adivinan" pares de transferencias históricas cargadas manualmente con las categorías "Transferencia Interna" existentes (ver Riesgos).

## Decisions

### Decisión 1: Modelo aditivo, no reemplazo de `IsIncome`
- **Elección**: mantener `bool IsIncome` tal cual (cada pata de la transferencia sigue siendo un Ingreso o un Egreso normal en su cuenta), y agregar únicamente `MovementSourceType.InternalTransfer` + `Guid? TransferGroupId` (nullable) a `AccountingMovement`.
- **Razón**: `IsIncome` se usa en decenas de lugares (filtros de listado, KPIs, fórmula de saldo). Reemplazarlo por un enum de tres estados obligaría a tocar todo eso y aumenta el riesgo de romper cálculos ya validados en producción. El campo nuevo es puramente aditivo: la migración solo agrega una columna nullable, **no actualiza ninguna fila existente** (todas quedan con `TransferGroupId = NULL`, comportamiento idéntico al actual).
- **Alternativa descartada**: entidad `Transfer` separada con su propia tabla que "envuelva" dos movimientos. Más "correcta" en términos de modelado, pero implica una migración de esquema más invasiva y duplicar lógica de consulta/edición que hoy ya vive en `AccountingMovement`. Se prioriza el cambio mínimo y reversible.

### Decisión 2: Endpoint dedicado con transacción atómica
- **Elección**: `POST /api/movements/transfer` crea las dos filas dentro de una única `DbContext.SaveChangesAsync()` (o transacción explícita si se separan en dos `Add`), reutilizando las dos `MovementCategory` semilla ya existentes por su `Id` conocido (no se crean categorías nuevas ni se renombran las actuales, porque movimientos históricos ya las referencian por FK).
- **Razón**: garantiza que nunca exista una transferencia con una sola pata cargada. Seguir el mismo patrón que otros endpoints "polimórficos" del módulo (consistente con `accounting-ui`).
- **Validaciones**: `CuentaOrigenId != CuentaDestinoId`, `Monto > 0`, ambas cuentas `IsActive`, y misma `CurrencyId` (si difieren, error 400 explícito en vez de crear una transferencia con montos que no van a cuadrar en ninguna moneda real).

### Decisión 3: Guarda de integridad en edición/eliminación, con alcance acotado a datos nuevos
- **Elección**: `PUT /api/movements/{id}` y `DELETE /api/movements/{id}` rechazan (HTTP 400) cualquier movimiento cuyo `TransferGroupId` no sea `null`, indicando que debe usarse `DELETE /api/movements/transfer/{transferGroupId}` (no existe "editar" una transferencia: se borra y se vuelve a cargar, para no tener que resolver reconciliación de montos entre patas).
- **Razón — por qué esto es seguro para los datos ya cargados**: esta guarda solo se activa cuando `TransferGroupId != null`. **Todo movimiento existente hoy tiene `TransferGroupId = null`** (la columna nace nula para filas preexistentes), incluyendo los que ya usan manualmente las categorías "Transferencia Interna". Por lo tanto el comportamiento de edición/eliminación individual para datos históricos **no cambia en absoluto** — siguen editándose y eliminándose exactamente como hoy, uno por uno.

### Decisión 4: Exclusión en KPIs solo hacia adelante, sin recalcular historia
- **Elección**: en `FinancialDashboardEndpoints.cs`, `incomeCurrentMonth`, `incomeTrend` y `expensesCurrentMonth` agregan el filtro `SourceType != MovementSourceType.InternalTransfer`. El saldo por cuenta (`/kpis` por cuenta y `FinancialSummaryEndpoints`) **no se toca** — debe seguir sumando todos los movimientos, transferencias incluidas, porque así es como el saldo refleja la realidad.
- **Razón — por qué no se migran datos históricos**: los movimientos ya cargados con las categorías "Transferencia Interna (Ingreso/Egreso)" tienen `SourceType = Manual`, no `InternalTransfer`, porque se crearon con el formulario genérico existente. Reclasificarlos retroactivamente a `InternalTransfer` para que el nuevo filtro los excluya de los KPIs **cambiaría cifras de reportes de meses ya cerrados**, algo que se considera más riesgoso que la inconsistencia menor que ya existe hoy. Se documenta expresamente como decisión: **el filtro por `SourceType = InternalTransfer` solo aplica a transferencias creadas desde el nuevo endpoint en adelante.**

## Risks / Trade-offs

- **[Riesgo] Movimientos históricos "Transferencia Interna" ya cargados no quedan vinculados ni excluidos de los KPIs brutos.**
  - **Mitigación**: es una decisión consciente (Decisión 4) para no tocar datos ya reportados. Si a futuro se desea sanear el histórico, debe hacerse como un ejercicio manual/asistido de auditoría contable (revisar movimientos con esas dos categorías, confirmar pares uno por uno con un contador), nunca con un script automático que empareje por monto+fecha, porque dos movimientos coincidentes en monto y fecha no necesariamente son la misma transferencia (podría vincular incorrectamente registros no relacionados y corromper la trazabilidad). Queda explícitamente fuera de alcance de este cambio.
- **[Riesgo] Migración de esquema sobre tabla con datos en producción.**
  - **Mitigación**: la migración de EF Core solo agrega una columna `nvarchar`/`uniqueidentifier` nullable (`TransferGroupId`) y no ejecuta ningún `UPDATE`. Es la misma clase de migración aditiva y de bajo riesgo que `PolymorphicAccountingMovement` (que ya agregó `SourceType`/`SourceId` sin backfill). Se valida con `dotnet ef migrations script` antes de aplicar en un ambiente con datos reales.
- **[Riesgo] Usuario intenta transferir entre cuentas de distinta moneda.**
  - **Mitigación**: validación explícita en el endpoint (HTTP 400 con mensaje claro), en vez de crear una transferencia con un monto que no representa fielmente ninguna de las dos monedas.
- **[Riesgo] Borrado parcial si el segundo `Add` de la transacción falla.**
  - **Mitigación**: ambas inserciones se ejecutan dentro de una misma transacción de base de datos (`BeginTransactionAsync` o un único `SaveChangesAsync` con ambas entidades trackeadas); si falla cualquiera de las dos, no se persiste ninguna.

### Decisión 5: Conversión de un movimiento existente a Transferencia (editar → borrar + recrear, no un endpoint de "conversión")
- **Elección**: en el formulario de edición, si el usuario cambia el "Tipo de Movimiento" a "Transferencia entre Cuentas", el frontend encadena `DELETE /api/movements/{id}` (del movimiento original) y, si tiene éxito, `POST /api/movements/transfer` (creación de la transferencia nueva). No se agregó un endpoint dedicado `PATCH /api/movements/{id}/convert-to-transfer`.
- **Razón**: son dos operaciones ya existentes y ya validadas (borrado individual + creación de transferencia); encadenarlas en el cliente evita duplicar lógica de validación en el backend para un caso de uso puntual. Es seguro porque el movimiento a convertir, por construcción, nunca tiene `TransferGroupId` (los que sí lo tienen ni siquiera llegan a este formulario: el listado oculta su botón de editar), por lo que no hay riesgo de "romper" una transferencia real existente.
- **Alternativa descartada**: hacerlo atómico en el backend con un endpoint dedicado. Se descartó por sobre-ingeniería para un caso de uso de corrección manual poco frecuente; el riesgo de una falla a mitad de camino (se borra el original pero falla la creación de la transferencia) se considera aceptable frente a la simplicidad, ya que el usuario puede simplemente volver a cargar el movimiento si eso ocurre.

### Decisión 6: Categorías de Transferencia Interna marcadas como `IsSystemDefault`
- **Elección**: se agrega `bool IsSystemDefault` a `MovementCategory`. Las dos categorías semilla "Transferencia Interna (Ingreso/Egreso)" se marcan `true` vía migración (`UpdateData` sobre las filas existentes, identificadas por su Id conocido). El backend rechaza `PUT`/`DELETE` sobre categorías `IsSystemDefault`, y `POST` (creación de categorías nuevas) siempre fuerza `IsSystemDefault = false`, sin exponer el campo como configurable desde la API de creación.
- **Razón**: una vez que existe el flujo dedicado de transferencias (que asigna estas categorías automáticamente), permitir que un usuario las siga seleccionando manualmente desde el formulario genérico de Ingreso/Egreso reintroduce exactamente el problema que este change vino a resolver (transferencias sin vincular, KPIs potencialmente inflados). Marcarlas como reservadas cierra ese camino sin eliminar las categorías (que siguen siendo necesarias como FK de movimientos históricos y de las transferencias nuevas).
- **Riesgo y mitigación**: igual que `TransferGroupId`, es una migración aditiva (`AddColumn` + `UpdateData` acotado a 2 filas por Id exacto) que no toca ninguna otra categoría ni movimiento existente.
