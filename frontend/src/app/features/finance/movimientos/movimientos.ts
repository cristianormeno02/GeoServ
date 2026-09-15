import {  Component, OnInit, ChangeDetectorRef, ViewChild  } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { Movement, MovementService } from '../services/movement.service';
import { MovimientoFormComponent } from './movimiento-form.component';
import { MovementCategoryService } from '../services/movement-category.service';
import { FinancialAccountService } from '../services/financial-account.service';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';

export const STORAGE_KEY_MOVIMIENTOS_PERIOD = 'geoserv_movimientos_period';

export function dateRangeValidator(control: AbstractControl): ValidationErrors | null {
  const start = control.get('startDate')?.value;
  const end = control.get('endDate')?.value;
  if (!start || !end) return null;

  const startDate = new Date(start);
  const endDate = new Date(end);
  if (startDate.getTime() > endDate.getTime()) {
    return { dateRangeInvalid: true };
  }
  return null;
}

@Component({
  selector: 'app-movimientos',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatDialogModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule
  ],
  templateUrl: './movimientos.html',
  styleUrl: './movimientos.css',
})
export class Movimientos implements OnInit {
  movements: Movement[] = [];
  displayedColumns: string[] = ['date', 'type', 'category', 'source', 'description', 'account', 'amount', 'actions'];

  readonly sourceTypeLabels: Record<string, string> = {
    Manual: 'Manual',
    ServiceOrderIncome: 'Ingreso por OS',
    DirectCost: 'Costo Directo',
    FixedCostPayment: 'Pago de Gasto Fijo',
    AssetPurchase: 'Compra de Activo',
    InternalTransfer: 'Transferencia Interna',
  };

  getSourceLabel(sourceType?: string): string {
    return sourceType ? (this.sourceTypeLabels[sourceType] ?? sourceType) : 'Manual';
  }

  getSourceReference(movement: Movement): string | null {
    if (movement.sourceType === 'InternalTransfer' && movement.sourceId) {
      const otherAccount = this.accounts.find(a => a.id === movement.sourceId);
      const otherName = otherAccount?.name || 'otra cuenta';
      return movement.isIncome ? `Desde ${otherName}` : `Hacia ${otherName}`;
    }
    if (movement.sourceType === 'DirectCost') {
      const directCostDesc = movement.sourceReference || 'Costo Directo';
      if (movement.serviceOrderNumber) {
        return `${directCostDesc} (OS: ${movement.serviceOrderNumber})`;
      }
      return directCostDesc;
    }
    return movement.sourceReference || movement.serviceOrderNumber || null;
  }

  totalCount = 0;
  pageSize = 10;
  pageIndex = 0;

  filterForm: FormGroup;
  categories: any[] = [];
  accounts: any[] = [];

  constructor(
    private movementService: MovementService,
    private categoryService: MovementCategoryService,
    private accountService: FinancialAccountService,
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) {
    const initialPeriod = this.getInitialPeriod();
    this.filterForm = this.fb.group({
      startDate: [initialPeriod.startDate],
      endDate: [initialPeriod.endDate],
      categoryId: [''],
      financialAccountId: [''],
      isIncome: ['']
    }, { validators: dateRangeValidator });
  }

  private getDefaultPeriod(): { startDate: Date; endDate: Date } {
    const today = new Date();
    const lastMonth = new Date();
    lastMonth.setMonth(today.getMonth() - 1);
    return { startDate: lastMonth, endDate: today };
  }

