import { Component, Inject, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

import { ServiceType } from '../../models/service-type.model';

@Component({
  selector: 'app-service-type-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  template: `
    <h2 mat-dialog-title>{{ isEdit ? 'Modificar Tipo de Servicio' : 'Nuevo Tipo de Servicio' }}</h2>
    
    <mat-dialog-content>
      <form [formGroup]="serviceTypeForm" class="service-type-form">
        
        <mat-form-field appearance="outline">
          <mat-label>Nombre</mat-label>
          <input matInput formControlName="name" required maxlength="100" #nameInput>
          <mat-hint align="end">{{nameInput.value.length}} / 100</mat-hint>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Descripción</mat-label>
          <textarea matInput formControlName="description" maxlength="500" rows="3" #descInput></textarea>
          <mat-hint align="end">{{descInput.value.length}} / 500</mat-hint>
        </mat-form-field>

      </form>
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Cancelar</button>
      <button mat-raised-button color="primary" [disabled]="serviceTypeForm.invalid" (click)="save()">
        Guardar
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .service-type-form {
      display: flex;
      flex-direction: column;
      gap: 8px;
      padding-top: 10px;
      min-width: 400px;
    }
  `]
})
export class ServiceTypeDialogComponent implements OnInit {
  private fb = inject(FormBuilder);
  public dialogRef = inject(MatDialogRef<ServiceTypeDialogComponent>);
  
  serviceTypeForm: FormGroup;
  isEdit = false;

  constructor(@Inject(MAT_DIALOG_DATA) public data: { serviceType?: ServiceType }) {
    this.isEdit = !!data?.serviceType;
    
    this.serviceTypeForm = this.fb.group({
      name: [data?.serviceType?.name || '', Validators.required],
      description: [data?.serviceType?.description || '']
    });
  }

  ngOnInit(): void {
  }

  save() {
    if (this.serviceTypeForm.valid) {
      this.dialogRef.close(this.serviceTypeForm.value);
    }
  }
}
