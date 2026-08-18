import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // Obtenemos el token desde localStorage
  const token = localStorage.getItem('jwt_token');

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
