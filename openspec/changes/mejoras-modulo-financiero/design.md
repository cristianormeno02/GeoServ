## Context

El sistema gestiona movimientos financieros polimórficos vinculados a distintas fuentes (Órdenes de Servicio, Costos Directos, Gastos Fijos, Compra de Activos y Transferencias Internas). Actualmente, varias pantallas del módulo financiero adolecen de inconsistencias en la presentación de datos, ausencia de persistencia en filtros de fechas y distorsiones visuales en gráficos de cobertura mensual. Ver `proposal.md` para más detalles.

## Goals / Non-Goals

**Goals:**
- Desacoplar el selector de fechas de Movimientos Financieros en dos controles independientes ("Fecha Desde" y "Fecha Hasta") con datepicker propio y validación cruzada reactiva a nivel de `FormGroup`.
- Persistir el rango de fechas seleccionado en `localStorage` y restaurarlo automáticamente al inicializar la pantalla.
- Enriquecer el endpoint `GET /api/financial-movements/{id}` para que retorne `ServiceOrderNumber` resolviendo tanto la OS directa como la OS asociada al `DirectCost`.
- Garantizar que en el listado de movimientos contables la columna "Origen" muestre la Orden de Servicio asociada al Pago de Costo Directo.
- Garantizar que en el formulario de edición de un movimiento de costo directo, el campo "Orden de Servicio" muestre el número de OS (`serviceOrderNumber`) en lugar de la descripción del costo directo.
- Presentar etiquetas en español para los tipos de cuentas financieras en el Resumen Financiero (`Cuenta Bancaria`, `Efectivo`, `Billetera Digital`).
- Mejorar el diseño responsive y proporciones del componente `combo-chart` en el Dashboard Financiero para evitar distorsiones en pantallas de escritorio.

**Non-Goals:**
- Modificar contratos de creación o eliminación de transferencias o costos directos.
- Modificar la vista SQL `vw_MonthlyCoverageReport` o las fórmulas de cálculo de cobertura.
- Modificar la vista de detalle de Órdenes de Servicio (será abordada en una propuesta independiente).

## Decisions

### 1. Separación de controles de fecha y validación cruzada
En `movimientos.html`, reemplazaremos `<mat-date-range-input>` por dos `<mat-form-field>` independientes con `<input matInput [matDatepicker]="pickerDesde" formControlName="startDate">` y `<input matInput [matDatepicker]="pickerHasta" formControlName="endDate">`.
En `movimientos.ts`, agregaremos un validador personalizado al formulario:
```typescript
function dateRangeValidator(group: AbstractControl): ValidationErrors | null {
  const start = group.get('startDate')?.value;
  const end = group.get('endDate')?.value;
  if (start && end && new Date(start) > new Date(end)) {
    return { dateRangeInvalid: true };
  }
  return null;
}
```
*Alternativas consideradas*: Mantener `mat-date-range-input`. Se descartó porque el usuario solicitó específicamente dos controles individuales con sus propios selectores y validación visible.

### 2. Persistencia en LocalStorage
Se utilizará la clave `geoserv_movimientos_filter_period`. Al invocar `applyFilter()`, se almacenará `{ startDate, endDate }` en formato ISO. En `ngOnInit()` o en la inicialización de `filterForm`, se recuperará dicho valor:
- Si existe y es una fecha válida, se parsea a objetos `Date` y se asigna al formulario.
- Si no existe o las fechas son inválidas, se utiliza por defecto el último mes a la fecha de hoy.
Al ejecutar `resetFilter()`, se restablece al período por defecto y se actualiza el `localStorage`.

### 3. Exposición de ServiceOrderNumber en Backend
En `AccountingMovementEndpoints.cs`:
En el endpoint `GET /{id:guid}`, se debe incluir en la proyección del objeto anónimo:
```csharp
ServiceOrderNumber = movement.ServiceOrder != null 
    ? movement.ServiceOrder.OrderNumber 
    : (movement.DirectCost != null && movement.DirectCost.ServiceOrder != null 
        ? movement.DirectCost.ServiceOrder.OrderNumber 
        : null),
```
Para que `movement.DirectCost.ServiceOrder` esté cargado, el endpoint `GetMovementById` debe incluir `.Include(m => m.DirectCost).ThenInclude(dc => dc!.ServiceOrder)`.

### 4. Visualización de OS en Listado y Edición de Costo Directo
- En `movimientos.ts`, el método `getSourceReference(movement)`:
  Para `DirectCost`, si existe `movement.serviceOrderNumber`, retornar `${movement.sourceReference || 'Costo Directo'} (OS: ${movement.serviceOrderNumber})`. Si no hay OS, retornar únicamente `movement.sourceReference`.
- En `movimiento-form.component.ts`:
  En el modo edición, al recibir el movimiento de detalle:
  ```typescript
  if (mov.sourceType === 'DirectCost') {
    this.sourceLabel = mov.serviceOrderNumber ? `OS: ${mov.serviceOrderNumber}` : (mov.sourceReference || null);
  } else {
    this.sourceLabel = mov.sourceReference || null;
  }
  ```

### 5. Traducción de Tipos de Cuentas en Resumen Financiero
En `financial-summary.component.ts`, definir un mapa o función:
```typescript
getAccountTypeLabel(type: string): string {
  const map: Record<string, string> = {
    'BankAccount': 'Cuenta Bancaria',
    'Cash': 'Efectivo',
    'DigitalWallet': 'Billetera Digital'
  };
  return map[type] || type;
}
```
Y en `financial-summary.component.html`, invocar `getAccountTypeLabel(acc.accountType)`.

### 6. Optimización visual de ComboChart (Cobertura Mensual)
En `combo-chart.component.ts`:
- Aumentar la altura en `.combo-chart-wrapper` de `240px` a `320px`.
- Ajustar `viewBox` a `"0 0 760 280"` con márgenes cómodos para etiquetas numéricas del eje Y y períodos en el eje X.
- Asegurar que las barras (`width="14"`, espaciado de `4px`) y la línea de saldo acumulado mantengan una proporción adecuada sin pixelado ni estiramiento excesivo.

## Risks / Trade-offs

- **[Riesgo] Formato de fechas no válido en LocalStorage**: Si el almacenamiento local contiene cadenas inválidas o manipuladas, el formulario podría quedar con valores corruptos.
  - *Mitigación*: Envolver la deserialización de fechas en un bloque `try/catch` y verificar con `!isNaN(new Date(val).getTime())`. Si falla, purgar la clave y usar los valores por defecto.
- **[Riesgo] Costos directos históricos sin OS vinculada**:
  - *Mitigación*: Comprobación segura de nulidad (`?.`); si no posee OS asociada, el listado muestra simplemente la referencia del costo y el formulario no arroja error.
