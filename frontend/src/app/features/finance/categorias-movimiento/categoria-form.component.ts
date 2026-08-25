import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSelectModule } from '@angular/material/select';
import { MovementCategory, MovementCategoryService } from '../services/movement-category.service';

@Component({
  selector: 'app-categoria-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSlideToggleModule,
    MatSelectModule
  ],
  template: `
    <h2 mat-dialog-title>{{ isEditMode ? 'Editar Categoría' : 'Nueva Categoría' }}</h2>
    <mat-dialog-content>
      <form [formGroup]="categoryForm" class="form-container">
        
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Nombre de la Categoría</mat-label>
          <input matInput formControlName="name" placeholder="Ej: Compra de Drones" required>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Descripción</mat-label>
          <input matInput formControlName="description" placeholder="Opcional">
        </mat-form-field>

        <div class="toggle-container">
          <mat-slide-toggle formControlName="isIncome" color="primary">
            {{ categoryForm.get('isIncome')?.value ? 'Es un Ingreso' : 'Es un Egreso' }}
          </mat-slide-toggle>
        </div>

        <div class="toggle-container">
          <mat-slide-toggle formControlName="isActive" color="accent">
            Categoría Activa
          </mat-slide-toggle>
        </div>

      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Cancelar</button>
      <button mat-raised-button color="primary" [disabled]="categoryForm.invalid || isSubmitting" (click)="save()">
        {{ isSubmitting ? 'Guardando...' : 'Guardar' }}
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .form-container {
      display: flex;
      flex-direction: column;
      gap: 15px;
      min-width: 400px;
      margin-top: 10px;
    }
    .full-width {
      width: 100%;
    }
    .toggle-container {
      margin-top: 10px;
      margin-bottom: 10px;
    }
  `]
})
export class CategoriaFormComponent {
  categoryForm: FormGroup;
  isEditMode = false;
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<CategoriaFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { category?: MovementCategory },
    private categoryService: MovementCategoryService
  ) {
    this.isEditMode = !!data?.category;
    this.categoryForm = this.fb.group({
      name: [data?.category?.name || '', Validators.required],
      description: [data?.category?.description || ''],
      isIncome: [data?.category?.isIncome ?? true],
      isActive: [data?.category?.isActive ?? true]
    });
  }

  save() {
    if (this.categoryForm.invalid) return;
    
    this.isSubmitting = true;
    const formVal = this.categoryForm.value;

    if (this.isEditMode && this.data.category?.id) {
      this.categoryService.updateCategory(this.data.category.id, formVal).subscribe({
        next: () => this.dialogRef.close(true),
        error: (err) => {
          console.error(err);
          this.isSubmitting = false;
        }
      });
    } else {
      this.categoryService.createCategory(formVal).subscribe({
        next: () => this.dialogRef.close(true),
        error: (err) => {
          console.error(err);
          this.isSubmitting = false;
        }
      });
    }
  }
}
