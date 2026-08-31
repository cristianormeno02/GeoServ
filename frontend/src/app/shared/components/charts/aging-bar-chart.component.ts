import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';

export interface AgingBucket {
  range: string;
  count: number;
  totalPendingAmount?: number;
  color?: string;
}

@Component({
  selector: 'app-aging-bar-chart',
  standalone: true,
  imports: [CommonModule, MatCardModule],
  template: `
    <mat-card class="aging-card">
      <div class="aging-header">
        <span class="aging-title">{{ title }}</span>
        <span class="aging-badge" *ngIf="totalAmountText">{{ totalAmountText }}</span>
      </div>

      <div class="aging-bars-container" *ngIf="buckets.length > 0; else emptyState">
        <div *ngFor="let bucket of buckets; let i = index" class="aging-row">
          <div class="aging-label-col">
            <span class="range-name">{{ bucket.range }}</span>
            <span class="range-amount" *ngIf="bucket.totalPendingAmount !== undefined">
              {{ formatCurrency(bucket.totalPendingAmount) }}
            </span>
          </div>

          <div class="aging-bar-wrapper">
            <div
              class="aging-bar-fill"
              [style.width.%]="getBarPercentage(bucket.count)"
              [style.background-color]="getBucketColor(bucket, i)"
            ></div>
          </div>

          <div class="aging-count-col">
            <span class="range-count">{{ bucket.count }}</span>
          </div>
        </div>
      </div>

      <ng-template #emptyState>
        <div class="empty-state">
          <span>No hay registros pendientes de antigüedad</span>
        </div>
      </ng-template>
    </mat-card>
  `,
  styles: [`
    .aging-card {
      padding: 18px 20px 14px 20px;
      border-radius: 14px;
      background: #ffffff;
      box-shadow: 0 4px 18px rgba(0, 0, 0, 0.05);
      border: 1px solid #edf2f7;
      height: 100%;
      display: flex;
      flex-direction: column;
    }
    .aging-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
    }
    .aging-title {
      font-size: 13px;
      font-weight: 600;
      color: #64748b;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .aging-badge {
      font-size: 12px;
      font-weight: 700;
      color: #b91c1c;
      background: #fee2e2;
      padding: 2px 10px;
      border-radius: 10px;
    }
    .aging-bars-container {
      display: flex;
      flex-direction: column;
      gap: 12px;
      flex: 1;
      justify-content: center;
    }
    .aging-row {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .aging-label-col {
      width: 100px;
      display: flex;
      flex-direction: column;
      flex-shrink: 0;
    }
    .range-name {
      font-size: 12px;
      font-weight: 600;
      color: #1e293b;
    }
    .range-amount {
      font-size: 11px;
      color: #64748b;
    }
    .aging-bar-wrapper {
      flex: 1;
      height: 12px;
      background: #f1f5f9;
      border-radius: 6px;
      overflow: hidden;
    }
    .aging-bar-fill {
      height: 100%;
      border-radius: 6px;
      transition: width 0.6s ease;
    }
    .aging-count-col {
      width: 32px;
      text-align: right;
      flex-shrink: 0;
    }
    .range-count {
      font-size: 13px;
      font-weight: 700;
      color: #334155;
    }
    .empty-state {
      padding: 30px;
      text-align: center;
      color: #94a3b8;
      font-size: 12px;
    }
  `]
})
export class AgingBarChartComponent {
  @Input() title: string = '';
  @Input() totalAmountText?: string;
  @Input() buckets: AgingBucket[] = [];

  private riskColors = ['#10b981', '#f59e0b', '#f97316', '#ef4444'];

  get maxCount(): number {
    if (!this.buckets || this.buckets.length === 0) return 1;
    const max = Math.max(...this.buckets.map(b => b.count));
    return max === 0 ? 1 : max;
  }

  getBarPercentage(count: number): number {
    return Math.round((count / this.maxCount) * 100);
  }

  getBucketColor(bucket: AgingBucket, index: number): string {
    if (bucket.color) return bucket.color;
    return this.riskColors[index % this.riskColors.length];
  }

  formatCurrency(amount: number): string {
    return '$ ' + amount.toLocaleString('es-AR', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  }
}
