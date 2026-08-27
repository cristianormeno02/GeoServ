import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Asset, AssetService } from '../services/asset.service';
import { ActivoFormComponent } from './activo-form.component';

import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-activos',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatButtonModule, MatIconModule, MatCardModule, MatDialogModule],
  templateUrl: './activos.html',
  styleUrl: './activos.css',
})
export class Activos implements OnInit {
  assets: Asset[] = [];
  displayedColumns: string[] = ['name', 'description', 'purchasePrice', 'purchaseDate', 'actions'];

  constructor(
    private assetService: AssetService,
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadAssets();
  }

  loadAssets() {
    this.assetService.getAssets().subscribe({
      next: (data) => {
        this.assets = [...data];
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error(err);
        this.snackBar.open('Error al cargar activos', 'Cerrar', { duration: 4000, panelClass: ['snackbar-error'] });
      }
    });
  }

  openAddDialog() {
    const dialogRef = this.dialog.open(ActivoFormComponent, { width: '500px' });
    dialogRef.afterClosed().subscribe(result => {
      if (result) this.loadAssets();
    });
  }

  openEditDialog(asset: Asset) {
    const dialogRef = this.dialog.open(ActivoFormComponent, { width: '500px', data: { asset } });
    dialogRef.afterClosed().subscribe(result => {
      if (result) this.loadAssets();
    });
  }

  deleteAsset(asset: Asset) {
    if (confirm(`¿Estás seguro de eliminar el activo "${asset.name}"?`)) {
      this.assetService.deleteAsset(asset.id!).subscribe({
        next: () => {
          this.snackBar.open('Activo eliminado con éxito', 'Cerrar');
          this.loadAssets();
        },
        error: (err) => {
          console.error(err);
          this.snackBar.open(err.error?.message || 'Error al eliminar activo', 'Cerrar', { duration: 4000, panelClass: ['snackbar-error'] });
        }
      });
    }
  }
}
