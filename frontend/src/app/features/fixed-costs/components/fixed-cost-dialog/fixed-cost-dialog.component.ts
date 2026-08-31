import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { FixedCostService } from '../../services/fixed-cost.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';

import { NgxMaskDirective } from 'ngx-mask';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-fixed-cost-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatCheckboxModule, MatButtonModule, NgxMaskDirective, MatSnackBarModule],
  templateUrl: './fixed-cost-dialog.component.html',
  styleUrls: ['./fixed-cost-dialog.component.css']
})
export class FixedCostDialogComponent implements OnInit {
  form: FormGroup;
  categories: any[] = [];
  providers: any[] = [];

  constructor(
    private fb: FormBuilder,
    private fixedCostService: FixedCostService,
    private http: HttpClient,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef,
    public dialogRef: MatDialogRef<FixedCostDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      categoryId: ['', Validators.required],
      providerId: [null],
      initialAmount: [0, [Validators.required, Validators.min(0)]],
      isRecurring: [false],
      observation: ['']
    });

    if (data) {
      this.form.patchValue(data);
    }
  }

  ngOnInit(): void {
    this.http.get<any[]>(`${environment.apiUrl}/fixed-cost-categories`).subscribe(res => {
      this.categories = res;
      this.cdr.detectChanges();
    });
    this.http.get<any[]>(`${environment.apiUrl}/providers`).subscribe(res => {
      this.providers = res;
      this.cdr.detectChanges();
    });
  }

  save() {
    if (this.form.invalid) return;
    
    const formVal = { ...this.form.value };
    if (typeof formVal.initialAmount === 'string') {
      formVal.initialAmount = parseFloat(formVal.initialAmount.replace(/\./g, '').replace(',', '.'));
    }
    if (formVal.providerId === '') {
      formVal.providerId = null;
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

    if (this.data) {
      this.fixedCostService.updateItem(this.data.id, formVal).subscribe(obs);
    } else {
      this.fixedCostService.createItem(formVal).subscribe(obs);
    }
  }
}
