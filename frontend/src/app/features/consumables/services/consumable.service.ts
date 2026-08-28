import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Consumable, ConsumableClass, ConsumableType, CreateConsumableRequest } from '../models/consumable.model';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ConsumableService {
  private apiUrl = `${environment.apiUrl}/consumables`;
  private typesUrl = `${environment.apiUrl}/consumable-types`;
  private classesUrl = `${environment.apiUrl}/consumable-classes`;

  constructor(private http: HttpClient) { }

  getConsumables(): Observable<Consumable[]> {
    return this.http.get<Consumable[]>(this.apiUrl);
  }

  createConsumable(data: CreateConsumableRequest): Observable<Consumable> {
    return this.http.post<Consumable>(this.apiUrl, data);
  }

  updateConsumable(id: string, data: any): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, data);
  }

  deleteConsumable(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getConsumableTypes(): Observable<ConsumableType[]> {
    return this.http.get<ConsumableType[]>(this.typesUrl);
  }

  getConsumableClasses(): Observable<ConsumableClass[]> {
    return this.http.get<ConsumableClass[]>(this.classesUrl);
  }
}
