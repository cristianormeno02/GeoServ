import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // Obtenemos el servicio mediante inject() al ser un interceptor funcional
  const authService = inject(AuthService);
  const token = authService.getToken();

  if (token) {
    // Clonamos la petición y agregamos el header de Authorization
    const authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next(authReq);
  }

  // Si no hay token, enviamos la petición tal cual
  return next(req);
};
