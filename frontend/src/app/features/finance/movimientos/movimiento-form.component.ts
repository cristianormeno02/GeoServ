import { Component, Inject, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { NgxMaskDirective } from 'ngx-mask';
import { Movement, MovementService, MovementSourceType } from '../services/movement.service';
import { FinancialAccount, FinancialAccountService } from '../services/financial-account.service';
import { MovementCategoryService } from '../services/movement-category.service';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef } from '@angular/core';
import { switchMap } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';

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

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Tipo de Origen</mat-label>
            <mat-select formControlName="sourceType" required>
              <mat-option value="Manual">Manual</mat-option>
              <mat-option value="ServiceOrderIncome" *ngIf="isIncomeCtrl.value">Ingreso por OS</mat-option>
              <mat-option value="DirectCost" *ngIf="!isIncomeCtrl.value">Costo Directo</mat-option>
              <mat-option value="FixedCostPayment" *ngIf="!isIncomeCtrl.value">Pago de Gasto Fijo</mat-option>
              <mat-option value="AssetPurchase" *ngIf="!isIncomeCtrl.value">Compra de Activo</mat-option>
            </mat-select>
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width" *ngIf="sourceTypeCtrl.value !== 'Manual'">
            <mat-label>Origen Específico</mat-label>
            <mat-select formControlName="sourceId" [compareWith]="compareIds" required>
              <mat-option *ngFor="let opt of sourceOptions" [value]="opt.id">
                {{ opt.name }}
              </mat-option>
            </mat-select>
          </mat-form-field>
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
  `]
})
export class MovimientoFormComponent implements OnInit {
  movementForm: FormGroup;
  isEditMode = false;
  isSubmitting = false;
  accounts: FinancialAccount[] = [];
  allCategories: any[] = [];
  sourceOptions: any[] = [];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<MovimientoFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { movement?: Movement },
    private movementService: MovementService,
    private accountService: FinancialAccountService,
    private categoryService: MovementCategoryService,
    private snackBar: MatSnackBar,
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {
    this.isEditMode = !!data?.movement;
    this.movementForm = this.fb.group({
      movementMode: [data?.movement?.isIncome === false ? 'Egreso' : 'Ingreso'],
      isIncome: [data?.movement?.isIncome ?? true],
      categoryId: [data?.movement?.categoryId || '', Validators.required],
      sourceType: [data?.movement?.sourceType || 'Manual', Validators.required],
      sourceId: [data?.movement?.sourceId || ''],
      description: [data?.movement?.description || '', Validators.required],
      amount: [data?.movement?.amount || '', [Validators.required, Validators.min(0.01)]],
      date: [data?.movement?.date ? new Date(data.movement.date) : new Date(), Validators.required],
      financialAccountId: [data?.movement?.financialAccountId || '', Validators.required],
      fromAccountId: [''],
      toAccountId: ['']
    });
  }

  compareIds(id1: any, id2: any): boolean {
    if (!id1 || !id2) return id1 === id2;
    return id1.toString().toLowerCase() === id2.toString().toLowerCase();
  }

  ngOnInit(): void {
    this.loadAccounts();
    this.loadCategories();

    this.movementModeCtrl.valueChanges.subscribe(mode => this.applyMovementMode(mode));
    this.applyMovementMode(this.movementModeCtrl.value, { emitEvent: false });

    this.isIncomeCtrl.valueChanges.subscribe(() => {
      this.movementForm.get('categoryId')?.setValue('');
      this.movementForm.get('sourceType')?.setValue('Manual');
    });

    this.sourceTypeCtrl.valueChanges.subscribe(val => {
      this.sourceOptions = [];
      if (val === 'Manual') {
        this.movementForm.get('sourceId')?.setValue(null);
        this.movementForm.get('sourceId')?.clearValidators();
      } else {
        this.movementForm.get('sourceId')?.setValidators(Validators.required);
        this.loadSourceOptions(val);
      }
      this.movementForm.get('sourceId')?.updateValueAndValidity();
    });

    if (this.sourceTypeCtrl.value !== 'Manual') {
      this.loadSourceOptions(this.sourceTypeCtrl.value);
    }

    if (this.isEditMode && this.data?.movement?.id) {
      this.movementService.getMovement(this.data.movement.id).subscribe({
        next: (mov: any) => {
          this.movementForm.patchValue({
            isIncome: mov.isIncome,
            categoryId: mov.categoryId,
            sourceType: mov.sourceType?.toString() || 'Manual',
            sourceId: mov.sourceId,
            description: mov.description,
            amount: mov.amount,
            date: mov.date ? new Date(mov.date) : new Date(),
            financialAccountId: mov.financialAccountId
          }, { emitEvent: false });
          if (mov.sourceType && mov.sourceType !== 'Manual') {
            this.loadSourceOptions(mov.sourceType);
          }
          this.cdr.detectChanges();
        },
        error: (err) => console.error('Error fetching movement detail', err)
      });
    }
  }

  get isIncomeCtrl() { return this.movementForm.get('isIncome')!; }
  get sourceTypeCtrl() { return this.movementForm.get('sourceType')!; }
  get movementModeCtrl() { return this.movementForm.get('movementMode')!; }
  get fromAccountIdCtrl() { return this.movementForm.get('fromAccountId')!; }
  get toAccountIdCtrl() { return this.movementForm.get('toAccountId')!; }
  get filteredCategories() { return this.allCategories.filter(c => c.isIncome === this.isIncomeCtrl.value && c.isActive); }

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

  loadSourceOptions(type: string) {
    let endpoint = '';
    let mapFn = (x: any) => ({ id: x.id, name: x.name || x.description || x.orderNumber });
    
    if (type === 'ServiceOrderIncome') endpoint = '/service-orders';
    else if (type === 'DirectCost') {
      endpoint = '/direct-costs';
      mapFn = (x: any) => {
        const osPrefix = x.serviceOrderNumber ? `[OS #${x.serviceOrderNumber}] ` : '';
        const catSuffix = x.categoryName ? ` (${x.categoryName})` : '';
        const amountSuffix = x.totalAmount != null ? ` - $${Number(x.totalAmount).toLocaleString('es-AR')}` : '';
        return {
          id: x.id,
          name: `${osPrefix}${x.description || 'Costo Directo'}${catSuffix}${amountSuffix}`
        };
      };
    }
    else if (type === 'FixedCostPayment') {
      endpoint = '/fixed-cost-items';
      mapFn = (x: any) => ({
        id: x.id,
        name: x.name + (x.category?.name ? ` (${x.category.name})` : '')
      });
    }
    else if (type === 'AssetPurchase') endpoint = '/assets';
    
    if (endpoint) {
      this.http.get<any[]>(environment.apiUrl + endpoint).subscribe({
        next: (res: any) => {
           let arr = res.items || res;
           this.sourceOptions = arr.map(mapFn);
           this.cdr.detectChanges();
        },
        error: () => this.sourceOptions = []
      });
    }
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
      sourceId: val.sourceId || null
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





