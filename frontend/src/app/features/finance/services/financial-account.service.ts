import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

export interface FinancialAccount {
  id?: string;
  name: string;
  accountNumber: string;
  accountType: string;
  currencyId: string;
  currencyName?: string;
  isActive: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class FinancialAccountService {
  private apiUrl = `${environment.apiUrl}/api/financial-accounts`;

  constructor(private http: HttpClient) {}

  getAccounts(): Observable<FinancialAccount[]> {
    return this.http.get<FinancialAccount[]>(this.apiUrl);
  }

  createAccount(account: FinancialAccount): Observable<FinancialAccount> {
    return this.http.post<FinancialAccount>(this.apiUrl, account);
  }

  updateAccount(id: string, account: FinancialAccount): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, account);
  }

  deleteAccount(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
