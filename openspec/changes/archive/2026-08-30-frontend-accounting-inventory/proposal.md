## Why

En el cambio previo (efactor-accounting-add-inventory), el backend introdujo soporte para orígenes polimórficos en los movimientos contables (SourceType y SourceId) y un libro de movimientos de inventario dinámico (InventoryMovement). Para que los usuarios puedan aprovechar estas nuevas capacidades, el Frontend (Angular) debe adaptarse. Las pantallas actuales asumen una relación estática y obligatoria con Órdenes de Servicio para la contabilidad, y carecen de interfaz para ver el historial de stock o registrar mermas/ajustes manualmente.

## What Changes

- **Formulario de Movimientos Contables**: Se reemplazará el selector estático de "Orden de Servicio" por un flujo de dos pasos: selección del origen (SourceType, ej: Manual, Costo Directo, Ingreso OS) y, en base a ello, la búsqueda/selección de la entidad de origen correspondiente (SourceId).
- **Grilla de Movimientos Contables**: Adaptar las columnas de la tabla para mostrar el SourceType amigable y el identificador legible del origen (ej. número de orden, nombre de activo), leyendo de la nueva vista de detalle provista por el backend.
- **Grilla de Insumos (Consumables)**: Deshabilitar la edición manual de la cantidad en formularios de edición directa (ya que ahora el stock es dinámico) y mostrar una acción para ver el "Historial de Stock".
- **Historial de Inventario y Ajustes**: Crear un componente/modal para listar los InventoryMovement de un insumo, y otro formulario para registrar manualmente un nuevo movimiento de tipo "Ajuste Positivo", "Ajuste Negativo" (requiriendo un Motivo) o "Consumo Interno".

## Capabilities

### New Capabilities
- ccounting-ui: Pantallas y componentes de UI para registrar y visualizar movimientos contables con orígenes polimórficos (SourceType / SourceId).
- inventory-ui: Pantallas y modales para visualizar el historial dinámico de un insumo y registrar ajustes o mermas manuales.

### Modified Capabilities

## Impact

- **UI / Formularios (Angular)**: El componente AccountingMovementFormComponent requerirá lógica asíncrona para cargar desplegables distintos (Costos, Activos, OS) según el SourceType seleccionado.
- **Componentes de Insumos**: Modificaciones en ConsumableListComponent para integrar el acceso al libro de movimientos.
- **Nuevos Servicios**: Creación de InventoryMovementService en Angular para consumos a la nueva API (asumiendo que se creará un endpoint simple si aún no existe, o se agregarán los llamados).
