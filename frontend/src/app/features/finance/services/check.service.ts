import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

export interface Check {
  id?: string;
  checkNumber: string;
  bankName: string;
  issuerName: string;
  amount: number;
  issueDate: string;
  dueDate: string;
  status: number;
  receivedFromClientId?: string;
  clientName?: string;
  observations?: string;
}

@Injectable({
  providedIn: 'root'
})
export class CheckService {
  private apiUrl = `${environment.apiUrl}/checks`;

  constructor(private http: HttpClient) {}

  getChecks(): Observable<Check[]> {
    return this.http.get<Check[]>(this.apiUrl);
  }

  createCheck(check: Check): Observable<Check> {
    return this.http.post<Check>(this.apiUrl, check);
  }

  updateCheck(id: string, check: Check): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, check);
  }

  deleteCheck(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
