import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FixedCostService } from '../../services/fixed-cost.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-fixed-cost-category-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatSnackBarModule],
  template: `
    <h2 mat-dialog-title>{{ data ? 'Editar' : 'Nueva' }} Categoría de Gasto Fijo</h2>
    <mat-dialog-content>
      <form [formGroup]="form" class="dialog-form" style="display:flex; flex-direction:column; gap:15px; margin-top:10px; min-width:300px;">
        <mat-form-field appearance="outline">
          <mat-label>Nombre</mat-label>
          <input matInput formControlName="name" required>
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Descripción</mat-label>
          <textarea matInput formControlName="description"></textarea>
        </mat-form-field>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Cancelar</button>
      <button mat-raised-button color="primary" [disabled]="form.invalid" (click)="save()">Guardar</button>
    </mat-dialog-actions>
  `
})
export class FixedCostCategoryDialogComponent {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private fixedCostService: FixedCostService,
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<FixedCostCategoryDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      description: ['']
    });

    if (data) {
      this.form.patchValue(data);
    }
  }

  save() {
    if (this.form.invalid) return;

    const obs = {
      next: () => this.dialogRef.close(true),
      error: (err: any) => {
        let msg = err.error?.message || err.error?.title || 'Error al guardar';
        this.snackBar.open(msg, 'Cerrar', { duration: 4000, panelClass: ['snackbar-error'] });
      }
    };

    if (this.data) {
      this.fixedCostService.updateCategory(this.data.id, this.form.value).subscribe(obs);
    } else {
      this.fixedCostService.createCategory(this.form.value).subscribe(obs);
    }
  }
}
