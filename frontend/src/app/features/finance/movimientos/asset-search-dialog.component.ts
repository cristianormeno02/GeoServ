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
import { Asset, AssetService } from '../services/asset.service';
import { SourceSearchResult } from './service-order-search-dialog.component';

@Component({
  selector: 'app-asset-search-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatAutocompleteModule, MatButtonModule],
  template: `
    <h2 mat-dialog-title>Buscar Activo</h2>
    <mat-dialog-content>
      <p>Busca el Activo al que se vinculará esta compra.</p>

      <mat-form-field appearance="outline" class="full-width">
        <mat-label>Buscar por nombre</mat-label>
        <input type="text" matInput [formControl]="searchControl" [matAutocomplete]="auto">
        <mat-autocomplete #auto="matAutocomplete" [displayWith]="displayFn" (optionSelected)="onOptionSelected($event)">
          <mat-option *ngIf="isLoading" disabled>Buscando...</mat-option>
          <mat-option *ngFor="let asset of results" [value]="asset">
            <span>{{ asset.name }}</span>
            <small *ngIf="asset.providerName"> - {{ asset.providerName }}</small>
          </mat-option>
        </mat-autocomplete>
      </mat-form-field>

      <p *ngIf="selected" class="selection-preview">Seleccionado: <strong>{{ selected.name }}</strong></p>
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
export class AssetSearchDialogComponent {
  searchControl = new FormControl('');
  results: Asset[] = [];
  selected: Asset | null = null;
  isLoading = false;

  constructor(
    private dialogRef: MatDialogRef<AssetSearchDialogComponent>,
    private assetService: AssetService,
    private cdr: ChangeDetectorRef
  ) {
    this.searchControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      tap(() => { this.isLoading = true; this.cdr.detectChanges(); }),
      switchMap(value => (typeof value === 'string' && value.length > 0) ? this.assetService.searchAssets(value) : of([]))
    ).subscribe({
      next: (results) => { this.results = results; this.isLoading = false; this.cdr.detectChanges(); },
      error: () => { this.results = []; this.isLoading = false; this.cdr.detectChanges(); }
    });
  }

  displayFn(asset: Asset): string {
    return asset ? asset.name : '';
  }

  onOptionSelected(event: any): void {
    this.selected = event.option.value;
  }

  confirm(): void {
    if (!this.selected) return;
    const result: SourceSearchResult = {
      id: this.selected.id!,
      label: this.selected.name
    };
    this.dialogRef.close(result);
  }
}
