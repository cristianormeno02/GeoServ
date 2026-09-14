import {  Component, OnInit, ChangeDetectorRef  } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatChipsModule } from '@angular/material/chips';
import { MovementCategory, MovementCategoryService } from '../services/movement-category.service';
import { CategoriaFormComponent } from './categoria-form.component';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';

const LINKED_SOURCE_TYPE_LABELS: Record<string, string> = {
  ServiceOrderIncome: 'Cobro de Orden de Servicio',
  AssetPurchase: 'Compra de Activo',
  FixedCostPayment: 'Pago de Gasto Fijo',
  DirectCost: 'Pago de Costo Directo'
};

@Component({
  selector: 'app-categorias-movimiento',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatButtonModule, MatIconModule, MatCardModule, MatDialogModule, MatChipsModule],
  templateUrl: './categorias-movimiento.html',
  styleUrl: './categorias-movimiento.css',
})
export class CategoriasMovimiento implements OnInit {
  categories: MovementCategory[] = [];
  displayedColumns: string[] = ['name', 'description', 'type', 'linkedSourceType', 'status', 'actions'];

  linkedSourceTypeLabel(value: string): string {
    return LINKED_SOURCE_TYPE_LABELS[value] || value;
  }

  constructor(
    private categoryService: MovementCategoryService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories() {
    this.categoryService.getCategories().subscribe({
      next: (data) => {
        this.categories = [...data];
        this.cdr.detectChanges();
      },
      error: (err) => console.error(err)
    });
  }

  openAddDialog() {
    const dialogRef = this.dialog.open(CategoriaFormComponent, { width: '500px' });
    dialogRef.afterClosed().subscribe(result => {
      if (result) this.loadCategories();
    });
  }

  openEditDialog(category: MovementCategory) {
    if (category.isSystemDefault) return;
    const dialogRef = this.dialog.open(CategoriaFormComponent, { width: '500px', data: { category } });
    dialogRef.afterClosed().subscribe(result => {
      if (result) this.loadCategories();
    });
  }

  deleteCategory(category: MovementCategory) {
    if (category.isSystemDefault) return;
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Confirmar Eliminación',
        message: `¿Estás seguro de eliminar la categoría "${category.name}"?`,
        confirmText: 'Eliminar',
        cancelText: 'Cancelar',
        isDestructive: true
      }
    });

    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        this.categoryService.deleteCategory(category.id!).subscribe({
          next: () => {
            this.snackBar.open('Categoría eliminada con éxito', 'Cerrar', { duration: 3000 });
            this.loadCategories();
          },
          error: (err) => {
            console.error(err);
            this.snackBar.open(err.error || 'Ocurrió un error al eliminar. Es posible que esté en uso.', 'Cerrar', { duration: 4000, panelClass: ['snackbar-error'] });
          }
        });
      }
    });
  }
}
