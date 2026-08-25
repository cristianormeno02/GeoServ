import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { NgxMaskDirective } from 'ngx-mask';
import { MatIconModule } from '@angular/material/icon';
import { Check, CheckService } from '../services/check.service';

@Component({
  selector: 'app-cheque-form',
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
    NgxMaskDirective,
    MatIconModule
  ],
  template: `
    <h2 mat-dialog-title>{{ isEditMode ? 'Editar Cheque' : 'Nuevo Cheque' }}</h2>
    <mat-dialog-content>
      <form [formGroup]="checkForm" class="form-container">
        
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Número de Cheque</mat-label>
          <input matInput formControlName="checkNumber" required>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Banco</mat-label>
          <input matInput formControlName="bankName" required>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Emisor</mat-label>
          <input matInput formControlName="issuerName" required>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Monto</mat-label>
          <span matTextPrefix>$&nbsp;</span>
          <input matInput type="text" formControlName="amount" mask="separator.2" thousandSeparator="." decimalMarker="," class="text-right" required>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Fecha de Emisión</mat-label>
          <input matInput [matDatepicker]="issuePicker" formControlName="issueDate" required>
          <mat-datepicker-toggle matIconSuffix [for]="issuePicker"></mat-datepicker-toggle>
          <mat-datepicker #issuePicker></mat-datepicker>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Fecha de Pago / Vencimiento</mat-label>
          <input matInput [matDatepicker]="duePicker" formControlName="dueDate" required>
          <mat-datepicker-toggle matIconSuffix [for]="duePicker"></mat-datepicker-toggle>
          <mat-datepicker #duePicker></mat-datepicker>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width" *ngIf="isEditMode">
          <mat-label>Estado</mat-label>
          <mat-select formControlName="status" required>
            <mat-option [value]="1">En Cartera</mat-option>
            <mat-option [value]="2">Depositado</mat-option>
            <mat-option [value]="3">Acreditado</mat-option>
            <mat-option [value]="4">Rechazado</mat-option>
          </mat-select>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Observaciones</mat-label>
          <textarea matInput formControlName="observations" rows="2"></textarea>
        </mat-form-field>

      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Cancelar</button>
      <button mat-raised-button color="primary" [disabled]="checkForm.invalid || isSubmitting" (click)="save()">
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
export class ChequeFormComponent {
  checkForm: FormGroup;
  isEditMode = false;
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<ChequeFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { check?: Check },
    private checkService: CheckService
  ) {
    this.isEditMode = !!data?.check;
    this.checkForm = this.fb.group({
      checkNumber: [data?.check?.checkNumber || '', Validators.required],
      bankName: [data?.check?.bankName || '', Validators.required],
      issuerName: [data?.check?.issuerName || '', Validators.required],
      amount: [data?.check?.amount || '', [Validators.required, Validators.min(0)]],
      issueDate: [data?.check?.issueDate ? new Date(data.check.issueDate) : new Date(), Validators.required],
      dueDate: [data?.check?.dueDate ? new Date(data.check.dueDate) : new Date(), Validators.required],
      status: [data?.check?.status || 1], // Default En Cartera
      observations: [data?.check?.observations || '']
    });
  }

  save() {
    if (this.checkForm.invalid) return;
    
    this.isSubmitting = true;
    const formVal = this.checkForm.value;
    const checkData: Check = {
      ...formVal,
      issueDate: formVal.issueDate.toISOString(),
      dueDate: formVal.dueDate.toISOString()
    };

    if (this.isEditMode && this.data.check?.id) {
      this.checkService.updateCheck(this.data.check.id, checkData).subscribe({
        next: () => this.dialogRef.close(true),
        error: (err) => {
          console.error(err);
          this.isSubmitting = false;
        }
      });
    } else {
      this.checkService.createCheck(checkData).subscribe({
        next: () => this.dialogRef.close(true),
        error: (err) => {
          console.error(err);
          this.isSubmitting = false;
        }
      });
    }
  }
}
