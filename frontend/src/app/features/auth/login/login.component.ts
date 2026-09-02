import { Component, OnInit, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { Router } from '@angular/router';
import { EmpresaConfigService } from '../../../core/services/empresa-config.service';
import { AuthService } from '../../../core/services/auth.service';

declare var google: any;

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
    MatFormFieldModule,
    MatCheckboxModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit, AfterViewInit {
  loginForm: FormGroup;
  hidePassword = true;
  isLoading = false;
  errorMessage = '';
  isError = true;

  // App Branding
  appName = 'GeoServ';
  appLogo = '/assets/geoserv-logo.svg';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    public empresaConfig: EmpresaConfigService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      rememberMe: [false]
    });
  }

  ngOnInit(): void {
    // Intentar cargar la configuración inicial si es posible (opcional)
  }

  ngAfterViewInit(): void {
    if (typeof google !== 'undefined' && google.accounts) {
      google.accounts.id.initialize({
        client_id: '681219359856-l8f77bv2dtku580h4t1mt93gbthsse6g.apps.googleusercontent.com',
        callback: this.handleGoogleResponse.bind(this)
      });
      google.accounts.id.renderButton(
        document.getElementById('google-btn-container'),
        { theme: 'outline', size: 'large', text: 'signin_with', width: 280 }
      );
    }
  }

  handleGoogleResponse(response: any) {
    if (response.credential) {
      this.isLoading = true;
      this.errorMessage = '';
      this.cdr.detectChanges();
      
      const tenantId = this.empresaConfig.obtenerSubdominioActual() || 'default';
      
      // Llamamos al servicio de auth para el login con google (requiere implementación en backend)
      this.authService.loginWithGoogle(response.credential, tenantId).subscribe({
        next: () => {
          this.empresaConfig.cargarConfiguracion().subscribe({
            next: () => {
              this.router.navigate(['/']);
            },
            error: () => {
              this.isLoading = false;
              this.isError = true;
              this.errorMessage = 'No se pudo cargar la configuración de la empresa.';
              this.cdr.detectChanges();
            }
          });
        },
        error: (err) => {
          console.error('Error de login con Google:', err);
          this.isLoading = false;
          this.isError = true;
          this.errorMessage = 'No se pudo iniciar sesión con Google.';
          this.cdr.detectChanges();
        }
      });
    }
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      this.isError = true;
      this.errorMessage = 'Faltan campos requeridos o son inválidos.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    
    const tenantId = this.empresaConfig.obtenerSubdominioActual() || 'default'; // Subdominio extraído
    const loginData = {
      email: this.loginForm.value.email,
      password: this.loginForm.value.password,
      tenantId: tenantId 
    };
    
    const rememberMe = this.loginForm.value.rememberMe;

    this.authService.login(loginData, tenantId, rememberMe).subscribe({
      next: () => {
        // El AuthService ya guarda el token. Ahora cargamos la configuración:
        this.empresaConfig.cargarConfiguracion().subscribe({
          next: () => {
            this.router.navigate(['/']); // Redirigir al inicio/dashboard
          },
          error: () => {
            this.isLoading = false;
            this.isError = true;
            this.errorMessage = 'No se pudo cargar la configuración de la empresa.';
            this.cdr.detectChanges();
          }
        });
      },
      error: (err) => {
        console.error('Error de login:', err);
        this.isLoading = false;
        this.isError = true;
        if (err.status === 401 || err.status === 403) {
          this.errorMessage = 'Credenciales incorrectas.';
        } else {
          this.errorMessage = 'Ocurrió un error al intentar iniciar sesión.';
        }
        this.cdr.detectChanges();
      }
    });
  }
}
