import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

export enum MovementSourceType {
  Manual = 'Manual',
  DirectCost = 'DirectCost',
  FixedCostPayment = 'FixedCostPayment',
  AssetPurchase = 'AssetPurchase',
  ServiceOrderIncome = 'ServiceOrderIncome',
  InternalTransfer = 'InternalTransfer'
}

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
  fixedCostPaymentId?: string;
  directCostId?: string;
  directCostCategoryId?: string | null;
  assetId?: string;
  checkId?: string;
  responsibleId?: string;
  registeredByUserId?: string;
  sourceType?: MovementSourceType;
  sourceId?: string | null;
  sourceReference?: string | null;
  transferGroupId?: string | null;
  balanceAfter?: number;
}

export interface AccountPeriodSummary {
  initialBalance: number;
  periodIncome: number;
  periodExpense: number;
  finalBalance: number;
}

export interface PagedMovementResponse {
  items: Movement[];
  totalCount: number;
  page: number;
  pageSize: number;
  accountSummary?: AccountPeriodSummary | null;
}

export interface CreateTransferRequest {
  fromAccountId: string;
  toAccountId: string;
  amount: number;
  date: string;
  description?: string | null;
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

  createTransfer(request: CreateTransferRequest): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/transfer`, request);
  }

  deleteTransfer(transferGroupId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/transfer/${transferGroupId}`);
  }
}
