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
   * Extrae el tenant/subdominio de la URL actual.
   * Maneja localhost, query param ?tenant=..., subdominios de Vercel (ej: geocobre-geoserv.vercel.app)
   * y subdominios estándar (ej: geocobre.midominio.com).
   */
  obtenerSubdominioActual(): string {
    const hostname = window.location.hostname;

    // 1. Parámetro explícito en la URL (?tenant=geocobre)
    if (typeof window !== 'undefined' && window.location.search) {
      const urlParams = new URLSearchParams(window.location.search);
      const tenantParam = urlParams.get('tenant');
      if (tenantParam) {
        return tenantParam.toLowerCase().trim();
      }
    }

    // 2. Entorno local
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return 'geocobre';
    }

    // 3. Extracción de subdominio
    const parts = hostname.split('.');
    if (parts.length >= 3) {
      let sub = parts[0].toLowerCase();

      // Si el subdominio en Vercel tiene el sufijo de la app (ej: geocobre-geoserv -> geocobre)
      if (sub.endsWith('-geoserv')) {
        sub = sub.replace(/-geoserv$/, '');
      }

      // Si es un subdominio genérico del proyecto
      if (sub === 'geoserv' || sub === 'geoserv-web' || sub === 'geoserv-api') {
        return 'geocobre';
      }

      return sub || 'geocobre';
    }

    return 'geocobre'; // Fallback
  }
}
