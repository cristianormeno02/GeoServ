import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, switchMap, filter, take } from 'rxjs/operators';
import { throwError, BehaviorSubject } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../services/auth.service';

let isRefreshing = false;
let refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const snackBar = inject(MatSnackBar);
  const token = authService.getToken();

  let authReq = req;
  if (token) {
    authReq = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` }
    });
  }

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        if (req.url.includes('/refresh-token') || !authService.isRememberMe()) {
          return handleSessionExpired(authService, snackBar, router, error);
        }

        if (!isRefreshing) {
          isRefreshing = true;
          refreshTokenSubject.next(null);

          const currentToken = authService.getToken();
          const refreshToken = authService.getRefreshToken();

          if (currentToken && refreshToken) {
            return authService.refreshTokenApi(currentToken, refreshToken).pipe(
              switchMap((tokenResponse: any) => {
                isRefreshing = false;
                const rememberMe = authService.isRememberMe();
                authService.setToken(tokenResponse.token, rememberMe);
                if (tokenResponse.refreshToken) {
                  authService.setRefreshToken(tokenResponse.refreshToken, rememberMe);
                }
                refreshTokenSubject.next(tokenResponse.token);
                return next(req.clone({ setHeaders: { Authorization: `Bearer ${tokenResponse.token}` } }));
              }),
              catchError((err) => {
                isRefreshing = false;
                return handleSessionExpired(authService, snackBar, router, err);
              })
            );
          } else {
            isRefreshing = false;
            return handleSessionExpired(authService, snackBar, router, error);
          }
        } else {
          return refreshTokenSubject.pipe(
            filter(token => token != null),
            take(1),
            switchMap(jwt => {
              return next(req.clone({ setHeaders: { Authorization: `Bearer ${jwt}` } }));
            })
          );
        }
      }
      return throwError(() => error);
    })
  );
};

function handleSessionExpired(authService: AuthService, snackBar: MatSnackBar, router: Router, error: any) {
  authService.logout();
  snackBar.open('Su sesión ha finalizado. Por favor, vuelva a ingresar.', 'Cerrar', {
    duration: 5000,
    horizontalPosition: 'center',
    verticalPosition: 'bottom'
  });
  router.navigate(['/login']);
  return throwError(() => error);
}
