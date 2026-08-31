import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDividerModule } from '@angular/material/divider';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { DonutChartComponent, DonutSlice } from '../../shared/components/charts/donut-chart.component';
import { GeneralDashboardService } from './services/general-dashboard.service';
import {
  UserProfileResponse,
  GeneralKpisResponse,
  ActiveOrderItem,
  PendingActivityItem,
  RecentObservationItem
} from './models/general-dashboard.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressBarModule,
    MatChipsModule,
    MatTooltipModule,
    MatDividerModule,
    DonutChartComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  isLoading = false;
  lastUpdated: Date = new Date();

  profile: UserProfileResponse | null = null;
  kpis: GeneralKpisResponse | null = null;
  activeOrders: ActiveOrderItem[] = [];
  pendingActivities: PendingActivityItem[] = [];
  recentObservations: RecentObservationItem[] = [];

  statusSlices: DonutSlice[] = [];
  prioritySlices: DonutSlice[] = [];

  private readonly statusColors: Record<string, string> = {
    'Alta': '#94a3b8',
    'Presupuestada': '#60a5fa',
    'Aprobada': '#34d399',
    'Iniciada': '#f59e0b',
    'Entregada': '#a78bfa',
    'Cobrada': '#10b981',
    'Cancelada': '#f87171',
  };

  private readonly priorityColors: Record<string, string> = {
    'Alta': '#ef4444',
    'Media': '#f59e0b',
    'Baja': '#22c55e',
  };

  constructor(private dashboardService: GeneralDashboardService) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.isLoading = true;
    this.lastUpdated = new Date();

    this.dashboardService.getProfile().pipe(
      catchError(err => {
        console.error('Error cargando perfil', err);
        return of({ hasResponsible: false, userName: 'Usuario' });
      })
    ).subscribe({
      next: (profile) => {
        this.profile = profile;
        if (!profile.hasResponsible) {
          this.isLoading = false;
          return;
        }
        this.loadDashboardData();
      }
    });
  }

  private loadDashboardData(): void {
    forkJoin({
      kpis: this.dashboardService.getKpis().pipe(catchError(e => { console.error('Error KPIs', e); return of({ hasResponsible: true } as GeneralKpisResponse); })),
      orders: this.dashboardService.getActiveOrders().pipe(catchError(e => { console.error('Error órdenes activas', e); return of([] as ActiveOrderItem[]); })),
      activities: this.dashboardService.getPendingActivities().pipe(catchError(e => { console.error('Error actividades', e); return of([] as PendingActivityItem[]); })),
      observations: this.dashboardService.getRecentObservations().pipe(catchError(e => { console.error('Error observaciones', e); return of([] as RecentObservationItem[]); }))
    }).subscribe({
      next: ({ kpis, orders, activities, observations }) => {
        this.kpis = kpis;
        this.statusSlices = (kpis.byStatus ?? []).map(s => ({
          label: s.statusName,
          value: s.count,
          color: this.statusColors[s.statusName]
        }));
        this.prioritySlices = (kpis.byPriority ?? []).map(p => ({
          label: p.priority,
          value: p.count,
          color: this.priorityColors[p.priority]
        }));
        this.activeOrders = orders;
        this.pendingActivities = activities;
        this.recentObservations = observations;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  getAlertIcon(level: string): string {
    if (level === 'overdue') return 'error';
    if (level === 'warning') return 'warning';
    return 'check_circle';
  }

  getAlertColor(level: string): string {
    if (level === 'overdue') return '#ef4444';
    if (level === 'warning') return '#f59e0b';
    return '#10b981';
  }

  getStatusColor(statusName: string): string {
    return this.statusColors[statusName] ?? '#94a3b8';
  }

  getPriorityColor(priority: string): string {
    return this.priorityColors[priority] ?? '#94a3b8';
  }

  getProgressColor(pct: number): string {
    if (pct >= 80) return 'accent';
    if (pct >= 40) return 'primary';
    return 'warn';
  }

  formatDate(dateStr?: string): string {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  }

  formatRelativeDate(dateStr: string): string {
    const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 86400000);
    if (diff === 0) return 'hoy';
    if (diff === 1) return 'ayer';
    return `hace ${diff} días`;
  }

  getInitials(name?: string): string {
    if (!name) return 'U';
    return name.trim().split(' ').filter(p => p.length > 0).slice(0, 2).map(p => p[0]).join('').toUpperCase();
  }
}
