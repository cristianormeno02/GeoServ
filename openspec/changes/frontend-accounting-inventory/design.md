## Context
El backend ha sido actualizado para soportar polimorfismo en contabilidad y un esquema de eventos de inventario (event-sourcing ligero) para los consumibles. El frontend de Angular (usualmente con ReactiveForms y Angular Material o similar) debe integrarse con estos nuevos modelos.

## Goals / Non-Goals

**Goals:**
- Actualizar componentes existentes de AccountingMovement y Consumable para soportar las nuevas reglas.
- Proveer una experiencia de usuario guiada para la selección de orígenes polimórficos.
- Mantener consistencia visual utilizando la misma librería de componentes (Angular Material / Bootstrap) que el resto de la aplicación.

**Non-Goals:**
- No se crearán pantallas de ABM completas para las entidades origen (como Activos o Costos Fijos), estas se asumen ya existentes o fuera de este alcance.

## Decisions

- **Manejo de SourceType y SourceId en Formularios**: Se utilizará un BehaviorSubject o se escuchará el evento alueChanges del campo SourceType en el FormGroup para disparar dinámicamente peticiones HTTP que llenen la lista de opciones para el campo SourceId.
- **Vista de Historial de Stock**: Se implementará mediante un Modal (ej. MatDialog) lanzado desde la lista principal de Consumables. Esto evita la necesidad de crear rutas nuevas o romper el flujo de navegación actual del usuario, siendo un reporte rápido.
- **Formulario de Ajustes**: Reutilizará el mismo modal del Historial (en una pestaña de "Nuevo Movimiento") o será un modal separado y ligero para no complicar el componente de edición del Consumable base.

## Risks / Trade-offs

- [Risk] Demora o llamadas HTTP redundantes al cambiar rápidamente el SourceType. → Mitigación: Uso de operadores de RxJS como debounceTime(300) o cacheo de catálogos si son pequeños.
- [Risk] Falta de endpoint en el backend para listar InventoryMovements por insumo. → Mitigación: El backend ya fue refactorizado, pero si carece del endpoint de GET específico, será necesario agregarlo como una tarea paralela rápida.
