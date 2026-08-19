import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface LoginResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly TOKEN_KEY = 'jwt_token';
  private readonly USER_NAME_KEY = 'user_name';

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
          if (response.user && response.user.name) {
             this.setUserName(response.user.name, rememberMe);
          }
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

  setUserName(name: string, rememberMe: boolean): void {
    if (rememberMe) {
      localStorage.setItem(this.USER_NAME_KEY, name);
      sessionStorage.removeItem(this.USER_NAME_KEY);
    } else {
      sessionStorage.setItem(this.USER_NAME_KEY, name);
      localStorage.removeItem(this.USER_NAME_KEY);
    }
  }

  /**
   * Obtiene el token, buscando primero en localStorage y luego en sessionStorage
   */
  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY) || sessionStorage.getItem(this.TOKEN_KEY);
  }

  getUserName(): string {
    const storedName = localStorage.getItem(this.USER_NAME_KEY) || sessionStorage.getItem(this.USER_NAME_KEY);
    if (storedName) {
      return storedName;
    }
    
    // Fallback: intentar extraer el nombre o email del token si no hay nombre guardado
    const token = this.getToken();
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const nameClaim = payload.name || payload.unique_name || payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'];
        if (nameClaim) return nameClaim;
        
        // ClaimTypes.Email en .NET
        return payload.email || payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'] || 'Usuario';
      } catch (e) {
        return 'Usuario';
      }
    }
    
    return 'Usuario';
  }

  /**
   * Elimina el token de ambos almacenamientos y cierra la sesión
   */
  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    sessionStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_NAME_KEY);
    sessionStorage.removeItem(this.USER_NAME_KEY);
  }

  /**
   * Verifica si el usuario está autenticado comprobando si existe un token
   */
  isLoggedIn(): boolean {
    return !!this.getToken();
  }
}
