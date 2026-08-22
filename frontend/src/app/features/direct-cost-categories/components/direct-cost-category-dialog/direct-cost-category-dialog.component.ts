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
      isActive: [this.data?.category?.isActive ?? true]
    });
  }

  onCancel() { this.dialogRef.close(); }
  onSave() { if (this.form.valid) this.dialogRef.close(this.form.value); }
}
