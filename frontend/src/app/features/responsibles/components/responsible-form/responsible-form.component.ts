import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ResponsibleService } from '../../services/responsible.service';
import { UserService } from '../../../users/services/user.service';

@Component({
  selector: 'app-responsible-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatCardModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule, MatSnackBarModule],
  template: `
    <div class="container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>{{ isEditMode ? 'Editar' : 'Nuevo' }} Responsable</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <form [formGroup]="form" (ngSubmit)="onSubmit()">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Nombre</mat-label>
              <input matInput formControlName="name">
              <mat-error *ngIf="form.get('name')?.hasError('required')">Requerido</mat-error>
            </mat-form-field>
            
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Cargo</mat-label>
              <input matInput formControlName="position">
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Título</mat-label>
              <input matInput formControlName="title">
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Especialidades</mat-label>
              <input matInput formControlName="specialties">
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Usuario en Sistema (Opcional)</mat-label>
              <mat-select formControlName="userId">
                <mat-option [value]="null">-- Ninguno --</mat-option>
                <mat-option *ngFor="let u of users" [value]="u.id">{{u.name}} ({{u.email}})</mat-option>
              </mat-select>
            </mat-form-field>

            <div class="actions">
              <button mat-button type="button" (click)="cancel()">Cancelar</button>
              <button mat-raised-button color="primary" type="submit" [disabled]="form.invalid">Guardar</button>
            </div>
          </form>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .container { padding: 20px; max-width: 600px; margin: auto; }
    .full-width { width: 100%; margin-bottom: 15px; }
    .actions { display: flex; justify-content: flex-end; gap: 10px; margin-top: 20px; }
  `]
})
export class ResponsibleFormComponent implements OnInit {
  form: FormGroup;
  isEditMode = false;
  responsibleId: string | null = null;
  users: any[] = [];

  constructor(
    private fb: FormBuilder,
    private responsibleService: ResponsibleService,
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      position: [''],
      title: [''],
      specialties: [''],
      userId: [null]
    });
  }

  ngOnInit(): void {
    this.userService.getUsers().subscribe(u => this.users = u);
    
    this.responsibleId = this.route.snapshot.paramMap.get('id');
    if (this.responsibleId) {
      this.isEditMode = true;
      this.responsibleService.getResponsibleById(this.responsibleId).subscribe({
        next: (data) => this.form.patchValue(data),
        error: () => this.snackBar.open('Error al cargar', 'Cerrar', { duration: 3000 })
      });
    }
  }

  onSubmit(): void {
    if (this.form.invalid) return;

    const req = this.form.value;
    
    if (this.isEditMode && this.responsibleId) {
      this.responsibleService.updateResponsible(this.responsibleId, req).subscribe({
        next: () => {
          this.snackBar.open('Actualizado con éxito', 'Cerrar', { duration: 3000 });
          this.router.navigate(['/responsibles']);
        },
        error: (err) => this.snackBar.open(err.error?.message || err.error || 'Error', 'Cerrar', { duration: 3000 })
      });
    } else {
      this.responsibleService.createResponsible(req).subscribe({
        next: () => {
          this.snackBar.open('Creado con éxito', 'Cerrar', { duration: 3000 });
          this.router.navigate(['/responsibles']);
        },
        error: (err) => this.snackBar.open(err.error?.message || err.error || 'Error', 'Cerrar', { duration: 3000 })
      });
    }
  }

  cancel(): void {
    this.router.navigate(['/responsibles']);
  }
}
