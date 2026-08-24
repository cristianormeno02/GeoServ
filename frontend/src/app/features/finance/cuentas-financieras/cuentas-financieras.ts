import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { FinancialAccount, FinancialAccountService } from '../services/financial-account.service';
import { CuentaFormComponent } from './cuenta-form.component';

@Component({
  selector: 'app-cuentas-financieras',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatButtonModule, MatIconModule, MatCardModule, MatDialogModule],
  templateUrl: './cuentas-financieras.html',
  styleUrl: './cuentas-financieras.css',
})
export class CuentasFinancieras implements OnInit {
  accounts: FinancialAccount[] = [];
  displayedColumns: string[] = ['name', 'accountNumber', 'accountType', 'currencyName', 'isActive', 'actions'];

  constructor(
    private accountService: FinancialAccountService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadAccounts();
  }

  loadAccounts() {
    this.accountService.getAccounts().subscribe({
      next: (data) => {
        this.accounts = data;
      },
      error: (err) => console.error('Error loading accounts:', err)
    });
  }

  openAddDialog() {
    const dialogRef = this.dialog.open(CuentaFormComponent, {
      width: '500px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadAccounts(); // Refresh table if saved
      }
    });
  }

  openEditDialog(account: FinancialAccount) {
    const dialogRef = this.dialog.open(CuentaFormComponent, {
      width: '500px',
      data: { account }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadAccounts();
      }
    });
  }

  deleteAccount(account: FinancialAccount) {
    if (confirm(`¿Estás seguro de que deseas eliminar la cuenta "${account.name}"?`)) {
      this.accountService.deleteAccount(account.id!).subscribe({
        next: () => this.loadAccounts(),
        error: (err) => console.error(err)
      });
    }
  }
}
