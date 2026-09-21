import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

// Angular Material
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatMenuModule } from '@angular/material/menu';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatTabsModule } from '@angular/material/tabs';

// Core
import { AlertCenterService } from '../../core/services/alert-center.service';
import { AlertItemDto, AlertCenterQuery, AlertActionDto } from '../../core/models/alert-center.model';
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-alert-center',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    MatCardModule,
    MatTableModule,
    MatPaginatorModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatMenuModule,
    MatChipsModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatDialogModule,
    MatTabsModule
  ],
  templateUrl: './alert-center.component.html',
  styleUrl: './alert-center.component.css'
})
export class AlertCenterComponent implements OnInit {
  private alertService = inject(AlertCenterService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);
  private dialog = inject(MatDialog);

  alerts = signal<AlertItemDto[]>([]);
  totalCount = signal<number>(0);
  loading = signal<boolean>(false);
  
  query = signal<AlertCenterQuery>({
    page: 1,
    pageSize: 10,
    search: '',
    priority: '',
    state: ''
  });

  displayedColumns: string[] = ['priority', 'title', 'dueDate', 'amount', 'state', 'actions'];

  ngOnInit(): void {
    this.loadAlerts();
  }

  loadAlerts(): void {
    this.loading.set(true);
    this.alertService.getAlerts(this.query()).subscribe({
      next: (res) => {
        this.alerts.set(res.items);
        this.totalCount.set(res.totalCount);
        this.loading.set(false);
      },
      error: (err) => {
        this.snackBar.open('Error al cargar alertas', 'Cerrar', { duration: 3000 });
        this.loading.set(false);
      }
    });
  }

  onPageChange(event: PageEvent): void {
    this.query.update(q => ({
      ...q,
      page: event.pageIndex + 1,
      pageSize: event.pageSize
    }));
    this.loadAlerts();
  }

  onSearch(): void {
    this.query.update(q => ({ ...q, page: 1 }));
    this.loadAlerts();
  }

  onFilterChange(): void {
    this.query.update(q => ({ ...q, page: 1 }));
    this.loadAlerts();
  }
  
  setTabFilter(index: number): void {
    const states = ['', 'New', 'Read', 'Snoozed', 'Resolved'];
    this.query.update(q => ({ ...q, state: states[index], page: 1 }));
    this.loadAlerts();
  }

  getPriorityIcon(priority: string): string {
    switch(priority) {
      case 'Critical': return 'error';
      case 'High': return 'warning';
      case 'Medium': return 'info';
      default: return 'notifications';
    }
  }

  getPriorityColor(priority: string): string {
    switch(priority) {
      case 'Critical': return 'warn';
      case 'High': return 'accent';
      case 'Medium': return 'primary';
      default: return '';
    }
  }

  getStateLabel(state: string): string {
    switch(state) {
      case 'New': return 'Nueva';
      case 'Read': return 'Leída';
      case 'Snoozed': return 'Pospuesta';
      case 'Resolved': return 'Resuelta';
      default: return state;
    }
  }

  markAs(alert: AlertItemDto, state: string, snoozedUntil?: Date): void {
    this.alertService.updateState(alert.id, { state, snoozedUntil }).subscribe({
      next: (updated) => {
        this.snackBar.open(`Alerta marcada como ${this.getStateLabel(state)}`, 'Cerrar', { duration: 2000 });
        this.loadAlerts();
      },
      error: () => {
        this.snackBar.open('Error al actualizar la alerta', 'Cerrar', { duration: 3000 });
      }
    });
  }

  executeAction(alert: AlertItemDto, action: AlertActionDto): void {
    if (action.requiresConfirmation) {
      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        width: '400px',
        data: {
          title: action.label,
          message: `¿Estás seguro de que deseas ejecutar la acción: "${action.label}"?`
        }
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.handleActionRoute(alert, action);
        }
      });
    } else {
      this.handleActionRoute(alert, action);
    }
  }

  private handleActionRoute(alert: AlertItemDto, action: AlertActionDto): void {
    if (action.route) {
      // route is a string, possibly with query params. Let's parse it if needed.
      // Or we can just use navigateByUrl
      this.router.navigateByUrl(action.route).then(() => {
        // Automatically mark as read if it's New
        if (alert.state === 'New') {
          this.markAs(alert, 'Read');
        }
      });
    } else if (action.key === 'mark-delivered') {
      // Special handler if it needs a backend call to actually change state
      // This might require a call to ServiceOrderService, but for now we just show a message.
      this.snackBar.open('Esta acción requiere implementación en el backend de Órdenes', 'OK');
    }
  }
}
