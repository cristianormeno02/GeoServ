import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter, Router } from '@angular/router';
import { of } from 'rxjs';

import { LoginComponent } from './login.component';
import { AuthService } from '../../../core/services/auth.service';
import { EmpresaConfigService } from '../../../core/services/empresa-config.service';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let empresaConfigSpy: jasmine.SpyObj<EmpresaConfigService>;
  let router: Router;

  beforeEach(async () => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['login', 'loginWithGoogle', 'getDefaultDashboardRoute']);
    empresaConfigSpy = jasmine.createSpyObj('EmpresaConfigService', ['obtenerSubdominioActual', 'cargarConfiguracion']);

    empresaConfigSpy.obtenerSubdominioActual.and.returnValue('test');
    empresaConfigSpy.cargarConfiguracion.and.returnValue(of({} as any));

    await TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
        { provide: AuthService, useValue: authServiceSpy },
        { provide: EmpresaConfigService, useValue: empresaConfigSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    spyOn(router, 'navigate');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('debe navegar al dashboard resuelto tras login exitoso por formulario', () => {
    authServiceSpy.login.and.returnValue(of({ token: 'fake-jwt', refreshToken: 'fake-refresh', user: { id: '1', name: 'Admin', email: 'admin@test.com' } }));
    authServiceSpy.getDefaultDashboardRoute.and.returnValue('/dashboard');

    component.loginForm.setValue({
      email: 'admin@test.com',
      password: 'password123',
      rememberMe: false
    });

    component.onSubmit();

    expect(authServiceSpy.login).toHaveBeenCalled();
    expect(authServiceSpy.getDefaultDashboardRoute).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/dashboard']);
  });

  it('debe navegar al dashboard cliente tras login con Google si el rol es Cliente', () => {
    authServiceSpy.loginWithGoogle.and.returnValue(of({ token: 'fake-jwt', refreshToken: 'fake-refresh', user: { id: '2', name: 'Cliente', email: 'cliente@test.com' } }));
    authServiceSpy.getDefaultDashboardRoute.and.returnValue('/dashboard/cliente');

    component.handleGoogleResponse({ credential: 'google-token' });

    expect(authServiceSpy.loginWithGoogle).toHaveBeenCalledWith('google-token', 'test');
    expect(authServiceSpy.getDefaultDashboardRoute).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/dashboard/cliente']);
  });
});
