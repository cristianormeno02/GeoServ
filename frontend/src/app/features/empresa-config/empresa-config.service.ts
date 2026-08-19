import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

export interface EmpresaConfigData {
  nombre: string;
  correo: string;
  telefono: string;
  direccion: string;
  taxId: string;
  logoSvg: string;
  subdominio: string;
}

@Injectable({
  providedIn: 'root'
})
export class EmpresaConfigService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/api/empresa`;

  getConfig(): Observable<EmpresaConfigData> {
    return this.http.get<EmpresaConfigData>(`${this.apiUrl}/config`);
  }

  saveConfig(formData: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/inicializar`, formData);
  }
}
