import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-gauge-chart',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule],
  template: `
    <mat-card class="gauge-card">
      <div class="gauge-header">
        <span class="gauge-title">{{ title }}</span>
        <span *ngIf="statusLabel" class="gauge-status-badge" [ngClass]="statusClass">
          {{ statusLabel }}
        </span>
      </div>

      <div class="gauge-svg-wrapper">
        <svg viewBox="0 0 200 115" class="gauge-svg">
          <!-- Background arc -->
          <path
            d="M 25 100 A 75 75 0 0 1 175 100"
            fill="none"
            stroke="#f1f5f9"
            stroke-width="16"
            stroke-linecap="round"
          />
          <!-- Value arc -->
          <path
            [attr.d]="valueArcPath"
            fill="none"
            [attr.stroke]="gaugeColor"
            stroke-width="16"
            stroke-linecap="round"
            class="gauge-value-path"
          />
        </svg>

        <div class="gauge-center-text">
          <span class="gauge-main-value">{{ displayPercentage }}%</span>
          <span class="gauge-sub-value" *ngIf="subtitle">{{ subtitle }}</span>
        </div>
      </div>

      <div class="gauge-footer" *ngIf="leftLabel || rightLabel">
        <span class="limit-label">{{ leftLabel || '0%' }}</span>
        <span class="limit-label">{{ rightLabel || '100%' }}</span>
      </div>
    </mat-card>
  `,
  styles: [`
    .gauge-card {
      padding: 18px 20px 14px 20px;
      border-radius: 14px;
      background: #ffffff;
      box-shadow: 0 4px 18px rgba(0, 0, 0, 0.05);
      border: 1px solid #edf2f7;
      display: flex;
      flex-direction: column;
      height: 100%;
    }
    .gauge-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;
    }
    .gauge-title {
      font-size: 13px;
      font-weight: 600;
      color: #64748b;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .gauge-status-badge {
      font-size: 11px;
      font-weight: 600;
      padding: 2px 8px;
      border-radius: 10px;
    }
    .status-normal { background: #dcfce7; color: #15803d; }
    .status-warning { background: #fef3c7; color: #b45309; }
    .status-danger { background: #fee2e2; color: #b91c1c; }
    .status-info { background: #e0f2fe; color: #0369a1; }

    .gauge-svg-wrapper {
      position: relative;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 4px 0;
    }
    .gauge-svg {
      width: 100%;
      max-width: 220px;
      height: auto;
      overflow: visible;
    }
    .gauge-value-path {
      transition: stroke-dashoffset 0.8s ease, stroke 0.3s ease;
    }
    .gauge-center-text {
      position: absolute;
      bottom: 6px;
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
    }
    .gauge-main-value {
      font-size: 26px;
      font-weight: 700;
      color: #1e293b;
      line-height: 1;
    }
    .gauge-sub-value {
      font-size: 11px;
      color: #64748b;
      margin-top: 4px;
      font-weight: 500;
    }
    .gauge-footer {
      display: flex;
      justify-content: space-between;
      margin-top: 2px;
      padding: 0 10px;
    }
    .limit-label {
      font-size: 10px;
      color: #94a3b8;
      font-weight: 500;
    }
  `]
})
export class GaugeChartComponent implements OnChanges {
  @Input() title: string = '';
  @Input() value: number = 0; // percentage 0 to 100 (or higher)
  @Input() subtitle?: string;
  @Input() statusLabel?: string;
  @Input() semanticStatus?: 'normal' | 'warning' | 'danger' | 'info' | string = 'normal';
  @Input() leftLabel?: string = '0%';
  @Input() rightLabel?: string = '100%';
  @Input() customColor?: string;

  valueArcPath: string = '';

  get displayPercentage(): number {
    return Math.round(this.value || 0);
  }

  get statusClass(): string {
    const s = (this.semanticStatus || '').toLowerCase();
    if (s.includes('sobrecarg') || s.includes('danger') || s.includes('critico') || s.includes('retraso')) return 'status-danger';
    if (s.includes('alerta') || s.includes('warning') || s.includes('atencion')) return 'status-warning';
    if (s.includes('info') || s.includes('neutro')) return 'status-info';
    return 'status-normal';
  }

  get gaugeColor(): string {
    if (this.customColor) return this.customColor;
    const s = this.statusClass;
    if (s === 'status-danger') return '#ef4444';
    if (s === 'status-warning') return '#f59e0b';
    if (s === 'status-info') return '#0284c7';
    return '#10b981';
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.calculateArc();
  }

  private calculateArc(): void {
    const clamped = Math.max(0, Math.min(100, this.value || 0));
    const angle = (clamped / 100) * 180; // 0 to 180 deg
    const rad = (180 - angle) * (Math.PI / 180);
    const radius = 75;
    const cx = 100;
    const cy = 100;

    const x = cx + radius * Math.cos(rad);
    const y = cy - radius * Math.sin(rad);

    if (clamped <= 0.1) {
      this.valueArcPath = 'M 25 100 A 75 75 0 0 1 25.1 100';
    } else {
      this.valueArcPath = `M 25 100 A 75 75 0 0 1 ${x.toFixed(1)} ${y.toFixed(1)}`;
    }
  }
}
