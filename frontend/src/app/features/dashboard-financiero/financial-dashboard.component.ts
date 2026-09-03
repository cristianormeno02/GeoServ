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
import { ChangeDetectorRef, computed } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { EmpresaConfigService } from '../../core/services/empresa-config.service';

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

  // Textos explicativos para los reportes
  infoTexts = {
    saldoCuentas: 'Total disponible consolidado en todas las cuentas bancarias de la empresa al cierre de la última actualización.',
    ingresosMes: 'Monto total percibido por cobranzas durante el mes en curso.',
    resultadoMes: 'Diferencia neta entre los ingresos percibidos y todos los egresos (fijos y variables) correspondientes al mes.',
    saldoAcumulado: 'Acumulación de superávit o déficit operativo arrastrado desde el inicio del registro.',
    cobertura: 'Este medidor muestra qué porcentaje de los costos totales del mes ha sido cubierto con los ingresos percibidos. Un valor de 100% o superior indica que la empresa ha logrado cubrir todos sus compromisos.',
    margen: 'Representa el promedio del margen de ganancia de todas las órdenes cobradas en el período. Un margen alto sugiere buena rentabilidad operativa por servicio prestado.',
    coberturaMensual: 'El gráfico principal muestra la evolución histórica de ingresos (barras) frente a los costos totales (línea roja). El área sombreada representa el arrastre acumulado: si está por encima de cero es superávit, por debajo es déficit.',
    agingGastos: 'Desglosa los gastos fijos pendientes de pago organizados por tiempo de vencimiento. Ayuda a identificar deuda atrasada o próxima a vencer.',
    proyeccionEgresos: 'Muestra los compromisos de pago futuros ya asumidos (costos fijos, impuestos, cuotas) distribuidos en los próximos 30, 60 y 90 días para previsibilidad del flujo de caja.',
    costosDirectos: 'Visualiza la proporción de cada categoría de costo directo (materiales, mano de obra, viáticos, etc.) respecto al total de costos directos de las operaciones.',
    topOrdenes: 'Lista las órdenes de servicio que generaron mayor ganancia neta en el período evaluado, descontando sus costos directos asociados.',
    bottomOrdenes: 'Identifica las órdenes de servicio con menor margen de ganancia o pérdida, lo cual requiere atención para optimizar presupuestos futuros.',
    distribucionIngresos: 'Compara los ingresos facturados o presupuestados (Esperado) contra los cobros reales (Real) según diferentes conceptos de facturación.',
    patrimonioActivos: 'Detalla el valor de los bienes de capital adquiridos por la empresa (vehículos, maquinaria, equipos) basados en su precio histórico de compra.'
  };

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

  constructor(
    private dashboardService: FinancialDashboardService,
    private cdr: ChangeDetectorRef,
    public empresaConfig: EmpresaConfigService,
    private sanitizer: DomSanitizer
  ) {}

  safeLogoSvg = computed(() => {
    const svg = this.empresaConfig.empresaActual()?.logoSvg;
    if (!svg) return null;
    const base64 = btoa(unescape(encodeURIComponent(svg)));
    return this.sanitizer.bypassSecurityTrustResourceUrl(`data:image/svg+xml;base64,${base64}`);
  });

  ngOnInit(): void {
    this.loadAllData();
  }

  loadAllData(): void {
    this.isLoading = true;
    this.lastUpdated = new Date();

    // 1. KPIs
    this.dashboardService.getKpis().subscribe({
      next: res => { this.kpis = res; this.cdr.detectChanges(); },
      error: err => { console.error('Error fetching financial KPIs', err); this.cdr.detectChanges(); }
    });

    // 2. Gauges
    this.dashboardService.getMonthlyCoverageGauge().subscribe({
      next: res => { this.coverageGauge = res; this.cdr.detectChanges(); },
      error: err => { console.error('Error fetching coverage gauge', err); this.cdr.detectChanges(); }
    });

    this.dashboardService.getAverageOrderMargin(3).subscribe({
      next: res => { this.averageMargin = res; this.cdr.detectChanges(); },
      error: err => { console.error('Error fetching average order margin', err); this.cdr.detectChanges(); }
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
        this.cdr.detectChanges();
      },
      error: err => { console.error('Error fetching fixed costs aging', err); this.cdr.detectChanges(); }
    });

    this.dashboardService.getCommittedExpensesProjection().subscribe({
      next: res => { this.committedExpenses = res; this.cdr.detectChanges(); },
      error: err => { console.error('Error fetching committed expenses', err); this.cdr.detectChanges(); }
    });

    // 5. Rentabilidad
    this.dashboardService.getProfitability().subscribe({
      next: res => { this.profitability = res; this.cdr.detectChanges(); },
      error: err => { console.error('Error fetching profitability', err); this.cdr.detectChanges(); }
    });

    // 6. Distribución de Ingresos
    this.dashboardService.getDistributionSummary().subscribe({
      next: res => { this.distribution = res; this.cdr.detectChanges(); },
      error: err => { console.error('Error fetching distribution summary', err); this.cdr.detectChanges(); }
    });

    // 7. Costos directos
    this.dashboardService.getDirectCostsBreakdown().subscribe({
      next: res => {
        this.directCosts = res;
        this.costCategorySlices = res.byCategory.map(c => ({
          label: c.categoryName,
          value: c.totalAmount
        }));
        this.cdr.detectChanges();
      },
      error: err => { console.error('Error fetching direct costs breakdown', err); this.cdr.detectChanges(); }
    });

    // 8. Activos y evolución
    this.dashboardService.getAssetsValuation().subscribe({
      next: res => {
        this.assetsValuation = res;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: err => {
        console.error('Error fetching assets valuation', err);
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });

    this.dashboardService.getFixedCostsEvolution(this.selectedPeriod).subscribe({
      next: res => { this.fixedCostsEvolution = res; this.cdr.detectChanges(); },
      error: err => { console.error('Error fetching fixed costs evolution', err); this.cdr.detectChanges(); }
    });
  }

  loadCoverageReport(): void {
    this.dashboardService.getMonthlyCoverageReport(this.selectedPeriod).subscribe({
      next: res => { this.coverageReportData = res; this.cdr.detectChanges(); },
      error: err => { console.error('Error fetching monthly coverage report', err); this.cdr.detectChanges(); }
    });
  }

  onPeriodChange(months: number): void {
    this.selectedPeriod = months;
    this.loadCoverageReport();
    this.dashboardService.getFixedCostsEvolution(months).subscribe({
      next: res => { this.fixedCostsEvolution = res; this.cdr.detectChanges(); },
      error: err => { console.error('Error fetching fixed costs evolution', err); this.cdr.detectChanges(); }
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
