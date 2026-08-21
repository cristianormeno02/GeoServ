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

import { ServiceOrderService } from '../../services/service-order.service';
import { ServiceOrderListItem } from '../../models/service-order.model';

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
    MatTooltipModule
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
    private router: Router
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
    if (!status) return 'status-info';
    const s = status.toLowerCase();
    if (s.includes('aprobado') || s.includes('completado') || s.includes('pagado') || s.includes('cobrado') || s.includes('activo') || s.includes('procesado')) {
      return 'status-success';
    }
    if (s.includes('pendiente') || s.includes('revisión') || s.includes('revision')) {
      return 'status-warning';
    }
    if (s.includes('error') || s.includes('rechazado')) {
      return 'status-error';
    }
    return 'status-info';
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
    if (confirm('¿Estás seguro de que deseas eliminar esta orden de servicio? Todos los documentos, actividades y responsables asociados también se eliminarán.')) {
      this.serviceOrderService.deleteServiceOrder(id).subscribe({
        next: () => {
          this.loadOrders();
        },
        error: (err) => {
          console.error('Error al eliminar la orden', err);
          alert('Hubo un error al eliminar la orden.');
        }
      });
    }
  }
}
