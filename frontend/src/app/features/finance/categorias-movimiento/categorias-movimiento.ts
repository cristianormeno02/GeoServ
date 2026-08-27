import {  Component, OnInit  } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatChipsModule } from '@angular/material/chips';
import { MovementCategory, MovementCategoryService } from '../services/movement-category.service';
import { CategoriaFormComponent } from './categoria-form.component';

@Component({
  selector: 'app-categorias-movimiento',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatButtonModule, MatIconModule, MatCardModule, MatDialogModule, MatChipsModule],
  templateUrl: './categorias-movimiento.html',
  styleUrl: './categorias-movimiento.css',
})
export class CategoriasMovimiento implements OnInit {
  categories: MovementCategory[] = [];
  displayedColumns: string[] = ['name', 'description', 'type', 'status', 'actions'];

  constructor(
    private categoryService: MovementCategoryService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories() {
    this.categoryService.getCategories().subscribe({
      next: (data) => {
        this.categories = data;
      },
      error: (err) => console.error(err)
    });
  }

  openAddDialog() {
    const dialogRef = this.dialog.open(CategoriaFormComponent, { width: '500px' });
    dialogRef.afterClosed().subscribe(result => {
      if (result) this.loadCategories();
    });
  }

  openEditDialog(category: MovementCategory) {
    const dialogRef = this.dialog.open(CategoriaFormComponent, { width: '500px', data: { category } });
    dialogRef.afterClosed().subscribe(result => {
      if (result) this.loadCategories();
    });
  }

  deleteCategory(category: MovementCategory) {
    if (confirm(`¿Estás seguro de eliminar la categoría "${category.name}"?`)) {
      this.categoryService.deleteCategory(category.id!).subscribe({
        next: () => this.loadCategories(),
        error: (err) => {
          console.error(err);
          alert(err.error || 'Ocurrió un error al eliminar. Es posible que esté en uso.');
        }
      });
    }
  }
}
