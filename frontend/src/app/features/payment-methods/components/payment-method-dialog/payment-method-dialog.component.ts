import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { PaymentMethod } from '../../models/payment-method.model';

@Component({
  selector: 'app-payment-method-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatCheckboxModule],
  template: `
    <h2 mat-dialog-title>{{ data?.paymentMethod ? 'Editar' : 'Nuevo' }} Medio de Pago</h2>
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
export class PaymentMethodDialogComponent implements OnInit {
  form!: FormGroup;
  constructor(private fb: FormBuilder, private dialogRef: MatDialogRef<PaymentMethodDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: { paymentMethod?: PaymentMethod }) {}
  ngOnInit() {
    this.form = this.fb.group({
      id: [this.data?.paymentMethod?.id],
      name: [this.data?.paymentMethod?.name || '', Validators.required],
      isActive: [this.data?.paymentMethod?.isActive ?? true]
    });
  }
  onCancel() { this.dialogRef.close(); }
  onSave() { if (this.form.valid) this.dialogRef.close(this.form.value); }
}
