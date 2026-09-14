import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { UnitService } from '../../services/unit.service';
import { Unit } from '../../models/unit.model';
import { UnitDialogComponent } from '../unit-dialog/unit-dialog.component';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';
import { CrudTableComponent, CrudTableColumn } from '../../../../shared/components/crud-table/crud-table.component';

@Component({
  selector: 'app-unit-list',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatSnackBarModule,
    CrudTableComponent
  ],
  template: `
    <div style="padding:20px;">
      <div style="display:flex; justify-content:space-between; margin-bottom:20px; align-items:center;">
        <h2 style="margin:0;">Unidades</h2>
        <button mat-raised-button color="primary" (click)="openDialog()">
          <mat-icon>add</mat-icon> Nueva Unidad
        </button>
      </div>

      <app-crud-table
        [data]="units"
        [columns]="columns"
        [isLoading]="isLoading"
        filterPlaceholder="Buscar unidades..."
      >
        <ng-template #actionsTemplate let-item>
          <button mat-icon-button color="primary" (click)="openDialog(item)">
            <mat-icon>edit</mat-icon>
          </button>
          <button mat-icon-button color="warn" (click)="deleteItem(item.id)">
            <mat-icon>delete</mat-icon>
          </button>
        </ng-template>
      </app-crud-table>
    </div>
  `
})
export class UnitListComponent implements OnInit {
  units: Unit[] = [];
  isLoading = false;

  columns: CrudTableColumn<Unit>[] = [
    { key: 'name', label: 'Nombre', sortable: true },
    { key: 'isActive', label: 'Activo', sortable: true, format: (val: boolean) => val ? 'Sí' : 'No' }
  ];

  service = inject(UnitService);
  dialog = inject(MatDialog);
  snack = inject(MatSnackBar);

  ngOnInit() {
    this.load();
  }

  load() {
    this.isLoading = true;
    this.service.getUnits().subscribe({
      next: (res) => {
        this.units = res;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        this.snack.open('Error al cargar unidades', 'Cerrar', { duration: 3000 });
      }
    });
  }

  openDialog(unit?: Unit) {
    this.dialog.open(UnitDialogComponent, { width: '400px', data: { unit } }).afterClosed().subscribe(res => {
      if (!res) return;
      if (res.id) {
        this.service.updateUnit(res.id, res).subscribe(() => {
          this.load();
          this.snack.open('Actualizado', 'OK', { duration: 2000 });
        });
      } else {
        this.service.createUnit(res).subscribe(() => {
          this.load();
          this.snack.open('Creado', 'OK', { duration: 2000 });
        });
      }
    });
  }

  deleteItem(id: string) {
    this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Confirmar Eliminación',
        message: '¿Está seguro de que desea eliminar esta unidad?',
        confirmText: 'Eliminar',
        cancelText: 'Cancelar',
        isDestructive: true
      }
    }).afterClosed().subscribe(confirmed => {
      if (confirmed) {
        this.service.deleteUnit(id).subscribe(() => {
          this.load();
          this.snack.open('Eliminado exitosamente', 'OK', { duration: 2000 });
        });
      }
    });
  }
}
