import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
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

  constructor(
    private summaryService: FinancialSummaryService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadSummary();
  }

  loadSummary(): void {
    this.loading = true;
    this.error = null;
    this.summaryService.getSummary().subscribe({
      next: data => {
        this.accounts = data.accounts || [];
        this.checks = data.checks || [];
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: err => {
        this.error = err?.status === 404
          ? 'El endpoint no fue encontrado en el servidor (404). Asegúrate de que el backend esté actualizado.'
          : 'Error al cargar el resumen financiero. Por favor, reintenta.';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }
}
