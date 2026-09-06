import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, Router, UrlTree } from '@angular/router';
import { dashboardRoleGuard } from './dashboard-role.guard';
import { AuthService } from '../services/auth.service';

describe('dashboardRoleGuard', () => {
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(() => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['isLoggedIn', 'hasRole', 'getDefaultDashboardRoute']);
    routerSpy = jasmine.createSpyObj('Router', ['createUrlTree']);

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    });
  });

  const runGuard = (routeData: any = {}) => {
    const routeSnapshot = { data: routeData } as unknown as ActivatedRouteSnapshot;
    return TestBed.runInInjectionContext(() => dashboardRoleGuard(routeSnapshot, {} as any));
  };

  it('debe redirigir a /login si el usuario no está autenticado', () => {
    authServiceSpy.isLoggedIn.and.returnValue(false);
    const mockUrlTree = {} as UrlTree;
    routerSpy.createUrlTree.and.returnValue(mockUrlTree);

    const result = runGuard();
    expect(authServiceSpy.isLoggedIn).toHaveBeenCalled();
    expect(routerSpy.createUrlTree).toHaveBeenCalledWith(['/login']);
    expect(result).toBe(mockUrlTree);
  });

  it('debe permitir la navegación si no hay roles restringidos', () => {
    authServiceSpy.isLoggedIn.and.returnValue(true);

    const result = runGuard({});
    expect(result).toBeTrue();
  });

  it('debe permitir la navegación si el usuario posee uno de los roles autorizados', () => {
    authServiceSpy.isLoggedIn.and.returnValue(true);
    authServiceSpy.hasRole.and.returnValue(true);

    const result = runGuard({ roles: ['Administrador', 'Operador'] });
    expect(authServiceSpy.hasRole).toHaveBeenCalledWith(['Administrador', 'Operador']);
    expect(result).toBeTrue();
  });

  it('debe redirigir al dashboard por defecto del usuario si no tiene el rol autorizado', () => {
    authServiceSpy.isLoggedIn.and.returnValue(true);
    authServiceSpy.hasRole.and.returnValue(false);
    authServiceSpy.getDefaultDashboardRoute.and.returnValue('/dashboard/cliente');
    const mockUrlTree = {} as UrlTree;
    routerSpy.createUrlTree.and.returnValue(mockUrlTree);

    const result = runGuard({ roles: ['Administrador', 'Operador'] });
    expect(authServiceSpy.hasRole).toHaveBeenCalledWith(['Administrador', 'Operador']);
    expect(authServiceSpy.getDefaultDashboardRoute).toHaveBeenCalled();
    expect(routerSpy.createUrlTree).toHaveBeenCalledWith(['/dashboard/cliente']);
    expect(result).toBe(mockUrlTree);
  });
});
