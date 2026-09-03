import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-sparkline-card',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatTooltipModule, MatButtonModule],
  template: `
    <mat-card class="kpi-card" [ngClass]="semanticState || 'neutral'">
      <div class="kpi-header">
        <div class="kpi-title-area">
          <span class="kpi-title">{{ title }}</span>
          <span *ngIf="subtitle" class="kpi-subtitle">{{ subtitle }}</span>
        </div>
        <div class="kpi-icon-box" [style.background-color]="iconBgColor">
          <mat-icon [style.color]="iconColor">{{ icon || 'analytics' }}</mat-icon>
        </div>
      </div>

      <div class="kpi-body">
        <div class="kpi-value-container">
          <span class="kpi-value" [style.color]="iconColor">{{ formattedValue }}</span>
          <span *ngIf="unit" class="kpi-unit">{{ unit }}</span>
        </div>

        <div *ngIf="badgeText" class="kpi-badge" [ngClass]="semanticState">
          <mat-icon class="badge-icon">{{ badgeIcon }}</mat-icon>
          <span>{{ badgeText }}</span>
        </div>
      </div>

      <div class="kpi-help-button" *ngIf="helpText">
        <button mat-icon-button [matTooltip]="helpText" matTooltipPosition="above" matTooltipClass="custom-help-tooltip">
          <mat-icon>help_outline</mat-icon>
        </button>
      </div>
    </mat-card>
  `,
  styles: [`
    .kpi-card {
      padding: 18px 20px 14px 20px;
      border-radius: 14px;
      position: relative;
      overflow: hidden;
      box-shadow: 0 4px 18px rgba(0, 0, 0, 0.05);
      background: #ffffff;
      transition: transform 0.2s ease, box-shadow 0.2s ease;
      border: 1px solid #edf2f7;
    }
    .kpi-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
    }
    .kpi-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 12px;
    }
    .kpi-title-area {
      display: flex;
      flex-direction: column;
    }
    .kpi-title {
      font-size: 13px;
      font-weight: 600;
      color: #64748b;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .kpi-subtitle {
      font-size: 11px;
      color: #94a3b8;
      margin-top: 2px;
    }
    .kpi-icon-box {
      width: 38px;
      height: 38px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .kpi-icon-box mat-icon {
      font-size: 20px;
      width: 20px;
      height: 20px;
    }
    .kpi-body {
      display: flex;
      align-items: baseline;
      justify-content: space-between;
      margin-bottom: 8px;
    }
    .kpi-value-container {
      display: flex;
      align-items: baseline;
      gap: 4px;
    }
    .kpi-value {
      font-size: 56px;
      font-weight: 700;
      line-height: 1.1;
    }
    .kpi-unit {
      font-size: 13px;
      font-weight: 600;
      color: #64748b;
    }
    .kpi-badge {
      font-size: 11px;
      font-weight: 600;
      padding: 3px 8px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      gap: 3px;
    }
    .badge-icon {
      font-size: 14px;
      width: 14px;
      height: 14px;
    }
    .kpi-badge.positive { background: #dcfce7; color: #15803d; }
    .kpi-badge.negative { background: #fee2e2; color: #b91c1c; }
    .kpi-badge.warning { background: #fef3c7; color: #b45309; }
    .kpi-badge.neutral { background: #f1f5f9; color: #475569; }

    .kpi-help-button {
      position: absolute;
      bottom: 4px;
      right: 4px;
      transform: scale(0.8);
      opacity: 0.5;
    }
    .kpi-help-button:hover {
      opacity: 1;
    }
  `]
})
export class SparklineCardComponent {
  @Input() title: string = '';
  @Input() subtitle?: string;
  @Input() value: number | string = 0;
  @Input() unit?: string;
  @Input() trend: number[] = [];
  @Input() icon: string = 'analytics';
  @Input() iconColor: string = '#0284c7';
  @Input() iconBgColor: string = '#e0f2fe';
  @Input() sparkColor: string = '#0284c7';
  @Input() semanticState?: 'positive' | 'negative' | 'warning' | 'neutral' = 'neutral';
  @Input() badgeText?: string;
  @Input() badgeIcon: string = 'trending_flat';
  @Input() helpText?: string;

  get formattedValue(): string {
    if (typeof this.value === 'number') {
      return this.value.toLocaleString();
    }
    return this.value || '0';
  }
}
