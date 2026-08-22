import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { DirectCostCategory } from '../models/direct-cost-category.model';

@Injectable({ providedIn: 'root' })
export class DirectCostCategoryService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/direct-cost-categories`;

  getCategories(): Observable<DirectCostCategory[]> {
    return this.http.get<DirectCostCategory[]>(this.apiUrl);
  }
  getCategory(id: string): Observable<DirectCostCategory> {
    return this.http.get<DirectCostCategory>(`${this.apiUrl}/${id}`);
  }
  createCategory(category: DirectCostCategory): Observable<DirectCostCategory> {
    return this.http.post<DirectCostCategory>(this.apiUrl, category);
  }
  updateCategory(id: string, category: DirectCostCategory): Observable<DirectCostCategory> {
    return this.http.put<DirectCostCategory>(`${this.apiUrl}/${id}`, category);
  }
  deleteCategory(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
