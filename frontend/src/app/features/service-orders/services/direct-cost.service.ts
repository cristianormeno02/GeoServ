import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { DirectCost, CreateDirectCostDto } from '../models/direct-cost.model';

@Injectable({ providedIn: 'root' })
export class DirectCostService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/direct-costs`;

  getCostsByOrder(serviceOrderId: string): Observable<DirectCost[]> {
    return this.http.get<DirectCost[]>(`${this.apiUrl}/by-order/${serviceOrderId}`);
  }

  createCost(cost: CreateDirectCostDto): Observable<DirectCost> {
    return this.http.post<DirectCost>(this.apiUrl, cost);
  }

  updateCost(id: string, cost: CreateDirectCostDto): Observable<DirectCost> {
    return this.http.put<DirectCost>(`${this.apiUrl}/${id}`, cost);
  }

  deleteCost(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
