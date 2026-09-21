import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { BehaviorSubject, of, throwError } from 'rxjs';

import { ResetPassword } from './reset-password';
import { AuthService } from '../../../core/services/auth.service';
import { EmpresaConfigService } from '../../../core/services/empresa-config.service';

describe('ResetPassword', () => {
  let component: ResetPassword;
  let fixture: ComponentFixture<ResetPassword>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let queryParams$: BehaviorSubject<Record<string, string>>;

  const create = (params: Record<string, string>) => {
    queryParams$ = new BehaviorSubject(params);
    TestBed.overrideProvider(ActivatedRoute, { useValue: { queryParams: queryParams$.asObservable() } });
    fixture = TestBed.createComponent(ResetPassword);
    component = fixture.componentInstance;
    fixture.detectChanges();
  };

  const fillAndSubmit = (password: string, confirm = password) => {
    component.resetForm.setValue({ password, confirmPassword: confirm });
    component.onSubmit();
    fixture.detectChanges();
  };

  const text = () => (fixture.nativeElement as HTMLElement).textContent ?? '';

  beforeEach(async () => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['resetPassword']);
    const empresaConfigSpy = jasmine.createSpyObj('EmpresaConfigService', ['obtenerSubdominioActual']);
    empresaConfigSpy.obtenerSubdominioActual.and.returnValue('geocobre');

    await TestBed.configureTestingModule({
      imports: [ResetPassword, NoopAnimationsModule],
      providers: [
        provideRouter([]),
        { provide: AuthService, useValue: authServiceSpy },
        { provide: EmpresaConfigService, useValue: empresaConfigSpy }
      ]
    }).compileComponents();
  });

  it('should create', () => {
    create({ token: 'abc' });
    expect(component).toBeTruthy();
    expect(component.linkInvalid).toBeFalse();
  });

  it('muestra enlace inválido y ofrece solicitar uno nuevo cuando falta el token', () => {
    create({});

    expect(component.linkInvalid).toBeTrue();
    expect(text()).toContain('inválido');
    const link = (fixture.nativeElement as HTMLElement).querySelector('a[href="/recover-password"]');
    expect(link).not.toBeNull();
    expect((fixture.nativeElement as HTMLElement).querySelector('form')).toBeNull();
  });

  it('no envía si las contraseñas no coinciden', () => {
    create({ token: 'abc' });

    fillAndSubmit('Clave123', 'Otra1234');

    expect(authServiceSpy.resetPassword).not.toHaveBeenCalled();
    expect(component.resetForm.hasError('mismatch')).toBeTrue();
  });

  it('no envía si la contraseña es más corta que el mínimo', () => {
    create({ token: 'abc' });

    fillAndSubmit('123');

    expect(authServiceSpy.resetPassword).not.toHaveBeenCalled();
  });

  it('envía token, contraseña y tenant, y muestra éxito', () => {
    create({ token: 'abc' });
    authServiceSpy.resetPassword.and.returnValue(of({}));

    fillAndSubmit('Clave123');

    expect(authServiceSpy.resetPassword).toHaveBeenCalledOnceWith('abc', 'Clave123', 'geocobre');
    expect(component.isSuccess).toBeTrue();
    expect(text()).toContain('restablecido correctamente');
  });

  it('marca el enlace como inválido cuando el backend responde 400 por token', () => {
    create({ token: 'vencido' });
    authServiceSpy.resetPassword.and.returnValue(
      throwError(() => new HttpErrorResponse({ status: 400, error: { detail: 'El enlace es inválido o ha expirado.' } }))
    );

    fillAndSubmit('Clave123');

    expect(component.linkInvalid).toBeTrue();
    expect(component.isLoading).toBeFalse();
    expect(text()).toContain('Solicita uno nuevo');
  });

  it('mantiene el formulario y muestra el error cuando el backend rechaza la contraseña', () => {
    create({ token: 'abc' });
    authServiceSpy.resetPassword.and.returnValue(
      throwError(() => new HttpErrorResponse({ status: 400, error: { detail: 'La contraseña debe tener al menos 6 caracteres.' } }))
    );

    fillAndSubmit('Clave123');

    expect(component.linkInvalid).toBeFalse();
    expect(component.errorMessage).toContain('contraseña');
  });

  it('muestra mensaje genérico ante error de servidor', () => {
    create({ token: 'abc' });
    authServiceSpy.resetPassword.and.returnValue(throwError(() => new HttpErrorResponse({ status: 500 })));

    fillAndSubmit('Clave123');

    expect(component.linkInvalid).toBeFalse();
    expect(component.errorMessage).toContain('No se pudo restablecer');
  });
});
