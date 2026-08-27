import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ConsumableService } from '../../services/consumable.service';
import { Consumable } from '../../models/consumable.model';
import { ConsumableDialogComponent } from '../consumable-dialog/consumable-dialog.component';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-consumable-list',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatButtonModule, MatIconModule, MatDialogModule, MatSnackBarModule],
  templateUrl: './consumable-list.component.html',
  styleUrls: ['./consumable-list.component.css']
})
export class ConsumableListComponent implements OnInit {
  items: Consumable[] = [];
  columnsToDisplay = ['purchaseDate', 'class', 'description', 'quantity', 'totalCost', 'provider', 'actions'];

  constructor(
    private consumableService: ConsumableService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadItems();
  }

  loadItems() {
    this.consumableService.getConsumables().subscribe(res => {
      this.items = res;
    });
  }

  openDialog(item?: Consumable) {
    const dialogRef = this.dialog.open(ConsumableDialogComponent, {
      width: '600px',
      data: item
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) this.loadItems();
    });
  }

  deleteItem(id: string) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: { title: 'Eliminar Insumo', message: '¿Estás seguro de eliminar este insumo?' }
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.consumableService.deleteConsumable(id).subscribe(() => {
          this.snackBar.open('Insumo eliminado', 'Cerrar', { duration: 3000 });
          this.loadItems();
        });
      }
    });
  }
}
