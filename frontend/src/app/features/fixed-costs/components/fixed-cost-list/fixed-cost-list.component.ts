import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { FixedCostService } from '../../services/fixed-cost.service';
import { FixedCostItem, FixedCostPayment } from '../../models/fixed-cost.model';
import { FixedCostDialogComponent } from '../fixed-cost-dialog/fixed-cost-dialog.component';
import { FixedCostPaymentDialogComponent } from '../fixed-cost-payment-dialog/fixed-cost-payment-dialog.component';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-fixed-cost-list',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatButtonModule, MatIconModule, MatDialogModule, MatSnackBarModule],
  templateUrl: './fixed-cost-list.component.html',
  styleUrls: ['./fixed-cost-list.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class FixedCostListComponent implements OnInit {
  items: FixedCostItem[] = [];
  columnsToDisplay = ['name', 'category', 'provider', 'initialAmount', 'isRecurring', 'actions'];
  columnsToDisplayWithExpand = [...this.columnsToDisplay, 'expand'];
  expandedElement: FixedCostItem | null = null;

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
    this.fixedCostService.getItems().subscribe(res => {
      this.items = res;
      this.cdr.detectChanges();
    });
  }

  openItemDialog(item?: FixedCostItem) {
    const dialogRef = this.dialog.open(FixedCostDialogComponent, {
      width: '600px',
      data: item
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) this.loadItems();
    });
  }

  deleteItem(id: string) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: { title: 'Eliminar Gasto Fijo', message: '¿Estás seguro de eliminar este gasto fijo y todos sus pagos?' }
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.fixedCostService.deleteItem(id).subscribe(() => {
          this.snackBar.open('Gasto fijo eliminado', 'Cerrar', { duration: 3000 });
          this.loadItems();
        });
      }
    });
  }

  // --- Payments ---

  openPaymentDialog(item: FixedCostItem, payment?: FixedCostPayment) {
    const dialogRef = this.dialog.open(FixedCostPaymentDialogComponent, {
      width: '500px',
      data: { itemId: item.id, payment: payment }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) this.loadItems();
    });
  }

  deletePayment(paymentId: string) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: { title: 'Eliminar Vencimiento', message: '¿Estás seguro de eliminar este vencimiento?' }
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.fixedCostService.deletePayment(paymentId).subscribe(() => {
          this.snackBar.open('Vencimiento eliminado', 'Cerrar', { duration: 3000 });
          this.loadItems();
        });
      }
    });
  }
}
