import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatChipsModule } from '@angular/material/chips';

import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';
import { UserDialogComponent } from '../user-dialog/user-dialog.component';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatSnackBarModule,
    MatChipsModule
  ],
  template: `
    <div class="user-container">
      <div class="header">
        <h1>Gestión de Usuarios</h1>
        <button mat-raised-button color="primary" (click)="openDialog()">
          <mat-icon>add</mat-icon> Nuevo Usuario
        </button>
      </div>

      <mat-form-field appearance="outline" class="search-field">
        <mat-label>Buscar usuario...</mat-label>
        <input matInput (input)="applyFilter($event)" placeholder="Ej. Juan Pérez, admin@..." #input>
        <mat-icon matSuffix>search</mat-icon>
      </mat-form-field>

      <div class="table-container mat-elevation-z8">
        <table mat-table [dataSource]="dataSource" matSort>

          <!-- Name Column -->
          <ng-container matColumnDef="name">
            <th mat-header-cell *matHeaderCellDef mat-sort-header> Nombre </th>
            <td mat-cell *matCellDef="let element"> {{element.name}} </td>
          </ng-container>

          <!-- Email Column -->
          <ng-container matColumnDef="email">
            <th mat-header-cell *matHeaderCellDef mat-sort-header> Email </th>
            <td mat-cell *matCellDef="let element"> {{element.email}} </td>
          </ng-container>

          <!-- Role Column -->
          <ng-container matColumnDef="role">
            <th mat-header-cell *matHeaderCellDef mat-sort-header> Rol </th>
            <td mat-cell *matCellDef="let element"> {{element.roleName}} </td>
          </ng-container>

          <!-- Status Column -->
          <ng-container matColumnDef="isActive">
            <th mat-header-cell *matHeaderCellDef mat-sort-header> Estado </th>
            <td mat-cell *matCellDef="let element"> 
              <mat-chip-set>
                <mat-chip [color]="element.isActive ? 'primary' : 'warn'" highlighted>
                  {{ element.isActive ? 'Activo' : 'Inactivo' }}
                </mat-chip>
              </mat-chip-set>
            </td>
          </ng-container>

          <!-- Actions Column -->
          <ng-container matColumnDef="actions">
            <th mat-header-cell *matHeaderCellDef> Acciones </th>
            <td mat-cell *matCellDef="let element">
              <div class="action-buttons">
                <button mat-icon-button color="primary" (click)="openDialog(element)">
                  <mat-icon>edit</mat-icon>
                </button>
                <button mat-icon-button color="warn" (click)="deleteUser(element)">
                  <mat-icon>delete</mat-icon>
                </button>
              </div>
            </td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>

          <!-- Row shown when there is no matching data. -->
          <tr class="mat-row" *matNoDataRow>
            <td class="mat-cell" colspan="5">No se encontraron datos que coincidan con la búsqueda "{{input.value}}"</td>
          </tr>
        </table>
        
        <mat-paginator [pageSize]="10" [pageSizeOptions]="[5, 10, 25, 100]" aria-label="Seleccionar página de usuarios"></mat-paginator>
      </div>
    </div>
  `,
  styles: [`
    .user-container {
      padding: 20px;
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }
    .search-field {
      width: 100%;
      margin-bottom: 10px;
    }
    .table-container {
      border-radius: 8px;
      overflow: hidden;
    }
    table {
      width: 100%;
    }
    .mat-column-actions {
      width: 120px;
      text-align: center;
    }
    .action-buttons {
      display: flex;
      justify-content: center;
      gap: 8px;
      white-space: nowrap;
    }
  `]
})
export class UserListComponent implements OnInit {
  private userService = inject(UserService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);

  displayedColumns: string[] = ['name', 'email', 'role', 'isActive', 'actions'];
  dataSource: MatTableDataSource<User> = new MatTableDataSource();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers() {
    this.userService.getUsers().subscribe({
      next: (data) => {
        this.dataSource = new MatTableDataSource(data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        
        this.dataSource.filterPredicate = (user: User, filter: string) => {
          const searchStr = `${user.name || ''} ${user.email || ''} ${user.roleName || ''}`.toLowerCase();
          return searchStr.includes(filter.toLowerCase());
        };
      },
      error: (err) => {
        this.showError('Error al cargar usuarios');
        console.error(err);
      }
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  openDialog(user?: User) {
    const dialogRef = this.dialog.open(UserDialogComponent, {
      width: '500px',
      data: { user }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (user && user.id) {
          // Edit
          this.userService.updateUser(user.id, result).subscribe({
            next: () => {
              this.showSuccess('Usuario actualizado exitosamente');
              this.loadUsers();
            },
            error: (err) => {
              const errorMsg = err.error?.message || err.error?.title || 'Error al actualizar el usuario';
              this.showError(errorMsg);
              console.error(err);
            }
          });
        } else {
          // Create
          this.userService.createUser(result).subscribe({
            next: () => {
              this.showSuccess('Usuario creado exitosamente');
              this.loadUsers();
            },
            error: (err) => {
              const errorMsg = err.error?.message || err.error?.title || 'Error al crear el usuario';
              this.showError(errorMsg);
              console.error(err);
            }
          });
        }
      }
    });
  }

  deleteUser(user: User) {
    if (confirm(`¿Estás seguro de que deseas eliminar al usuario ${user.name}?`)) {
      this.userService.deleteUser(user.id).subscribe({
        next: () => {
          this.showSuccess('Usuario eliminado exitosamente');
          this.loadUsers();
        },
        error: (err) => {
          const errorMsg = err.error?.message || err.error?.title || 'Ocurrió un error al intentar eliminar el usuario';
          this.showError(errorMsg);
          console.error(err);
        }
      });
    }
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
