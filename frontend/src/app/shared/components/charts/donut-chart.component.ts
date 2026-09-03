import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';

export interface DonutSlice {
  label: string;
  value: number;
  percentage?: number;
  color?: string;
  dashArray?: string;
  dashOffset?: number;
}

@Component({
  selector: 'app-donut-chart',
  standalone: true,
  imports: [CommonModule, MatCardModule],
  template: `
    <mat-card class="donut-card">
      <div class="donut-header">
        <span class="donut-title">{{ title }}</span>
        <span class="donut-total" *ngIf="totalCount > 0">Total: <ng-container *ngIf="isCurrency">$</ng-container>{{ totalCount | number:'1.0-0' }}</span>
      </div>

      <div class="donut-content" *ngIf="slices.length > 0; else emptyState">
        <div class="donut-svg-wrapper">
          <svg viewBox="0 0 100 100" class="donut-svg">
            <circle
              *ngFor="let slice of processedSlices; let i = index"
              cx="50"
              cy="50"
              r="38"
              fill="transparent"
              [attr.stroke]="slice.color"
              stroke-width="16"
              [attr.stroke-dasharray]="slice.dashArray"
              [attr.stroke-dashoffset]="slice.dashOffset"
              class="donut-segment"
            />
          </svg>
          <div class="donut-center-label">
            <span class="center-count"><ng-container *ngIf="isCurrency">$</ng-container>{{ totalCount | number:'1.0-0' }}</span>
            <span class="center-text">{{ centerSubtitle || 'Órdenes' }}</span>
          </div>
        </div>

        <div class="donut-legend">
          <div *ngFor="let item of processedSlices" class="legend-row">
            <div class="legend-color-dot" [style.background-color]="item.color"></div>
            <span class="legend-label" [title]="item.label">{{ item.label }}</span>
            <span class="legend-value"><ng-container *ngIf="isCurrency">$</ng-container>{{ item.value | number:'1.0-0' }} ({{ item.percentage }}%)</span>
          </div>
        </div>
      </div>

      <ng-template #emptyState>
        <div class="empty-state">
          <span>No hay datos para mostrar en este período</span>
        </div>
      </ng-template>
    </mat-card>
  `,
  styles: [`
    .donut-card {
      padding: 18px 20px 14px 20px;
      border-radius: 14px;
      background: #ffffff;
      box-shadow: 0 4px 18px rgba(0, 0, 0, 0.05);
      border: 1px solid #edf2f7;
      height: 100%;
      display: flex;
      flex-direction: column;
    }
    .donut-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;
    }
    .donut-title {
      font-size: 13px;
      font-weight: 600;
      color: #64748b;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .donut-total {
      font-size: 12px;
      font-weight: 600;
      color: #0284c7;
      background: #e0f2fe;
      padding: 2px 8px;
      border-radius: 10px;
    }
    .donut-content {
      display: flex;
      align-items: center;
      justify-content: space-around;
      gap: 16px;
      flex: 1;
    }
    .donut-svg-wrapper {
      position: relative;
      width: 120px;
      height: 120px;
      flex-shrink: 0;
    }
    .donut-svg {
      width: 100%;
      height: 100%;
      transform: rotate(-90deg);
      border-radius: 50%;
    }
    .donut-segment {
      transition: stroke-dashoffset 0.6s ease, stroke-dasharray 0.6s ease;
    }
    .donut-center-label {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
    }
    .center-count {
      font-size: 18px;
      font-weight: 700;
      color: #1e293b;
      line-height: 1;
    }
    .center-text {
      font-size: 9px;
      color: #64748b;
      font-weight: 600;
      text-transform: uppercase;
      margin-top: 2px;
    }
    .donut-legend {
      display: flex;
      flex-direction: column;
      gap: 8px;
      flex: 1;
      max-height: 140px;
      overflow-y: auto;
    }
    .legend-row {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 12px;
    }
    .legend-color-dot {
      width: 10px;
      height: 10px;
      border-radius: 3px;
      flex-shrink: 0;
    }
    .legend-label {
      color: #334155;
      font-weight: 500;
      flex: 1;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .legend-value {
      color: #64748b;
      font-weight: 600;
      white-space: nowrap;
    }
    .empty-state {
      padding: 30px;
      text-align: center;
      color: #94a3b8;
      font-size: 12px;
    }
  `]
})
export class DonutChartComponent implements OnChanges {
  @Input() title: string = '';
  @Input() centerSubtitle?: string = 'Total';
  @Input() slices: DonutSlice[] = [];
  @Input() isCurrency: boolean = false;

  processedSlices: DonutSlice[] = [];
  totalCount: number = 0;

  private defaultPalette = [
    '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16', '#f97316'
  ];

  ngOnChanges(changes: SimpleChanges): void {
    this.calculateSlices();
  }

  private calculateSlices(): void {
    if (!this.slices || this.slices.length === 0) {
      this.processedSlices = [];
      this.totalCount = 0;
      return;
    }

    this.totalCount = this.slices.reduce((sum, s) => sum + s.value, 0);
    const circumference = 2 * Math.PI * 38; // ~238.76

    let accumulatedOffset = 0;

    this.processedSlices = this.slices.map((slice, idx) => {
      const percentage = this.totalCount > 0 ? Math.round((slice.value / this.totalCount) * 100) : 0;
      const strokeLength = (percentage / 100) * circumference;
      const spaceLength = circumference - strokeLength;
      const color = slice.color || this.defaultPalette[idx % this.defaultPalette.length];

      const processed: DonutSlice = {
        ...slice,
        percentage,
        color,
        dashArray: `${strokeLength} ${spaceLength}`,
        dashOffset: -accumulatedOffset
      };

      accumulatedOffset += strokeLength;
      return processed;
    });
  }
}
