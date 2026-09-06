import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { AuthService } from './auth.service';

describe('AuthService - Dashboard Redirection', () => {
  let service: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(AuthService);
    localStorage.clear();
    sessionStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
    sessionStorage.clear();
  });

  it('debe resolver /dashboard para un usuario con rol Administrador', () => {
    spyOn(service, 'getUserRole').and.returnValue('Administrador');
    expect(service.getDefaultDashboardRoute()).toBe('/dashboard');
  });

  it('debe resolver /dashboard para un usuario con rol Operador', () => {
    spyOn(service, 'getUserRole').and.returnValue('Operador');
    expect(service.getDefaultDashboardRoute()).toBe('/dashboard');
  });

  it('debe resolver /dashboard/operativo para un usuario con acceso exclusivo a Dashboard Operativo', () => {
    spyOn(service, 'hasRole').and.callFake((roles: string[]) => {
      // No tiene general, pero tiene operativo
      return !roles.includes('Operador') && roles.includes('OperativoExclusivo');
    });
    // Si simulamos rol OperativoExclusivo:
    spyOn(service, 'getUserRole').and.returnValue('OperativoExclusivo');
    expect(service.getDefaultDashboardRoute()).toBe('/dashboard/operativo');
  });

  it('debe resolver /dashboard/cliente para un usuario con rol Cliente', () => {
    spyOn(service, 'getUserRole').and.returnValue('Cliente');
    expect(service.getDefaultDashboardRoute()).toBe('/dashboard/cliente');
  });

  it('debe verificar correctamente hasRole cuando el rol es un array', () => {
    spyOn(service, 'getUserRole').and.returnValue(['Operador', 'Otro']);
    expect(service.hasRole(['Administrador', 'Operador'])).toBeTrue();
    expect(service.hasRole(['Cliente'])).toBeFalse();
  });

  it('debe verificar correctamente hasRole cuando el rol es un string', () => {
    spyOn(service, 'getUserRole').and.returnValue('Cliente');
    expect(service.hasRole(['Cliente'])).toBeTrue();
    expect(service.hasRole(['Administrador'])).toBeFalse();
  });
});
