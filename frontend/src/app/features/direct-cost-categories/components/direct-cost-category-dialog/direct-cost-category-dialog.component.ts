import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { DirectCostCategory } from '../../models/direct-cost-category.model';

@Component({
  selector: 'app-direct-cost-category-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatCheckboxModule],
  template: `
    <h2 mat-dialog-title>{{ data?.category ? 'Editar' : 'Nueva' }} Categoría de Costo</h2>
    <mat-dialog-content>
      <form [formGroup]="form" style="display:flex; flex-direction:column; padding-top:10px;">
        <mat-form-field appearance="outline">
          <mat-label>Nombre</mat-label>
          <input matInput formControlName="name" required>
        </mat-form-field>
        <mat-checkbox formControlName="isActive" color="primary">Activo</mat-checkbox>
        <mat-checkbox formControlName="isAssignableViaMovement" color="primary" style="margin-top:8px;">
          Asignable vía movimiento
        </mat-checkbox>
        <p style="font-size:12px; color:rgba(0,0,0,0.6); margin:4px 0 0 32px;">
          Permite imputar egresos de esta categoría a una Orden de Servicio directamente desde el formulario de Movimientos.
        </p>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="onCancel()">Cancelar</button>
      <button mat-raised-button color="primary" [disabled]="form.invalid" (click)="onSave()">Guardar</button>
    </mat-dialog-actions>
  `
})
export class DirectCostCategoryDialogComponent implements OnInit {
  form!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<DirectCostCategoryDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { category?: DirectCostCategory }
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      id: [this.data?.category?.id],
      name: [this.data?.category?.name || '', Validators.required],
      isActive: [this.data?.category?.isActive ?? true],
      isAssignableViaMovement: [this.data?.category?.isAssignableViaMovement ?? false]
    });
  }

  onCancel() { this.dialogRef.close(); }
  onSave() { 
    if (this.form.valid) {
      const val = { ...this.form.value };
      if (!val.id) {
        delete val.id;
      }
      this.dialogRef.close(val);
    }
  }
}
