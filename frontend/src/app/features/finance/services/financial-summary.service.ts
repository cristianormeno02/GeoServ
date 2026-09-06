import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';

export interface AccountSummary {
  id: string;
  name: string;
  accountNumber: string;
  accountType: string;
  currencyId: string;
  currencyName: string;
  isActive: boolean;
  balance: number;
}

export interface CheckSummary {
  id: string;
  checkNumber: string;
  bankName: string;
  issuerName: string;
  amount: number;
  issueDate: string;
  dueDate: string;
  status: string;
  clientName?: string;
  observations?: string;
}

export interface FinancialSummaryResponse {
  accounts: AccountSummary[];
  checks: CheckSummary[];
}

@Injectable({
  providedIn: 'root'
})
export class FinancialSummaryService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/financial-summary`;

  getSummary(): Observable<FinancialSummaryResponse> {
    return this.http.get<FinancialSummaryResponse>(this.apiUrl);
  }
}
