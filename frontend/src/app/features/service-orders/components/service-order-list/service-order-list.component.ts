import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { ServiceOrderService } from '../../services/service-order.service';
import { ServiceOrderListItem } from '../../models/service-order.model';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';
import { getOrderDateInfo, getOrderDateTimestamp, OrderDateInfo } from './service-order-date.util';

@Component({
  selector: 'app-service-order-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatTooltipModule,
    MatDialogModule,
    MatSnackBarModule
  ],
  templateUrl: './service-order-list.component.html',
  styleUrls: ['./service-order-list.component.scss']
})
export class ServiceOrderListComponent implements OnInit {
  displayedColumns: string[] = [
    'alerts',
    'orderNumber',
    'clientName',
    'projectName',
    'statusName',
    'createdAt',
    'budgetedAmount',
    'collectedAmount',
    'actions'
  ];
  dataSource = new MatTableDataSource<ServiceOrderListItem>();

  // Filtros
  searchTerm: string = '';
  selectedProjectId: string = '';
  selectedStatusName: string = 'Iniciada';

  projects: any[] = [];
  statuses: any[] = [];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private serviceOrderService: ServiceOrderService,
    private router: Router,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.setupFilterPredicate();
    this.setupSortingDataAccessor();
    this.loadCatalogs();
    this.loadOrders();
  }

  setupSortingDataAccessor(): void {
    this.dataSource.sortingDataAccessor = (item: ServiceOrderListItem, property: string) => {
      switch (property) {
        case 'createdAt':
          return getOrderDateTimestamp(item);
        case 'budgetedAmount':
          return item.budgetedAmount ?? 0;
        case 'collectedAmount':
          return item.collectedAmount ?? 0;
        default:
          const value = (item as any)[property];
          return typeof value === 'string' ? value.toLowerCase() : value;
      }
    };
  }

  getOrderDateInfo(row: ServiceOrderListItem): OrderDateInfo {
    return getOrderDateInfo(row);
  }

  loadCatalogs(): void {
    this.serviceOrderService.getProjects().subscribe({
      next: (projects) => {
        this.projects = projects || [];
      },
      error: (err) => console.error('Error al cargar proyectos', err)
    });

    this.serviceOrderService.getStatuses().subscribe({
      next: (statuses) => {
        this.statuses = statuses || [];
      },
      error: (err) => console.error('Error al cargar estados', err)
    });
  }

  setupFilterPredicate(): void {
    this.dataSource.filterPredicate = (data: ServiceOrderListItem, filterJson: string) => {
      let filter = { text: '', projectId: '', statusName: '' };
      try {
        filter = JSON.parse(filterJson);
      } catch {
        return true;
      }

      // 1. Filtro por Estado
      if (filter.statusName) {
        if (!data.statusName || data.statusName.toLowerCase() !== filter.statusName.toLowerCase()) {
          return false;
        }
      }

      // 2. Filtro por Proyecto
      if (filter.projectId) {
        if (data.projectId !== filter.projectId) {
          return false;
        }
      }

      // 3. Filtro de búsqueda libre
      if (filter.text) {
        const text = filter.text;
        const match =
          (data.orderNumber && data.orderNumber.toLowerCase().includes(text)) ||
          (data.clientName && data.clientName.toLowerCase().includes(text)) ||
          (data.projectName && data.projectName.toLowerCase().includes(text)) ||
          (data.statusName && data.statusName.toLowerCase().includes(text));
        if (!match) {
          return false;
        }
      }

      return true;
    };
  }

  loadOrders(): void {
    this.serviceOrderService.getServiceOrders().subscribe({
      next: (data) => {
        // Orden inicial ascendente por orderNumber
        data.sort((a, b) => (a.orderNumber || '').localeCompare(b.orderNumber || '', undefined, { numeric: true, sensitivity: 'base' }));
        this.dataSource.data = data;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        if (this.sort) {
          this.sort.active = 'orderNumber';
          this.sort.direction = 'asc';
        }
        this.applyCombinedFilter();
      },
      error: (err) => {
        console.error('Error al cargar órdenes de servicio', err);
      }
    });
  }

  applyCombinedFilter(): void {
    const filterObj = {
      text: this.searchTerm.trim().toLowerCase(),
      projectId: this.selectedProjectId,
      statusName: this.selectedStatusName
    };
    this.dataSource.filter = JSON.stringify(filterObj);

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
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

  getInconsistencyTooltip(row: ServiceOrderListItem): string {
    if (row.inconsistencyReasons && row.inconsistencyReasons.length > 0) {
      return 'Información mal cargada:\n• ' + row.inconsistencyReasons.join('\n• ');
    }
    return 'Alerta: Existe información mal cargada o incompleta en esta orden.';
  }

  createOrder(): void {
    this.router.navigate(['/ordenes-servicio/nuevo']);
  }

  viewDetails(id: string): void {
    this.router.navigate(['/ordenes-servicio', id]);
  }

  deliverOrder(row: ServiceOrderListItem): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '450px',
      data: {
        title: 'Marcar como Entregada',
        message: `¿Estás seguro de marcar la orden ${row.orderNumber} como Entregada? Se registrará la entrega en el sistema y se completarán automáticamente las fechas reales si no están definidas.`,
        isDestructive: false,
        confirmText: 'Confirmar Entrega'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.serviceOrderService.markAsDelivered(row.id).subscribe({
          next: () => {
            this.snackBar.open(`Orden ${row.orderNumber} marcada como entregada exitosamente`, 'Cerrar', { 
              duration: 3000, 
              panelClass: ['snackbar-success'] 
            });
            this.loadOrders();
          },
          error: (err) => {
            console.error('Error al marcar la orden como entregada', err);
            const errorMsg = err?.error?.message || 'Hubo un error al marcar la orden como entregada.';
            this.snackBar.open(errorMsg, 'Cerrar', { 
              duration: 5000, 
              panelClass: ['snackbar-error'] 
            });
          }
        });
      }
    });
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
