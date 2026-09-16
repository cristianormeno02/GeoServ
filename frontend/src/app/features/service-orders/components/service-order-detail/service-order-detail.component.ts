import { Component, OnInit, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';

import { LoadingService } from '../../../../core/services/loading.service';
import { ServiceOrderService } from '../../services/service-order.service';
import { ServiceOrder, ServiceOrderDocument, ServiceOrderMovement, ServiceOrderObservation } from '../../models/service-order.model';
import { DirectCostService } from '../../services/direct-cost.service';
import { DirectCost } from '../../models/direct-cost.model';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';
import { ServiceOrderObservationsComponent } from '../service-order-observations/service-order-observations.component';

const LIFECYCLE_STEPS = ['Alta', 'Presupuestada', 'Aprobada', 'Iniciada', 'Entregada', 'Cobrada'];

@Component({
  selector: 'app-service-order-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatListModule,
    MatCheckboxModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    MatTabsModule,
    MatTableModule,
    MatDialogModule,
    MatTooltipModule,
    ServiceOrderObservationsComponent
  ],
  templateUrl: './service-order-detail.component.html',
  styleUrls: ['./service-order-detail.component.scss']
})
export class ServiceOrderDetailComponent implements OnInit {
  private loadingService = inject(LoadingService);
  public isGlobalLoading$ = this.loadingService.loading$;

  orderId: string | null = null;
  order: ServiceOrder | null = null;
  isLoading = true;

  readonly lifecycleSteps = LIFECYCLE_STEPS;

  // Variables para subida de archivos
  selectedFile: File | null = null;
  isVisibleToClient: boolean = false;
  isUploading = false;

  // Variables para Costos Directos
  directCostsDataSource = new MatTableDataSource<DirectCost>();
  directCostsColumns: string[] = ['date', 'category', 'description', 'quantity', 'unitPrice', 'totalAmount', 'status', 'origin'];
  isLoadingCosts = false;

  // Bitácora
  observations: ServiceOrderObservation[] = [];

  // Movimientos de cobro vinculados
  movements: ServiceOrderMovement[] = [];
  movementsTotal = 0;
  isLoadingMovements = false;

