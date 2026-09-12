import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface LoginResponse {
  token: string;
  refreshToken: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

export interface RefreshTokenResponse {
  token: string;
  refreshToken: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly TOKEN_KEY = 'jwt_token';
  private readonly REFRESH_TOKEN_KEY = 'refresh_token';
  private readonly USER_NAME_KEY = 'user_name';
  private readonly REMEMBER_ME_KEY = 'remember_me';

  constructor(private http: HttpClient) {}

  login(credentials: any, tenantId: string, rememberMe: boolean = false): Observable<LoginResponse> {
    const headers = new HttpHeaders({
      'X-Tenant-Id': tenantId
    });

    return this.http.post<LoginResponse>(`${environment.apiUrl}/login`, credentials, { headers }).pipe(
      tap(response => {
        if (response && response.token) {
          localStorage.setItem(this.REMEMBER_ME_KEY, rememberMe ? 'true' : 'false');
          this.setToken(response.token, rememberMe);
          if (response.refreshToken) {
            this.setRefreshToken(response.refreshToken, rememberMe);
          }
          if (response.user && response.user.name) {
             this.setUserName(response.user.name, rememberMe);
          }
        }
      })
    );
  }

  loginWithGoogle(credential: string, tenantId: string): Observable<LoginResponse> {
    const headers = new HttpHeaders({
      'X-Tenant-Id': tenantId
    });

    return this.http.post<LoginResponse>(`${environment.apiUrl}/auth/google`, { credential }, { headers }).pipe(
      tap(response => {
        if (response && response.token) {
          // Asumimos rememberMe por defecto al usar SSO
          const rememberMe = true;
          localStorage.setItem(this.REMEMBER_ME_KEY, 'true');
          this.setToken(response.token, rememberMe);
          if (response.refreshToken) {
            this.setRefreshToken(response.refreshToken, rememberMe);
          }
          if (response.user && response.user.name) {
             this.setUserName(response.user.name, rememberMe);
          }
        }
      })
    );
  }
  
  recoverPassword(email: string, tenantId: string): Observable<any> {
    const headers = new HttpHeaders({
      'X-Tenant-Id': tenantId
    });
    return this.http.post(`${environment.apiUrl}/auth/recover-password`, { email }, { headers });
  }

  resetPassword(token: string, newPassword: string): Observable<any> {
    return this.http.post(`${environment.apiUrl}/auth/reset-password`, { token, newPassword });
  }

  refreshTokenApi(token: string, refreshToken: string): Observable<RefreshTokenResponse> {
    return this.http.post<RefreshTokenResponse>(`${environment.apiUrl}/refresh-token`, { token, refreshToken });
  }

  setToken(token: string, rememberMe: boolean): void {
    if (rememberMe) {
      localStorage.setItem(this.TOKEN_KEY, token);
      sessionStorage.removeItem(this.TOKEN_KEY);
    } else {
      sessionStorage.setItem(this.TOKEN_KEY, token);
      localStorage.removeItem(this.TOKEN_KEY);
    }
  }
  
  setRefreshToken(refreshToken: string, rememberMe: boolean): void {
    if (rememberMe) {
      localStorage.setItem(this.REFRESH_TOKEN_KEY, refreshToken);
      sessionStorage.removeItem(this.REFRESH_TOKEN_KEY);
    } else {
      sessionStorage.setItem(this.REFRESH_TOKEN_KEY, refreshToken);
      localStorage.removeItem(this.REFRESH_TOKEN_KEY);
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

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY) || sessionStorage.getItem(this.TOKEN_KEY);
  }
  
  getRefreshToken(): string | null {
    return localStorage.getItem(this.REFRESH_TOKEN_KEY) || sessionStorage.getItem(this.REFRESH_TOKEN_KEY);
  }
  
  isRememberMe(): boolean {
    return localStorage.getItem(this.REMEMBER_ME_KEY) === 'true';
  }

  /** Extrae el ID del usuario autenticado desde el token JWT */
  getUserId(): string {
    const token = this.getToken();
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const id = payload.sub || payload.nameid || payload.id ||
          payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'];
        if (id) return String(id);
      } catch (e) {}
    }
    return 'anonymous';
  }

  getUserName(): string {
    const storedName = localStorage.getItem(this.USER_NAME_KEY) || sessionStorage.getItem(this.USER_NAME_KEY);
    if (storedName) {
      return storedName;
    }
    
    const token = this.getToken();
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const nameClaim = payload.name || payload.unique_name || payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'];
        if (nameClaim) return nameClaim;
        
        return payload.email || payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'] || 'Usuario';
      } catch (e) {
        return 'Usuario';
      }
    }
    
    return 'Usuario';
  }

  getUserRole(): any {
    const token = this.getToken();
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const roleClaim = payload.role || payload.roles || payload.Role || payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
        if (roleClaim) return roleClaim;
      } catch (e) {}
      return 'Administrador'; // Fallback per default if token exists but role not found
    }
    return null;
  }

  hasRole(allowedRoles: string[]): boolean {
    const userRole = this.getUserRole();
    if (!userRole) return false;
    if (Array.isArray(userRole)) {
      return userRole.some(r => allowedRoles.includes(r));
    }
    return allowedRoles.includes(userRole);
  }

  getDefaultDashboardRoute(): string {
    // 1. Dashboard General
    if (this.hasRole(['Administrador', 'Operador'])) {
      return '/dashboard';
    }
    // 2. Dashboard Operativo
    if (this.hasRole(['Administrador', 'OperativoExclusivo'])) {
      return '/dashboard/operativo';
    }
    // 3. Dashboard Cliente
    if (this.hasRole(['Cliente'])) {
      return '/dashboard/cliente';
    }
    // Fallback
    return '/dashboard/cliente';
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    sessionStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    sessionStorage.removeItem(this.REFRESH_TOKEN_KEY);
    localStorage.removeItem(this.USER_NAME_KEY);
    sessionStorage.removeItem(this.USER_NAME_KEY);
    localStorage.removeItem(this.REMEMBER_ME_KEY);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }
}
