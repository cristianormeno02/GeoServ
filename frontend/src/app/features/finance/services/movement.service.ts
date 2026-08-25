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

export interface PagedMovementResponse {
  items: Movement[];
  totalCount: number;
  page: number;
  pageSize: number;
}

@Injectable({
  providedIn: 'root'
})
export class MovementService {
  private apiUrl = `${environment.apiUrl}/movements`;

  constructor(private http: HttpClient) {}

  getMovements(
    page: number = 1,
    pageSize: number = 10,
    startDate?: string,
    endDate?: string,
    categoryId?: string,
    financialAccountId?: string,
    isIncome?: boolean
  ): Observable<PagedMovementResponse> {
    let params: any = { page, pageSize };
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;
    if (categoryId) params.categoryId = categoryId;
    if (financialAccountId) params.financialAccountId = financialAccountId;
    if (isIncome !== undefined && isIncome !== null) params.isIncome = isIncome;

    return this.http.get<PagedMovementResponse>(this.apiUrl, { params });
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
