import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { RouterModule } from '@angular/router';
import { Subscription, interval } from 'rxjs';
import { EmpresaConfigService } from '../../../core/services/empresa-config.service';
import { AuthService } from '../../../core/services/auth.service';

/** Segundos que debe esperar el usuario antes de poder reenviar el correo. */
export const RESEND_COOLDOWN_SECONDS = 60;
/** Vigencia del enlace de recuperación, en minutos (debe coincidir con el backend). */
export const LINK_VALIDITY_MINUTES = 30;

@Component({
  selector: 'app-recover-password',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule
  ],
  templateUrl: './recover-password.html',
  styleUrl: './recover-password.css',
})
export class RecoverPassword implements AfterViewInit, OnDestroy {
  @ViewChild('emailInput') emailInput?: ElementRef<HTMLInputElement>;

  recoverForm: FormGroup;
  isLoading = false;
  isSuccess = false;
  errorMessage = '';
  submittedEmail = '';
  resendSeconds = 0;
  resendNotice = false;
  readonly linkValidityMinutes = LINK_VALIDITY_MINUTES;

  // App Branding
  appName = 'GeoServ';
  appLogo = '/assets/geoserv-logo.svg';

  private cooldownSub?: Subscription;
  private destroyed = false;

  constructor(
    private fb: FormBuilder,
    public empresaConfig: EmpresaConfigService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {
    this.recoverForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  ngAfterViewInit(): void {
    this.emailInput?.nativeElement.focus();
  }

  ngOnDestroy(): void {
    this.destroyed = true;
    this.cooldownSub?.unsubscribe();
  }

  /** Las respuestas HTTP no refrescan la vista por sí solas en esta app (ver login), por eso se fuerza. */
  private refresh(): void {
    if (!this.destroyed) {
      this.cdr.detectChanges();
    }
  }

  onSubmit(): void {
    if (this.isLoading) return;

    const emailControl = this.recoverForm.get('email')!;
    emailControl.setValue((emailControl.value ?? '').trim());

    if (this.recoverForm.invalid) {
      this.recoverForm.markAllAsTouched();
      this.errorMessage = '';
      return;
    }

    this.send(emailControl.value, false);
  }

  onResend(): void {
    if (this.isLoading || this.resendSeconds > 0 || !this.submittedEmail) return;
    this.send(this.submittedEmail, true);
  }

  private send(email: string, isResend: boolean): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.resendNotice = false;

    const tenantId = this.empresaConfig.obtenerSubdominioActual() || 'default';

    this.authService.recoverPassword(email, tenantId).subscribe({
      next: () => {
        this.isLoading = false;
        this.isSuccess = true;
        this.submittedEmail = email;
        this.resendNotice = isResend;
        this.startCooldown();
        this.refresh();
      },
      error: (err: HttpErrorResponse) => {
        this.isLoading = false;
        this.errorMessage = this.mapError(err);
        if (err.status === 429 && this.isSuccess) {
          this.startCooldown();
        }
        this.refresh();
      }
    });
  }

  private startCooldown(): void {
    this.cooldownSub?.unsubscribe();
    this.resendSeconds = RESEND_COOLDOWN_SECONDS;
    this.cooldownSub = interval(1000).subscribe(() => {
      this.resendSeconds = Math.max(0, this.resendSeconds - 1);
      if (this.resendSeconds === 0) {
        this.cooldownSub?.unsubscribe();
      }
      this.refresh();
    });
  }

  private mapError(err: HttpErrorResponse): string {
    if (err.status === 0) {
      return 'No hay conexión con el servidor. Revisa tu conexión a internet e intenta nuevamente.';
    }
    if (err.status === 429) {
      return 'Demasiados intentos. Espera unos minutos antes de volver a intentar.';
    }
    if (err.status === 400) {
      return 'Verifica el correo ingresado e intenta nuevamente.';
    }
    if (err.status >= 500) {
      return 'El servicio no está disponible en este momento. Intenta nuevamente más tarde.';
    }
    return 'No se pudo procesar la solicitud. Intenta nuevamente.';
  }
}
