## Context

Ver `proposal.md` para la motivación general del cambio.

En el frontend actual:
1. `InventoryHistoryDialogComponent` declara una propiedad `movements: InventoryMovement[] = []` y la enlaza directamente a `<table mat-table [dataSource]="movements">`. Al consultar la API de movimientos (`InventoryMovementService.getMovementsByConsumableId`), la asignación del resultado a un array plano no dispara el renderizado de filas de `MatTable` porque no se utiliza una instancia de `MatTableDataSource` ni se invoca `ChangeDetectorRef.detectChanges()`. Al ejecutar `save()`, la directiva `*ngIf="!showNewForm"` destruye y recrea el elemento de la tabla en el DOM, provocando que recién en ese momento se visualicen los datos.
2. `ServiceOrderListComponent` cuenta ya con la propiedad `collectedAmount` provista por el endpoint `GET /api/service-orders` y definida en el modelo `ServiceOrderListItem`. No obstante, la lista `displayedColumns` y la plantilla HTML omiten la columna, impidiendo al usuario ver el monto cobrado directamente en el listado.

## Goals / Non-Goals

**Goals:**
- Implementar `MatTableDataSource<InventoryMovement>` en `InventoryHistoryDialogComponent` junto a `ChangeDetectorRef`, asegurando que los movimientos se muestren inmediatamente al abrir el modal.
- Incorporar un mensaje de estado vacío o fila informativa cuando el insumo no posea movimientos registrados.
- Añadir la columna "Cobrado" (`collectedAmount`) en `ServiceOrderListComponent` (en `displayedColumns` y en el template HTML con el pipe `currency`).
- Ajustar el `colspan` de la fila de datos no encontrados (`*matNoDataRow`) en la tabla de órdenes de servicio para contemplar la nueva columna.

**Non-Goals:**
- Modificar el backend: tanto `InventoryMovementEndpoints.cs` como `ServiceOrderEndpoints.cs` ya operan con las entidades y campos requeridos.
- Alterar los flujos de creación de órdenes o de registro de movimientos manuales.

## Decisions

### Decisión 1: Emplear `MatTableDataSource` en `InventoryHistoryDialogComponent`
- **Elección**: Reemplazar el array primitivo `movements` por `dataSource = new MatTableDataSource<InventoryMovement>([])`, inyectando `ChangeDetectorRef` para forzar la actualización al completarse la suscripción HTTP.
- **Razón**: Es el patrón estándar utilizado en todo el frontend de GeoServ (`InventarioComponent`, `ClientListComponent`, etc.), resolviendo el ciclo de detección de cambios de Angular Material de manera limpia y predecible.
- **Alternativas consideradas**: Usar `table.renderRows()` requiriendo `@ViewChild(MatTable)`. `MatTableDataSource` es superior al proveer mejor interoperabilidad y desacoplamiento.

### Decisión 2: Disposición y formato de la columna "Cobrado" en el listado de OS
- **Elección**: Posicionar la columna inmediatamente a la derecha de "Presupuestado" (`budgetedAmount`), con cabecera "Cobrado" y template `{{row.collectedAmount | currency}}`.
- **Razón**: Permite una comparación financiera inmediata entre lo cotizado/presupuestado y lo efectivamente percibido para cada orden de servicio.

## Risks / Trade-offs

- **[Espacio horizontal en tabla de OS]** → La tabla de órdenes de servicio ya se encuentra contenida en `.table-container` con `overflow-x: auto` y anchos proporcionales, por lo que una columna adicional se integra de forma armónica sin romper el diseño responsive.
