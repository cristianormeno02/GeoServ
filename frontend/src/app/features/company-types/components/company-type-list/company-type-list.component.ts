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

import { CompanyTypeService } from '../../services/company-type.service';
import { CompanyType } from '../../models/company-type.model';
import { CompanyTypeDialogComponent } from '../company-type-dialog/company-type-dialog.component';

@Component({
  selector: 'app-company-type-list',
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
    <div class="company-type-container">
      <div class="header">
        <h1>Tipos de Compañía</h1>
        <button mat-raised-button color="primary" (click)="openDialog()">
          <mat-icon>add</mat-icon> Nuevo Tipo
        </button>
      </div>

      <mat-form-field appearance="outline" class="search-field">
        <mat-label>Buscar tipo de compañía...</mat-label>
        <input matInput (input)="applyFilter($event)" placeholder="Ej. Empresa Constructora" #input>
        <mat-icon matSuffix>search</mat-icon>
      </mat-form-field>

      <div class="table-container mat-elevation-z8">
        <table mat-table [dataSource]="dataSource" matSort>

          <!-- Name Column -->
          <ng-container matColumnDef="name">
            <th mat-header-cell *matHeaderCellDef mat-sort-header> Nombre </th>
            <td mat-cell *matCellDef="let element"> {{element.name}} </td>
          </ng-container>

          <!-- Description Column -->
          <ng-container matColumnDef="description">
            <th mat-header-cell *matHeaderCellDef mat-sort-header> Descripción </th>
            <td mat-cell *matCellDef="let element"> {{element.description}} </td>
          </ng-container>

          <!-- Actions Column -->
          <ng-container matColumnDef="actions">
            <th mat-header-cell *matHeaderCellDef> Acciones </th>
            <td mat-cell *matCellDef="let element">
              <div class="action-buttons">
                <button mat-icon-button color="primary" (click)="openDialog(element)">
                  <mat-icon>edit</mat-icon>
                </button>
                <button mat-icon-button color="warn" (click)="deleteCompanyType(element)">
                  <mat-icon>delete</mat-icon>
                </button>
              </div>
            </td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>

          <!-- Row shown when there is no matching data. -->
          <tr class="mat-row" *matNoDataRow>
            <td class="mat-cell" colspan="3">No se encontraron datos que coincidan con la búsqueda "{{input.value}}"</td>
          </tr>
        </table>
        
        <mat-paginator [pageSize]="10" [pageSizeOptions]="[5, 10, 25, 100]" aria-label="Seleccionar página"></mat-paginator>
      </div>
    </div>
  `,
  styles: [`
    .company-type-container {
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
export class CompanyTypeListComponent implements OnInit {
  private companyTypeService = inject(CompanyTypeService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);

  displayedColumns: string[] = ['name', 'description', 'actions'];
  dataSource: MatTableDataSource<CompanyType> = new MatTableDataSource();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngOnInit(): void {
    this.loadCompanyTypes();
  }

  loadCompanyTypes() {
    this.companyTypeService.getCompanyTypes().subscribe({
      next: (data) => {
        this.dataSource = new MatTableDataSource(data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        
        // Custom filter to search across specific fields easily
        this.dataSource.filterPredicate = (companyType: CompanyType, filter: string) => {
          const searchStr = `${companyType.name || ''} ${companyType.description || ''}`.toLowerCase();
          return searchStr.includes(filter.toLowerCase());
        };
      },
      error: (err) => {
        this.showError('Error al cargar los tipos de compañía');
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

  openDialog(companyType?: CompanyType) {
    const dialogRef = this.dialog.open(CompanyTypeDialogComponent, {
      width: '500px',
      data: { companyType }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (companyType && companyType.id) {
          // Edit
          this.companyTypeService.updateCompanyType(companyType.id, result).subscribe({
            next: () => {
              this.showSuccess('Tipo de compañía actualizado exitosamente');
              this.loadCompanyTypes();
            },
            error: (err) => {
              const errorMsg = err.error?.message || err.error?.title || 'Error al actualizar el tipo de compañía';
              this.showError(errorMsg);
              console.error(err);
            }
          });
        } else {
          // Create
          this.companyTypeService.createCompanyType(result).subscribe({
            next: () => {
              this.showSuccess('Tipo de compañía creado exitosamente');
              this.loadCompanyTypes();
            },
            error: (err) => {
              const errorMsg = err.error?.message || err.error?.title || 'Error al crear el tipo de compañía';
              this.showError(errorMsg);
              console.error(err);
            }
          });
        }
      }
    });
  }

  deleteCompanyType(companyType: CompanyType) {
    if (confirm(`¿Estás seguro de que deseas eliminar el tipo de compañía ${companyType.name}?`)) {
      this.companyTypeService.deleteCompanyType(companyType.id).subscribe({
        next: () => {
          this.showSuccess('Tipo de compañía eliminado exitosamente');
          this.loadCompanyTypes();
        },
        error: (err) => {
          const errorMsg = err.error?.message || err.error?.title || 'Ocurrió un error al intentar eliminar el tipo de compañía';
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
