import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDividerModule } from '@angular/material/divider';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { computed } from '@angular/core';

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

  // Nombre a mostrar: prioriza profile del backend, fallback a AuthService (token JWT)
  get displayName(): string {
    // 1. Intentar desde el profile del backend
    if (this.profile) {
      const name = this.profile.responsibleName || this.profile.userName;
      if (name && name.trim().length > 0 && name !== 'Usuario') {
        return name;
      }
    }

    // 2. Fallback: nombre almacenado en AuthService (del login o del token JWT)
    const authName = this.authService.getUserName();
    if (authName && authName.trim().length > 0 && authName !== 'Usuario') {
      return authName;
    }

    // 3. Último fallback
    if (this.profile?.userName && this.profile.userName.trim().length > 0) {
      return this.profile.userName;
    }

    return 'Usuario';
  }

  constructor(
    private dashboardService: GeneralDashboardService,
    public empresaConfig: EmpresaConfigService,
    public authService: AuthService,
    private sanitizer: DomSanitizer,
    private cdr: ChangeDetectorRef
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

    // Cargar profile
    this.dashboardService.getProfile().subscribe({
      next: (res) => {
        console.log('[Dashboard] Profile response:', res);
        this.profile = res;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('[Dashboard] Error fetching profile:', err);
        this.profile = { hasResponsible: true, userName: this.authService.getUserName() };
        this.cdr.detectChanges();
      }
    });

    // Cargar KPIs
    this.dashboardService.getKpis().subscribe({
      next: (kpis) => {
        console.log('[Dashboard] KPIs response:', kpis);
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
        this.cdr.detectChanges();
      },
      error: (err) => console.error('[Dashboard] Error fetching KPIs:', err)
    });

    // Cargar órdenes activas
    this.dashboardService.getActiveOrders().subscribe({
      next: (orders) => {
        console.log('[Dashboard] Active orders response:', orders);
        this.activeOrders = orders ?? [];
        this.cdr.detectChanges();
      },
      error: (err) => console.error('[Dashboard] Error fetching active orders:', err)
    });

    // Cargar actividades pendientes
    this.dashboardService.getPendingActivities().subscribe({
      next: (activities) => {
        console.log('[Dashboard] Pending activities response:', activities);
        this.pendingActivities = activities ?? [];
        this.cdr.detectChanges();
      },
      error: (err) => console.error('[Dashboard] Error fetching pending activities:', err)
    });

    // Cargar observaciones recientes
    this.dashboardService.getRecentObservations().subscribe({
      next: (observations) => {
        console.log('[Dashboard] Recent observations response:', observations);
        this.recentObservations = observations ?? [];
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('[Dashboard] Error fetching recent observations:', err);
        this.isLoading = false;
        this.cdr.detectChanges();
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
