import { Component, Inject, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { GoogleMapsModule } from '@angular/google-maps';

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
    MatButtonModule,
    GoogleMapsModule
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
          <textarea matInput formControlName="description" rows="3" maxlength="500" #projDesc></textarea>
          <mat-hint align="end">{{projDesc.value.length}} / 500</mat-hint>
        </mat-form-field>

        <div class="coords-row">
          <mat-form-field appearance="outline" class="coord-field">
            <mat-label>Latitud</mat-label>
            <input matInput type="number" formControlName="latitud" step="0.000001">
            <mat-error *ngIf="projectForm.get('latitud')?.hasError('min') || projectForm.get('latitud')?.hasError('max')">
              Debe estar entre -90 y 90
            </mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline" class="coord-field">
            <mat-label>Longitud</mat-label>
            <input matInput type="number" formControlName="longitud" step="0.000001">
            <mat-error *ngIf="projectForm.get('longitud')?.hasError('min') || projectForm.get('longitud')?.hasError('max')">
              Debe estar entre -180 y 180
            </mat-error>
          </mat-form-field>
        </div>

        <div class="map-container">
          <google-map 
            width="100%" 
            height="300px" 
            [center]="mapCenter" 
            [zoom]="mapZoom"
            [options]="mapOptions"
            (mapClick)="onMapClick($event)">
            <map-marker 
              *ngIf="markerPosition" 
              [position]="markerPosition" 
              [options]="{draggable: true}"
              (mapDragend)="onMarkerDragEnd($event)">
            </map-marker>
          </google-map>
        </div>
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
      gap: 12px;
      padding-top: 10px;
    }
    .coords-row {
      display: flex;
      gap: 16px;
    }
    .coord-field {
      flex: 1;
    }
    .map-container {
      margin-top: 4px;
      margin-bottom: 8px;
      border: 1px solid #ccc;
      border-radius: 4px;
      overflow: hidden;
    }
  `]
})
export class ProjectDialogComponent implements OnInit {
  private fb = inject(FormBuilder);
  public dialogRef = inject(MatDialogRef<ProjectDialogComponent>);
  
  projectForm: FormGroup;
  isEdit = false;

  mapOptions: google.maps.MapOptions = { mapTypeId: 'hybrid' };
  mapCenter: google.maps.LatLngLiteral = { lat: -34.6037, lng: -58.3816 }; // Buenos Aires default
  mapZoom = 10;
  markerPosition: google.maps.LatLngLiteral | null = null;

  constructor(@Inject(MAT_DIALOG_DATA) public data: { project?: Project }) {
    this.isEdit = !!data?.project;
    
    this.projectForm = this.fb.group({
      name: [data?.project?.name || '', Validators.required],
      description: [data?.project?.description || ''],
      latitud: [data?.project?.latitud || null, [Validators.min(-90), Validators.max(90)]],
      longitud: [data?.project?.longitud || null, [Validators.min(-180), Validators.max(180)]]
    });

    if (data?.project?.latitud && data?.project?.longitud) {
      this.markerPosition = { lat: data.project.latitud, lng: data.project.longitud };
      this.mapCenter = this.markerPosition;
      this.mapZoom = 14;
    }

    // Sync form to map
    this.projectForm.get('latitud')?.valueChanges.subscribe(lat => this.updateMarkerFromForm());
    this.projectForm.get('longitud')?.valueChanges.subscribe(lng => this.updateMarkerFromForm());
  }

  ngOnInit(): void {
  }

  updateMarkerFromForm() {
    const lat = this.projectForm.get('latitud')?.value;
    const lng = this.projectForm.get('longitud')?.value;
    
    if (lat != null && lng != null && lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) {
      this.markerPosition = { lat: Number(lat), lng: Number(lng) };
      this.mapCenter = this.markerPosition;
    } else {
      this.markerPosition = null;
    }
  }

  onMapClick(event: google.maps.MapMouseEvent) {
    if (event.latLng) {
      this.updateFormFromMap(event.latLng);
    }
  }

  onMarkerDragEnd(event: google.maps.MapMouseEvent) {
    if (event.latLng) {
      this.updateFormFromMap(event.latLng);
    }
  }

  private updateFormFromMap(latLng: google.maps.LatLng) {
    this.projectForm.patchValue({
      latitud: parseFloat(latLng.lat().toFixed(6)),
      longitud: parseFloat(latLng.lng().toFixed(6))
    }, { emitEvent: false }); // prevent cyclic updates
    this.markerPosition = { lat: latLng.lat(), lng: latLng.lng() };
  }

  save() {
    if (this.projectForm.valid) {
      this.dialogRef.close(this.projectForm.value);
    }
  }
}
