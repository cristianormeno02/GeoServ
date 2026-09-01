import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';

import { SparklineCardComponent } from '../../shared/components/charts/sparkline-card.component';
import { GaugeChartComponent } from '../../shared/components/charts/gauge-chart.component';
import { DonutChartComponent, DonutSlice } from '../../shared/components/charts/donut-chart.component';
import { AgingBarChartComponent, AgingBucket } from '../../shared/components/charts/aging-bar-chart.component';
import { HorizontalBarChartComponent, HorizontalBarItem } from '../../shared/components/charts/horizontal-bar-chart.component';

import { OperationalDashboardService } from './services/operational-dashboard.service';
import {
  OperationalKpisResponse,
  TeamCapacityResponse,
  DeadlineComplianceResponse,
  StagnantOrdersResponse,
  AgingUncollectedOrdersResponse,
  InventoryAlertsResponse,
  UpcomingFixedCost
} from './models/operational-dashboard.model';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-operational-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    SparklineCardComponent,
    GaugeChartComponent,
    DonutChartComponent,
    AgingBarChartComponent,
    HorizontalBarChartComponent
  ],
  templateUrl: './operational-dashboard.component.html',
  styleUrls: ['./operational-dashboard.component.css']
})
export class OperationalDashboardComponent implements OnInit {
  isLoading = true;
  lastUpdated: Date = new Date();

  // KPIs
  kpis: OperationalKpisResponse | null = null;

  // Gauges
  teamCapacity: TeamCapacityResponse | null = null;
  deadlineCompliance: DeadlineComplianceResponse | null = null;

  // Charts data
  serviceTypeSlices: DonutSlice[] = [];
  workloadItems: HorizontalBarItem[] = [];
  agingBuckets: AgingBucket[] = [];
  totalUncollectedAmountText: string = '';

  // Tables
  stagnantOrdersData: StagnantOrdersResponse | null = null;
  stagnantPage = 1;
  stagnantPageSize = 5;

  uncollectedOrdersData: AgingUncollectedOrdersResponse | null = null;
  uncollectedPage = 1;
  uncollectedPageSize = 5;

  inventoryAlerts: InventoryAlertsResponse | null = null;
  upcomingCosts: UpcomingFixedCost[] = [];

  stagnantColumns: string[] = ['orderNumber', 'clientName', 'serviceTypeName', 'daysInStatus', 'actions'];
  uncollectedColumns: string[] = ['orderNumber', 'clientName', 'deliveryDate', 'pendingAmount', 'actions'];
  inventoryColumns: string[] = ['description', 'unitName', 'currentStock', 'minimumStock', 'deficit'];
  upcomingCostsColumns: string[] = ['itemName', 'categoryName', 'dueDate', 'amount', 'daysRemaining'];

  constructor(
    private dashboardService: OperationalDashboardService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadAllData();
  }

  loadAllData(): void {
    this.isLoading = true;
    this.lastUpdated = new Date();

    this.dashboardService.getKpis().subscribe({
      next: res => { this.kpis = res; this.cdr.detectChanges(); },
      error: err => { console.error('Error fetching KPIs', err); this.cdr.detectChanges(); }
    });

    this.dashboardService.getTeamCapacity().subscribe({
      next: res => { this.teamCapacity = res; this.cdr.detectChanges(); },
      error: err => { console.error('Error fetching Team Capacity', err); this.cdr.detectChanges(); }
    });

    this.dashboardService.getDeadlineCompliance().subscribe({
      next: res => { this.deadlineCompliance = res; this.cdr.detectChanges(); },
      error: err => { console.error('Error fetching Deadline Compliance', err); this.cdr.detectChanges(); }
    });

    this.dashboardService.getOrdersByServiceType().subscribe({
      next: res => {
        this.serviceTypeSlices = res.map(item => ({
          label: item.serviceTypeName,
          value: item.count
        }));
        this.cdr.detectChanges();
      },
      error: err => { console.error('Error fetching orders by service type', err); this.cdr.detectChanges(); }
    });

    this.dashboardService.getWorkloadByResponsible().subscribe({
      next: res => {
        this.workloadItems = res.map(item => ({
          label: item.responsibleName,
          value: item.activeOrdersCount
        }));
        this.cdr.detectChanges();
      },
      error: err => { console.error('Error fetching workload by responsible', err); this.cdr.detectChanges(); }
    });

    this.loadAgingAndUncollected();
    this.loadStagnantOrders();

    this.dashboardService.getInventoryAlerts().subscribe({
      next: res => { this.inventoryAlerts = res; this.cdr.detectChanges(); },
      error: err => { console.error('Error fetching inventory alerts', err); this.cdr.detectChanges(); }
    });

    this.dashboardService.getUpcomingFixedCosts().subscribe({
      next: res => {
        this.upcomingCosts = res;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: err => {
        console.error('Error fetching upcoming fixed costs', err);
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  loadStagnantOrders(): void {
    this.dashboardService.getStagnantOrders(this.stagnantPage, this.stagnantPageSize).subscribe({
      next: res => { this.stagnantOrdersData = res; this.cdr.detectChanges(); },
      error: err => { console.error('Error fetching stagnant orders', err); this.cdr.detectChanges(); }
    });
  }

  onStagnantPageChange(event: PageEvent): void {
    this.stagnantPage = event.pageIndex + 1;
    this.stagnantPageSize = event.pageSize;
    this.loadStagnantOrders();
  }

  loadAgingAndUncollected(): void {
    this.dashboardService.getAgingUncollectedOrders(this.uncollectedPage, this.uncollectedPageSize).subscribe({
      next: res => {
        this.uncollectedOrdersData = res;
        this.agingBuckets = res.buckets.map(b => ({
          range: b.range,
          count: b.count,
          totalPendingAmount: b.totalPendingAmount
        }));
        this.totalUncollectedAmountText = 'Total: $ ' + res.totalPendingAmount.toLocaleString('es-AR');
        this.cdr.detectChanges();
      },
      error: err => { console.error('Error fetching aging uncollected orders', err); this.cdr.detectChanges(); }
    });
  }

  onUncollectedPageChange(event: PageEvent): void {
    this.uncollectedPage = event.pageIndex + 1;
    this.uncollectedPageSize = event.pageSize;
    this.loadAgingAndUncollected();
  }

  formatCurrency(val: number): string {
    return '$ ' + (val || 0).toLocaleString('es-AR', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  }

  formatDate(dateStr: string): string {
    if (!dateStr) return '-';
    const d = new Date(dateStr);
    return d.toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  }
}
