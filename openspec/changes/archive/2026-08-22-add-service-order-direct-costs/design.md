# Design: Costos Directos

## Architecture & Data Model

### Tablas a crear / modificar
1. `CostosDirectos`:
   - `Id` (PK)
   - `OrdenServicioId` (FK -> OrdenesServicio)
   - `Fecha` (DateTime/Date)
   - `CategoriaCostoId` (FK -> CategoriasCostos)
   - `Detalle` (string)
   - `ProveedorId` (FK -> Proveedores)
   - `Cantidad` (decimal)
   - `UnidadId` (FK -> Unidades)
   - `PrecioUnitario` (decimal)
   - `ImporteTotal` (decimal)
   - `PagadoPorId` (FK -> Responsables/Usuarios)
   - `MedioPagoId` (FK -> MediosPago)
   - `Estado` (string / enum: Pagado, Pendiente)
   - `Observaciones` (string)

2. **Tablas maestras (Mantenedores):**
   - `CategoriasCostos`
   - `Proveedores`
   - `Unidades`
   - `MediosPago`

## UI/UX Approach
- Se agregará un nuevo componente de interfaz tipo pestaña (Tab) en el contenedor de detalle o edición de la Orden de Servicio.
- La pestaña mostrará un `DataTable` o `Grid` con las columnas más importantes (Fecha, Categoría, Detalle, Importe Total, Estado).
- Se dispondrá de un botón "Agregar Costo" que abrirá un Modal/Dialog o un formulario en la misma vista, con los campos mencionados.
- El importe total debería autocalcularse en el front-end a partir de `Cantidad` y `PrecioUnitario`, permitiendo validación antes de guardar.
- Los catálogos (Categorías, Proveedores, Unidades, Medios de Pago) deberán disponer de pantallas tipo CRUD (lista + formulario básico) accesibles desde un menú de "Configuración" o "Mantenedores".
