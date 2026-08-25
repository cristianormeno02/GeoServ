import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

export interface Movement {
  id?: string;
  isIncome: boolean;
  categoryId: string;
  categoryName?: string;
  amount: number;
  date: string;
  description?: string;
  financialAccountId: string;
  financialAccountName?: string;
  paymentMethodId?: string;
  paymentMethodName?: string;
  serviceOrderId?: string;
  serviceOrderNumber?: string;
  fixedCostId?: string;
  directCostId?: string;
  assetId?: string;
  checkId?: string;
  responsibleId?: string;
  registeredByUserId?: string;
}

@Injectable({
  providedIn: 'root'
})
export class MovementService {
  private apiUrl = `${environment.apiUrl}/movements`;

  constructor(private http: HttpClient) {}

  getMovements(): Observable<Movement[]> {
    return this.http.get<Movement[]>(this.apiUrl);
  }

  getMovement(id: string): Observable<Movement> {
    return this.http.get<Movement>(`${this.apiUrl}/${id}`);
  }

  createMovement(movement: Movement): Observable<Movement> {
    return this.http.post<Movement>(this.apiUrl, movement);
  }

  updateMovement(id: string, movement: Movement): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, movement);
  }

  deleteMovement(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
