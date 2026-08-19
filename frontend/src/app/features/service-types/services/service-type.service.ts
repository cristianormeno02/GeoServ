import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ServiceType, CreateServiceTypeRequest, UpdateServiceTypeRequest } from '../models/service-type.model';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ServiceTypeService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/service-types`;

  getServiceTypes(): Observable<ServiceType[]> {
    return this.http.get<ServiceType[]>(this.apiUrl);
  }

  getServiceType(id: string): Observable<ServiceType> {
    return this.http.get<ServiceType>(`${this.apiUrl}/${id}`);
  }

  createServiceType(serviceType: CreateServiceTypeRequest): Observable<ServiceType> {
    return this.http.post<ServiceType>(this.apiUrl, serviceType);
  }

  updateServiceType(id: string, serviceType: UpdateServiceTypeRequest): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, serviceType);
  }

  deleteServiceType(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
