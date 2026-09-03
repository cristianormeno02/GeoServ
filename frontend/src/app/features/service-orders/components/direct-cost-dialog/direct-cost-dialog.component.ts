import { Component, Inject, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, MAT_DATE_LOCALE, DateAdapter, NativeDateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { NumericInputDirective } from '../../../shared/directives/numeric-input.directive';

import { DirectCost, CreateDirectCostDto } from '../../models/direct-cost.model';
import { DirectCostCategoryService } from '../../../direct-cost-categories/services/direct-cost-category.service';
import { ProviderService } from '../../../providers/services/provider.service';
import { UnitService } from '../../../units/services/unit.service';
import { PaymentMethodService } from '../../../payment-methods/services/payment-method.service';

export class CustomDateAdapter extends NativeDateAdapter {
  override format(date: Date, displayFormat: Object): string {
    if (displayFormat === 'input') {
      let day: string = date.getDate().toString();
      day = +day < 10 ? '0' + day : day;
      let month: string = (date.getMonth() + 1).toString();
      month = +month < 10 ? '0' + month : month;
      let year = date.getFullYear();
      return `${day}/${month}/${year}`;
    }
    return super.format(date, displayFormat);
  }
}

export const CUSTOM_DATE_FORMATS = {
  parse: { dateInput: { month: 'short', year: 'numeric', day: 'numeric' } },
  display: {
    dateInput: 'input',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  }
};

@Component({
  selector: 'app-direct-cost-dialog',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, MatDialogModule, MatFormFieldModule,
    MatInputModule, MatButtonModule, MatSelectModule, MatDatepickerModule, MatNativeDateModule,
    NgxMaskDirective,
    NumericInputDirective
  ],
  providers: [
    provideNgxMask(),
    { provide: MAT_DATE_LOCALE, useValue: 'es-AR' },
    { provide: DateAdapter, useClass: CustomDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: CUSTOM_DATE_FORMATS }
  ],
  template: `
    <h2 mat-dialog-title>{{ data?.cost ? 'Editar' : 'Registrar' }} Costo Directo</h2>
    <mat-dialog-content>
      <form [formGroup]="form" style="display:flex; flex-direction:column; padding-top:10px; gap: 10px;">
        <div style="display:flex; gap:10px;">
          <mat-form-field appearance="outline" style="flex:1">
            <mat-label>Categoría</mat-label>
            <mat-select formControlName="categoryId" required>
              <mat-option *ngFor="let c of categories" [value]="c.id">{{c.name}}</mat-option>
            </mat-select>
          </mat-form-field>
          <mat-form-field appearance="outline" style="flex:1">
            <mat-label>Proveedor</mat-label>
            <mat-select formControlName="providerId">
              <mat-option [value]="null">Ninguno</mat-option>
              <mat-option *ngFor="let p of providers" [value]="p.id">{{p.name}}</mat-option>
            </mat-select>
          </mat-form-field>
        </div>

        <mat-form-field appearance="outline">
          <mat-label>Descripción</mat-label>
          <input matInput formControlName="description" required>
        </mat-form-field>

        <div style="display:flex; gap:10px;">
          <mat-form-field appearance="outline" style="flex:1">
            <mat-label>Cantidad</mat-label>
            <input matInput type="text" formControlName="quantity" required mask="separator.2" thousandSeparator="." decimalMarker="," style="text-align: right;">
          </mat-form-field>
          <mat-form-field appearance="outline" style="flex:1">
            <mat-label>Unidad</mat-label>
            <mat-select formControlName="unitId">
              <mat-option [value]="null">Ninguna</mat-option>
              <mat-option *ngFor="let u of units" [value]="u.id">{{u.name}}</mat-option>
            </mat-select>
          </mat-form-field>
        </div>

        <div style="display:flex; gap:10px;">
          <mat-form-field appearance="outline" style="flex:1">
            <mat-label>Precio Unitario</mat-label>
            <input matInput type="text" formControlName="unitPrice" required mask="separator.2" thousandSeparator="." decimalMarker="," style="text-align: right;">
          </mat-form-field>
          <mat-form-field appearance="outline" style="flex:1">
            <mat-label>Total (Calculado)</mat-label>
            <input matInput type="text" formControlName="totalAmount" readonly mask="separator.2" thousandSeparator="." decimalMarker="," style="text-align: right; font-weight: bold;">
          </mat-form-field>
        </div>

        <div style="display:flex; gap:10px;">
          <mat-form-field appearance="outline" style="flex:1">
            <mat-label>Fecha</mat-label>
            <input matInput [matDatepicker]="picker" formControlName="date" required>
            <mat-datepicker-toggle matIconSuffix [for]="picker"></mat-datepicker-toggle>
            <mat-datepicker #picker></mat-datepicker>
          </mat-form-field>
          <mat-form-field appearance="outline" style="flex:1">
            <mat-label>Medio de Pago</mat-label>
            <mat-select formControlName="paymentMethodId">
              <mat-option [value]="null">Ninguno</mat-option>
              <mat-option *ngFor="let pm of paymentMethods" [value]="pm.id">{{pm.name}}</mat-option>
            </mat-select>
          </mat-form-field>
        </div>
        
        <mat-form-field appearance="outline">
          <mat-label>Estado</mat-label>
          <mat-select formControlName="status" required>
            <mat-option value="Pendiente">Pendiente</mat-option>
            <mat-option value="Pagado">Pagado</mat-option>
            <mat-option value="Cancelado">Cancelado</mat-option>
          </mat-select>
        </mat-form-field>
        
        <mat-form-field appearance="outline">
          <mat-label>Observaciones</mat-label>
          <textarea matInput formControlName="observations"></textarea>
        </mat-form-field>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="onCancel()">Cancelar</button>
      <button mat-raised-button color="primary" [disabled]="form.invalid" (click)="onSave()">Guardar</button>
    </mat-dialog-actions>
  `
})
export class DirectCostDialogComponent implements OnInit {
  form!: FormGroup;
  categories: any[] = [];
  providers: any[] = [];
  units: any[] = [];
  paymentMethods: any[] = [];

