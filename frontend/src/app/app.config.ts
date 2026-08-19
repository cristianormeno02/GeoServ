import { ApplicationConfig, provideZoneChangeDetection, APP_INITIALIZER } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { loadingInterceptor } from './core/interceptors/loading.interceptor';
import { AuthService } from './core/services/auth.service';
import { EmpresaConfigService } from './core/services/empresa-config.service';
import { catchError, of } from 'rxjs';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { CustomMatPaginatorIntl } from './core/providers/custom-mat-paginator-intl';

export function initializeAppFactory(authService: AuthService, empresaConfigService: EmpresaConfigService) {
  return () => {
    // Si hay un token guardado, intentamos cargar la configuración de la empresa antes de iniciar la app
    if (authService.isLoggedIn()) {
      return empresaConfigService.cargarConfiguracion().pipe(
        catchError(() => {
          // Si falla (ej. token expirado), podemos limpiar la sesión o simplemente dejar que cargue
          // authService.logout(); 
          return of(null);
        })
      );
    }
    return of(null);
  };
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimationsAsync(),
    provideHttpClient(withInterceptors([authInterceptor, loadingInterceptor])),
    {
      provide: APP_INITIALIZER,
      useFactory: initializeAppFactory,
      deps: [AuthService, EmpresaConfigService],
      multi: true
    },
    { provide: MatPaginatorIntl, useClass: CustomMatPaginatorIntl }
  ]
};
