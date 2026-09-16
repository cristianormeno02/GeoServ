import { HttpInterceptorFn, HttpContextToken } from '@angular/common/http';
import { inject } from '@angular/core';
import { LoadingService } from '../services/loading.service';
import { finalize } from 'rxjs';

export const SKIP_GLOBAL_LOADING = new HttpContextToken<boolean>(() => false);

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  if (req.context.get(SKIP_GLOBAL_LOADING) || req.url.includes('assets/')) {
    return next(req);
  }

  const loadingService = inject(LoadingService);
  
  // Mostrar el loading cuando inicia la petición
  loadingService.show();

  // Ocultar el loading cuando finaliza (ya sea con éxito o error)
  return next(req).pipe(
    finalize(() => loadingService.hide())
  );
};
