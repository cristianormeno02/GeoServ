import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

export interface Responsible {
  id?: string;
  name: string;
  position?: string;
  title?: string;
  specialties?: string;
  userId?: string;
  userName?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ResponsibleService {
  private apiUrl = `${environment.apiUrl}/responsibles`;

  constructor(private http: HttpClient) { }

  getResponsibles(): Observable<Responsible[]> {
    return this.http.get<Responsible[]>(this.apiUrl);
  }

  getResponsibleById(id: string): Observable<Responsible> {
    return this.http.get<Responsible>(`${this.apiUrl}/${id}`);
  }

  createResponsible(data: Responsible): Observable<string> {
    return this.http.post<string>(this.apiUrl, data);
  }

  updateResponsible(id: string, data: Responsible): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, data);
  }

  deleteResponsible(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
