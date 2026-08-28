import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ConsumableClassDialogComponent } from '../consumable-class-dialog/consumable-class-dialog.component';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-consumable-class-list',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatButtonModule, MatIconModule, MatDialogModule, MatSnackBarModule],
  templateUrl: './consumable-class-list.component.html',
  styleUrls: ['./consumable-class-list.component.css']
})
export class ConsumableClassListComponent implements OnInit {
  items: any[] = [];
  columnsToDisplay = ['name', 'type', 'actions'];
  private apiUrl = `${environment.apiUrl}/consumable-classes`;

  constructor(private http: HttpClient, private dialog: MatDialog, private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.loadItems();
  }

  loadItems() {
    this.http.get<any[]>(this.apiUrl).subscribe(res => this.items = res);
  }

  openDialog(item?: any) {
    const dialogRef = this.dialog.open(ConsumableClassDialogComponent, { width: '400px', data: item });
    dialogRef.afterClosed().subscribe(res => { if (res) this.loadItems(); });
  }

  deleteItem(id: string) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: { title: 'Eliminar Clase', message: '¿Eliminar esta clase de insumo?' }
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.http.delete(`${this.apiUrl}/${id}`).subscribe(() => {
          this.snackBar.open('Eliminado', 'Cerrar', { duration: 3000 });
          this.loadItems();
        });
      }
    });
  }
}
