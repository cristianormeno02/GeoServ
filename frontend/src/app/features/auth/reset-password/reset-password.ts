import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { EmpresaConfigService } from '../../../core/services/empresa-config.service';
import { AuthService } from '../../../core/services/auth.service';

/** Longitud mínima de contraseña (debe coincidir con el backend). */
export const MIN_PASSWORD_LENGTH = 6;

@Component({
  selector: 'app-reset-password',
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
  templateUrl: './reset-password.html',
  styleUrl: './reset-password.css',
})
export class ResetPassword implements OnInit, OnDestroy {
  resetForm: FormGroup;
  hidePassword = true;
  isLoading = false;
  isSuccess = false;
  /** El enlace no trae token o el servidor lo rechazó (inválido, vencido o ya usado). */
  linkInvalid = false;
  errorMessage = '';
  token = '';
  private destroyed = false;
  readonly minPasswordLength = MIN_PASSWORD_LENGTH;

  // App Branding
  appName = 'GeoServ';
  appLogo = '/assets/geoserv-logo.svg';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    public empresaConfig: EmpresaConfigService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {
    this.resetForm = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(MIN_PASSWORD_LENGTH)]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.token = params['token'] ?? '';
      this.linkInvalid = !this.token;
    });
  }

  ngOnDestroy(): void {
    this.destroyed = true;
  }

  /** Las respuestas HTTP no refrescan la vista por sí solas en esta app (ver login), por eso se fuerza. */
  private refresh(): void {
    if (!this.destroyed) {
      this.cdr.detectChanges();
    }
  }

  passwordMatchValidator(g: AbstractControl): ValidationErrors | null {
    return g.get('password')?.value === g.get('confirmPassword')?.value
      ? null : { mismatch: true };
  }

  onSubmit(): void {
    if (!this.token || this.isLoading) return;

    if (this.resetForm.invalid) {
      this.resetForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const tenantId = this.empresaConfig.obtenerSubdominioActual() || 'default';

    this.authService.resetPassword(this.token, this.resetForm.value.password, tenantId).subscribe({
      next: () => {
        this.isLoading = false;
        this.isSuccess = true;
        this.refresh();
      },
      error: (err: HttpErrorResponse) => {
        this.isLoading = false;
        if (err.status === 400 && this.isLinkError(err)) {
          this.linkInvalid = true;
        } else if (err.status === 400) {
          this.errorMessage = `La contraseña debe tener al menos ${MIN_PASSWORD_LENGTH} caracteres.`;
        } else if (err.status === 0) {
          this.errorMessage = 'No hay conexión con el servidor. Revisa tu conexión a internet e intenta nuevamente.';
        } else {
          this.errorMessage = 'No se pudo restablecer la contraseña. Intenta nuevamente más tarde.';
        }
        this.refresh();
      }
    });
  }

  /** El backend responde 400 tanto por enlace inválido como por contraseña débil; se distingue por el detalle. */
  private isLinkError(err: HttpErrorResponse): boolean {
    const detail: string = err.error?.detail ?? '';
    return !detail.toLowerCase().includes('contraseña');
  }
}
