import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpContext } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError, of } from 'rxjs';
import { SKIP_GLOBAL_LOADING } from '../interceptors/loading.interceptor';

export interface VersionInfo {
  version: string;
  buildDate: string;
  commit: string;
}

const CHECK_INTERVAL_MS = 5 * 60 * 1000;
const RELOAD_DELAY_MS = 2500;

/**
 * Detecta cuando el navegador tiene cacheada una versión vieja del frontend
 * comparándola contra assets/version.json (generado en cada build, servido
 * sin caché) y recarga automáticamente la página cuando cambia.
 */
@Injectable({
  providedIn: 'root'
})
export class VersionCheckService {
  private http = inject(HttpClient);
  private snackBar = inject(MatSnackBar);

  /** Versión con la que arrancó esta pestaña (bundle actualmente cargado) */
  readonly currentVersion = signal<VersionInfo | null>(null);

  private loadedFingerprint: string | null = null;
  private checking = false;
  private started = false;

  start(): void {
    if (this.started) return;
    this.started = true;

    this.fetchVersion().subscribe(info => {
      if (!info) return;
      this.currentVersion.set(info);
      this.loadedFingerprint = `${info.version}:${info.buildDate}`;

      setInterval(() => this.checkForUpdate(), CHECK_INTERVAL_MS);
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') this.checkForUpdate();
      });
    });
  }

  private checkForUpdate(): void {
    if (this.checking || !this.loadedFingerprint) return;
    this.checking = true;

    this.fetchVersion().subscribe(info => {
      this.checking = false;
      if (!info) return;

      const fingerprint = `${info.version}:${info.buildDate}`;
      if (fingerprint !== this.loadedFingerprint) {
        this.notifyAndReload();
      }
    });
  }

  private notifyAndReload(): void {
    this.loadedFingerprint = null; // evita reprogramar múltiples recargas

    this.snackBar.open('Hay una nueva versión disponible. Actualizando…', undefined, {
      duration: RELOAD_DELAY_MS,
      panelClass: ['snackbar-info']
    });

    setTimeout(() => window.location.reload(), RELOAD_DELAY_MS);
  }

  private fetchVersion() {
    return this.http
      .get<VersionInfo>(`assets/version.json?t=${Date.now()}`, {
        headers: { 'Cache-Control': 'no-cache' },
        context: new HttpContext().set(SKIP_GLOBAL_LOADING, true)
      })
      .pipe(catchError(() => of(null)));
  }
}