  // Acción "Marcar como Entregada"
  isDelivering = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private serviceOrderService: ServiceOrderService,
    private directCostService: DirectCostService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.orderId = this.route.snapshot.paramMap.get('id');
    if (this.orderId) {
      this.loadOrderDetails();
      this.loadDirectCosts();
      this.loadMovements();
    }
  }

  loadOrderDetails(): void {
    this.isLoading = true;
    this.serviceOrderService.getServiceOrderById(this.orderId!).subscribe({
      next: (data) => {
        this.order = data;
        this.observations = data.observations ?? [];
        this.isLoading = false;
        try {
          this.cdr.detectChanges();
        } catch (e) {
          console.error('Error al renderizar la vista (Angular crash):', e);
        }
      },
      error: (err) => {
        console.error('Error HTTP o de parsing:', err);
        this.snackBar.open('Error al cargar detalles de la orden.', 'Cerrar', { duration: 3000 });
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  editOrder(): void {
    this.router.navigate(['/ordenes-servicio/editar', this.orderId]);
  }

  goBack(): void {
    this.router.navigate(['/ordenes-servicio']);
  }

  // --- CICLO DE VIDA / STEPPER ---

  get isCanceled(): boolean {
    return (this.order?.statusName || '').toLowerCase() === 'cancelada';
  }

  get currentStepIndex(): number {
    if (!this.order?.statusName) return -1;
    return this.lifecycleSteps.findIndex(s => s.toLowerCase() === this.order!.statusName!.toLowerCase());
  }

  stepState(index: number): 'done' | 'current' | 'pending' {
    const current = this.currentStepIndex;
    if (index < current) return 'done';
    if (index === current) return 'current';
    return 'pending';
  }

  get canDeliver(): boolean {
    return (this.order?.statusName || '').toLowerCase() === 'iniciada';
  }

  markAsDelivered(): void {
    if (!this.order || !this.orderId) return;

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '450px',
      data: {
        title: 'Marcar como Entregada',
        message: `¿Estás seguro de marcar la orden ${this.order.orderNumber} como Entregada? Se registrará la entrega en el sistema y se completarán automáticamente las fechas reales si no están definidas.`,
        isDestructive: false,
        confirmText: 'Confirmar Entrega'
      }
    });

    dialogRef.afterClosed().subscribe(confirmed => {
      if (!confirmed) return;
      this.isDelivering = true;
      this.serviceOrderService.markAsDelivered(this.orderId!).subscribe({
        next: () => {
          this.isDelivering = false;
          this.snackBar.open(`Orden ${this.order?.orderNumber} marcada como entregada exitosamente`, 'Cerrar', {
            duration: 3000,
            panelClass: ['snackbar-success']
          });
          this.loadOrderDetails();
        },
        error: (err) => {
          console.error('Error al marcar la orden como entregada', err);
          this.isDelivering = false;
          const errorMsg = err?.error?.message || 'Hubo un error al marcar la orden como entregada.';
          this.snackBar.open(errorMsg, 'Cerrar', { duration: 5000, panelClass: ['snackbar-error'] });
        }
      });
    });
  }

  // --- PRIORIDAD / ESTADO (badges) ---

  getStatusClass(status: string | undefined): string {
    if (!status) return 'bg-info';
    const s = status.toLowerCase();
    if (s.includes('aprobado') || s.includes('completado') || s.includes('pagado') || s.includes('cobrado') || s.includes('activo') || s.includes('procesado') || s.includes('entregada') || s.includes('entregado') || s.includes('ingreso') || s.includes('finalizado')) {
      return 'bg-success';
    }
    if (s.includes('pendiente') || s.includes('revisión') || s.includes('revision')) {
      return 'bg-warning';
    }
    if (s.includes('error') || s.includes('rechazado') || s.includes('cancelada') || s.includes('cancelado')) {
      return 'bg-error';
    }
    return 'bg-info';
  }

  getPriorityClass(priority: string | undefined): string {
    if (!priority) return 'bg-info';
    const p = priority.toLowerCase();
    if (p === 'urgente') return 'bg-error';
    if (p === 'alta') return 'bg-warning';
    if (p === 'media') return 'bg-info';
    return 'bg-neutral';
  }

  // --- FINANZAS ---

  get collectedPercent(): number {
    if (!this.order || !this.order.totalAmount) return 0;
    return Math.max(0, Math.min(100, (this.order.collectedAmount / this.order.totalAmount) * 100));
  }

  get hasForeignCurrency(): boolean {
    return !!this.order?.currencyCode && this.order.currencyCode !== 'ARS' && !!this.order?.foreignAmount;
  }

  // --- EQUIPO DE TRABAJO ---

  getInitials(name: string | undefined): string {
    if (!name) return '?';
    const parts = name.trim().split(/\s+/);
    const first = parts[0]?.[0] || '';
    const last = parts.length > 1 ? parts[parts.length - 1][0] : '';
    return (first + last).toUpperCase();
  }

  // --- DISTRIBUCIÓN FINANCIERA ---

  get distributionTotals() {
    const list = this.order?.distributions || [];
    return {
      percentage: list.reduce((acc, d) => acc + (d.percentage || 0), 0),
      expectedAmount: list.reduce((acc, d) => acc + (d.expectedAmount || 0), 0),
      actualAmount: list.reduce((acc, d) => acc + (d.actualAmount || 0), 0)
    };
  }

  get isDistributionValid(): boolean {
    if (!this.order?.distributions || this.order.distributions.length === 0) return true;
    return Math.abs(this.distributionTotals.percentage - 100) < 0.01;
  }

  // --- MÉTODOS DE DOCUMENTOS ---

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }

  uploadDocument(): void {
    if (!this.selectedFile || !this.orderId) return;

    this.isUploading = true;
    this.serviceOrderService.uploadDocument(this.orderId, this.selectedFile, this.isVisibleToClient).subscribe({
      next: (res) => {
        this.snackBar.open('Documento subido con éxito.', 'Cerrar', { duration: 3000 });
        this.selectedFile = null;
        this.isVisibleToClient = false;
        const fileInput = document.getElementById('fileInput') as HTMLInputElement;
        if (fileInput) fileInput.value = '';
        this.loadOrderDetails();
        this.isUploading = false;
      },
      error: (err) => {
        console.error(err);
        this.snackBar.open(err.error?.message || 'Error al subir el documento (Verifica tus permisos).', 'Cerrar', { duration: 4000 });
        this.isUploading = false;
      }
    });
  }

  downloadDocument(doc: ServiceOrderDocument): void {
    if (!this.orderId) return;

    this.serviceOrderService.downloadDocument(this.orderId, doc.id).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = doc.fileName;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
      },
      error: (err) => {
        console.error(err);
        this.snackBar.open('Error al descargar el archivo. Puede que no tengas permisos.', 'Cerrar', { duration: 4000 });
      }
    });
  }

  deleteDocument(docId: string): void {
    if (!this.orderId) return;

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Confirmar Eliminación',
        message: '¿Estás seguro de que deseas eliminar este documento? Esta acción no se puede deshacer.',
        confirmText: 'Eliminar',
        cancelText: 'Cancelar',
        isDestructive: true
      }
    });

    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        this.serviceOrderService.deleteDocument(this.orderId!, docId).subscribe({
          next: () => {
            this.snackBar.open('Documento eliminado.', 'Cerrar', { duration: 3000 });
            this.loadOrderDetails();
          },
          error: (err) => {
            console.error(err);
            this.snackBar.open('Error al eliminar el documento (Verifica tus permisos).', 'Cerrar', { duration: 4000 });
          }
        });
      }
    });
  }

  // --- MÉTODOS DE COSTOS DIRECTOS (solo lectura en esta vista) ---

  loadDirectCosts(): void {
    if (!this.orderId) return;
    this.isLoadingCosts = true;
    this.directCostService.getCostsByOrder(this.orderId).subscribe({
      next: (costs) => {
        this.directCostsDataSource.data = costs;
        this.isLoadingCosts = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error(err);
        this.isLoadingCosts = false;
      }
    });
  }

  getTotalCosts(): number {
    return this.directCostsDataSource.data.reduce((acc, curr) => acc + (curr.totalAmount || 0), 0);
  }

  getManualCosts(): number {
    return this.directCostsDataSource.data
      .filter(c => !c.isFromMovement)
      .reduce((acc, curr) => acc + (curr.totalAmount || 0), 0);
  }

  getMovementCosts(): number {
    return this.directCostsDataSource.data
      .filter(c => c.isFromMovement)
      .reduce((acc, curr) => acc + (curr.totalAmount || 0), 0);
  }

  // --- MOVIMIENTOS DE COBRO VINCULADOS ---

  loadMovements(): void {
    if (!this.orderId) return;
    this.isLoadingMovements = true;
    this.serviceOrderService.getMovements(this.orderId).subscribe({
      next: (res) => {
        this.movements = res.items || [];
        this.movementsTotal = res.total || 0;
        this.isLoadingMovements = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error(err);
        this.isLoadingMovements = false;
      }
    });
  }

  // --- BITÁCORA / OBSERVACIONES ---

  onObservationAdded(payload: any): void {
    if (!this.orderId) return;
    this.serviceOrderService.addObservation(this.orderId, payload).subscribe({
      next: (obs) => {
        this.observations = [obs, ...this.observations];
        this.cdr.detectChanges();
        this.snackBar.open('Observación guardada', 'Cerrar', { duration: 2000 });
      },
      error: () => {
        this.snackBar.open('Error al guardar observación', 'Cerrar', { duration: 3000, panelClass: ['snackbar-error'] });
      }
    });
  }

  onObservationDeleted(id: string): void {
    if (!this.orderId) return;
    this.serviceOrderService.deleteObservation(this.orderId, id).subscribe({
      next: () => {
        this.observations = this.observations.filter(o => o.id !== id);
        this.cdr.detectChanges();
        this.snackBar.open('Observación eliminada', 'Cerrar', { duration: 2000 });
      },
      error: () => {
        this.snackBar.open('Error al eliminar observación', 'Cerrar', { duration: 3000, panelClass: ['snackbar-error'] });
      }
    });
  }
}
