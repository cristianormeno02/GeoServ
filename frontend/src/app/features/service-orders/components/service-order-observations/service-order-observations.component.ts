import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-service-order-observations',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule
  ],
  templateUrl: './service-order-observations.component.html',
  styleUrls: ['./service-order-observations.component.scss']
})
export class ServiceOrderObservationsComponent {
  @Input() serviceOrderId: string | null = null;
  @Input() observations: any[] = [];
  @Output() observationAdded = new EventEmitter<any>();
  @Output() observationDeleted = new EventEmitter<string>();

  constructor(private dialog: MatDialog) {}

  newObservationText: string = '';
  observationType: string = 'Nota General';
  isSavingObservation = false;

  observationTypes = [
    { value: 'Nota General', color: '#1976d2' }, // Azul
    { value: 'Alerta Operativa', color: '#ff9800' }, // Naranja/Amarillo
    { value: 'Novedad Contable', color: '#f44336' }, // Rojo
    { value: 'Hito Clave', color: '#4caf50' } // Verde
  ];

  saveObservation() {
    if (!this.newObservationText.trim() || !this.serviceOrderId) return;
    
    this.isSavingObservation = true;
    const payload = {
      text: this.newObservationText,
      observationType: this.observationType
    };

    this.observationAdded.emit(payload);
    
    // In a real app we might wait for the parent to say "done" before clearing
    // but here we just clear the form.
    this.newObservationText = '';
    this.observationType = 'Nota General';
    this.isSavingObservation = false;
  }

  getColor(type: string): string {
    const found = this.observationTypes.find(t => t.value === type);
    return found ? found.color : '#757575';
  }

  deleteObservation(id: string) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Eliminar Observación',
        message: '¿Está seguro de eliminar esta observación?',
        isDestructive: true,
        confirmText: 'Eliminar'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.observationDeleted.emit(id);
      }
    });
  }
}
