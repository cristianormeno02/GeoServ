import {
  Component,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  OnInit,
  AfterViewInit,
  OnChanges,
  SimpleChanges,
  TemplateRef,
  ContentChild,
  ChangeDetectionStrategy,
  DestroyRef,
  inject
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { LoadingService } from '../../../core/services/loading.service';

export interface CrudTableColumn<T = any> {
  key: string;
  label: string;
  sortable?: boolean;
  format?: (value: any, row: T) => string;
  cellClass?: string | ((value: any, row: T) => string);
  headerClass?: string;
}

@Component({
  selector: 'app-crud-table',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="crud-table-wrapper">
      <!-- Barra de Filtro / Búsqueda -->
      <div *ngIf="showFilter" class="crud-table-header">
        <mat-form-field appearance="outline" class="search-field">
          <mat-label>{{ filterPlaceholder }}</mat-label>
          <input
            matInput
            [(ngModel)]="filterValue"
            (input)="onSearchInput($event)"
            [placeholder]="filterPlaceholder"
            #filterInput
          />
          <mat-icon matPrefix>search</mat-icon>
          <button
            *ngIf="filterValue"
            mat-icon-button
            matSuffix
            type="button"
            (click)="clearFilter()"
            aria-label="Limpiar filtro"
            class="clear-filter-btn"
          >
            <mat-icon>close</mat-icon>
          </button>
        </mat-form-field>

        <div class="header-extra">
          <ng-content select="[tableActions]"></ng-content>
        </div>
      </div>

      <!-- Contenedor de la Tabla -->
      <div class="table-responsive-container mat-elevation-z2">
        <!-- Indicador de Carga (suprimido si el loader global está activo para evitar doble spinner) -->
        <div *ngIf="isLoading && !(isGlobalLoading$ | async)" class="loading-overlay">
          <mat-spinner diameter="40"></mat-spinner>
          <span class="loading-text">Cargando datos...</span>
        </div>

        <table mat-table [dataSource]="dataSource" matSort class="crud-mat-table">
          <!-- Columnas Dinámicas -->
          <ng-container *ngFor="let col of columns" [matColumnDef]="col.key">
            <th
              mat-header-cell
              *matHeaderCellDef
              [mat-sort-header]="col.sortable !== false ? col.key : ''"
              [disabled]="col.sortable === false"
              [ngClass]="col.headerClass || ''"
            >
              {{ col.label }}
            </th>
            <td
              mat-cell
              *matCellDef="let row"
              [ngClass]="getCellClass(col, row)"
            >
              <!-- Si hay template personalizado para esta columna -->
              <ng-container *ngIf="customTemplates && customTemplates[col.key]; else defaultCell">
                <ng-container
                  *ngTemplateOutlet="customTemplates[col.key]; context: { $implicit: row, value: row[col.key], row: row, col: col }"
                ></ng-container>
              </ng-container>
              <!-- Renderizado por defecto -->
              <ng-template #defaultCell>
                {{ formatCellValue(col, row) }}
              </ng-template>
            </td>
          </ng-container>

          <!-- Columna Opcional de Acciones Proyectada -->
          <ng-container *ngIf="actionsTemplate" matColumnDef="actions">
            <th mat-header-cell *matHeaderCellDef class="actions-header-cell">Acciones</th>
            <td mat-cell *matCellDef="let row" class="actions-cell">
              <ng-container
                *ngTemplateOutlet="actionsTemplate; context: { $implicit: row, row: row }"
              ></ng-container>
            </td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="effectiveDisplayedColumns"></tr>
          <tr
            mat-row
            *matRowDef="let row; columns: effectiveDisplayedColumns;"
            (click)="rowClick.emit(row)"
            [class.clickable-row]="hasRowClick"
          ></tr>

          <!-- Estado Vacío / Sin Coincidencias -->
          <tr class="mat-row empty-row" *matNoDataRow>
            <td class="mat-cell" [attr.colspan]="effectiveDisplayedColumns.length">
              <div class="empty-state">
                <mat-icon class="empty-icon">search_off</mat-icon>
                <span>{{ filterValue ? ('No se encontraron resultados para "' + filterValue + '"') : emptyMessage }}</span>
              </div>
            </td>
          </tr>
        </table>

        <!-- Paginador -->
        <mat-paginator
          [pageSize]="pageSize"
          [pageSizeOptions]="pageSizeOptions"
          showFirstLastButtons
          aria-label="Seleccionar página"
        ></mat-paginator>
      </div>
    </div>
  `,
  styles: [`
    .crud-table-wrapper {
      display: flex;
      flex-direction: column;
      width: 100%;
      gap: 12px;
    }

    .crud-table-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 16px;
      flex-wrap: wrap;
    }

    .search-field {
      min-width: 280px;
      max-width: 400px;
      flex: 1;
    }

    .clear-filter-btn {
      border: none;
      background: transparent;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .header-extra {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .table-responsive-container {
      position: relative;
      overflow-x: auto;
      background-color: var(--color-surface, #ffffff);
      border-radius: 8px;
    }

    .crud-mat-table {
      width: 100%;
      min-width: 600px;
    }

    .loading-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(255, 255, 255, 0.7);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      z-index: 10;
      gap: 12px;
    }

    .loading-text {
      font-size: 14px;
      color: var(--text-primary, #1e293b);
      font-weight: 500;
    }

    .actions-header-cell,
    .actions-cell {
      width: 120px;
      text-align: right;
    }

    .clickable-row {
      cursor: pointer;
      transition: background-color 0.15s ease;
    }

    .clickable-row:hover {
      background-color: rgba(0, 0, 0, 0.04);
    }

    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 32px 16px;
      gap: 8px;
      color: var(--text-secondary, #64748b);
      font-size: 14px;
    }

    .empty-icon {
      font-size: 36px;
      width: 36px;
      height: 36px;
      color: #cbd5e1;
    }
  `]
})
export class CrudTableComponent<T = any> implements OnInit, AfterViewInit, OnChanges {
  private loadingService = inject(LoadingService);
  public isGlobalLoading$ = this.loadingService.loading$;

  @Input() columns: CrudTableColumn<T>[] = [];
  @Input() displayedColumns: string[] = [];
  @Input() data: T[] = [];
  @Input() isLoading: boolean = false;
  @Input() showFilter: boolean = true;
  @Input() filterPlaceholder: string = 'Buscar...';
  @Input() emptyMessage: string = 'No se encontraron registros';
  @Input() pageSize: number = 10;
  @Input() pageSizeOptions: number[] = [5, 10, 25, 50, 100];
  @Input() customTemplates: { [key: string]: TemplateRef<any> } = {};

  @ContentChild('actionsTemplate') actionsTemplate?: TemplateRef<any>;

  @Output() rowClick = new EventEmitter<T>();
  @Output() filterChange = new EventEmitter<string>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  dataSource = new MatTableDataSource<T>([]);
  filterValue: string = '';

  private searchSubject = new Subject<string>();
  private destroyRef = inject(DestroyRef);

  get hasRowClick(): boolean {
    return this.rowClick.observed;
  }

  get effectiveDisplayedColumns(): string[] {
    if (this.displayedColumns && this.displayedColumns.length > 0) {
      return this.displayedColumns;
    }
    const cols = this.columns.map(c => c.key);
    if (this.actionsTemplate && !cols.includes('actions')) {
      cols.push('actions');
    }
    return cols;
  }

  ngOnInit(): void {
    this.dataSource.data = this.data || [];

    this.searchSubject
      .pipe(
        debounceTime(250),
        distinctUntilChanged(),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(query => {
        this.dataSource.filter = query.trim().toLowerCase();
        if (this.dataSource.paginator) {
          this.dataSource.paginator.firstPage();
        }
        this.filterChange.emit(query);
      });
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data'] && changes['data'].currentValue) {
      this.dataSource.data = changes['data'].currentValue;
    }
  }

  onSearchInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchSubject.next(input.value || '');
  }

  clearFilter(): void {
    this.filterValue = '';
    this.searchSubject.next('');
  }

  formatCellValue(col: CrudTableColumn<T>, row: T): string {
    const val = (row as any)?.[col.key];
    if (col.format) {
      return col.format(val, row);
    }
    if (val === null || val === undefined) {
      return '';
    }
    return String(val);
  }

  getCellClass(col: CrudTableColumn<T>, row: T): string {
    if (!col.cellClass) return '';
    if (typeof col.cellClass === 'function') {
      return col.cellClass((row as any)?.[col.key], row);
    }
    return col.cellClass;
  }
}
