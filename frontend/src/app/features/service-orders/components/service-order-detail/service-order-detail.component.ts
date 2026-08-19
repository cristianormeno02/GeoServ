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

import { ServiceOrderService } from '../../services/service-order.service';
import { ServiceOrder, ServiceOrderDocument } from '../../models/service-order.model';

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
    MatProgressSpinnerModule
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

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private serviceOrderService: ServiceOrderService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.orderId = this.route.snapshot.paramMap.get('id');
    if (this.orderId) {
      this.loadOrderDetails();
    }
  }

  loadOrderDetails(): void {
    this.isLoading = true;
    this.serviceOrderService.getServiceOrderById(this.orderId!).subscribe({
      next: (data) => {
        this.order = data;
        this.isLoading = false;
      },
      error: (err) => {
        this.snackBar.open('Error al cargar detalles de la orden.', 'Cerrar', { duration: 3000 });
        this.isLoading = false;
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
}
