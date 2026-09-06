import { inject } from '@angular/core';
import { CanActivateFn, Router, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const dashboardRoleGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isLoggedIn()) {
    return router.createUrlTree(['/login']);
  }

  const allowedRoles = route.data?.['roles'] as string[] | undefined;

  // Si no se definieron roles específicos, se permite el acceso
  if (!allowedRoles || allowedRoles.length === 0) {
    return true;
  }

  if (authService.hasRole(allowedRoles)) {
    return true;
  }

  // Si no tiene acceso al dashboard solicitado, redirigir a su dashboard correspondiente
  const defaultRoute = authService.getDefaultDashboardRoute();
  return router.createUrlTree([defaultRoute]);
};
