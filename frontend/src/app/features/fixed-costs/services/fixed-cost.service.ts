import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FixedCostItem, FixedCostPayment, CreateFixedCostItemRequest, CreateFixedCostPaymentRequest } from '../models/fixed-cost.model';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FixedCostService {
  private itemsUrl = `${environment.apiUrl}/api/fixed-cost-items`;
  private paymentsUrl = `${environment.apiUrl}/api/fixed-cost-payments`;

  constructor(private http: HttpClient) { }

  getItems(): Observable<FixedCostItem[]> {
    return this.http.get<FixedCostItem[]>(this.itemsUrl);
  }

  getItemById(id: string): Observable<FixedCostItem> {
    return this.http.get<FixedCostItem>(`${this.itemsUrl}/${id}`);
  }

  createItem(data: CreateFixedCostItemRequest): Observable<FixedCostItem> {
    return this.http.post<FixedCostItem>(this.itemsUrl, data);
  }

  updateItem(id: string, data: any): Observable<void> {
    return this.http.put<void>(`${this.itemsUrl}/${id}`, data);
  }

  deleteItem(id: string): Observable<void> {
    return this.http.delete<void>(`${this.itemsUrl}/${id}`);
  }

  createPayment(data: CreateFixedCostPaymentRequest): Observable<FixedCostPayment> {
    return this.http.post<FixedCostPayment>(this.paymentsUrl, data);
  }

  updatePayment(id: string, data: any): Observable<void> {
    return this.http.put<void>(`${this.paymentsUrl}/${id}`, data);
  }

  deletePayment(id: string): Observable<void> {
    return this.http.delete<void>(`${this.paymentsUrl}/${id}`);
  }
}