  private getInitialPeriod(): { startDate: Date; endDate: Date } {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_MOVIMIENTOS_PERIOD);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.startDate && parsed.endDate) {
          const start = new Date(parsed.startDate);
          const end = new Date(parsed.endDate);
          if (!isNaN(start.getTime()) && !isNaN(end.getTime()) && start.getTime() <= end.getTime()) {
            return { startDate: start, endDate: end };
          }
        }
      }
    } catch (e) {
      console.warn('Error al leer el período desde localStorage', e);
    }
    return this.getDefaultPeriod();
  }

  private savePeriodToStorage(startDate: any, endDate: any): void {
    try {
      if (startDate && endDate) {
        const data = {
          startDate: startDate instanceof Date ? startDate.toISOString() : new Date(startDate).toISOString(),
          endDate: endDate instanceof Date ? endDate.toISOString() : new Date(endDate).toISOString()
        };
        localStorage.setItem(STORAGE_KEY_MOVIMIENTOS_PERIOD, JSON.stringify(data));
      }
    } catch (e) {
      console.warn('Error al guardar el período en localStorage', e);
    }
  }

  ngOnInit(): void {
    this.loadFiltersData();
    this.loadMovements();
  }

  loadFiltersData() {
    this.categoryService.getCategories().subscribe(data => this.categories = data);
    this.accountService.getAccounts().subscribe(data => this.accounts = data);
  }

  loadMovements() {
    const filters = this.filterForm.value;
    const startDate = filters.startDate ? new Date(filters.startDate).toISOString() : undefined;
    const endDate = filters.endDate ? new Date(filters.endDate).toISOString() : undefined;
    const isIncome = filters.isIncome === '' ? undefined : filters.isIncome === 'true';

    this.movementService.getMovements(
      this.pageIndex + 1,
      this.pageSize,
      startDate,
      endDate,
      filters.categoryId || undefined,
      filters.financialAccountId || undefined,
      isIncome
    ).subscribe({
      next: (res) => {
        this.movements = [...res.items];
        this.totalCount = res.totalCount;
        this.cdr.detectChanges();
      },
      error: (err) => console.error(err)
    });
  }

  applyFilter() {
    if (this.filterForm.invalid) return;
    this.pageIndex = 0; // reset to first page
    const { startDate, endDate } = this.filterForm.value;
    this.savePeriodToStorage(startDate, endDate);
    this.loadMovements();
  }

  resetFilter() {
    const defaultPeriod = this.getDefaultPeriod();
    this.savePeriodToStorage(defaultPeriod.startDate, defaultPeriod.endDate);
    this.filterForm.reset({
      startDate: defaultPeriod.startDate,
      endDate: defaultPeriod.endDate,
      categoryId: '',
      financialAccountId: '',
      isIncome: ''
    });
    this.applyFilter();
  }

  onPageChange(event: PageEvent) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadMovements();
  }

  openAddDialog() {
    const dialogRef = this.dialog.open(MovimientoFormComponent, { width: '550px' });
    dialogRef.afterClosed().subscribe(result => {
      if (result) this.loadMovements();
    });
  }

  openEditDialog(movement: Movement) {
    const dialogRef = this.dialog.open(MovimientoFormComponent, { width: '550px', data: { movement } });
    dialogRef.afterClosed().subscribe(result => {
      if (result) this.loadMovements();
    });
  }

  deleteMovement(movement: Movement) {
    if (movement.transferGroupId) {
      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        data: {
          title: 'Confirmar Eliminación',
          message: `¿Estás seguro de eliminar esta Transferencia Interna por $${movement.amount}? Se eliminarán ambos movimientos (origen y destino).`,
          confirmText: 'Eliminar',
          cancelText: 'Cancelar',
          isDestructive: true
        }
      });
      dialogRef.afterClosed().subscribe(confirmed => {
        if (confirmed) {
          this.movementService.deleteTransfer(movement.transferGroupId!).subscribe({
            next: () => { this.snackBar.open('Transferencia eliminada con éxito', 'Cerrar'); this.loadMovements(); },
            error: (err) => { console.error(err); this.snackBar.open(err.error?.message || 'Error al eliminar la transferencia', 'Cerrar', { duration: 4000, panelClass: ['snackbar-error'] }); }
          });
        }
      });
      return;
    }

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Confirmar Eliminación',
        message: `¿Estás seguro de eliminar este movimiento por $${movement.amount}?`,
        confirmText: 'Eliminar',
        cancelText: 'Cancelar',
        isDestructive: true
      }
    });
    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        this.movementService.deleteMovement(movement.id!).subscribe({
          next: () => { this.snackBar.open('Eliminado con éxito', 'Cerrar'); this.loadMovements(); },
          error: (err) => { console.error(err); this.snackBar.open(err.error?.message || 'Error al eliminar', 'Cerrar', { duration: 4000, panelClass: ['snackbar-error'] }); }
        });
      }
    });
  }
}


