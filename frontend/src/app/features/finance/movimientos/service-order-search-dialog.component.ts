import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { debounceTime, distinctUntilChanged, switchMap, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { ServiceOrderService } from '../../service-orders/services/service-order.service';

export interface SourceSearchResult {
  id: string;
  label: string;
  amount?: number;
  description?: string;
}

@Component({
  selector: 'app-service-order-search-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatAutocompleteModule, MatButtonModule],
  template: `
    <h2 mat-dialog-title>Buscar Orden de Servicio</h2>
    <mat-dialog-content>
      <p>Busca la Orden de Servicio a la que se vinculará el cobro.</p>

      <mat-form-field appearance="outline" class="full-width">
        <mat-label>Buscar por número o cliente</mat-label>
        <input type="text" matInput [formControl]="searchControl" [matAutocomplete]="auto">
        <mat-autocomplete #auto="matAutocomplete" [displayWith]="displayFn" (optionSelected)="onOptionSelected($event)">
          <mat-option *ngIf="isLoading" disabled>Buscando...</mat-option>
          <mat-option *ngFor="let order of results" [value]="order">
            <span class="order-number">{{ order.orderNumber }}</span>
            <small *ngIf="order.clientName"> - {{ order.clientName }}</small>
          </mat-option>
        </mat-autocomplete>
      </mat-form-field>

      <p *ngIf="selected" class="selection-preview">Seleccionado: <strong>{{ selected.orderNumber }}</strong> - {{ selected.clientName }}</p>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Cancelar</button>
      <button mat-raised-button color="primary" [disabled]="!selected" (click)="confirm()">Seleccionar</button>
    </mat-dialog-actions>
  `,
  styles: [`
    .full-width { width: 100%; min-width: 400px; }
    .selection-preview { color: var(--text-secondary, #666); }
  `]
})
export class ServiceOrderSearchDialogComponent {
  searchControl = new FormControl('');
  results: any[] = [];
  selected: any = null;
  isLoading = false;

  constructor(
    private dialogRef: MatDialogRef<ServiceOrderSearchDialogComponent>,
    private serviceOrderService: ServiceOrderService,
    private cdr: ChangeDetectorRef
  ) {
    this.searchControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      tap(() => { this.isLoading = true; this.cdr.detectChanges(); }),
      switchMap(value => (typeof value === 'string' && value.length > 0) ? this.serviceOrderService.searchServiceOrders(value) : of([]))
    ).subscribe({
      next: (results) => { this.results = results; this.isLoading = false; this.cdr.detectChanges(); },
      error: () => { this.results = []; this.isLoading = false; this.cdr.detectChanges(); }
    });
  }

  displayFn(order: any): string {
    return order ? `${order.orderNumber}${order.clientName ? ' - ' + order.clientName : ''}` : '';
  }

  onOptionSelected(event: any): void {
    this.selected = event.option.value;
  }

  confirm(): void {
    if (!this.selected) return;
    const result: SourceSearchResult = {
      id: this.selected.id,
      label: `${this.selected.orderNumber}${this.selected.clientName ? ' - ' + this.selected.clientName : ''}`
    };
    this.dialogRef.close(result);
  }
}
