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
   * @param rememberMe Indica si la sesión debe persistir al cerrar el navegador
   */
  login(credentials: any, tenantId: string, rememberMe: boolean = false): Observable<LoginResponse> {
    const headers = new HttpHeaders({
      'X-Tenant-Id': tenantId
    });

    return this.http.post<LoginResponse>(`${environment.apiUrl}/login`, credentials, { headers }).pipe(
      tap(response => {
        if (response && response.token) {
          this.setToken(response.token, rememberMe);
        }
      })
    );
  }

  /**
   * Guarda el token en el almacenamiento correspondiente
   * @param token El JWT a almacenar
   * @param rememberMe Si es true usa localStorage, si es false usa sessionStorage
   */
  setToken(token: string, rememberMe: boolean): void {
    if (rememberMe) {
      localStorage.setItem(this.TOKEN_KEY, token);
      sessionStorage.removeItem(this.TOKEN_KEY);
    } else {
      sessionStorage.setItem(this.TOKEN_KEY, token);
      localStorage.removeItem(this.TOKEN_KEY);
    }
  }

  /**
   * Obtiene el token, buscando primero en localStorage y luego en sessionStorage
   */
  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY) || sessionStorage.getItem(this.TOKEN_KEY);
  }

  /**
   * Elimina el token de ambos almacenamientos y cierra la sesión
   */
  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    sessionStorage.removeItem(this.TOKEN_KEY);
  }

  /**
   * Verifica si el usuario está autenticado comprobando si existe un token
   */
  isLoggedIn(): boolean {
    return !!this.getToken();
  }
}
