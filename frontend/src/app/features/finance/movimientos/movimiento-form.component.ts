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
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatIconModule } from '@angular/material/icon';
import { NgxMaskDirective } from 'ngx-mask';
import { Movement, MovementService, MovementSourceType } from '../services/movement.service';
import { FinancialAccount, FinancialAccountService } from '../services/financial-account.service';
import { MovementCategoryService } from '../services/movement-category.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-movimiento-form',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, MatDialogModule, MatButtonModule,
    MatFormFieldModule, MatInputModule, MatSelectModule, MatDatepickerModule,
    MatNativeDateModule, MatSlideToggleModule, MatIconModule, NgxMaskDirective
  ],
  template: `
    <h2 mat-dialog-title>{{ isEditMode ? 'Editar Movimiento' : 'Nuevo Movimiento' }}</h2>
    <mat-dialog-content>
      <form [formGroup]="movementForm" class="form-container">
        
        <div class="toggle-container">
          <mat-slide-toggle formControlName="isIncome" [color]="isIncomeCtrl.value ? 'primary' : 'warn'">
            {{ isIncomeCtrl.value ? 'Ingreso' : 'Egreso' }}
          </mat-slide-toggle>
        </div>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Categoría</mat-label>
          <mat-select formControlName="categoryId" required>
            <mat-option *ngFor="let cat of filteredCategories" [value]="cat.value">
              {{ cat.label }}
            </mat-option>
          </mat-select>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Tipo de Origen</mat-label>
          <mat-select formControlName="sourceType" required>
            <mat-option value="Manual">Manual</mat-option>
            <mat-option value="ServiceOrderIncome" *ngIf="isIncomeCtrl.value">Ingreso por OS</mat-option>
            <mat-option value="DirectCost" *ngIf="!isIncomeCtrl.value">Costo Directo</mat-option>
            <mat-option value="FixedCostPayment" *ngIf="!isIncomeCtrl.value">Pago de Costo Fijo</mat-option>
            <mat-option value="AssetPurchase" *ngIf="!isIncomeCtrl.value">Compra de Activo</mat-option>
          </mat-select>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width" *ngIf="sourceTypeCtrl.value !== 'Manual'">
          <mat-label>Origen Específico</mat-label>
          <mat-select formControlName="sourceId" required>
            <mat-option *ngFor="let opt of sourceOptions" [value]="opt.id">
              {{ opt.name }}
            </mat-option>
          </mat-select>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Descripción</mat-label>
          <input matInput formControlName="description" placeholder="Ej: Pago alquiler" required>
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

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Cuenta Financiera</mat-label>
          <mat-select formControlName="financialAccountId" required>
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
    .toggle-container { margin-top: 10px; margin-bottom: 20px; }
    .text-right { text-align: right !important; }
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
    private http: HttpClient
  ) {
    this.isEditMode = !!data?.movement;
    this.movementForm = this.fb.group({
      isIncome: [data?.movement?.isIncome ?? true],
      categoryId: [data?.movement?.categoryId || '', Validators.required],
      sourceType: [data?.movement?.sourceType || 'Manual', Validators.required],
      sourceId: [data?.movement?.sourceId || ''],
      description: [data?.movement?.description || '', Validators.required],
      amount: [data?.movement?.amount || '', [Validators.required, Validators.min(0.01)]],
      date: [data?.movement?.date ? new Date(data.movement.date) : new Date(), Validators.required],
      financialAccountId: [data?.movement?.financialAccountId || '', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadAccounts();
    this.loadCategories();

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
  }

  get isIncomeCtrl() { return this.movementForm.get('isIncome')!; }
  get sourceTypeCtrl() { return this.movementForm.get('sourceType')!; }
  get filteredCategories() { return this.allCategories.filter(c => c.isIncome === this.isIncomeCtrl.value && c.isActive); }

  loadAccounts() { this.accountService.getAccounts().subscribe(data => this.accounts = data); }
  loadCategories() { this.categoryService.getCategories().subscribe(data => this.allCategories = data); }

  loadSourceOptions(type: string) {
    let endpoint = '';
    let mapFn = (x: any) => ({ id: x.id, name: x.name || x.description || x.orderNumber });
    
    if (type === 'ServiceOrderIncome') endpoint = '/service-orders';
    else if (type === 'DirectCost') endpoint = '/direct-costs';
    else if (type === 'FixedCostPayment') endpoint = '/fixed-cost-payments';
    else if (type === 'AssetPurchase') endpoint = '/assets';
    
    if (endpoint) {
      this.http.get<any[]>(environment.apiUrl + endpoint).subscribe({
        next: (res: any) => {
           let arr = res.items || res;
           this.sourceOptions = arr.map(mapFn);
        },
        error: () => this.sourceOptions = []
      });
    }
  }

  save() {
    if (this.movementForm.invalid) return;
    this.isSubmitting = true;
    const val = this.movementForm.value;
    const payload: Movement = {
      isIncome: val.isIncome,
      categoryId: val.categoryId,
      amount: parseFloat(val.amount),
      date: val.date.toISOString(),
      description: val.description,
      financialAccountId: val.financialAccountId,
      sourceType: val.sourceType,
      sourceId: val.sourceId
    };

    if (this.isEditMode) {
      this.movementService.updateMovement(this.data.movement!.id!, payload).subscribe({
        next: () => { this.snackBar.open('Movimiento actualizado', 'Cerrar'); this.dialogRef.close(true); },
        error: (err) => { this.isSubmitting = false; this.snackBar.open(err.error?.message || 'Error', 'Cerrar'); }
      });
    } else {
      this.movementService.createMovement(payload).subscribe({
        next: () => { this.snackBar.open('Movimiento creado', 'Cerrar'); this.dialogRef.close(true); },
        error: (err) => { this.isSubmitting = false; this.snackBar.open(err.error?.message || 'Error', 'Cerrar'); }
      });
    }
  }
}


