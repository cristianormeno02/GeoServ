import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { Router } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ResponsibleService, Responsible } from '../../services/responsible.service';

@Component({
  selector: 'app-responsible-list',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatButtonModule, MatIconModule, MatCardModule, MatSnackBarModule],
  template: `
    <div class="container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>Responsables Maestros</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <div class="actions">
            <button mat-raised-button color="primary" (click)="create()">+ Nuevo Responsable</button>
          </div>
          <table mat-table [dataSource]="responsibles" class="mat-elevation-z8">
            <ng-container matColumnDef="name">
              <th mat-header-cell *matHeaderCellDef> Nombre </th>
              <td mat-cell *matCellDef="let element"> {{element.name}} </td>
            </ng-container>
            <ng-container matColumnDef="position">
              <th mat-header-cell *matHeaderCellDef> Cargo </th>
              <td mat-cell *matCellDef="let element"> {{element.position}} </td>
            </ng-container>
            <ng-container matColumnDef="userName">
              <th mat-header-cell *matHeaderCellDef> Usuario del Sistema </th>
              <td mat-cell *matCellDef="let element"> {{element.userName || 'No asignado'}} </td>
            </ng-container>
            <ng-container matColumnDef="actions">
              <th mat-header-cell *matHeaderCellDef> Acciones </th>
              <td mat-cell *matCellDef="let element">
                <button mat-icon-button color="primary" (click)="edit(element.id)">
                  <mat-icon>edit</mat-icon>
                </button>
                <button mat-icon-button color="warn" (click)="deleteResp(element.id)">
                  <mat-icon>delete</mat-icon>
                </button>
              </td>
            </ng-container>
            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
          </table>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .container { padding: 20px; }
    .actions { margin-bottom: 20px; display: flex; justify-content: flex-end; }
    table { width: 100%; }
  `]
})
export class ResponsibleListComponent implements OnInit {
  responsibles = new MatTableDataSource<Responsible>([]);
  displayedColumns: string[] = ['name', 'position', 'userName', 'actions'];

  constructor(
    private responsibleService: ResponsibleService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.responsibleService.getResponsibles().subscribe({
      next: (data) => this.responsibles.data = data,
      error: () => this.snackBar.open('Error al cargar', 'Cerrar', { duration: 4000, panelClass: ['snackbar-error'] })
    });
  }

  create(): void {
    this.router.navigate(['/responsibles/nuevo']);
  }

  edit(id: string): void {
    this.router.navigate(['/responsibles/editar', id]);
  }

  deleteResp(id: string): void {
    if (confirm('¿Está seguro de eliminar este responsable?')) {
      this.responsibleService.deleteResponsible(id).subscribe({
        next: () => {
          this.snackBar.open('Eliminado correctamente', 'Cerrar', { duration: 3000 });
          this.loadData();
        },
        error: (err) => this.snackBar.open(err.error?.message || 'Error al eliminar', 'Cerrar', { duration: 4000, panelClass: ['snackbar-error'] })
      });
    }
  }
}
