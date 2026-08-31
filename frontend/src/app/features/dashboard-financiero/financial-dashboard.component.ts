import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';

import { SparklineCardComponent } from '../../shared/components/charts/sparkline-card.component';
import { GaugeChartComponent } from '../../shared/components/charts/gauge-chart.component';
import { DonutChartComponent, DonutSlice } from '../../shared/components/charts/donut-chart.component';
import { AgingBarChartComponent, AgingBucket } from '../../shared/components/charts/aging-bar-chart.component';
import { ComboChartComponent, MonthlyCoverageItem } from '../../shared/components/charts/combo-chart.component';

import { FinancialDashboardService } from './services/financial-dashboard.service';
import {
  FinancialKpisResponse,
  MonthlyCoverageGaugeResponse,
  AverageOrderMarginResponse,
  FixedCostsAgingResponse,
  CommittedExpensesProjectionResponse,
  ServiceOrdersProfitabilityResponse,
  DistributionSummaryResponse,
  DirectCostsBreakdownResponse,
  FixedCostEvolutionItem,
  AssetsValuationResponse
} from './models/financial-dashboard.model';

@Component({
  selector: 'app-financial-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatSelectModule,
    MatFormFieldModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    SparklineCardComponent,
    GaugeChartComponent,
    DonutChartComponent,
    AgingBarChartComponent,
    ComboChartComponent
  ],
  templateUrl: './financial-dashboard.component.html',
  styleUrls: ['./financial-dashboard.component.css']
})
export class FinancialDashboardComponent implements OnInit {
  isLoading = true;
  lastUpdated: Date = new Date();

  // Period Selector
  selectedPeriod: number = 12; // 3, 6, 12 months

  // 1. KPIs
  kpis: FinancialKpisResponse | null = null;

  // 2. Gauges
  coverageGauge: MonthlyCoverageGaugeResponse | null = null;
  averageMargin: AverageOrderMarginResponse | null = null;

  // 3. Widget Principal: Cobertura Mensual
  coverageReportData: MonthlyCoverageItem[] = [];

  // 4. Aging & Proyección
  fixedCostsAging: FixedCostsAgingResponse | null = null;
  agingBuckets: AgingBucket[] = [];
  committedExpenses: CommittedExpensesProjectionResponse | null = null;

  // 5. Rentabilidad Top/Bottom
  profitability: ServiceOrdersProfitabilityResponse | null = null;

  // 6. Distribución de Ingresos
  distribution: DistributionSummaryResponse | null = null;

  // 7. Costos por categoría y proveedor
  directCosts: DirectCostsBreakdownResponse | null = null;
  costCategorySlices: DonutSlice[] = [];

  // 8. Evolución de costos fijos y activos
  fixedCostsEvolution: FixedCostEvolutionItem[] = [];
  assetsValuation: AssetsValuationResponse | null = null;

  // Table Columns
  topOrdersColumns: string[] = ['orderNumber', 'clientName', 'income', 'directCosts', 'profit', 'marginPercentage'];
  bottomOrdersColumns: string[] = ['orderNumber', 'clientName', 'income', 'directCosts', 'profit', 'marginPercentage'];
  distributionColumns: string[] = ['conceptName', 'expectedAmount', 'actualAmount'];
  providerCostsColumns: string[] = ['providerName', 'count', 'totalAmount'];
  assetsColumns: string[] = ['name', 'purchaseDate', 'purchasePrice', 'description'];

  constructor(private dashboardService: FinancialDashboardService) {}

  ngOnInit(): void {
    this.loadAllData();
  }

  loadAllData(): void {
    this.isLoading = true;
    this.lastUpdated = new Date();

    // 1. KPIs
    this.dashboardService.getKpis().subscribe({
      next: res => (this.kpis = res),
      error: err => console.error('Error fetching financial KPIs', err)
    });

    // 2. Gauges
    this.dashboardService.getMonthlyCoverageGauge().subscribe({
      next: res => (this.coverageGauge = res),
      error: err => console.error('Error fetching coverage gauge', err)
    });

    this.dashboardService.getAverageOrderMargin(3).subscribe({
      next: res => (this.averageMargin = res),
      error: err => console.error('Error fetching average order margin', err)
    });

    // 3. Informe de Cobertura Mensual
    this.loadCoverageReport();

    // 4. Aging y Proyección
    this.dashboardService.getFixedCostsAging().subscribe({
      next: res => {
        this.fixedCostsAging = res;
        this.agingBuckets = res.buckets.map(b => ({
          range: b.range,
          count: b.count,
          totalPendingAmount: b.totalAmount,
          color: b.color
        }));
      },
      error: err => console.error('Error fetching fixed costs aging', err)
    });

    this.dashboardService.getCommittedExpensesProjection().subscribe({
      next: res => (this.committedExpenses = res),
      error: err => console.error('Error fetching committed expenses', err)
    });

    // 5. Rentabilidad
    this.dashboardService.getProfitability().subscribe({
      next: res => (this.profitability = res),
      error: err => console.error('Error fetching profitability', err)
    });

    // 6. Distribución de Ingresos
    this.dashboardService.getDistributionSummary().subscribe({
      next: res => (this.distribution = res),
      error: err => console.error('Error fetching distribution summary', err)
    });

    // 7. Costos directos
    this.dashboardService.getDirectCostsBreakdown().subscribe({
      next: res => {
        this.directCosts = res;
        this.costCategorySlices = res.byCategory.map(c => ({
          label: c.categoryName,
          value: c.totalAmount
        }));
      },
      error: err => console.error('Error fetching direct costs breakdown', err)
    });

    // 8. Activos y evolución
    this.dashboardService.getAssetsValuation().subscribe({
      next: res => {
        this.assetsValuation = res;
        this.isLoading = false;
      },
      error: err => {
        console.error('Error fetching assets valuation', err);
        this.isLoading = false;
      }
    });

    this.dashboardService.getFixedCostsEvolution(this.selectedPeriod).subscribe({
      next: res => (this.fixedCostsEvolution = res),
      error: err => console.error('Error fetching fixed costs evolution', err)
    });
  }

  loadCoverageReport(): void {
    this.dashboardService.getMonthlyCoverageReport(this.selectedPeriod).subscribe({
      next: res => (this.coverageReportData = res),
      error: err => console.error('Error fetching monthly coverage report', err)
    });
  }

  onPeriodChange(months: number): void {
    this.selectedPeriod = months;
    this.loadCoverageReport();
    this.dashboardService.getFixedCostsEvolution(months).subscribe({
      next: res => (this.fixedCostsEvolution = res),
      error: err => console.error('Error fetching fixed costs evolution', err)
    });
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
