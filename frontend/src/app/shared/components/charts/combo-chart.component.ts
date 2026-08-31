import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

export interface MonthlyCoverageItem {
  periodo: string; // YYYY-MM
  ingresos: number;
  gastosFijos: number;
  gastosDirectos: number;
  honorarios: number;
  resultadoMes: number;
  saldoAcumulado: number;
}

interface ChartBarPoint {
  periodo: string;
  x: number;
  ingresosHeight: number;
  ingresosY: number;
  costosHeight: number;
  costosY: number;
  saldoY: number;
  saldoX: number;
  raw: MonthlyCoverageItem;
  totalCostos: number;
}

@Component({
  selector: 'app-combo-chart',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatTooltipModule],
  template: `
    <mat-card class="combo-card">
      <div class="combo-header">
        <div class="header-titles">
          <div class="title-with-badge">
            <span class="combo-title">{{ title }}</span>
            <span class="coverage-badge" [ngClass]="finalBalance >= 0 ? 'badge-positive' : 'badge-negative'">
              Saldo Acumulado: {{ formatCurrency(finalBalance) }}
            </span>
          </div>
          <span class="combo-subtitle" *ngIf="subtitle">{{ subtitle }}</span>
        </div>

        <div class="combo-legend">
          <div class="legend-item">
            <span class="legend-box income-box"></span>
            <span>Ingresos ($)</span>
          </div>
          <div class="legend-item">
            <span class="legend-box cost-box"></span>
            <span>Costos Totales ($)</span>
          </div>
          <div class="legend-item">
            <span class="legend-line balance-line"></span>
            <span>Saldo Acumulado ($)</span>
          </div>
        </div>
      </div>

      <div class="combo-chart-wrapper" *ngIf="data.length > 0; else emptyState">
        <svg viewBox="0 0 700 240" class="combo-svg" preserveAspectRatio="none">
          <!-- Grid Lines & Y Axis Labels -->
          <g class="grid-lines">
            <line *ngFor="let tick of yTicks" x1="50" [attr.y1]="tick.y" x2="680" [attr.y2]="tick.y" stroke="#f1f5f9" stroke-dasharray="3,3" />
            <text *ngFor="let tick of yTicks" x="42" [attr.y]="tick.y + 4" text-anchor="end" class="axis-text">{{ tick.label }}</text>
          </g>

          <!-- Zero line -->
          <line x1="50" [attr.y1]="zeroY" x2="680" [attr.y2]="zeroY" stroke="#cbd5e1" stroke-width="1.2" />

          <!-- Bars -->
          <g *ngFor="let p of chartPoints" class="bar-group">
            <!-- Ingresos bar -->
            <rect
              [attr.x]="p.x - 14"
              [attr.y]="p.ingresosY"
              width="12"
              [attr.height]="p.ingresosHeight"
              rx="3"
              fill="#0ea5e9"
              class="bar-rect"
            >
              <title>{{ p.periodo }}&#10;Ingresos: {{ formatCurrency(p.raw.ingresos) }}</title>
            </rect>

            <!-- Costos bar -->
            <rect
              [attr.x]="p.x + 2"
              [attr.y]="p.costosY"
              width="12"
              [attr.height]="p.costosHeight"
              rx="3"
              fill="#f97316"
              class="bar-rect"
            >
              <title>{{ p.periodo }}&#10;Costos: {{ formatCurrency(p.totalCostos) }}&#10;(Fijos: {{ formatCurrency(p.raw.gastosFijos) }}, Directos: {{ formatCurrency(p.raw.gastosDirectos) }}, Honorarios: {{ formatCurrency(p.raw.honorarios) }})</title>
            </rect>

            <!-- Period Label -->
            <text [attr.x]="p.x" y="228" text-anchor="middle" class="axis-text period-text">{{ p.periodo }}</text>
          </g>

          <!-- Saldo Acumulado Area / Line -->
          <path [attr.d]="balanceLinePath" fill="none" stroke="#10b981" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />

          <!-- Saldo Points -->
          <circle
            *ngFor="let p of chartPoints"
            [attr.cx]="p.saldoX"
            [attr.cy]="p.saldoY"
            r="4.5"
            [attr.fill]="p.raw.saldoAcumulado >= 0 ? '#10b981' : '#ef4444'"
            stroke="#ffffff"
            stroke-width="2"
            class="point-circle"
          >
            <title>{{ p.periodo }}&#10;Saldo Acumulado: {{ formatCurrency(p.raw.saldoAcumulado) }}&#10;Resultado Mes: {{ formatCurrency(p.raw.resultadoMes) }}</title>
          </circle>
        </svg>
      </div>

      <ng-template #emptyState>
        <div class="empty-state">
          <mat-icon class="empty-icon">bar_chart</mat-icon>
          <span>No hay movimientos registrados para calcular la cobertura en este rango</span>
        </div>
      </ng-template>
    </mat-card>
  `,
  styles: [`
    .combo-card {
      padding: 20px 24px;
      border-radius: 14px;
      background: #ffffff;
      box-shadow: 0 4px 18px rgba(0, 0, 0, 0.05);
      border: 1px solid #edf2f7;
      display: flex;
      flex-direction: column;
    }
    .combo-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 16px;
      flex-wrap: wrap;
      gap: 12px;
    }
    .header-titles {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    .title-with-badge {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .combo-title {
      font-size: 16px;
      font-weight: 700;
      color: #0f172a;
      letter-spacing: -0.3px;
    }
    .coverage-badge {
      font-size: 12px;
      font-weight: 700;
      padding: 3px 10px;
      border-radius: 12px;
    }
    .badge-positive { background: #dcfce7; color: #15803d; }
    .badge-negative { background: #fee2e2; color: #b91c1c; }

    .combo-subtitle {
      font-size: 12px;
      color: #64748b;
    }
    .combo-legend {
      display: flex;
      gap: 16px;
      align-items: center;
    }
    .legend-item {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 12px;
      font-weight: 500;
      color: #475569;
    }
    .legend-box {
      width: 12px;
      height: 12px;
      border-radius: 3px;
    }
    .income-box { background: #0ea5e9; }
    .cost-box { background: #f97316; }
    .legend-line {
      width: 16px;
      height: 3px;
      border-radius: 2px;
      background: #10b981;
    }

    .combo-chart-wrapper {
      position: relative;
      width: 100%;
      height: 240px;
      padding-top: 8px;
    }
    .combo-svg {
      width: 100%;
      height: 100%;
      overflow: visible;
    }
    .axis-text {
      font-size: 10px;
      fill: #94a3b8;
      font-family: inherit;
    }
    .period-text {
      font-weight: 600;
      fill: #475569;
    }
    .bar-rect {
      transition: y 0.5s ease, height 0.5s ease;
      cursor: pointer;
    }
    .bar-rect:hover {
      opacity: 0.85;
    }
    .point-circle {
      cursor: pointer;
      transition: r 0.2s ease;
    }
    .point-circle:hover {
      r: 6.5;
    }
    .empty-state {
      padding: 40px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 8px;
      color: #94a3b8;
      font-size: 13px;
    }
    .empty-icon {
      font-size: 36px;
      width: 36px;
      height: 36px;
      color: #cbd5e1;
    }
  `]
})
export class ComboChartComponent implements OnChanges {
  @Input() title: string = 'Informe de Cobertura Mensual';
  @Input() subtitle: string = 'Ingresos vs Costos Totales con Arrastre de Saldo Acumulado (Único Eje Y)';
  @Input() data: MonthlyCoverageItem[] = [];

