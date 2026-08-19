import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Client, CompanyType, AvailableUser, CreateClientRequest, UpdateClientRequest } from '../models/client.model';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ClientService {
  private http = inject(HttpClient);
  // Asumiendo que environment.apiUrl está definido. Si no, ajustar a la URL base.
  private apiUrl = `${environment.apiUrl}/clients`;

  getClients(): Observable<Client[]> {
    return this.http.get<Client[]>(this.apiUrl);
  }

  getClient(id: string): Observable<Client> {
    return this.http.get<Client>(`${this.apiUrl}/${id}`);
  }

  createClient(client: CreateClientRequest): Observable<Client> {
    return this.http.post<Client>(this.apiUrl, client);
  }

  updateClient(id: string, client: UpdateClientRequest): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, client);
  }

  deleteClient(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getCompanyTypes(): Observable<CompanyType[]> {
    return this.http.get<CompanyType[]>(`${this.apiUrl}/company-types`);
  }

  getAvailableUsers(currentUserId?: string): Observable<AvailableUser[]> {
    let params = new HttpParams();
    if (currentUserId) {
      params = params.set('currentUserId', currentUserId);
    }
    return this.http.get<AvailableUser[]>(`${this.apiUrl}/available-users`, { params });
  }
}
