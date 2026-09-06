import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FinancialSummaryService, AccountSummary, CheckSummary } from '../services/financial-summary.service';

@Component({
  selector: 'app-financial-summary',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './financial-summary.component.html',
  styleUrls: ['./financial-summary.component.scss']
})
export class FinancialSummaryComponent implements OnInit {
  accounts: AccountSummary[] = [];
  checks: CheckSummary[] = [];
  loading = false;
  error: string | null = null;

  constructor(private summaryService: FinancialSummaryService) {}

  ngOnInit(): void {
    this.loadSummary();
  }

  loadSummary(): void {
    this.loading = true;
    this.summaryService.getSummary().subscribe({
      next: data => {
        this.accounts = data.accounts;
        this.checks = data.checks;
        this.loading = false;
      },
      error: err => {
        this.error = 'Error al cargar el resumen financiero';
        this.loading = false;
      }
    });
  }
}
