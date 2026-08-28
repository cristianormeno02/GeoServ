import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { FixedCostService } from '../../services/fixed-cost.service';
import { FixedCostCategoryDialogComponent } from '../fixed-cost-category-dialog/fixed-cost-category-dialog.component';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-fixed-cost-category-list',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatButtonModule, MatIconModule, MatDialogModule, MatSnackBarModule],
  template: `
    <div class="list-header">
      <h2>Categorías de Gastos Fijos</h2>
      <button mat-raised-button color="primary" (click)="openDialog()">
        <mat-icon>add</mat-icon> Nueva Categoría
      </button>
    </div>

    <table mat-table [dataSource]="items" class="mat-elevation-z8">
      <ng-container matColumnDef="name">
        <th mat-header-cell *matHeaderCellDef>Nombre</th>
        <td mat-cell *matCellDef="let element"> {{element.name}} </td>
      </ng-container>

      <ng-container matColumnDef="description">
        <th mat-header-cell *matHeaderCellDef>Descripción</th>
        <td mat-cell *matCellDef="let element"> {{element.description}} </td>
      </ng-container>

      <ng-container matColumnDef="actions">
        <th mat-header-cell *matHeaderCellDef class="text-right">Acciones</th>
        <td mat-cell *matCellDef="let element" class="text-right">
          <button mat-icon-button color="primary" (click)="openDialog(element)">
            <mat-icon>edit</mat-icon>
          </button>
          <button mat-icon-button color="warn" (click)="deleteItem(element.id)">
            <mat-icon>delete</mat-icon>
          </button>
        </td>
      </ng-container>

      <tr mat-header-row *matHeaderRowDef="columnsToDisplay"></tr>
      <tr mat-row *matRowDef="let row; columns: columnsToDisplay;"></tr>
    </table>
  `,
  styles: [`
    .list-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
    table { width: 100%; }
    .text-right { text-align: right; }
  `]
})
export class FixedCostCategoryListComponent implements OnInit {
  items: any[] = [];
  columnsToDisplay = ['name', 'description', 'actions'];

  constructor(
    private fixedCostService: FixedCostService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadItems();
  }

  loadItems() {
    this.fixedCostService.getCategories().subscribe(res => {
      this.items = res;
      this.cdr.detectChanges();
    });
  }

  openDialog(item?: any) {
    const dialogRef = this.dialog.open(FixedCostCategoryDialogComponent, {
      width: '400px',
      data: item
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) this.loadItems();
    });
  }

  deleteItem(id: string) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: { title: 'Eliminar Categoría', message: '¿Estás seguro de eliminar esta categoría?' }
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.fixedCostService.deleteCategory(id).subscribe({
          next: () => {
            this.snackBar.open('Categoría eliminada', 'Cerrar', { duration: 3000 });
            this.loadItems();
          },
          error: (err: any) => {
            let msg = err.error?.message || 'Error al eliminar';
            this.snackBar.open(msg, 'Cerrar', { duration: 4000, panelClass: ['snackbar-error'] });
          }
        });
      }
    });
  }
}
