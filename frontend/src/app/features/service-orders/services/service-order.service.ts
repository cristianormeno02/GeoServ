import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import {
  ServiceOrderListItem,
  ServiceOrder,
  CreateServiceOrderRequest,
  UpdateServiceOrderRequest,
  DocumentUploadResponse
} from '../models/service-order.model';

@Injectable({
  providedIn: 'root'
})
export class ServiceOrderService {
  private apiUrl = `${environment.apiUrl}/service-orders`;

  constructor(private http: HttpClient) {}

  // 1. Obtener todas las órdenes de servicio
  getServiceOrders(): Observable<ServiceOrderListItem[]> {
    return this.http.get<ServiceOrderListItem[]>(this.apiUrl);
  }

  // 2. Obtener una orden de servicio por ID
  getServiceOrderById(id: string): Observable<ServiceOrder> {
    return this.http.get<ServiceOrder>(`${this.apiUrl}/${id}`);
  }

  // 3. Crear una orden de servicio
  createServiceOrder(order: CreateServiceOrderRequest): Observable<string> {
    return this.http.post<string>(this.apiUrl, order);
  }

  // 4. Actualizar una orden de servicio
  updateServiceOrder(id: string, order: UpdateServiceOrderRequest): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, order);
  }

  // 5. Eliminar una orden de servicio
  deleteServiceOrder(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Catálogos
  getStatuses(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/catalogs/statuses`);
  }

  getProjects(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/catalogs/projects`);
  }

  getDistributionConcepts(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/catalogs/distribution-concepts`);
  }

  getCurrencies(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/catalogs/currencies`);
  }

  getResponsiblesCatalog(): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiUrl}/responsibles`);
  }

  // 6. Subir Documento
  uploadDocument(orderId: string, file: File, isVisibleToClient: boolean): Observable<DocumentUploadResponse> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('isVisibleToClient', String(isVisibleToClient));

    return this.http.post<DocumentUploadResponse>(`${this.apiUrl}/${orderId}/documents`, formData);
  }

  // 7. Descargar Documento
  // En Angular, para descargar un archivo como Blob (para poder forzar la descarga en el navegador):
  downloadDocument(orderId: string, documentId: string): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/${orderId}/documents/${documentId}/download`, {
      responseType: 'blob'
    });
  }

  // 8. Eliminar Documento
  deleteDocument(orderId: string, documentId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${orderId}/documents/${documentId}`);
  }

  // 9. Agregar Observación
  addObservation(orderId: string, payload: { text: string, observationType?: string }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/${orderId}/observations`, payload);
  }
}
