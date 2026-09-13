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
import { DirectCostService } from '../../service-orders/services/direct-cost.service';
import { SourceSearchResult } from './service-order-search-dialog.component';

@Component({
  selector: 'app-direct-cost-search-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatAutocompleteModule, MatButtonModule],
  template: `
    <h2 mat-dialog-title>Buscar Costo Directo</h2>
    <mat-dialog-content>
      <p>Busca el Costo Directo que se está pagando (por descripción, proveedor, categoría o N° de orden).</p>

      <mat-form-field appearance="outline" class="full-width">
        <mat-label>Buscar</mat-label>
        <input type="text" matInput [formControl]="searchControl" [matAutocomplete]="auto">
        <mat-autocomplete #auto="matAutocomplete" [displayWith]="displayFn" (optionSelected)="onOptionSelected($event)">
          <mat-option *ngIf="isLoading" disabled>Buscando...</mat-option>
          <mat-option *ngFor="let cost of results" [value]="cost">
            <span *ngIf="cost.serviceOrderNumber" class="order-number">[OS #{{ cost.serviceOrderNumber }}]</span>
            {{ cost.description }}
            <small *ngIf="cost.categoryName"> ({{ cost.categoryName }})</small>
            <small> - \${{ cost.totalAmount | number:'1.2-2' }}</small>
          </mat-option>
        </mat-autocomplete>
      </mat-form-field>

      <div *ngIf="selected" class="selection-preview">
        <p>Seleccionado: <strong>{{ selected.description }}</strong> - {{ selected.totalAmount | number:'1.2-2' }}</p>
        <p *ngIf="selected.serviceOrderNumber">Orden de Servicio asociada: <strong>{{ selected.serviceOrderNumber }}</strong> (solo lectura)</p>
      </div>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Cancelar</button>
      <button mat-raised-button color="primary" [disabled]="!selected" (click)="confirm()">Seleccionar</button>
    </mat-dialog-actions>
  `,
  styles: [`
    .full-width { width: 100%; min-width: 450px; }
    .order-number { font-weight: 500; margin-right: 4px; }
    .selection-preview { color: var(--text-secondary, #666); }
  `]
})
export class DirectCostSearchDialogComponent {
  searchControl = new FormControl('');
  results: any[] = [];
  selected: any = null;
  isLoading = false;

  constructor(
    private dialogRef: MatDialogRef<DirectCostSearchDialogComponent>,
    private directCostService: DirectCostService,
    private cdr: ChangeDetectorRef
  ) {
    this.searchControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      tap(() => { this.isLoading = true; this.cdr.detectChanges(); }),
      switchMap(value => (typeof value === 'string' && value.length > 0) ? this.directCostService.searchAll(value) : of([]))
    ).subscribe({
      next: (results) => { this.results = results; this.isLoading = false; this.cdr.detectChanges(); },
      error: () => { this.results = []; this.isLoading = false; this.cdr.detectChanges(); }
    });
  }

  displayFn(cost: any): string {
    if (!cost) return '';
    const osPrefix = cost.serviceOrderNumber ? `[OS #${cost.serviceOrderNumber}] ` : '';
    return `${osPrefix}${cost.description}`;
  }

  onOptionSelected(event: any): void {
    this.selected = event.option.value;
  }

  confirm(): void {
    if (!this.selected) return;
    const osPrefix = this.selected.serviceOrderNumber ? `[OS #${this.selected.serviceOrderNumber}] ` : '';
    const result: SourceSearchResult = {
      id: this.selected.id,
      label: `${osPrefix}${this.selected.description}`,
      amount: this.selected.totalAmount,
      description: `${osPrefix}${this.selected.description}`
    };
    this.dialogRef.close(result);
  }
}
