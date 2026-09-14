import { Component, Inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { NgxMaskDirective } from 'ngx-mask';
import { switchMap } from 'rxjs/operators';
import { Movement, MovementService } from '../services/movement.service';
import { FinancialAccount, FinancialAccountService } from '../services/financial-account.service';
import { MovementCategoryService } from '../services/movement-category.service';
import { ServiceOrderSearchDialogComponent, SourceSearchResult } from './service-order-search-dialog.component';
import { AssetSearchDialogComponent } from './asset-search-dialog.component';
import { FixedCostSearchDialogComponent } from './fixed-cost-search-dialog.component';
import { DirectCostCategoryService } from '../../direct-cost-categories/services/direct-cost-category.service';
import { DirectCostCategory } from '../../direct-cost-categories/models/direct-cost-category.model';
import { DirectCostService } from '../../service-orders/services/direct-cost.service';

const SOURCE_FIELD_LABELS: Record<string, string> = {
  ServiceOrderIncome: 'Orden de Servicio',
  AssetPurchase: 'Activo',
  FixedCostPayment: 'Gasto Fijo / Vencimiento',
  // La búsqueda ahora apunta a la Orden de Servicio de destino; la categoría de Costo Directo
  // se elige aparte en un selector propio (ver directCostCategoryId).
  DirectCost: 'Orden de Servicio'
};

@Component({
  selector: 'app-movimiento-form',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, MatDialogModule, MatButtonModule,
    MatFormFieldModule, MatInputModule, MatSelectModule, MatDatepickerModule,
    MatNativeDateModule, MatIconModule, NgxMaskDirective
  ],
  template: `
    <h2 mat-dialog-title>{{ isEditMode ? 'Editar Movimiento' : 'Nuevo Movimiento' }}</h2>
    <mat-dialog-content>
      <form [formGroup]="movementForm" class="form-container">

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Tipo de Movimiento</mat-label>
          <mat-select formControlName="movementMode">
            <mat-option value="Ingreso">Ingreso</mat-option>
            <mat-option value="Egreso">Egreso</mat-option>
            <mat-option value="Transferencia">Transferencia entre Cuentas</mat-option>
          </mat-select>
        </mat-form-field>

        <p class="convert-hint" *ngIf="isEditMode && movementModeCtrl.value === 'Transferencia'">
          Se eliminará este movimiento y se creará una Transferencia Interna nueva con los datos ingresados.
        </p>

        <ng-container *ngIf="movementModeCtrl.value !== 'Transferencia'; else transferFields">
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Categoría</mat-label>
            <mat-select formControlName="categoryId" [compareWith]="compareIds" required>
              <mat-option *ngFor="let cat of filteredCategories" [value]="cat.id">
                {{ cat.name }}
              </mat-option>
            </mat-select>
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width" *ngIf="sourceTypeCtrl.value === 'DirectCost'">
            <mat-label>Categoría de Costo Directo</mat-label>
            <mat-select formControlName="directCostCategoryId" [compareWith]="compareIds" required>
              <mat-option *ngFor="let dcCat of directCostCategories" [value]="dcCat.id">
                {{ dcCat.name }}
              </mat-option>
            </mat-select>
            <mat-hint *ngIf="directCostCategories.length === 0">
              No hay categorías de costo directo habilitadas para asignación vía movimiento.
            </mat-hint>
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width" *ngIf="sourceTypeCtrl.value !== 'Manual'">
            <mat-label>{{ sourceFieldLabel }}</mat-label>
            <input matInput readonly [value]="sourceLabel || ''" (click)="openSourceSearchDialog()" placeholder="Click para buscar...">
            <button mat-icon-button matSuffix type="button" (click)="openSourceSearchDialog()">
              <mat-icon>search</mat-icon>
            </button>
          </mat-form-field>
          <p class="source-hint" *ngIf="sourceTypeCtrl.value !== 'Manual' && !sourceLabel">
            Debe seleccionar un origen específico para esta categoría.
          </p>
        </ng-container>

        <ng-template #transferFields>
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Cuenta Origen</mat-label>
            <mat-select formControlName="fromAccountId" [compareWith]="compareIds" required>
              <mat-option *ngFor="let acc of accounts" [value]="acc.id" [disabled]="acc.id === toAccountIdCtrl.value">
                {{acc.name}}
              </mat-option>
            </mat-select>
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Cuenta Destino</mat-label>
            <mat-select formControlName="toAccountId" [compareWith]="compareIds" required>
              <mat-option *ngFor="let acc of accounts" [value]="acc.id" [disabled]="acc.id === fromAccountIdCtrl.value">
                {{acc.name}}
              </mat-option>
            </mat-select>
          </mat-form-field>
        </ng-template>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Descripción</mat-label>
          <input matInput formControlName="description" placeholder="Ej: Pago alquiler" [required]="movementModeCtrl.value !== 'Transferencia'">
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Monto</mat-label>
          <span matTextPrefix>$&nbsp;</span>
          <input matInput type="text" formControlName="amount" mask="separator.2" thousandSeparator="." decimalMarker="," class="text-right" required>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Fecha</mat-label>
          <input matInput [matDatepicker]="picker" formControlName="date" required>
          <mat-datepicker-toggle matIconSuffix [for]="picker"></mat-datepicker-toggle>
          <mat-datepicker #picker></mat-datepicker>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width" *ngIf="movementModeCtrl.value !== 'Transferencia'">
          <mat-label>Cuenta Financiera</mat-label>
          <mat-select formControlName="financialAccountId" [compareWith]="compareIds" required>
            <mat-option *ngFor="let acc of accounts" [value]="acc.id">
              {{acc.name}}
            </mat-option>
          </mat-select>
        </mat-form-field>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Cancelar</button>
      <button mat-raised-button color="primary" [disabled]="movementForm.invalid || isSubmitting" (click)="save()">
        {{ isSubmitting ? 'Guardando...' : 'Guardar' }}
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .form-container { display: flex; flex-direction: column; gap: 15px; min-width: 450px; margin-top: 10px; }
    .full-width { width: 100%; }
    .text-right { text-align: right !important; }
    .convert-hint { margin: -10px 0 0; font-size: 0.85em; color: #b26a00; }
    .source-hint { margin: -10px 0 0; font-size: 0.8em; color: #b26a00; }
  `]
})
export class MovimientoFormComponent implements OnInit {
  movementForm: FormGroup;
  isEditMode = false;
  isSubmitting = false;
  accounts: FinancialAccount[] = [];
  allCategories: any[] = [];
  directCostCategories: DirectCostCategory[] = [];
  sourceLabel: string | null = null;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<MovimientoFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { movement?: Movement },
    private movementService: MovementService,
    private accountService: FinancialAccountService,
    private categoryService: MovementCategoryService,
    private directCostCategoryService: DirectCostCategoryService,
    private directCostService: DirectCostService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef
  ) {
    this.isEditMode = !!data?.movement;
    this.movementForm = this.fb.group({
      movementMode: [data?.movement?.isIncome === false ? 'Egreso' : 'Ingreso'],
      isIncome: [data?.movement?.isIncome ?? true],
      categoryId: [data?.movement?.categoryId || '', Validators.required],
      sourceType: [data?.movement?.sourceType || 'Manual', Validators.required],
      sourceId: [data?.movement?.sourceId || ''],
      directCostCategoryId: [''],
      description: [data?.movement?.description || '', Validators.required],
      amount: [data?.movement?.amount || '', [Validators.required, Validators.min(0.01)]],
      date: [data?.movement?.date ? new Date(data.movement.date) : new Date(), Validators.required],
      financialAccountId: [data?.movement?.financialAccountId || '', Validators.required],
      fromAccountId: [''],
      toAccountId: ['']
    });
    this.sourceLabel = data?.movement?.sourceReference || null;
  }

  compareIds(id1: any, id2: any): boolean {
    if (!id1 || !id2) return id1 === id2;
    return id1.toString().toLowerCase() === id2.toString().toLowerCase();
  }

  ngOnInit(): void {
    this.loadAccounts();
    this.loadCategories();
    this.loadDirectCostCategories();

    this.movementModeCtrl.valueChanges.subscribe(mode => this.applyMovementMode(mode));
    this.applyMovementMode(this.movementModeCtrl.value, { emitEvent: false });

    this.isIncomeCtrl.valueChanges.subscribe(() => {
      this.movementForm.get('categoryId')?.setValue('');
      this.resetSourceSelection('Manual');
    });

    this.categoryIdCtrl.valueChanges.subscribe(categoryId => this.onCategoryChanged(categoryId));

    if (this.isEditMode && this.data?.movement?.id) {
      this.movementService.getMovement(this.data.movement.id).subscribe({
        next: (mov: any) => {
          this.movementForm.patchValue({
            isIncome: mov.isIncome,
            categoryId: mov.categoryId,
            sourceType: mov.sourceType?.toString() || 'Manual',
            sourceId: mov.sourceType === 'DirectCost' ? (mov.serviceOrderId || '') : mov.sourceId,
            description: mov.description,
            amount: mov.amount,
            date: mov.date ? new Date(mov.date) : new Date(),
            financialAccountId: mov.financialAccountId
          }, { emitEvent: false });
          this.sourceLabel = mov.sourceReference || null;

          // El movimiento de costo directo vía el flujo nuevo referencia una fila ya creada/consolidada:
          // se consulta para preseleccionar su categoría de costo directo en el formulario.
          if (mov.sourceType === 'DirectCost' && mov.directCostId) {
            this.directCostService.getCostById(mov.directCostId).subscribe({
              next: (cost) => {
                this.movementForm.patchValue({ directCostCategoryId: cost.categoryId }, { emitEvent: false });
                this.cdr.detectChanges();
              },
              error: (err) => console.error('Error fetching direct cost detail', err)
            });
          }

          this.cdr.detectChanges();
        },
        error: (err) => console.error('Error fetching movement detail', err)
      });
    }
  }

  get isIncomeCtrl() { return this.movementForm.get('isIncome')!; }
  get sourceTypeCtrl() { return this.movementForm.get('sourceType')!; }
  get sourceIdCtrl() { return this.movementForm.get('sourceId')!; }
  get categoryIdCtrl() { return this.movementForm.get('categoryId')!; }
  get movementModeCtrl() { return this.movementForm.get('movementMode')!; }
  get fromAccountIdCtrl() { return this.movementForm.get('fromAccountId')!; }
  get toAccountIdCtrl() { return this.movementForm.get('toAccountId')!; }
  get filteredCategories() { return this.allCategories.filter(c => c.isIncome === this.isIncomeCtrl.value && c.isActive && !c.isSystemDefault); }
  get sourceFieldLabel() { return SOURCE_FIELD_LABELS[this.sourceTypeCtrl.value] || 'Origen Específico'; }

  // La categoría determina el tipo de origen: ya no se elige "Tipo de Origen" a mano.
  onCategoryChanged(categoryId: string): void {
    const category = this.allCategories.find(c => c.id === categoryId);
    const linkedSourceType = category?.linkedSourceType || 'Manual';
    this.resetSourceSelection(linkedSourceType);
  }

  resetSourceSelection(sourceType: string): void {
    this.sourceTypeCtrl.setValue(sourceType);
    this.sourceIdCtrl.setValue(sourceType === 'Manual' ? null : '');
    this.sourceIdCtrl.setValidators(sourceType === 'Manual' ? [] : [Validators.required]);
    this.sourceIdCtrl.updateValueAndValidity();

    const directCostCategoryIdCtrl = this.movementForm.get('directCostCategoryId')!;
    directCostCategoryIdCtrl.setValue('');
    directCostCategoryIdCtrl.setValidators(sourceType === 'DirectCost' ? [Validators.required] : []);
    directCostCategoryIdCtrl.updateValueAndValidity();

    this.sourceLabel = null;
  }

  openSourceSearchDialog(): void {
    const type = this.sourceTypeCtrl.value;
    let dialogRef;

    if (type === 'ServiceOrderIncome' || type === 'DirectCost') {
      // Costo Directo vía movimiento: se busca la Orden de Servicio de destino, igual que para un cobro.
      // La categoría de costo directo se elige aparte en el selector "Categoría de Costo Directo".
      dialogRef = this.dialog.open(ServiceOrderSearchDialogComponent, { width: '500px' });
    } else if (type === 'AssetPurchase') {
      dialogRef = this.dialog.open(AssetSearchDialogComponent, { width: '500px' });
    } else if (type === 'FixedCostPayment') {
      dialogRef = this.dialog.open(FixedCostSearchDialogComponent, {
        width: '500px',
        data: { currentFixedCostPaymentId: this.sourceIdCtrl.value || null }
      });
    } else {
      return;
    }

    dialogRef.afterClosed().subscribe((result: SourceSearchResult | undefined) => {
      if (!result) return;
      this.sourceIdCtrl.setValue(result.id);
      this.sourceLabel = result.label;
      this.applyAutofill(result);
      this.cdr.detectChanges();
    });
  }

  // Autocompleta Monto/Descripción con los datos del origen elegido (vencimiento de Gasto Fijo o
  // Costo Directo), solo si el usuario todavía no cargó un valor propio en esos campos.
  applyAutofill(result: SourceSearchResult): void {
    if (result.amount != null) {
      const amountCtrl = this.movementForm.get('amount')!;
      const current = amountCtrl.value;
      const isEmpty = current === '' || current === null || current === undefined || Number(current) === 0;
      if (isEmpty) amountCtrl.setValue(result.amount);
    }
    if (result.description) {
      const descriptionCtrl = this.movementForm.get('description')!;
      if (!descriptionCtrl.value) descriptionCtrl.setValue(result.description);
    }
  }

  applyMovementMode(mode: string, options: { emitEvent?: boolean } = {}) {
    const isTransfer = mode === 'Transferencia';

    const categoryId = this.movementForm.get('categoryId')!;
    const sourceType = this.movementForm.get('sourceType')!;
    const financialAccountId = this.movementForm.get('financialAccountId')!;
    const fromAccountId = this.movementForm.get('fromAccountId')!;
    const toAccountId = this.movementForm.get('toAccountId')!;
    const description = this.movementForm.get('description')!;

    if (isTransfer) {
      this.isIncomeCtrl.setValue(false, options);
      categoryId.clearValidators();
      sourceType.clearValidators();
      financialAccountId.clearValidators();
      description.clearValidators();
      fromAccountId.setValidators(Validators.required);
      toAccountId.setValidators(Validators.required);
    } else {
      this.isIncomeCtrl.setValue(mode !== 'Egreso', options);
      categoryId.setValidators(Validators.required);
      sourceType.setValidators(Validators.required);
      financialAccountId.setValidators(Validators.required);
      description.setValidators(Validators.required);
      fromAccountId.clearValidators();
      toAccountId.clearValidators();
      fromAccountId.setValue('', options);
      toAccountId.setValue('', options);
    }

    categoryId.updateValueAndValidity(options);
    sourceType.updateValueAndValidity(options);
    financialAccountId.updateValueAndValidity(options);
    fromAccountId.updateValueAndValidity(options);
    toAccountId.updateValueAndValidity(options);
    description.updateValueAndValidity(options);
  }

  loadAccounts() {
    this.accountService.getAccounts().subscribe(data => {
      this.accounts = data;
      this.cdr.detectChanges();
    });
  }

  loadCategories() {
    this.categoryService.getCategories().subscribe(data => {
      this.allCategories = data;
      this.cdr.detectChanges();
    });
  }

  loadDirectCostCategories() {
    this.directCostCategoryService.getCategories().subscribe(data => {
      this.directCostCategories = data.filter(c => c.isActive && c.isAssignableViaMovement);
      this.cdr.detectChanges();
    });
  }

  save() {
    if (this.movementForm.invalid) return;
    this.isSubmitting = true;
    const val = this.movementForm.value;

    let amountNumber = val.amount;
    if (typeof amountNumber === 'string') {
      amountNumber = parseFloat(amountNumber.replace(/\./g, '').replace(',', '.'));
    }

    if (val.movementMode === 'Transferencia') {
      const createTransfer$ = this.movementService.createTransfer({
        fromAccountId: val.fromAccountId,
        toAccountId: val.toAccountId,
        amount: Number(amountNumber) || 0,
        date: val.date instanceof Date ? val.date.toISOString() : new Date(val.date).toISOString(),
        description: val.description || null
      });

      // Al convertir un movimiento existente en Transferencia, se elimina el movimiento
      // original (nunca es una pata de otra transferencia: esos no llegan a este formulario)
      // y se crea la transferencia nueva en su lugar.
      const request$ = this.isEditMode
        ? this.movementService.deleteMovement(this.data.movement!.id!).pipe(switchMap(() => createTransfer$))
        : createTransfer$;

      request$.subscribe({
        next: () => {
          this.snackBar.open('Transferencia registrada con éxito', 'Cerrar', { duration: 3000 });
          this.dialogRef.close(true);
        },
        error: (err) => {
          this.isSubmitting = false;
          this.snackBar.open(err.error?.message || 'Error al registrar la transferencia', 'Cerrar', { duration: 4000, panelClass: ['snackbar-error'] });
        }
      });
      return;
    }

    const payload: Movement = {
      isIncome: val.isIncome,
      categoryId: val.categoryId,
      amount: Number(amountNumber) || 0,
      date: val.date instanceof Date ? val.date.toISOString() : new Date(val.date).toISOString(),
      description: val.description,
      financialAccountId: val.financialAccountId,
      sourceType: val.sourceType,
      sourceId: val.sourceId || null,
      directCostCategoryId: val.sourceType === 'DirectCost' ? (val.directCostCategoryId || null) : null
    };

    if (this.isEditMode) {
      this.movementService.updateMovement(this.data.movement!.id!, payload).subscribe({
        next: () => {
          this.snackBar.open('Movimiento actualizado con éxito', 'Cerrar', { duration: 3000 });
          this.dialogRef.close(true);
        },
        error: (err) => {
          this.isSubmitting = false;
          this.snackBar.open(err.error?.message || 'Error al actualizar movimiento', 'Cerrar', { duration: 4000, panelClass: ['snackbar-error'] });
        }
      });
    } else {
      this.movementService.createMovement(payload).subscribe({
        next: () => {
          this.snackBar.open('Movimiento creado con éxito', 'Cerrar', { duration: 3000 });
          this.dialogRef.close(true);
        },
        error: (err) => {
          this.isSubmitting = false;
          this.snackBar.open(err.error?.message || 'Error al crear movimiento', 'Cerrar', { duration: 4000, panelClass: ['snackbar-error'] });
        }
      });
    }
  }
}
