import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { ServiceOrderService } from '../../services/service-order.service';
import { ServiceOrderListItem } from '../../models/service-order.model';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-service-order-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatTooltipModule,
    MatDialogModule,
    MatSnackBarModule
  ],
  templateUrl: './service-order-list.component.html',
  styleUrls: ['./service-order-list.component.scss']
})
export class ServiceOrderListComponent implements OnInit {
  displayedColumns: string[] = [
    'orderNumber',
    'clientName',
    'projectName',
    'statusName',
    'createdAt',
    'budgetedAmount',
    'actions'
  ];
  dataSource = new MatTableDataSource<ServiceOrderListItem>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private serviceOrderService: ServiceOrderService,
    private router: Router,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.serviceOrderService.getServiceOrders().subscribe({
      next: (data) => {
        this.dataSource.data = data;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error: (err) => {
        console.error('Error al cargar órdenes de servicio', err);
      }
    });
  }

  getStatusClass(status: string): string {
    if (!status) return 'bg-info';
    const s = status.toLowerCase();
    if (s.includes('aprobado') || s.includes('completado') || s.includes('pagado') || s.includes('cobrado') || s.includes('activo') || s.includes('procesado') || s.includes('entregada') || s.includes('entregado') || s.includes('ingreso')) {
      return 'bg-success';
    }
    if (s.includes('pendiente') || s.includes('revisión') || s.includes('revision')) {
      return 'bg-warning';
    }
    if (s.includes('error') || s.includes('rechazado')) {
      return 'bg-error';
    }
    return 'bg-info';
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  createOrder(): void {
    this.router.navigate(['/ordenes-servicio/nuevo']);
  }

  viewDetails(id: string): void {
    this.router.navigate(['/ordenes-servicio', id]);
  }

  deleteOrder(id: string): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '450px',
      data: {
        title: 'Eliminar Orden de Servicio',
        message: '¿Estás seguro de que deseas eliminar esta orden de servicio? Todos los documentos, actividades y responsables asociados también se eliminarán.',
        isDestructive: true,
        confirmText: 'Eliminar'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.serviceOrderService.deleteServiceOrder(id).subscribe({
          next: () => {
            this.snackBar.open('Orden de servicio eliminada exitosamente', 'Cerrar', { 
              duration: 3000, 
              panelClass: ['snackbar-success'] 
            });
            this.loadOrders();
          },
          error: (err) => {
            console.error('Error al eliminar la orden', err);
            this.snackBar.open('Hubo un error al eliminar la orden.', 'Cerrar', { 
              duration: 5000, 
              panelClass: ['snackbar-error'] 
            });
          }
        });
      }
    });
  }
}
