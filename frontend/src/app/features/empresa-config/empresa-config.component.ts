import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

import { EmpresaConfigService, EmpresaConfigData } from './empresa-config.service';

@Component({
  selector: 'app-empresa-config',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatSnackBarModule
  ],
  templateUrl: './empresa-config.component.html',
  styleUrls: ['./empresa-config.component.css']
})
export class EmpresaConfigComponent implements OnInit {
  private fb = inject(FormBuilder);
  private empresaService = inject(EmpresaConfigService);
  private snackBar = inject(MatSnackBar);
  private sanitizer = inject(DomSanitizer);

  configForm: FormGroup;
  selectedFile: File | null = null;
  currentLogoSvg: SafeHtml | null = null;
  isLoading = false;

  constructor() {
    this.configForm = this.fb.group({
      nombre: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email]],
      telefono: [''],
      direccion: [''],
      taxId: [''],
      subdominio: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadConfig();
  }

  loadConfig() {
    this.isLoading = true;
    this.empresaService.getConfig().subscribe({
      next: (data: EmpresaConfigData) => {
        this.configForm.patchValue({
          nombre: data.nombre,
          correo: data.correo,
          telefono: data.telefono,
          direccion: data.direccion,
          taxId: data.taxId,
          subdominio: data.subdominio
        });
        if (data.logoSvg) {
          this.currentLogoSvg = this.sanitizer.bypassSecurityTrustHtml(data.logoSvg);
        }
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
        if (err.status !== 404) {
          this.showError('Error al cargar la configuración de la empresa');
          console.error(err);
        }
      }
    });
  }

  onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      if (file.type !== 'image/svg+xml') {
        this.showError('Solo se permiten archivos SVG');
        return;
      }
      this.selectedFile = file;
      
      // Mostrar preview
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          this.currentLogoSvg = this.sanitizer.bypassSecurityTrustHtml(e.target.result as string);
        }
      };
      reader.readAsText(file);
    }
  }

  save() {
    if (this.configForm.invalid) {
      return;
    }

    this.isLoading = true;
    const formData = new FormData();
    const formValues = this.configForm.value;

    formData.append('Nombre', formValues.nombre);
    formData.append('Correo', formValues.correo);
    formData.append('Telefono', formValues.telefono || '');
    formData.append('Direccion', formValues.direccion || '');
    formData.append('TaxId', formValues.taxId || '');
    formData.append('Subdominio', formValues.subdominio);

    if (this.selectedFile) {
      formData.append('LogoFile', this.selectedFile);
    }

    this.empresaService.saveConfig(formData).subscribe({
      next: (res) => {
        this.isLoading = false;
        this.showSuccess(res.message || 'Configuración guardada exitosamente');
        this.selectedFile = null; // Reiniciar archivo seleccionado
      },
      error: (err) => {
        this.isLoading = false;
        const errorMsg = err.error?.message || err.error?.title || 'Error al guardar la configuración';
        this.showError(errorMsg);
        console.error(err);
      }
    });
  }

  private showSuccess(message: string) {
    this.snackBar.open(message, 'Cerrar', {
      duration: 3000,
      panelClass: ['snackbar-success']
    });
  }

  private showError(message: string) {
    this.snackBar.open(message, 'Cerrar', {
      duration: 5000,
      panelClass: ['snackbar-error']
    });
  }
}