  chartPoints: ChartBarPoint[] = [];
  yTicks: { y: number; label: string }[] = [];
  zeroY: number = 200;
  balanceLinePath: string = '';
  finalBalance: number = 0;

  ngOnChanges(changes: SimpleChanges): void {
    this.calculateChart();
  }

  formatCurrency(val: number): string {
    return '$ ' + (val || 0).toLocaleString('es-AR', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  }

  private calculateChart(): void {
    if (!this.data || this.data.length === 0) {
      this.chartPoints = [];
      this.yTicks = [];
      this.balanceLinePath = '';
      this.finalBalance = 0;
      return;
    }

    const last = this.data[this.data.length - 1];
    this.finalBalance = last ? last.saldoAcumulado : 0;

    const values: number[] = [0];
    this.data.forEach(d => {
      const totalCostos = (d.gastosFijos || 0) + (d.gastosDirectos || 0) + (d.honorarios || 0);
      values.push(d.ingresos || 0);
      values.push(totalCostos);
      values.push(d.saldoAcumulado || 0);
    });

    let minVal = Math.min(...values);
    let maxVal = Math.max(...values);

    // Padding
    if (minVal > 0) minVal = 0;
    if (maxVal === 0) maxVal = 100000;
    const range = maxVal - minVal;

    const chartTop = 20;
    const chartBottom = 205;
    const chartHeight = chartBottom - chartTop;

    const getY = (val: number) => {
      const norm = (val - minVal) / (range || 1);
      return chartBottom - norm * chartHeight;
    };

    this.zeroY = getY(0);

    // Y Ticks (4 ticks)
    this.yTicks = [];
    const steps = 4;
    for (let i = 0; i <= steps; i++) {
      const val = minVal + (range / steps) * i;
      this.yTicks.push({
        y: getY(val),
        label: this.formatCompact(val)
      });
    }

    // X coordinates
    const startX = 85;
    const endX = 660;
    const availableWidth = endX - startX;
    const stepX = this.data.length > 1 ? availableWidth / (this.data.length - 1) : availableWidth / 2;

    this.chartPoints = this.data.map((d, idx) => {
      const x = this.data.length === 1 ? startX + availableWidth / 2 : startX + idx * stepX;
      const totalCostos = (d.gastosFijos || 0) + (d.gastosDirectos || 0) + (d.honorarios || 0);

      const ingY = getY(d.ingresos || 0);
      const ingHeight = Math.max(2, this.zeroY - ingY);

      const costY = getY(totalCostos);
      const costHeight = Math.max(2, this.zeroY - costY);

      const saldoY = getY(d.saldoAcumulado || 0);

      return {
        periodo: d.periodo,
        x,
        ingresosHeight: ingHeight,
        ingresosY: ingY,
        costosHeight: costHeight,
        costosY: costY,
        saldoY,
        saldoX: x,
        raw: d,
        totalCostos
      };
    });

    // Generate line path for saldo acumulado
    if (this.chartPoints.length > 0) {
      let path = `M ${this.chartPoints[0].saldoX} ${this.chartPoints[0].saldoY}`;
      for (let i = 1; i < this.chartPoints.length; i++) {
        path += ` L ${this.chartPoints[i].saldoX} ${this.chartPoints[i].saldoY}`;
      }
      this.balanceLinePath = path;
    }
  }

  private formatCompact(val: number): string {
    if (Math.abs(val) >= 1000000) {
      return (val / 1000000).toFixed(1) + 'M';
    }
    if (Math.abs(val) >= 1000) {
      return (val / 1000).toFixed(0) + 'k';
    }
    return val.toFixed(0);
  }
}
