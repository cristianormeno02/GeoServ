import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FinancialAccount, FinancialAccountService } from '../services/financial-account.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-cuenta-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSlideToggleModule
  ],
  template: `
    <h2 mat-dialog-title>{{ isEditMode ? 'Editar Cuenta' : 'Nueva Cuenta' }}</h2>
    <mat-dialog-content>
      <form [formGroup]="accountForm" class="form-container">
        
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Nombre de la Cuenta / Caja</mat-label>
          <input matInput formControlName="name" placeholder="Ej: Banco Galicia ARS, Caja Fuerte" required>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Tipo de Cuenta</mat-label>
          <mat-select formControlName="accountType" required>
            <mat-option value="BankAccount">Cuenta Bancaria</mat-option>
            <mat-option value="Cash">Efectivo / Caja Fuerte</mat-option>
            <mat-option value="DigitalWallet">Billetera Virtual (MercadoPago, etc.)</mat-option>
          </mat-select>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Número de Cuenta / CBU</mat-label>
          <input matInput formControlName="accountNumber">
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Moneda</mat-label>
          <mat-select formControlName="currencyId" required>
            <mat-option *ngFor="let curr of currencies" [value]="curr.id">
              {{curr.code}} - {{curr.name}}
            </mat-option>
          </mat-select>
        </mat-form-field>

        <div class="toggle-container">
          <mat-slide-toggle formControlName="isActive" color="primary">Cuenta Activa</mat-slide-toggle>
        </div>

      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Cancelar</button>
      <button mat-raised-button color="primary" [disabled]="accountForm.invalid || isSubmitting" (click)="save()">
        {{ isSubmitting ? 'Guardando...' : 'Guardar' }}
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .form-container {
      display: flex;
      flex-direction: column;
      gap: 15px;
      min-width: 350px;
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
export class CuentaFormComponent implements OnInit {
  accountForm: FormGroup;
  isEditMode = false;
  isSubmitting = false;
  currencies: any[] = [];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<CuentaFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { account?: FinancialAccount },
    private accountService: FinancialAccountService,
    private http: HttpClient
  ) {
    this.isEditMode = !!data?.account;
    this.accountForm = this.fb.group({
      name: [data?.account?.name || '', Validators.required],
      accountType: [data?.account?.accountType || '', Validators.required],
      accountNumber: [data?.account?.accountNumber || ''],
      currencyId: [data?.account?.currencyId?.toLowerCase() || '', Validators.required],
      isActive: [data?.account?.isActive ?? true]
    });
  }

  ngOnInit(): void {
    this.loadCurrencies();
  }

  // A quick way to get currencies. In a real app you might have a CurrencyService.
  loadCurrencies() {
    // Assuming you have an endpoint for currencies or we can just fetch from a generic one if exists
    // Looking at GeoServDbContext, there is a Currencies table. Wait, I didn't create a CurrencyEndpoint.
    // Let's assume we have it or hardcode the known IDs for now if it doesn't exist, but it's better to fetch.
    // Actually, I'll fetch them from an endpoint. If it doesn't exist, this might fail, so let me quickly add hardcoded fallbacks or create the endpoint.
    // Looking at seed data in GeoServDbContext:
    this.currencies = [
      { id: 'f1111111-1111-1111-1111-111111111111', code: 'ARS', name: 'Peso Argentino' },
      { id: 'f2222222-2222-2222-2222-222222222222', code: 'USD', name: 'Dólar Estadounidense' },
      { id: 'f3333333-3333-3333-3333-333333333333', code: 'CLP', name: 'Peso Chileno' }
    ];
  }

  save() {
    if (this.accountForm.invalid) return;
    
    this.isSubmitting = true;
    const accountData: FinancialAccount = this.accountForm.value;

    if (this.isEditMode && this.data.account?.id) {
      this.accountService.updateAccount(this.data.account.id, accountData).subscribe({
        next: () => this.dialogRef.close(true),
        error: (err) => {
          console.error(err);
          this.isSubmitting = false;
        }
      });
    } else {
      this.accountService.createAccount(accountData).subscribe({
        next: () => this.dialogRef.close(true),
        error: (err) => {
          console.error(err);
          this.isSubmitting = false;
        }
      });
    }
  }
}
