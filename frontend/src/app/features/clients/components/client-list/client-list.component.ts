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

import { ClientService } from '../../services/client.service';
import { Client } from '../../models/client.model';
import { ClientDialogComponent } from '../client-dialog/client-dialog.component';

@Component({
  selector: 'app-client-list',
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
    MatSnackBarModule
  ],
  template: `
    <div class="client-container">
      <div class="header">
        <h1>Gestión de Clientes</h1>
        <button mat-raised-button color="primary" (click)="openDialog()">
          <mat-icon>add</mat-icon> Nuevo Cliente
        </button>
      </div>

      <mat-form-field appearance="outline" class="search-field">
        <mat-label>Buscar cliente...</mat-label>
        <input matInput (input)="applyFilter($event)" placeholder="Ej. Empresa X, 12345678" #input>
        <mat-icon matSuffix>search</mat-icon>
      </mat-form-field>

      <div class="table-container mat-elevation-z8">
        <table mat-table [dataSource]="dataSource" matSort>

          <!-- Company Name Column -->
          <ng-container matColumnDef="companyName">
            <th mat-header-cell *matHeaderCellDef mat-sort-header> Compañía </th>
            <td mat-cell *matCellDef="let element"> {{element.companyName}} </td>
          </ng-container>

          <!-- Tax Id Column -->
          <ng-container matColumnDef="taxId">
            <th mat-header-cell *matHeaderCellDef mat-sort-header> ID Fiscal </th>
            <td mat-cell *matCellDef="let element"> {{element.taxId}} </td>
          </ng-container>

          <!-- Company Type Column -->
          <ng-container matColumnDef="companyType">
            <th mat-header-cell *matHeaderCellDef mat-sort-header> Tipo de Compañía </th>
            <td mat-cell *matCellDef="let element"> {{element.companyTypeName}} </td>
          </ng-container>

          <!-- Actions Column -->
          <ng-container matColumnDef="actions">
            <th mat-header-cell *matHeaderCellDef> Acciones </th>
            <td mat-cell *matCellDef="let element">
              <div class="action-buttons">
                <button mat-icon-button color="primary" (click)="openDialog(element)">
                  <mat-icon>edit</mat-icon>
                </button>
                <button mat-icon-button color="warn" (click)="deleteClient(element)">
                  <mat-icon>delete</mat-icon>
                </button>
              </div>
            </td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>

          <!-- Row shown when there is no matching data. -->
          <tr class="mat-row" *matNoDataRow>
            <td class="mat-cell" colspan="4">No se encontraron datos que coincidan con la búsqueda "{{input.value}}"</td>
          </tr>
        </table>
        
        <mat-paginator [pageSize]="10" [pageSizeOptions]="[5, 10, 25, 100]" aria-label="Seleccionar página de clientes"></mat-paginator>
      </div>
    </div>
  `,
  styles: [`
    .client-container {
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
export class ClientListComponent implements OnInit {
  private clientService = inject(ClientService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);

  displayedColumns: string[] = ['companyName', 'taxId', 'companyType', 'actions'];
  dataSource: MatTableDataSource<Client> = new MatTableDataSource();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngOnInit(): void {
    this.loadClients();
  }

  loadClients() {
    this.clientService.getClients().subscribe({
      next: (data) => {
        this.dataSource = new MatTableDataSource(data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        
        // Custom filter to search across specific fields easily
        this.dataSource.filterPredicate = (client: Client, filter: string) => {
          const searchStr = `${client.companyName || ''} ${client.taxId || ''} ${client.companyTypeName || ''}`.toLowerCase();
          return searchStr.includes(filter.toLowerCase());
        };
      },
      error: (err) => {
        this.showError('Error al cargar clientes');
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

  openDialog(client?: Client) {
    const dialogRef = this.dialog.open(ClientDialogComponent, {
      width: '500px',
      data: { client }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (client && client.id) {
          // Edit
          this.clientService.updateClient(client.id, result).subscribe({
            next: () => {
              this.showSuccess('Cliente actualizado exitosamente');
              this.loadClients();
            },
            error: (err) => {
              const errorMsg = err.error?.message || err.error?.title || 'Error al actualizar el cliente';
              this.showError(errorMsg);
              console.error(err);
            }
          });
        } else {
          // Create
          this.clientService.createClient(result).subscribe({
            next: () => {
              this.showSuccess('Cliente creado exitosamente');
              this.loadClients();
            },
            error: (err) => {
              const errorMsg = err.error?.message || err.error?.title || 'Error al crear el cliente';
              this.showError(errorMsg);
              console.error(err);
            }
          });
        }
      }
    });
  }

  deleteClient(client: Client) {
    if (confirm(`¿Estás seguro de que deseas eliminar al cliente ${client.companyName}?`)) {
      this.clientService.deleteClient(client.id).subscribe({
        next: () => {
          this.showSuccess('Cliente eliminado exitosamente');
          this.loadClients();
        },
        error: (err) => {
          const errorMsg = err.error?.message || err.error?.title || 'Ocurrió un error al intentar eliminar el cliente';
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
