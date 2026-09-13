import { Component, ChangeDetectorRef, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { debounceTime, distinctUntilChanged, switchMap, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { FixedCostService } from '../../fixed-costs/services/fixed-cost.service';
import { FixedCostItem, FixedCostPayment } from '../../fixed-costs/models/fixed-cost.model';
import { SourceSearchResult } from './service-order-search-dialog.component';

@Component({
  selector: 'app-fixed-cost-search-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatAutocompleteModule, MatButtonModule, MatListModule, MatIconModule],
  template: `
    <h2 mat-dialog-title>Buscar Gasto Fijo</h2>
    <mat-dialog-content>
      <ng-container *ngIf="!selectedItem">
        <p>Busca el Gasto Fijo que se está pagando.</p>
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Buscar por nombre, categoría o proveedor</mat-label>
          <input type="text" matInput [formControl]="searchControl" [matAutocomplete]="auto">
          <mat-autocomplete #auto="matAutocomplete" [displayWith]="displayFn" (optionSelected)="onItemSelected($event)">
            <mat-option *ngIf="isLoading" disabled>Buscando...</mat-option>
            <mat-option *ngFor="let item of results" [value]="item" [disabled]="isItemFullyPaid(item)">
              {{ item.name }}
              <small *ngIf="item.category?.name"> ({{ item.category?.name }})</small>
              <small *ngIf="isItemFullyPaid(item)"> - Ya pagado</small>
            </mat-option>
          </mat-autocomplete>
        </mat-form-field>
      </ng-container>

      <ng-container *ngIf="selectedItem">
        <p>Gasto Fijo: <strong>{{ selectedItem.name }}</strong></p>

        <ng-container *ngIf="selectedItem.isRecurring; else pagoUnico">
          <p>Seleccioná el vencimiento que corresponde a este movimiento:</p>
          <mat-selection-list [multiple]="false">
            <mat-list-option
              *ngFor="let payment of selectedItem.payments"
              [value]="payment"
              [disabled]="payment.isPaid && payment.id !== currentFixedCostPaymentId"
              (click)="onPaymentClick(payment)">
              Venc. {{ payment.dueDate | date:'dd/MM/yyyy' }} - \${{ payment.amount | number:'1.2-2' }}
              <span *ngIf="payment.isPaid && payment.id !== currentFixedCostPaymentId"> (Pagado)</span>
              <span *ngIf="payment.id === currentFixedCostPaymentId"> (vínculo actual)</span>
            </mat-list-option>
          </mat-selection-list>
        </ng-container>
        <ng-template #pagoUnico>
          <p *ngIf="singlePayment as payment">
            Vencimiento: {{ payment.dueDate | date:'dd/MM/yyyy' }} - \${{ payment.amount | number:'1.2-2' }}
            <span *ngIf="payment.isPaid && payment.id !== currentFixedCostPaymentId" class="warn"> (Ya pagado)</span>
          </p>
        </ng-template>

        <button mat-button (click)="backToSearch()">Volver a buscar</button>
      </ng-container>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Cancelar</button>
      <button mat-raised-button color="primary" [disabled]="!selectedPayment" (click)="confirm()">Seleccionar</button>
    </mat-dialog-actions>
  `,
  styles: [`
    .full-width { width: 100%; min-width: 420px; }
    .warn { color: #b26a00; }
  `]
})
export class FixedCostSearchDialogComponent {
  searchControl = new FormControl('');
  results: FixedCostItem[] = [];
  isLoading = false;

  selectedItem: FixedCostItem | null = null;
  selectedPayment: FixedCostPayment | null = null;
  currentFixedCostPaymentId: string | null;

  constructor(
    private dialogRef: MatDialogRef<FixedCostSearchDialogComponent>,
    private fixedCostService: FixedCostService,
    private cdr: ChangeDetectorRef,
    @Inject(MAT_DIALOG_DATA) public data: { currentFixedCostPaymentId?: string | null }
  ) {
    this.currentFixedCostPaymentId = data?.currentFixedCostPaymentId ?? null;

    this.searchControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      tap(() => { this.isLoading = true; this.cdr.detectChanges(); }),
      switchMap(value => (typeof value === 'string' && value.length > 0) ? this.fixedCostService.searchItems(value) : of([]))
    ).subscribe({
      next: (results) => { this.results = results; this.isLoading = false; this.cdr.detectChanges(); },
      error: () => { this.results = []; this.isLoading = false; this.cdr.detectChanges(); }
    });
  }

  get singlePayment(): FixedCostPayment | null {
    return this.selectedItem?.payments?.[0] ?? null;
  }

  // Un Gasto Fijo no recurrente cuyo único vencimiento ya está pagado (y no es el vinculado
  // al movimiento en edición) no puede seleccionarse: no queda ningún vencimiento disponible.
  isItemFullyPaid(item: FixedCostItem): boolean {
    if (item.isRecurring) return false;
    const payment = item.payments?.[0];
    return !!payment && payment.isPaid && payment.id !== this.currentFixedCostPaymentId;
  }

  displayFn(item: FixedCostItem): string {
    return item ? item.name : '';
  }

  onItemSelected(event: any): void {
    const item: FixedCostItem = event.option.value;
    this.selectedItem = item;

    if (!item.isRecurring) {
      const payment = item.payments?.[0] ?? null;
      this.selectedPayment = payment && (!payment.isPaid || payment.id === this.currentFixedCostPaymentId) ? payment : null;
    } else {
      this.selectedPayment = null;
    }
  }

  onPaymentClick(payment: FixedCostPayment): void {
    if (payment.isPaid && payment.id !== this.currentFixedCostPaymentId) return;
    this.selectedPayment = payment;
  }

  backToSearch(): void {
    this.selectedItem = null;
    this.selectedPayment = null;
    this.searchControl.setValue('');
  }

  confirm(): void {
    if (!this.selectedItem || !this.selectedPayment) return;
    const payment = this.selectedPayment;
    const result: SourceSearchResult = {
      id: payment.id,
      label: `${this.selectedItem.name} - Venc. ${new Date(payment.dueDate).toLocaleDateString('es-AR')}`,
      amount: payment.amount,
      description: `Pago vencimiento ${new Date(payment.dueDate).toLocaleDateString('es-AR')} - ${this.selectedItem.name}`
    };
    this.dialogRef.close(result);
  }
}
