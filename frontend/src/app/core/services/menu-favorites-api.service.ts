import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface AddUserMenuFavoriteDto {
  path: string;
}

@Injectable({
  providedIn: 'root'
})
export class MenuFavoritesApiService {
  private readonly baseUrl = `${environment.apiUrl}/user-menu-favorites`;

  constructor(private http: HttpClient) {}

  /**
   * Obtiene la lista de rutas (paths) favoritas del usuario autenticado.
   */
  getFavorites(): Observable<string[]> {
    return this.http.get<string[]>(this.baseUrl);
  }

  /**
   * Agrega un nuevo ítem favorito para el usuario autenticado.
   */
  addFavorite(path: string): Observable<void> {
    return this.http.post<void>(this.baseUrl, { path });
  }

  /**
   * Elimina un ítem favorito para el usuario autenticado usando query parameter `?path=...`.
   */
  removeFavorite(path: string): Observable<void> {
    const params = new HttpParams().set('path', path);
    return this.http.delete<void>(this.baseUrl, { params });
  }
}
