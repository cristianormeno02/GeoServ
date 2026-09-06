import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatTabsModule } from '@angular/material/tabs';
import { SparklineCardComponent } from '../../../shared/components/charts/sparkline-card.component';
import { DonutChartComponent, DonutSlice } from '../../../shared/components/charts/donut-chart.component';
import { 
  FinancialSummaryService, 
  AccountSummary, 
  CheckSummary, 
  QuickSummary 
} from '../services/financial-summary.service';

export enum CheckStatusEnum {
  InPortfolio = 1,
  Deposited = 2,
  Accredited = 3,
  Rejected = 4
}

@Component({
  selector: 'app-financial-summary',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatTabsModule,
    SparklineCardComponent,
    DonutChartComponent
  ],
  templateUrl: './financial-summary.component.html',
  styleUrls: ['./financial-summary.component.scss']
})
export class FinancialSummaryComponent implements OnInit {
  accounts: AccountSummary[] = [];
  checks: CheckSummary[] = [];
  quickSummary: QuickSummary | null = null;
  loading = false;
  error: string | null = null;
  lastUpdated: Date = new Date();

  // Filters
  accountTypeFilter: string = 'ALL';
  accountSearchTerm: string = '';
  checkStatusFilter: string = 'ALL';
  checkSearchTerm: string = '';

  // Donut chart slices
  checkSlices: DonutSlice[] = [];

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
    this.lastUpdated = new Date();

    this.summaryService.getSummary().subscribe({
      next: data => {
        this.accounts = data.accounts || [];
        this.checks = data.checks || [];
        this.quickSummary = data.quickSummary || null;
        this.buildDonutSlices();
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

  private buildDonutSlices(): void {
    if (!this.quickSummary) {
      this.checkSlices = [];
      return;
    }

    this.checkSlices = [
      {
        label: 'En Cartera',
        value: this.quickSummary.checksInPortfolio.totalAmount,
        color: '#f59e0b'
      },
      {
        label: 'Depositados',
        value: this.quickSummary.checksDeposited.totalAmount,
        color: '#0284c7'
      },
      {
        label: 'Acreditados',
        value: this.quickSummary.checksAccredited.totalAmount,
        color: '#10b981'
      },
      {
        label: 'Rechazados',
        value: this.quickSummary.checksRejected.totalAmount,
        color: '#ef4444'
      }
    ].filter(s => s.value > 0);
  }

  get filteredAccounts(): AccountSummary[] {
    return this.accounts.filter(acc => {
      const matchType = this.accountTypeFilter === 'ALL' || acc.accountType === this.accountTypeFilter;
      const term = this.accountSearchTerm.toLowerCase().trim();
      const matchTerm = !term || 
        acc.name.toLowerCase().includes(term) || 
        acc.accountNumber.toLowerCase().includes(term) ||
        acc.currencyName.toLowerCase().includes(term);
      return matchType && matchTerm;
    });
  }

  get filteredChecks(): CheckSummary[] {
    return this.checks.filter(chk => {
      const matchStatus = this.checkStatusFilter === 'ALL' || chk.status.toString() === this.checkStatusFilter;
      const term = this.checkSearchTerm.toLowerCase().trim();
      const matchTerm = !term ||
        chk.checkNumber.toLowerCase().includes(term) ||
        chk.bankName.toLowerCase().includes(term) ||
        chk.issuerName.toLowerCase().includes(term) ||
        (chk.clientName && chk.clientName.toLowerCase().includes(term));
      return matchStatus && matchTerm;
    });
  }

  getStatusLabel(status: number): string {
    switch (status) {
      case CheckStatusEnum.InPortfolio: return 'En Cartera';
      case CheckStatusEnum.Deposited: return 'Depositado';
      case CheckStatusEnum.Accredited: return 'Acreditado';
      case CheckStatusEnum.Rejected: return 'Rechazado';
      default: return 'Desconocido';
    }
  }

  getStatusClass(status: number): string {
    switch (status) {
      case CheckStatusEnum.InPortfolio: return 'status-portfolio';
      case CheckStatusEnum.Deposited: return 'status-deposited';
      case CheckStatusEnum.Accredited: return 'status-accredited';
      case CheckStatusEnum.Rejected: return 'status-rejected';
      default: return 'status-unknown';
    }
  }

  formatCurrency(val: number): string {
    const v = val || 0;
    // Si tiene centavos distintos de 0 los mostramos, si no redondeamos limpio para ahorrar espacio
    const hasDecimals = v % 1 !== 0;
    return '$ ' + v.toLocaleString('es-AR', { 
      minimumFractionDigits: hasDecimals ? 2 : 0, 
      maximumFractionDigits: hasDecimals ? 2 : 0 
    });
  }
}
