import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface LoginResponse {
  token: string;
  // Añade aquí otras propiedades que devuelva el backend, como user info
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly TOKEN_KEY = 'jwt_token';

  constructor(private http: HttpClient) {}

  /**
   * Realiza la petición de login al backend
   * @param credentials Datos de inicio de sesión (email, password, etc)
   * @param tenantId ID del tenant/subdominio actual
   */
  login(credentials: any, tenantId: string): Observable<LoginResponse> {
    const headers = new HttpHeaders({
      'X-Tenant-Id': tenantId
    });

    return this.http.post<LoginResponse>(`${environment.apiUrl}/login`, credentials, { headers }).pipe(
      tap(response => {
        if (response && response.token) {
          this.setToken(response.token);
        }
      })
    );
  }

  /**
   * Guarda el token en el almacenamiento local
   */
  setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  /**
   * Obtiene el token del almacenamiento local
   */
  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  /**
   * Elimina el token del almacenamiento local y cierra la sesión
   */
  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
  }

  /**
   * Verifica si el usuario está autenticado comprobando si existe un token
   */
  isLoggedIn(): boolean {
    return !!this.getToken();
  }
}
