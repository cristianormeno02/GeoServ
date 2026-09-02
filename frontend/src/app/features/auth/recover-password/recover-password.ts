import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Router, RouterModule } from '@angular/router';
import { EmpresaConfigService } from '../../../core/services/empresa-config.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-recover-password',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule
  ],
  templateUrl: './recover-password.html',
  styleUrl: './recover-password.css',
})
export class RecoverPassword {
  recoverForm: FormGroup;
  isLoading = false;
  isSuccess = false;
  errorMessage = '';
  isError = true;

  // App Branding
  appName = 'GeoServ';
  appLogo = '/assets/geoserv-logo.svg';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    public empresaConfig: EmpresaConfigService,
    private authService: AuthService
  ) {
    this.recoverForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit() {
    if (this.recoverForm.invalid) {
      this.recoverForm.markAllAsTouched();
      this.isError = true;
      this.errorMessage = 'Ingresa un correo electrónico válido.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    
    const tenantId = this.empresaConfig.obtenerSubdominioActual() || 'default';
    
    this.authService.recoverPassword(this.recoverForm.value.email, tenantId).subscribe({
      next: () => {
        this.isLoading = false;
        this.isSuccess = true;
      },
      error: (err) => {
        console.error('Error al recuperar contraseña:', err);
        this.isLoading = false;
        this.isError = true;
        this.errorMessage = 'No se pudo enviar el correo de recuperación. Intenta nuevamente.';
      }
    });
  }
}
