import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ProviderService } from '../../services/provider.service';
import { Provider } from '../../models/provider.model';
import { ProviderDialogComponent } from '../provider-dialog/provider-dialog.component';

@Component({
  selector: 'app-provider-list',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatButtonModule, MatIconModule, MatDialogModule, MatSnackBarModule],
  template: `
    <div style="padding:20px;">
      <div style="display:flex; justify-content:space-between; margin-bottom:20px;">
        <h2>Proveedores</h2>
        <button mat-raised-button color="primary" (click)="openDialog()"><mat-icon>add</mat-icon> Nuevo Proveedor</button>
      </div>
      <table mat-table [dataSource]="items" class="mat-elevation-z8" style="width:100%;">
        <ng-container matColumnDef="name"><th mat-header-cell *matHeaderCellDef>Nombre</th><td mat-cell *matCellDef="let item">{{item.name}}</td></ng-container>
        <ng-container matColumnDef="isActive"><th mat-header-cell *matHeaderCellDef>Activo</th><td mat-cell *matCellDef="let item">{{item.isActive ? 'Sí' : 'No'}}</td></ng-container>
        <ng-container matColumnDef="actions"><th mat-header-cell *matHeaderCellDef>Acciones</th>
          <td mat-cell *matCellDef="let item">
            <button mat-icon-button color="primary" (click)="openDialog(item)"><mat-icon>edit</mat-icon></button>
            <button mat-icon-button color="warn" (click)="deleteItem(item.id)"><mat-icon>delete</mat-icon></button>
          </td>
        </ng-container>
        <tr mat-header-row *matHeaderRowDef="['name','isActive','actions']"></tr>
        <tr mat-row *matRowDef="let row; columns: ['name','isActive','actions'];"></tr>
      </table>
    </div>
  `
})
export class ProviderListComponent implements OnInit {
  items: Provider[] = [];
  service = inject(ProviderService);
  dialog = inject(MatDialog);
  snack = inject(MatSnackBar);

  ngOnInit() { this.load(); }
  load() { this.service.getProviders().subscribe(res => this.items = res); }

  openDialog(provider?: Provider) {
    this.dialog.open(ProviderDialogComponent, { width: '400px', data: { provider } }).afterClosed().subscribe(res => {
      if (!res) return;
      if (res.id) this.service.updateProvider(res.id, res).subscribe(() => { this.load(); this.snack.open('Actualizado', 'OK', {duration:2000}); });
      else this.service.createProvider(res).subscribe(() => { this.load(); this.snack.open('Creado', 'OK', {duration:2000}); });
    });
  }

  deleteItem(id: string) {
    if (confirm('Eliminar?')) this.service.deleteProvider(id).subscribe(() => { this.load(); this.snack.open('Eliminado', 'OK', {duration:2000}); });
  }
}
