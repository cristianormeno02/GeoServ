import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

export interface MovementCategory {
  id?: string;
  name: string;
  description?: string;
  isIncome: boolean;
  isActive: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class MovementCategoryService {
  private apiUrl = `${environment.apiUrl}/movement-categories`;

  constructor(private http: HttpClient) {}

  getCategories(): Observable<MovementCategory[]> {
    return this.http.get<MovementCategory[]>(this.apiUrl);
  }

  getCategory(id: string): Observable<MovementCategory> {
    return this.http.get<MovementCategory>(`${this.apiUrl}/${id}`);
  }

  createCategory(category: MovementCategory): Observable<MovementCategory> {
    return this.http.post<MovementCategory>(this.apiUrl, category);
  }

  updateCategory(id: string, category: MovementCategory): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, category);
  }

  deleteCategory(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
