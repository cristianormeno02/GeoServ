import { ApplicationConfig, provideZoneChangeDetection, APP_INITIALIZER, LOCALE_ID } from '@angular/core';
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
import { MAT_DATE_LOCALE, provideNativeDateAdapter } from '@angular/material/core';

import { registerLocaleData } from '@angular/common';
import localeEsAr from '@angular/common/locales/es-AR';
registerLocaleData(localeEsAr, 'es-AR');

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

import { provideEnvironmentNgxMask } from 'ngx-mask';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimationsAsync(),
    provideHttpClient(withInterceptors([authInterceptor, loadingInterceptor])),
    provideEnvironmentNgxMask(),
    provideNativeDateAdapter(),
    {
      provide: APP_INITIALIZER,
      useFactory: initializeAppFactory,
      deps: [AuthService, EmpresaConfigService],
      multi: true
    },
    { provide: MatPaginatorIntl, useClass: CustomMatPaginatorIntl },
    { provide: LOCALE_ID, useValue: 'es-AR' },
    { provide: MAT_DATE_LOCALE, useValue: 'es-AR' }
  ]
};
