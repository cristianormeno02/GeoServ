import { Component, Inject, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

import { Project } from '../../models/project.model';

@Component({
  selector: 'app-project-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  template: `
    <h2 mat-dialog-title>{{ isEdit ? 'Modificar Proyecto' : 'Nuevo Proyecto' }}</h2>
    
    <mat-dialog-content>
      <form [formGroup]="projectForm" class="project-form">
        
        <mat-form-field appearance="outline">
          <mat-label>Nombre del Proyecto</mat-label>
          <input matInput formControlName="name" required maxlength="150" #projName>
          <mat-hint align="end">{{projName.value.length}} / 150</mat-hint>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Descripción</mat-label>
          <textarea matInput formControlName="description" rows="4" maxlength="500" #projDesc></textarea>
          <mat-hint align="end">{{projDesc.value.length}} / 500</mat-hint>
        </mat-form-field>

      </form>
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Cancelar</button>
      <button mat-raised-button color="primary" [disabled]="projectForm.invalid" (click)="save()">
        Guardar
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .project-form {
      display: flex;
      flex-direction: column;
      gap: 8px;
      padding-top: 10px;
      min-width: 400px;
    }
  `]
})
export class ProjectDialogComponent implements OnInit {
  private fb = inject(FormBuilder);
  public dialogRef = inject(MatDialogRef<ProjectDialogComponent>);
  
  projectForm: FormGroup;
  isEdit = false;

  constructor(@Inject(MAT_DIALOG_DATA) public data: { project?: Project }) {
    this.isEdit = !!data?.project;
    
    this.projectForm = this.fb.group({
      name: [data?.project?.name || '', Validators.required],
      description: [data?.project?.description || '']
    });
  }

  ngOnInit(): void {
  }

  save() {
    if (this.projectForm.valid) {
      this.dialogRef.close(this.projectForm.value);
    }
  }
}
