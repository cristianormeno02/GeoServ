import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { DirectCost, CreateDirectCostDto } from '../models/direct-cost.model';

@Injectable({ providedIn: 'root' })
export class DirectCostService {
  private http = inject(HttpClient);
  private getApiUrl(serviceOrderId: string) {
    return `${environment.apiUrl}/service-orders/${serviceOrderId}/direct-costs`;
  }

  getCostsByOrder(serviceOrderId: string): Observable<DirectCost[]> {
    return this.http.get<DirectCost[]>(this.getApiUrl(serviceOrderId));
  }

  // Búsqueda global de costos directos (todas las órdenes) para el buscador modal del formulario de movimientos.
  searchAll(query: string): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiUrl}/direct-costs?q=${encodeURIComponent(query)}`);
  }

  createCost(cost: CreateDirectCostDto): Observable<DirectCost> {
    return this.http.post<DirectCost>(this.getApiUrl(cost.serviceOrderId), cost);
  }

  updateCost(id: string, cost: CreateDirectCostDto): Observable<DirectCost> {
    return this.http.put<DirectCost>(`${this.getApiUrl(cost.serviceOrderId)}/${id}`, cost);
  }

  deleteCost(serviceOrderId: string, id: string): Observable<void> {
    return this.http.delete<void>(`${this.getApiUrl(serviceOrderId)}/${id}`);
  }
}
