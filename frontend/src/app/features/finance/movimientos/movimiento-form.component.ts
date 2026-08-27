import {  Component, Inject, OnInit  } from '@angular/core';
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
import { Movement, MovementService } from '../services/movement.service';
import { FinancialAccount, FinancialAccountService } from '../services/financial-account.service';

import { MovementCategoryService } from '../services/movement-category.service';

@Component({
  selector: 'app-movimiento-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSlideToggleModule,
    MatIconModule,
    NgxMaskDirective
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
          <mat-label>Descripción</mat-label>
          <input matInput formControlName="description" placeholder="Ej: Pago alquiler oficina" required>
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
          <mat-label>Cuenta Financiera (Origen/Destino)</mat-label>
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
    .form-container {
      display: flex;
      flex-direction: column;
      gap: 15px;
      min-width: 450px;
      margin-top: 10px;
    }
    .full-width {
      width: 100%;
    }
    .toggle-container {
      margin-top: 10px;
      margin-bottom: 20px;
    }
    .text-right {
      text-align: right !important;
    }
  `]
})
export class MovimientoFormComponent implements OnInit {
  movementForm: FormGroup;
  isEditMode = false;
  isSubmitting = false;
  accounts: FinancialAccount[] = [];
  allCategories: any[] = []; // Fetched from backend

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<MovimientoFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { movement?: Movement },
    private movementService: MovementService,
    private accountService: FinancialAccountService,
    private categoryService: MovementCategoryService,
    private snackBar: MatSnackBar
  ) {
    this.isEditMode = !!data?.movement;
    this.movementForm = this.fb.group({
      isIncome: [data?.movement?.isIncome ?? true],
      categoryId: [data?.movement?.categoryId?.toLowerCase() || '', Validators.required],
      description: [data?.movement?.description || '', Validators.required],
      amount: [data?.movement?.amount || '', [Validators.required, Validators.min(0.01)]],
      date: [data?.movement?.date ? new Date(data.movement.date) : new Date(), Validators.required],
      financialAccountId: [data?.movement?.financialAccountId?.toLowerCase() || '', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadAccounts();
    this.loadCategories();

    // Reset category when income/expense toggle changes
    this.isIncomeCtrl.valueChanges.subscribe(() => {
      this.movementForm.get('categoryId')?.setValue('');
    });
  }

  get isIncomeCtrl() {
    return this.movementForm.get('isIncome')!;
  }

  get filteredCategories() {
    return this.allCategories.filter(c => c.isIncome === this.isIncomeCtrl.value && c.isActive);
  }

  loadAccounts() {
    this.accountService.getAccounts().subscribe({
      next: (data) => this.accounts = data,
      error: (err) => console.error('Error fetching accounts:', err)
    });
  }

  loadCategories() {
    this.categoryService.getCategories().subscribe({
      next: (data) => {
        // Map backend objects for template
        this.allCategories = data.map(c => ({
          value: c.id?.toLowerCase(),
          label: c.name,
          isIncome: c.isIncome,
          isActive: c.isActive
        }));
      },
      error: (err) => console.error('Error fetching categories:', err)
    });
  }

  save() {
    if (this.movementForm.invalid) return;
    
    this.isSubmitting = true;
    const formVal = this.movementForm.value;
    const movementData: any = {
      ...formVal,
      date: formVal.date.toISOString()
    };

    if (this.isEditMode && this.data.movement?.id) {
      this.movementService.updateMovement(this.data.movement.id, movementData).subscribe({
        next: () => {
          this.snackBar.open('Movimiento guardado con éxito', 'Cerrar');
          this.dialogRef.close(true);
        },
        error: (err) => {
          this.snackBar.open(err.error?.message || 'Error al guardar el movimiento', 'Cerrar', { duration: 4000, panelClass: ['snackbar-error'] });
          this.isSubmitting = false;
        }
      });
    } else {
      this.movementService.createMovement(movementData).subscribe({
        next: () => {
          this.snackBar.open('Movimiento guardado con éxito', 'Cerrar');
          this.dialogRef.close(true);
        },
        error: (err) => {
          this.snackBar.open(err.error?.message || 'Error al guardar el movimiento', 'Cerrar', { duration: 4000, panelClass: ['snackbar-error'] });
          this.isSubmitting = false;
        }
      });
    }
  }
}
