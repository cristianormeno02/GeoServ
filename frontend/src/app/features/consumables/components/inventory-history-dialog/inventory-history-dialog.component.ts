import { Component, Inject, OnInit } from '@angular/core';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { InventoryMovementService } from '../../services/inventory-movement.service';
import { InventoryMovement, InventoryMovementType } from '../../models/inventory-movement.model';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-inventory-history-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatTableModule, MatButtonModule, MatIconModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatSnackBarModule ],
  template: `
    <h2 mat-dialog-title>Historial de Movimientos</h2>
    <mat-dialog-content>
      
      <div *ngIf="!showNewForm">
        <table mat-table [dataSource]="movements" class="mat-elevation-z2" style="width: 100%;">
          <ng-container matColumnDef="fecha">
            <th mat-header-cell *matHeaderCellDef> Fecha </th>
            <td mat-cell *matCellDef="let el"> {{el.fecha | date:'shortDate'}} </td>
          </ng-container>
          <ng-container matColumnDef="tipo">
            <th mat-header-cell *matHeaderCellDef> Tipo </th>
            <td mat-cell *matCellDef="let el"> {{el.movementType}} </td>
          </ng-container>
          <ng-container matColumnDef="cantidad">
            <th mat-header-cell *matHeaderCellDef> Cantidad </th>
            <td mat-cell *matCellDef="let el" [ngClass]="el.cantidad < 0 ? 'text-danger' : 'text-success'">
               {{el.cantidad > 0 ? '+' : ''}}{{el.cantidad}} 
            </td>
          </ng-container>
          <ng-container matColumnDef="motivo">
            <th mat-header-cell *matHeaderCellDef> Motivo </th>
            <td mat-cell *matCellDef="let el"> {{el.motivo}} </td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="['fecha', 'tipo', 'cantidad', 'motivo']"></tr>
          <tr mat-row *matRowDef="let row; columns: ['fecha', 'tipo', 'cantidad', 'motivo'];"></tr>
        </table>
        
        <div style="margin-top: 15px;">
           <button mat-stroked-button color="primary" (click)="showNewForm = true">
             <mat-icon>add</mat-icon> Registrar Movimiento Manual
           </button>
        </div>
      </div>

      <div *ngIf="showNewForm">
        <h3>Nuevo Movimiento Manual</h3>
        <form [formGroup]="form" style="display:flex; flex-direction:column; gap:10px;">
          <mat-form-field appearance="outline">
            <mat-label>Tipo</mat-label>
            <mat-select formControlName="movementType">
              <mat-option value="AjustePositivo">Ajuste Positivo</mat-option>
              <mat-option value="AjusteNegativo">Ajuste Negativo</mat-option>
              <mat-option value="ConsumoInterno">Consumo Interno</mat-option>
            </mat-select>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Cantidad</mat-label>
            <input matInput type="number" formControlName="cantidad">
          </mat-form-field>

          <mat-form-field appearance="outline" *ngIf="isAjuste">
            <mat-label>Motivo</mat-label>
            <input matInput formControlName="motivo">
          </mat-form-field>
        </form>
      </div>

    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="close()">Cerrar</button>
      <button mat-button *ngIf="showNewForm" (click)="showNewForm = false">Volver</button>
      <button mat-raised-button color="primary" *ngIf="showNewForm" [disabled]="form.invalid" (click)="save()">Guardar</button>
    </mat-dialog-actions>
  `,
  styles: [`
    .text-danger { color: red; }
    .text-success { color: green; }
  `]
})
export class InventoryHistoryDialogComponent implements OnInit {
  movements: InventoryMovement[] = [];
  showNewForm = false;
  form: FormGroup;
  
  constructor(
    private dialogRef: MatDialogRef<InventoryHistoryDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { consumableId: string },
    private invService: InventoryMovementService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) {
    this.form = this.fb.group({
      movementType: ['AjusteNegativo', Validators.required],
      cantidad: [1, [Validators.required, Validators.min(0.01)]],
      motivo: ['']
    });

    this.form.get('movementType')?.valueChanges.subscribe(val => {
       if (val === 'AjusteNegativo' || val === 'AjustePositivo') {
         this.form.get('motivo')?.setValidators(Validators.required);
       } else {
         this.form.get('motivo')?.clearValidators();
       }
       this.form.get('motivo')?.updateValueAndValidity();
    });
  }

  get isAjuste() {
    const val = this.form.get('movementType')?.value;
    return val === 'AjusteNegativo' || val === 'AjustePositivo';
  }

  ngOnInit() {
    this.loadMovements();
  }

  loadMovements() {
    this.invService.getMovementsByConsumableId(this.data.consumableId).subscribe(res => {
      this.movements = res;
    });
  }

    save() {
    if(this.form.invalid) return;
    const val = this.form.value;
    
    // Validar motivo para ajustes
    if ((val.movementType === 'AjustePositivo' || val.movementType === 'AjusteNegativo') && !val.motivo?.trim()) {
       this.snackBar.open('Debes ingresar un motivo para el ajuste', 'Cerrar', { duration: 3000 });
       return;
    }

    let qty = val.cantidad;
    if (val.movementType === 'AjusteNegativo' || val.movementType === 'ConsumoInterno') {
      qty = -Math.abs(qty); // Ensure it's negative
    } else {
      qty = Math.abs(qty); // Ensure it's positive
    }

    const payload: InventoryMovement = {
      consumableId: this.data.consumableId,
      movementType: val.movementType,
      cantidad: qty,
      motivo: val.motivo,
      fecha: new Date().toISOString()
    };

    this.invService.createMovement(payload).subscribe({
      next: () => {
        this.showNewForm = false;
        this.form.reset({ movementType: 'AjusteNegativo', cantidad: 1, motivo: '' });
        this.loadMovements();
        this.snackBar.open('Movimiento guardado exitosamente', 'Cerrar', { duration: 3000 });
      },
      error: (err) => {
        let msg = err.error?.message || err.error?.detail || err.error?.title || 'Error al guardar el movimiento';
        this.snackBar.open(msg, 'Cerrar', { duration: 5000 });
      }
    });
  }

  close() {
    this.dialogRef.close();
  }
}

