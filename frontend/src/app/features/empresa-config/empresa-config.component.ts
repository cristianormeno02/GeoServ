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
import { ChangeDetectorRef } from '@angular/core';

import { EmpresaConfigService, EmpresaConfigData } from './empresa-config.service';

import { forkJoin } from 'rxjs';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';

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
    MatSnackBarModule,
    MatSelectModule,
    MatTabsModule
  ],
  templateUrl: './empresa-config.component.html',
  styleUrls: ['./empresa-config.component.css']
})
export class EmpresaConfigComponent implements OnInit {
  private fb = inject(FormBuilder);
  private empresaService = inject(EmpresaConfigService);
  private snackBar = inject(MatSnackBar);
  private sanitizer = inject(DomSanitizer);
  private cdr = inject(ChangeDetectorRef);

  configForm: FormGroup;
  settingsForm: FormGroup;
  smtpForm: FormGroup;
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

    this.settingsForm = this.fb.group({
      os_number_format: ['manual']
    });

    this.smtpForm = this.fb.group({
      smtp_host: [''],
      smtp_port: [''],
      smtp_user: [''],
      smtp_password: [''],
      smtp_from: ['']
    });
  }

  ngOnInit(): void {
    this.loadConfig();
    this.loadSettings();
  }

  loadSettings() {
    this.empresaService.getSettings().subscribe({
      next: (settings: any) => {
        if (settings['os_number_format']) {
          this.settingsForm.patchValue({
            os_number_format: settings['os_number_format'].value
          });
        }
        if (settings['smtp_host']) this.smtpForm.patchValue({ smtp_host: settings['smtp_host'].value });
        if (settings['smtp_port']) this.smtpForm.patchValue({ smtp_port: settings['smtp_port'].value });
        if (settings['smtp_user']) this.smtpForm.patchValue({ smtp_user: settings['smtp_user'].value });
        if (settings['smtp_password']) this.smtpForm.patchValue({ smtp_password: settings['smtp_password'].value });
        if (settings['smtp_from']) this.smtpForm.patchValue({ smtp_from: settings['smtp_from'].value });
      },
      error: (err) => console.error(err)
    });
  }

  private prepareSvgUrl(svg: string): SafeHtml {
    const base64 = btoa(unescape(encodeURIComponent(svg)));
    return this.sanitizer.bypassSecurityTrustResourceUrl(`data:image/svg+xml;base64,${base64}`);
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
          this.currentLogoSvg = this.prepareSvgUrl(data.logoSvg);
        }
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.isLoading = false;
        if (err.status !== 404) {
          this.showError('Error al cargar la configuración de la empresa');
          console.error(err);
        }
        this.cdr.detectChanges();
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
      
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          this.currentLogoSvg = this.prepareSvgUrl(e.target.result as string);
        }
      };
      reader.readAsText(file);
    }
  }

  saveAll() {
    if (this.configForm.invalid || this.settingsForm.invalid || this.smtpForm.invalid) {
      return;
    }

    this.isLoading = true;

    // 1. Preparar datos de empresa
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

    // 2. Preparar configuraciones adicionales
    const settings = {
      os_number_format: {
        value: this.settingsForm.value.os_number_format,
        valueType: 'string',
        description: 'Formato de numeración de órdenes de servicio',
        group: 'Ordenes de Servicio'
      },
      smtp_host: { value: this.smtpForm.value.smtp_host, valueType: 'string', description: 'Servidor SMTP', group: 'Correo Avisos' },
      smtp_port: { value: this.smtpForm.value.smtp_port, valueType: 'string', description: 'Puerto SMTP', group: 'Correo Avisos' },
      smtp_user: { value: this.smtpForm.value.smtp_user, valueType: 'string', description: 'Usuario SMTP', group: 'Correo Avisos' },
      smtp_password: { value: this.smtpForm.value.smtp_password, valueType: 'string', description: 'Contraseña SMTP', group: 'Correo Avisos' },
      smtp_from: { value: this.smtpForm.value.smtp_from, valueType: 'string', description: 'Remitente', group: 'Correo Avisos' }
    };

    // 3. Ejecutar ambas peticiones en paralelo
    forkJoin({
      config: this.empresaService.saveConfig(formData),
      settings: this.empresaService.updateSettings(settings)
    }).subscribe({
      next: (results) => {
        this.isLoading = false;
        this.showSuccess('Configuraciones guardadas exitosamente');
        this.selectedFile = null;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error capturado en saveAll():', err);
        this.isLoading = false;
        const errorMsg = err.error?.message || err.error?.title || 'Error al guardar las configuraciones';
        this.showError(errorMsg);
        this.cdr.detectChanges();
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
