import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { FixedCostService } from '../../services/fixed-cost.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';

import { NgxMaskDirective } from 'ngx-mask';

import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-fixed-cost-payment-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatCheckboxModule, MatButtonModule, MatDatepickerModule, MatNativeDateModule, NgxMaskDirective, MatSnackBarModule],
  templateUrl: './fixed-cost-payment-dialog.component.html',
  styleUrls: ['./fixed-cost-payment-dialog.component.css']
})
export class FixedCostPaymentDialogComponent implements OnInit {
  form: FormGroup;
  paymentMethods: any[] = [];
  itemId: string;

  constructor(
    private fb: FormBuilder,
    private fixedCostService: FixedCostService,
    private http: HttpClient,
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<FixedCostPaymentDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { itemId: string, payment?: any }
  ) {
    this.itemId = data.itemId;
    this.form = this.fb.group({
      fixedCostItemId: [this.itemId],
      dueDate: [new Date(), Validators.required],
      amount: [0, [Validators.required, Validators.min(0)]],
      isPaid: [false],
      paymentDate: [null],
      paymentMethodId: [null],
      receiptNumber: ['']
    });

    if (data.payment) {
      this.form.patchValue({
        ...data.payment,
        dueDate: data.payment.dueDate ? new Date(data.payment.dueDate) : null,
        paymentDate: data.payment.paymentDate ? new Date(data.payment.paymentDate) : null
      });
    }

    this.form.get('isPaid')?.valueChanges.subscribe(paid => {
      if (paid && !this.form.get('paymentDate')?.value) {
        this.form.patchValue({ paymentDate: new Date() });
      }
    });
  }

  ngOnInit(): void {
    this.http.get<any[]>(`${environment.apiUrl}/payment-methods`).subscribe(res => this.paymentMethods = res);
  }

  save() {
    if (this.form.invalid) return;
    
    const formVal = { ...this.form.value };
    
    if (formVal.dueDate && formVal.dueDate instanceof Date) {
      formVal.dueDate = formVal.dueDate.toISOString();
    }
    if (formVal.paymentDate && formVal.paymentDate instanceof Date) {
      formVal.paymentDate = formVal.paymentDate.toISOString();
    }
    
    // Ensure amount is a number (in case ngx-mask leaves it as a string)
    if (typeof formVal.amount === 'string') {
      formVal.amount = parseFloat(formVal.amount.replace(/\./g, '').replace(',', '.'));
    }

    if (formVal.paymentMethodId === '') {
      formVal.paymentMethodId = null;
    }

    const obs = {
      next: () => this.dialogRef.close(true),
      error: (err: any) => {
        console.error(err);
        let msg = err.error?.message || err.error?.title || 'Error al guardar';
        if (err.status === 400 && err.error?.errors) {
          msg = 'Error de validación. Revisa los campos.';
        }
        this.snackBar.open(msg, 'Cerrar', { duration: 4000, panelClass: ['snackbar-error'] });
      }
    };

    if (this.data.payment) {
      this.fixedCostService.updatePayment(this.data.payment.id, formVal).subscribe(obs);
    } else {
      this.fixedCostService.createPayment(formVal).subscribe(obs);
    }
  }
}
