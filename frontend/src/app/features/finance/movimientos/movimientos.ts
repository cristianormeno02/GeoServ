import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Movement, MovementService } from '../services/movement.service';
import { MovimientoFormComponent } from './movimiento-form.component';

@Component({
  selector: 'app-movimientos',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatButtonModule, MatIconModule, MatCardModule, MatDialogModule],
  templateUrl: './movimientos.html',
  styleUrl: './movimientos.css',
})
export class Movimientos implements OnInit {
  movements: Movement[] = [];
  displayedColumns: string[] = ['date', 'type', 'category', 'description', 'account', 'amount', 'actions'];

  constructor(
    private movementService: MovementService,
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadMovements();
  }

  loadMovements() {
    this.movementService.getMovements().subscribe({
      next: (data) => {
        this.movements = [...data];
        this.cdr.detectChanges();
      },
      error: (err) => console.error(err)
    });
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
    if (confirm(`¿Estás seguro de eliminar este movimiento por $${movement.amount}?`)) {
      this.movementService.deleteMovement(movement.id!).subscribe({
        next: () => this.loadMovements(),
        error: (err) => console.error(err)
      });
    }
  }

  getCategoryName(category: number): string {
    const categories: Record<number, string> = {
      1: 'Cobro OS',
      2: 'Pago Gasto Fijo',
      3: 'Pago Costo Directo',
      4: 'Compra Activo',
      5: 'Honorarios',
      6: 'Depósito Cheque',
      7: 'Acreditación Cheque',
      8: 'Rechazo Cheque',
      9: 'Transferencia'
    };
    return categories[category] || 'Otro';
  }
}
