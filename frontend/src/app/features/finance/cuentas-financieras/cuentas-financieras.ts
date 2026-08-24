import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { FinancialAccount, FinancialAccountService } from '../services/financial-account.service';

@Component({
  selector: 'app-cuentas-financieras',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatButtonModule, MatIconModule, MatCardModule],
  templateUrl: './cuentas-financieras.html',
  styleUrl: './cuentas-financieras.css',
})
export class CuentasFinancieras implements OnInit {
  accounts: FinancialAccount[] = [];
  displayedColumns: string[] = ['name', 'accountNumber', 'accountType', 'currencyName', 'isActive', 'actions'];

  constructor(private accountService: FinancialAccountService) {}

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
}
