import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Router } from '@angular/router';
import { EmpresaConfigService } from '../../../core/services/empresa-config.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  hidePassword = true;
  isLoading = false;
  errorMessage = '';

  // App Branding
  appName = 'GeoServ';
  appLogo = '/assets/geoserv-logo.svg';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    public empresaConfig: EmpresaConfigService,
    private authService: AuthService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    // Intentar cargar la configuración inicial si es posible (opcional)
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';
      
      const tenantId = this.empresaConfig.obtenerSubdominioActual() || 'default'; // Subdominio extraído
      const loginData = {
        email: this.loginForm.value.email,
        password: this.loginForm.value.password,
        tenantId: tenantId 
      };

      this.authService.login(loginData, tenantId).subscribe({
        next: () => {
          // El AuthService ya guarda el token. Ahora cargamos la configuración:
          this.empresaConfig.cargarConfiguracion().subscribe({
            next: () => {
              this.router.navigate(['/']); // Redirigir al inicio/dashboard
            },
            error: () => {
              this.isLoading = false;
              this.errorMessage = 'No se pudo cargar la configuración de la empresa.';
            }
          });
        },
        error: (err) => {
          console.error('Error de login:', err);
          this.isLoading = false;
          this.errorMessage = 'Credenciales incorrectas o problema de conexión.';
        }
      });
    }
  }
}
