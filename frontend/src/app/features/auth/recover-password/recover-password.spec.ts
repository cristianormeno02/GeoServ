import { ComponentFixture, TestBed, fakeAsync, tick, discardPeriodicTasks } from '@angular/core/testing';
import { HttpErrorResponse } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of, throwError } from 'rxjs';

import { RecoverPassword, RESEND_COOLDOWN_SECONDS } from './recover-password';
import { AuthService } from '../../../core/services/auth.service';
import { EmpresaConfigService } from '../../../core/services/empresa-config.service';

describe('RecoverPassword', () => {
  let component: RecoverPassword;
  let fixture: ComponentFixture<RecoverPassword>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['recoverPassword']);
    const empresaConfigSpy = jasmine.createSpyObj('EmpresaConfigService', ['obtenerSubdominioActual']);
    empresaConfigSpy.obtenerSubdominioActual.and.returnValue('geocobre');

    await TestBed.configureTestingModule({
      imports: [RecoverPassword, NoopAnimationsModule],
      providers: [
        provideRouter([]),
        { provide: AuthService, useValue: authServiceSpy },
        { provide: EmpresaConfigService, useValue: empresaConfigSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RecoverPassword);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  const submitWith = (email: string) => {
    component.recoverForm.get('email')!.setValue(email);
    component.onSubmit();
    fixture.detectChanges();
  };

  const text = () => (fixture.nativeElement as HTMLElement).textContent ?? '';

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('no envía la petición y no muestra banner cuando el correo está vacío', () => {
    submitWith('');

    expect(authServiceSpy.recoverPassword).not.toHaveBeenCalled();
    expect(component.errorMessage).toBe('');
    expect(component.recoverForm.get('email')!.touched).toBeTrue();
  });

  it('no envía la petición con formato de correo inválido', () => {
    submitWith('no-es-un-correo');

    expect(authServiceSpy.recoverPassword).not.toHaveBeenCalled();
    expect(component.recoverForm.get('email')!.hasError('email')).toBeTrue();
  });

  it('recorta espacios del correo y envía el tenant actual', () => {
    authServiceSpy.recoverPassword.and.returnValue(of({}));

    submitWith('  usuario@empresa.com  ');

    expect(authServiceSpy.recoverPassword).toHaveBeenCalledOnceWith('usuario@empresa.com', 'geocobre');
  });

  it('muestra un mensaje de éxito neutro con el correo, la vigencia y el aviso de spam', fakeAsync(() => {
    authServiceSpy.recoverPassword.and.returnValue(of({}));

    submitWith('usuario@empresa.com');

    expect(component.isSuccess).toBeTrue();
    expect(text()).toContain('Si el correo está registrado');
    expect(text()).toContain('usuario@empresa.com');
    expect(text()).toContain('30 minutos');
    expect(text()).toContain('spam');
    expect(text()).not.toContain('Hemos enviado');
    discardPeriodicTasks();
  }));

  it('deshabilita el reenvío durante 60 s y lo habilita después', fakeAsync(() => {
    authServiceSpy.recoverPassword.and.returnValue(of({}));
    submitWith('usuario@empresa.com');

    expect(component.resendSeconds).toBe(RESEND_COOLDOWN_SECONDS);
    component.onResend();
    expect(authServiceSpy.recoverPassword).toHaveBeenCalledTimes(1);

    tick(59_000);
    expect(component.resendSeconds).toBe(1);

    tick(1_000);
    expect(component.resendSeconds).toBe(0);

    component.onResend();
    expect(authServiceSpy.recoverPassword).toHaveBeenCalledTimes(2);
    expect(component.resendNotice).toBeTrue();
    expect(component.resendSeconds).toBe(RESEND_COOLDOWN_SECONDS);
    discardPeriodicTasks();
  }));

  it('cancela el intervalo de enfriamiento al destruir el componente', fakeAsync(() => {
    authServiceSpy.recoverPassword.and.returnValue(of({}));
    submitWith('usuario@empresa.com');

    fixture.destroy();

    // fakeAsync falla si quedan temporizadores periódicos pendientes
    expect(() => tick(1_000)).not.toThrow();
  }));

  const errorCases: [number, string][] = [
    [0, 'No hay conexión'],
    [429, 'Demasiados intentos'],
    [400, 'Verifica el correo'],
    [500, 'El servicio no está disponible'],
    [418, 'No se pudo procesar']
  ];

  errorCases.forEach(([status, expected]) => {
    it(`muestra un mensaje amigable para HTTP ${status} sin exponer texto del backend`, () => {
      authServiceSpy.recoverPassword.and.returnValue(
        throwError(() => new HttpErrorResponse({ status, error: { detail: 'TEXTO TECNICO INTERNO' } }))
      );

      submitWith('usuario@empresa.com');

      expect(component.errorMessage).toContain(expected);
      expect(text()).not.toContain('TEXTO TECNICO INTERNO');
      expect(component.isLoading).toBeFalse();
      expect(component.isSuccess).toBeFalse();
    });
  });

  it('actualiza la vista por sí sola al recibir la respuesta (sin depender de otro evento)', () => {
    authServiceSpy.recoverPassword.and.returnValue(of({}));
    component.recoverForm.get('email')!.setValue('usuario@empresa.com');

    component.onSubmit();   // sin fixture.detectChanges() posterior

    expect((fixture.nativeElement as HTMLElement).querySelector('.success-message')).not.toBeNull();
    expect((fixture.nativeElement as HTMLElement).querySelector('form')).toBeNull();
  });

  it('actualiza la vista por sí sola al recibir un error', () => {
    authServiceSpy.recoverPassword.and.returnValue(throwError(() => new HttpErrorResponse({ status: 500 })));
    component.recoverForm.get('email')!.setValue('usuario@empresa.com');

    component.onSubmit();

    expect((fixture.nativeElement as HTMLElement).querySelector('[role="alert"]')).not.toBeNull();
  });

  it('marca el banner de error como alerta accesible', () => {
    authServiceSpy.recoverPassword.and.returnValue(throwError(() => new HttpErrorResponse({ status: 500 })));

    submitWith('usuario@empresa.com');

    const alert = (fixture.nativeElement as HTMLElement).querySelector('[role="alert"]');
    expect(alert).not.toBeNull();
  });
});
