import { Component, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDividerModule } from '@angular/material/divider';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { DonutChartComponent, DonutSlice } from '../../shared/components/charts/donut-chart.component';
import { GeneralDashboardService } from './services/general-dashboard.service';
import { EmpresaConfigService } from '../../core/services/empresa-config.service';
import { AuthService } from '../../core/services/auth.service';
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

  safeLogoSvg = computed<SafeResourceUrl | null>(() => {
    try {
      const svg = this.empresaConfig.empresaActual()?.logoSvg;
      if (!svg) return null;
      if (svg.startsWith('data:') || svg.startsWith('http') || svg.startsWith('/')) {
        return this.sanitizer.bypassSecurityTrustResourceUrl(svg);
      }
      const base64 = btoa(unescape(encodeURIComponent(svg)));
      return this.sanitizer.bypassSecurityTrustResourceUrl(`data:image/svg+xml;base64,${base64}`);
    } catch (e) {
      console.warn('Error sanitizing logo SVG', e);
      return null;
    }
  });

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
    'Urgente': '#dc2626'
  };

  get displayName(): string {
    const fromProfile = this.profile?.responsibleName || this.profile?.userName;
    if (fromProfile && fromProfile.trim().length > 0 && fromProfile !== 'Usuario') {
      return fromProfile;
    }
    const fromAuth = this.authService.getUserName();
    if (fromAuth && fromAuth.trim().length > 0) {
      return fromAuth;
    }
    return fromProfile || 'Usuario';
  }

  constructor(
    private dashboardService: GeneralDashboardService,
    public empresaConfig: EmpresaConfigService,
    public authService: AuthService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    if (!this.empresaConfig.empresaActual()) {
      this.empresaConfig.cargarConfiguracion().subscribe({
        error: (e) => console.warn('No se pudo cargar config de empresa', e)
      });
    }
    this.loadData();
  }

  loadData(): void {
    this.isLoading = true;
    this.lastUpdated = new Date();

    this.dashboardService.getProfile().subscribe({
      next: res => this.profile = res,
      error: err => {
        console.error('Error fetching profile', err);
        this.profile = { hasResponsible: true, userName: 'Usuario' };
      }
    });

    this.dashboardService.getKpis().subscribe({
      next: kpis => {
        this.kpis = kpis;
        this.statusSlices = (kpis?.byStatus ?? []).map(s => ({
          label: s.statusName,
          value: s.count,
          color: this.statusColors[s.statusName]
        }));
        this.prioritySlices = (kpis?.byPriority ?? []).map(p => ({
          label: p.priority,
          value: p.count,
          color: this.priorityColors[p.priority]
        }));
      },
      error: err => console.error('Error fetching KPIs', err)
    });

    this.dashboardService.getActiveOrders().subscribe({
      next: orders => this.activeOrders = orders ?? [],
      error: err => console.error('Error fetching active orders', err)
    });

    this.dashboardService.getPendingActivities().subscribe({
      next: activities => this.pendingActivities = activities ?? [],
      error: err => console.error('Error fetching pending activities', err)
    });

    this.dashboardService.getRecentObservations().subscribe({
      next: observations => {
        this.recentObservations = observations ?? [];
        this.isLoading = false;
      },
      error: err => {
        console.error('Error fetching recent observations', err);
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

  formatDate(dateStr?: string): string {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  }

  formatRelativeDate(dateStr: string): string {
    if (!dateStr) return '—';
    const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 86400000);
    if (isNaN(diff)) return '—';
    if (diff === 0) return 'hoy';
    if (diff === 1) return 'ayer';
    return `hace ${diff} días`;
  }

  getInitials(name?: string): string {
    if (!name) return 'U';
    return name.trim().split(' ').filter(p => p.length > 0).slice(0, 2).map(p => p[0]).join('').toUpperCase();
  }
}
