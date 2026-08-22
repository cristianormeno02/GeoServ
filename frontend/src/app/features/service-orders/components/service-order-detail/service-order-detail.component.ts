import { Component, OnInit } from '@angular/core';
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
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

import { ServiceOrderService } from '../../services/service-order.service';
import { ServiceOrder, ServiceOrderDocument } from '../../models/service-order.model';
import { DirectCostService } from '../../services/direct-cost.service';
import { DirectCost } from '../../models/direct-cost.model';
import { DirectCostDialogComponent } from '../direct-cost-dialog/direct-cost-dialog.component';

import { ChangeDetectorRef } from '@angular/core';

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
    MatTabsModule,
    MatTableModule,
    MatDialogModule
  ],
  templateUrl: './service-order-detail.component.html',
  styleUrls: ['./service-order-detail.component.scss']
})
export class ServiceOrderDetailComponent implements OnInit {
  orderId: string | null = null;
  order: ServiceOrder | null = null;
  isLoading = true;

  // Variables para subida de archivos
  selectedFile: File | null = null;
  isVisibleToClient: boolean = false;
  isUploading = false;

  // Variables para Costos Directos
  directCostsDataSource = new MatTableDataSource<DirectCost>();
  directCostsColumns: string[] = ['category', 'provider', 'description', 'quantity', 'unit', 'unitPrice', 'totalAmount', 'actions'];
  isLoadingCosts = false;

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
    }
  }

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

  loadOrderDetails(): void {
    this.isLoading = true;
    console.log('Iniciando carga de orden:', this.orderId);
    this.serviceOrderService.getServiceOrderById(this.orderId!).subscribe({
      next: (data) => {
        console.log('Datos recibidos:', data);
        this.order = data;
        this.isLoading = false;
        try {
          this.cdr.detectChanges();
          console.log('Detección de cambios manual ejecutada exitosamente.');
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
        // Resetear input file
        const fileInput = document.getElementById('fileInput') as HTMLInputElement;
        if (fileInput) fileInput.value = '';
        
        // Recargar orden para refrescar la lista de documentos
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

    if (confirm('¿Estás seguro de que deseas eliminar este documento? Esta acción no se puede deshacer.')) {
      this.serviceOrderService.deleteDocument(this.orderId, docId).subscribe({
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
  }

  // --- MÉTODOS DE COSTOS DIRECTOS ---

  openDirectCostDialog(cost?: DirectCost): void {
    const dialogRef = this.dialog.open(DirectCostDialogComponent, {
      width: '600px',
      data: { cost, serviceOrderId: this.orderId }
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        if (result.id) {
          this.directCostService.updateCost(result.id, result).subscribe({
            next: () => {
              this.snackBar.open('Costo actualizado.', 'Cerrar', { duration: 3000 });
              this.loadDirectCosts();
            },
            error: (err) => {
              console.error(err);
              this.snackBar.open('Error al actualizar costo.', 'Cerrar', { duration: 4000 });
            }
          });
        } else {
          this.directCostService.createCost(result).subscribe({
            next: () => {
              this.snackBar.open('Costo registrado.', 'Cerrar', { duration: 3000 });
              this.loadDirectCosts();
            },
            error: (err) => {
              console.error(err);
              this.snackBar.open('Error al registrar costo.', 'Cerrar', { duration: 4000 });
            }
          });
        }
      }
    });
  }

  deleteDirectCost(costId: string): void {
    if (confirm('¿Estás seguro de que deseas eliminar este costo directo?')) {
      this.directCostService.deleteCost(costId).subscribe({
        next: () => {
          this.snackBar.open('Costo directo eliminado.', 'Cerrar', { duration: 3000 });
          this.loadDirectCosts();
        },
        error: (err) => {
          console.error(err);
          this.snackBar.open('Error al eliminar costo directo.', 'Cerrar', { duration: 4000 });
        }
      });
    }
  }
}