  categoryService = inject(DirectCostCategoryService);
  providerService = inject(ProviderService);
  unitService = inject(UnitService);
  paymentMethodService = inject(PaymentMethodService);

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<DirectCostDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { cost?: DirectCost, serviceOrderId: string }
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      serviceOrderId: [this.data.serviceOrderId],
      categoryId: [this.data.cost?.categoryId || null, Validators.required],
      providerId: [this.data.cost?.providerId || null],
      description: [this.data.cost?.description || '', Validators.required],
      quantity: [this.data.cost?.quantity || 1, [Validators.required, Validators.min(0.01)]],
      unitId: [this.data.cost?.unitId || null],
      unitPrice: [this.data.cost?.unitPrice || 0, [Validators.required, Validators.min(0)]],
      totalAmount: [this.data.cost?.totalAmount || 0],
      date: [this.data.cost ? new Date(this.data.cost.date) : new Date(), Validators.required],
      paymentMethodId: [this.data.cost?.paymentMethodId || null],
      status: [this.data.cost?.status || 'Pendiente', Validators.required],
      observations: [this.data.cost?.observations || '']
    });

    // Auto-calculate total
    this.form.valueChanges.subscribe(val => {
      const q = parseFloat(val.quantity) || 0;
      const p = parseFloat(val.unitPrice) || 0;
      const t = q * p;
      if (this.form.get('totalAmount')?.value !== t) {
        this.form.patchValue({ totalAmount: t }, { emitEvent: false });
      }
    });

    this.categoryService.getCategories().subscribe(res => this.categories = res.filter(x => x.isActive));
    this.providerService.getProviders().subscribe(res => this.providers = res.filter(x => x.isActive));
    this.unitService.getUnits().subscribe(res => this.units = res.filter(x => x.isActive));
    this.paymentMethodService.getPaymentMethods().subscribe(res => this.paymentMethods = res.filter(x => x.isActive));
  }

  onCancel() { this.dialogRef.close(); }

  onSave() {
    if (this.form.valid) {
      const dto: CreateDirectCostDto = {
        ...this.form.value,
        date: this.form.value.date.toISOString()
      };
      if(this.data.cost?.id) {
         (dto as any).id = this.data.cost.id;
      }
      this.dialogRef.close(dto);
    }
  }
}
