import {  Component, OnInit, ChangeDetectorRef, ViewChild  } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { Movement, MovementService } from '../services/movement.service';
import { MovimientoFormComponent } from './movimiento-form.component';
import { MovementCategoryService } from '../services/movement-category.service';
import { FinancialAccountService } from '../services/financial-account.service';

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
    const today = new Date();
    this.filterForm = this.fb.group({
      startDate: [today],
      endDate: [today],
      categoryId: [''],
      financialAccountId: [''],
      isIncome: ['']
    });
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
    const startDate = filters.startDate ? filters.startDate.toISOString() : undefined;
    const endDate = filters.endDate ? filters.endDate.toISOString() : undefined;
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
    this.pageIndex = 0; // reset to first page
    this.loadMovements();
  }

  resetFilter() {
    const today = new Date();
    this.filterForm.reset({
      startDate: today,
      endDate: today,
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
    if (confirm(`Â¿EstÃ¡s seguro de eliminar este movimiento por $${movement.amount}?`)) {
      this.movementService.deleteMovement(movement.id!).subscribe({
        next: () => { this.snackBar.open('Eliminado con Ã©xito', 'Cerrar'); this.loadMovements(); },
        error: (err) => { console.error(err); this.snackBar.open(err.error?.message || 'Error al eliminar', 'Cerrar', { duration: 4000, panelClass: ['snackbar-error'] }); }
      });
    }
  }
}

