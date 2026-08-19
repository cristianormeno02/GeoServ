import { Component, Inject, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

import { UserService } from '../../services/user.service';
import { User, Role } from '../../models/user.model';

@Component({
  selector: 'app-user-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatSlideToggleModule
  ],
  template: `
    <h2 mat-dialog-title>{{ isEdit ? 'Modificar Usuario' : 'Nuevo Usuario' }}</h2>
    
    <mat-dialog-content>
      <form [formGroup]="userForm" class="user-form">
        
        <mat-form-field appearance="outline">
          <mat-label>Nombre</mat-label>
          <input matInput formControlName="name" required maxlength="100">
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Email</mat-label>
          <input matInput type="email" formControlName="email" required maxlength="100">
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Rol</mat-label>
          <mat-select formControlName="roleId" required [compareWith]="compareIds">
            <mat-option *ngFor="let role of roles" [value]="role.id">
              {{ role.name }}
            </mat-option>
          </mat-select>
        </mat-form-field>

        <mat-form-field appearance="outline" *ngIf="!isEdit">
          <mat-label>Contraseña</mat-label>
          <input matInput type="password" formControlName="password" required>
        </mat-form-field>
        
        <mat-form-field appearance="outline" *ngIf="isEdit">
          <mat-label>Nueva Contraseña (Opcional)</mat-label>
          <input matInput type="password" formControlName="password">
          <mat-hint>Dejar en blanco para mantener la actual</mat-hint>
        </mat-form-field>

        <div class="toggle-container">
          <mat-slide-toggle formControlName="isActive" color="primary">
            Activo
          </mat-slide-toggle>
        </div>

      </form>
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Cancelar</button>
      <button mat-raised-button color="primary" [disabled]="userForm.invalid" (click)="save()">
        Guardar
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .user-form {
      display: flex;
      flex-direction: column;
      gap: 16px;
      padding-top: 10px;
      min-width: 400px;
    }
    .toggle-container {
      margin-top: 8px;
      margin-bottom: 8px;
    }
  `]
})
export class UserDialogComponent implements OnInit {
  private fb = inject(FormBuilder);
  private userService = inject(UserService);
  public dialogRef = inject(MatDialogRef<UserDialogComponent>);
  
  userForm: FormGroup;
  isEdit = false;
  roles: Role[] = [];

  constructor(@Inject(MAT_DIALOG_DATA) public data: { user?: User }) {
    this.isEdit = !!data?.user;
    
    this.userForm = this.fb.group({
      name: [data?.user?.name || '', Validators.required],
      email: [data?.user?.email || '', [Validators.required, Validators.email]],
      roleId: [data?.user?.roleId || '', Validators.required],
      password: [this.isEdit ? '' : '', this.isEdit ? [] : [Validators.required]],
      isActive: [this.isEdit ? data.user!.isActive : true]
    });
  }

  ngOnInit(): void {
    this.loadRoles();
  }

  loadRoles() {
    this.userService.getRoles().subscribe({
      next: (roles) => {
        this.roles = roles;
      },
      error: (err) => console.error('Error loading roles', err)
    });
  }

  compareIds(c1: any, c2: any): boolean {
    if (!c1 || !c2) return c1 === c2;
    return c1.toString().toLowerCase() === c2.toString().toLowerCase();
  }

  save() {
    if (this.userForm.valid) {
      this.dialogRef.close(this.userForm.value);
    }
  }
}
