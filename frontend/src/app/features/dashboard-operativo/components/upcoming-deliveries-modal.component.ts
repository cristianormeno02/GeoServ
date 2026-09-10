import { Component, Inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { OperationalDashboardService } from '../services/operational-dashboard.service';
import { UpcomingDeliveryOrder } from '../models/operational-dashboard.model';

export interface UpcomingDeliveriesModalData {
  range: string;
  rangeKey: string;
}

@Component({
  selector: 'app-upcoming-deliveries-modal',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatDialogModule,
    MatButtonModule,
    MatTableModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatTooltipModule
  ],
  template: `
    <div class="modal-header">
      <div class="header-title-area">
        <mat-icon class="header-icon" [style.color]="getHeaderColor()">schedule</mat-icon>
        <h2 mat-dialog-title style="margin: 0;">Próximas Entregas: {{ data.range }}</h2>
      </div>
      <button mat-icon-button mat-dialog-close>
        <mat-icon>close</mat-icon>
      </button>
    </div>

    <mat-dialog-content>
      <div *ngIf="loading" class="spinner-container">
        <mat-spinner diameter="40"></mat-spinner>
      </div>

      <div *ngIf="!loading && items.length === 0" class="empty-message">
        No hay órdenes pendientes de entrega en este rango de fechas.
      </div>

      <div *ngIf="!loading && items.length > 0" class="table-container">
        <table mat-table [dataSource]="items" class="mat-elevation-z0" style="width: 100%;">
          <!-- Nº Orden -->
          <ng-container matColumnDef="orderNumber">
            <th mat-header-cell *matHeaderCellDef>Nº Orden</th>
            <td mat-cell *matCellDef="let element" class="fw-bold">{{ element.orderNumber }}</td>
          </ng-container>

          <!-- Cliente -->
          <ng-container matColumnDef="clientName">
            <th mat-header-cell *matHeaderCellDef>Cliente</th>
            <td mat-cell *matCellDef="let element">{{ element.clientName }}</td>
          </ng-container>

          <!-- Tipo Servicio -->
          <ng-container matColumnDef="serviceTypeName">
            <th mat-header-cell *matHeaderCellDef>Tipo</th>
            <td mat-cell *matCellDef="let element">{{ element.serviceTypeName }}</td>
          </ng-container>

          <!-- Fecha Presupuestada -->
          <ng-container matColumnDef="estimatedEndDate">
            <th mat-header-cell *matHeaderCellDef>Fecha Pactada</th>
            <td mat-cell *matCellDef="let element">{{ element.estimatedEndDate | date:'dd/MM/yyyy' }}</td>
          </ng-container>

          <!-- Días Restantes -->
          <ng-container matColumnDef="daysRemaining">
            <th mat-header-cell *matHeaderCellDef>Días Restantes</th>
            <td mat-cell *matCellDef="let element">
              <span class="days-badge" [ngClass]="getBadgeClass(element.daysRemaining)">
                {{ formatDaysText(element.daysRemaining) }}
              </span>
            </td>
          </ng-container>

          <!-- Acciones -->
          <ng-container matColumnDef="actions">
            <th mat-header-cell *matHeaderCellDef></th>
            <td mat-cell *matCellDef="let element">
              <a [routerLink]="['/service-orders', element.id]" mat-icon-button color="primary" matTooltip="Ver Orden" (click)="closeDialog()">
                <mat-icon>visibility</mat-icon>
              </a>
            </td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="displayedColumns; sticky: true"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
        </table>
      </div>
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <mat-paginator
        [length]="totalCount"
        [pageSize]="pageSize"
        [pageSizeOptions]="[5, 10, 20]"
        [pageIndex]="page - 1"
        (page)="onPageChange($event)"
        aria-label="Seleccionar página">
      </mat-paginator>
      <button mat-flat-button color="primary" mat-dialog-close>Cerrar</button>
    </mat-dialog-actions>
  `,
  styles: [`
    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px 24px 8px 24px;
    }
    .header-title-area {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .header-icon {
      font-size: 24px;
      width: 24px;
      height: 24px;
    }
    .spinner-container {
      display: flex;
      justify-content: center;
      padding: 3rem;
    }
    .empty-message {
      padding: 3rem;
      text-align: center;
      color: #64748b;
      font-size: 14px;
    }
    .table-container {
      max-height: 400px;
      overflow: auto;
      margin-top: 8px;
    }
    .fw-bold {
      font-weight: 600;
    }
    .days-badge {
      display: inline-block;
      padding: 3px 10px;
      border-radius: 12px;
      font-size: 11px;
      font-weight: 700;
    }
    .days-badge.critical {
      background: #fee2e2;
      color: #b91c1c;
    }
    .days-badge.warning {
      background: #fef3c7;
      color: #b45309;
    }
    .days-badge.ok {
      background: #dcfce7;
      color: #15803d;
    }
    .days-badge.neutral {
      background: #f1f5f9;
      color: #475569;
    }
  `]
})
export class UpcomingDeliveriesModalComponent implements OnInit {
  loading = false;
  items: UpcomingDeliveryOrder[] = [];
  totalCount = 0;
  page = 1;
  pageSize = 10;
  displayedColumns: string[] = ['orderNumber', 'clientName', 'serviceTypeName', 'estimatedEndDate', 'daysRemaining', 'actions'];

  constructor(
    public dialogRef: MatDialogRef<UpcomingDeliveriesModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: UpcomingDeliveriesModalData,
    private dashboardService: OperationalDashboardService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.loading = true;
    this.dashboardService.getUpcomingDeliveriesDetails(this.data.rangeKey, this.page, this.pageSize).subscribe({
      next: res => {
        this.items = res.items;
        this.totalCount = res.totalCount;
        this.page = res.page;
        this.pageSize = res.pageSize;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: err => {
        console.error('Error loading upcoming deliveries details', err);
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  onPageChange(event: PageEvent): void {
    this.page = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.loadData();
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  getHeaderColor(): string {
    if (this.data.rangeKey === '0_7') return '#ef4444';
    if (this.data.rangeKey === '8_14') return '#f59e0b';
    if (this.data.rangeKey === '15_30') return '#10b981';
    return '#64748b';
  }

  getBadgeClass(days: number): string {
    if (days <= 7) return 'critical';
    if (days <= 14) return 'warning';
    if (days <= 30) return 'ok';
    return 'neutral';
  }

  formatDaysText(days: number): string {
    if (days < 0) return `Vencida (${Math.abs(days)}d)`;
    if (days === 0) return 'Vence hoy';
    return `${days} días`;
  }
}
