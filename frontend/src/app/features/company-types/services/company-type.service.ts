import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CompanyType, CreateCompanyTypeRequest, UpdateCompanyTypeRequest } from '../models/company-type.model';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CompanyTypeService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/company-types`;

  getCompanyTypes(): Observable<CompanyType[]> {
    return this.http.get<CompanyType[]>(this.apiUrl);
  }

  getCompanyType(id: string): Observable<CompanyType> {
    return this.http.get<CompanyType>(`${this.apiUrl}/${id}`);
  }

  createCompanyType(companyType: CreateCompanyTypeRequest): Observable<CompanyType> {
    return this.http.post<CompanyType>(this.apiUrl, companyType);
  }

  updateCompanyType(id: string, companyType: UpdateCompanyTypeRequest): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, companyType);
  }

  deleteCompanyType(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
