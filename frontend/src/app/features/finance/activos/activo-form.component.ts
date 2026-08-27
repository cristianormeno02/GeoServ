import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { NgxMaskDirective } from 'ngx-mask';
import { MatIconModule } from '@angular/material/icon';
import { Asset, AssetService } from '../services/asset.service';

import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-activo-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    NgxMaskDirective,
    MatIconModule
  ],
  template: `
    <h2 mat-dialog-title>{{ isEditMode ? 'Editar Activo' : 'Nuevo Activo' }}</h2>
    <mat-dialog-content>
      <form [formGroup]="assetForm" class="form-container">
        
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Nombre</mat-label>
          <input matInput formControlName="name" placeholder="Ej: Estación Total Leica" required>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Descripción</mat-label>
          <textarea matInput formControlName="description" rows="2"></textarea>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Precio de Compra</mat-label>
          <span matTextPrefix>$&nbsp;</span>
          <input matInput type="text" formControlName="purchasePrice" mask="separator.2" thousandSeparator="." decimalMarker="," class="text-right" required>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Fecha de Compra</mat-label>
          <input matInput [matDatepicker]="picker" formControlName="purchaseDate" required>
          <mat-datepicker-toggle matIconSuffix [for]="picker"></mat-datepicker-toggle>
          <mat-datepicker #picker></mat-datepicker>
        </mat-form-field>

      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Cancelar</button>
      <button mat-raised-button color="primary" [disabled]="assetForm.invalid || isSubmitting" (click)="save()">
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
    .text-right {
      text-align: right !important;
    }
  `]
})
export class ActivoFormComponent {
  assetForm: FormGroup;
  isEditMode = false;
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<ActivoFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { asset?: Asset },
    private assetService: AssetService,
    private snackBar: MatSnackBar
  ) {
    this.isEditMode = !!data?.asset;
    this.assetForm = this.fb.group({
      name: [data?.asset?.name || '', Validators.required],
      description: [data?.asset?.description || ''],
      purchasePrice: [data?.asset?.purchasePrice || '', [Validators.required, Validators.min(0)]],
      purchaseDate: [data?.asset?.purchaseDate ? new Date(data.asset.purchaseDate) : new Date(), Validators.required]
    });
  }

  save() {
    if (this.assetForm.invalid) return;
    
    this.isSubmitting = true;
    const formVal = this.assetForm.value;
    const assetData: Asset = {
      ...formVal,
      purchaseDate: formVal.purchaseDate.toISOString()
    };

    if (this.isEditMode && this.data.asset?.id) {
      this.assetService.updateAsset(this.data.asset.id, assetData).subscribe({
        next: () => {
          this.snackBar.open('Activo actualizado con éxito', 'Cerrar');
          this.dialogRef.close(true);
        },
        error: (err) => {
          this.snackBar.open(err.error?.message || 'Error al actualizar el activo', 'Cerrar', { duration: 4000, panelClass: ['snackbar-error'] });
          this.isSubmitting = false;
        }
      });
    } else {
      this.assetService.createAsset(assetData).subscribe({
        next: () => {
          this.snackBar.open('Activo creado con éxito', 'Cerrar');
          this.dialogRef.close(true);
        },
        error: (err) => {
          this.snackBar.open(err.error?.message || 'Error al crear el activo', 'Cerrar', { duration: 4000, panelClass: ['snackbar-error'] });
          this.isSubmitting = false;
        }
      });
    }
  }
}
