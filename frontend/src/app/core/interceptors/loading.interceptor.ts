import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { LoadingService } from '../services/loading.service';
import { finalize } from 'rxjs';

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  const loadingService = inject(LoadingService);
  
  // Mostrar el loading cuando inicia la petición
  loadingService.show();

  // Ocultar el loading cuando finaliza (ya sea con éxito o error)
  return next(req).pipe(
    finalize(() => loadingService.hide())
  );
};
