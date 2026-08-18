import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface EmpresaConfig {
  nombre: string;
  correo: string;
  telefono: string;
  direccion: string;
  logoSvg: string;
  subdominio: string;
}

@Injectable({
  providedIn: 'root'
})
export class EmpresaConfigService {
  // Usamos Signals de Angular 18+ para reactividad
  public empresaActual = signal<EmpresaConfig | null>(null);

  // URL base de la API desde environment
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  /**
   * Obtiene la configuración de la empresa desde el backend.
   * Asume que el usuario ya está autenticado y el AuthInterceptor
   * inyectará el Token JWT que contiene el TenantId.
   */
  cargarConfiguracion(): Observable<EmpresaConfig> {
    return this.http.get<EmpresaConfig>(`${this.apiUrl}/empresa/config`).pipe(
      tap((config) => {
        this.empresaActual.set(config);
      }),
      catchError(err => {
        console.error('Error cargando la configuración de la empresa:', err);
        return throwError(() => err);
      })
    );
  }

  /**
   * Para desarrollo: Helper que extrae el subdominio de la URL actual.
   * Si es localhost, retorna "geocobre" por defecto para probar.
   */
  obtenerSubdominioActual(): string {
    const hostname = window.location.hostname;
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return 'geocobre'; // Mock para desarrollo local
    }
    const parts = hostname.split('.');
    if (parts.length >= 3) {
      return parts[0];
    }
    return 'geocobre'; // Fallback
  }
}
