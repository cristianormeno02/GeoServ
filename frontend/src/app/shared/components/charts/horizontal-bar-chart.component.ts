import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';

export interface HorizontalBarItem {
  label: string;
  value: number;
  secondaryLabel?: string;
  color?: string;
}

@Component({
  selector: 'app-horizontal-bar-chart',
  standalone: true,
  imports: [CommonModule, MatCardModule],
  template: `
    <mat-card class="hbar-card">
      <div class="hbar-header">
        <span class="hbar-title">{{ title }}</span>
        <span class="hbar-badge" *ngIf="items.length > 0">{{ items.length }} asignados</span>
      </div>

      <div class="hbar-list" *ngIf="items.length > 0; else emptyState">
        <div *ngFor="let item of items" class="hbar-row">
          <div class="hbar-label-col">
            <span class="item-name" [title]="item.label">{{ item.label }}</span>
            <span class="item-sec" *ngIf="item.secondaryLabel">{{ item.secondaryLabel }}</span>
          </div>

          <div class="hbar-track">
            <div
              class="hbar-fill"
              [style.width.%]="getPercentage(item.value)"
              [style.background-color]="item.color || '#3b82f6'"
            ></div>
          </div>

          <div class="hbar-value-col">
            <span class="item-val">{{ item.value }}</span>
          </div>
        </div>
      </div>

      <ng-template #emptyState>
        <div class="empty-state">
          <span>No hay datos de carga registrados</span>
        </div>
      </ng-template>
    </mat-card>
  `,
  styles: [`
    .hbar-card {
      padding: 18px 20px 14px 20px;
      border-radius: 14px;
      background: #ffffff;
      box-shadow: 0 4px 18px rgba(0, 0, 0, 0.05);
      border: 1px solid #edf2f7;
      height: 100%;
      display: flex;
      flex-direction: column;
    }
    .hbar-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 14px;
    }
    .hbar-title {
      font-size: 13px;
      font-weight: 600;
      color: #64748b;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .hbar-badge {
      font-size: 11px;
      font-weight: 600;
      color: #3b82f6;
      background: #eff6ff;
      padding: 2px 8px;
      border-radius: 10px;
    }
    .hbar-list {
      display: flex;
      flex-direction: column;
      gap: 10px;
      flex: 1;
      max-height: 220px;
      overflow-y: auto;
    }
    .hbar-row {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .hbar-label-col {
      width: 120px;
      flex-shrink: 0;
      display: flex;
      flex-direction: column;
    }
    .item-name {
      font-size: 12px;
      font-weight: 600;
      color: #1e293b;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .item-sec {
      font-size: 10px;
      color: #94a3b8;
    }
    .hbar-track {
      flex: 1;
      height: 10px;
      background: #f1f5f9;
      border-radius: 5px;
      overflow: hidden;
    }
    .hbar-fill {
      height: 100%;
      border-radius: 5px;
      transition: width 0.6s ease;
    }
    .hbar-value-col {
      width: 28px;
      text-align: right;
      flex-shrink: 0;
    }
    .item-val {
      font-size: 12px;
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
export class HorizontalBarChartComponent {
  @Input() title: string = '';
  @Input() items: HorizontalBarItem[] = [];

  get maxValue(): number {
    if (!this.items || this.items.length === 0) return 1;
    const max = Math.max(...this.items.map(i => i.value));
    return max === 0 ? 1 : max;
  }

  getPercentage(value: number): number {
    return Math.round((value / this.maxValue) * 100);
  }
}
