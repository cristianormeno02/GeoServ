import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Check, CheckService } from '../services/check.service';
import { ChequeFormComponent } from './cheque-form.component';

@Component({
  selector: 'app-cheques',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatButtonModule, MatIconModule, MatCardModule, MatDialogModule],
  templateUrl: './cheques.html',
  styleUrl: './cheques.css',
})
export class Cheques implements OnInit {
  checks: Check[] = [];
  displayedColumns: string[] = ['checkNumber', 'bankName', 'issuerName', 'amount', 'dueDate', 'status', 'actions'];

  constructor(
    private checkService: CheckService,
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadChecks();
  }

  loadChecks() {
    this.checkService.getChecks().subscribe({
      next: (data) => {
        this.checks = [...data];
        this.cdr.detectChanges();
      },
      error: (err) => console.error(err)
    });
  }

  openAddDialog() {
    const dialogRef = this.dialog.open(ChequeFormComponent, { width: '500px' });
    dialogRef.afterClosed().subscribe(result => {
      if (result) this.loadChecks();
    });
  }

  openEditDialog(check: Check) {
    const dialogRef = this.dialog.open(ChequeFormComponent, { width: '500px', data: { check } });
    dialogRef.afterClosed().subscribe(result => {
      if (result) this.loadChecks();
    });
  }

  deleteCheck(check: Check) {
    if (confirm(`¿Estás seguro de eliminar el cheque #${check.checkNumber}?`)) {
      this.checkService.deleteCheck(check.id!).subscribe({
        next: () => this.loadChecks(),
        error: (err) => console.error(err)
      });
    }
  }

  getStatusName(status: number): string {
    switch (status) {
      case 1: return 'En Cartera';
      case 2: return 'Depositado';
      case 3: return 'Acreditado';
      case 4: return 'Rechazado';
      default: return 'Desconocido';
    }
  }
}
