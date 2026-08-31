import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import {
  FinancialKpisResponse,
  MonthlyCoverageGaugeResponse,
  AverageOrderMarginResponse,
  MonthlyCoverageReportItem,
  FixedCostsAgingResponse,
  CommittedExpensesProjectionResponse,
  ServiceOrdersProfitabilityResponse,
  DistributionSummaryResponse,
  DirectCostsBreakdownResponse,
  FixedCostEvolutionItem,
  AssetsValuationResponse
} from '../models/financial-dashboard.model';

@Injectable({
  providedIn: 'root'
})
export class FinancialDashboardService {
  private baseUrl = `${environment.apiUrl}/dashboard/financial`;

  constructor(private http: HttpClient) {}

  getKpis(): Observable<FinancialKpisResponse> {
    return this.http.get<FinancialKpisResponse>(`${this.baseUrl}/kpis`);
  }

  getMonthlyCoverageGauge(): Observable<MonthlyCoverageGaugeResponse> {
    return this.http.get<MonthlyCoverageGaugeResponse>(`${this.baseUrl}/monthly-coverage-gauge`);
  }

  getAverageOrderMargin(months: number = 3): Observable<AverageOrderMarginResponse> {
    const params = new HttpParams().set('months', months.toString());
    return this.http.get<AverageOrderMarginResponse>(`${this.baseUrl}/average-order-margin`, { params });
  }

  getMonthlyCoverageReport(months: number = 12): Observable<MonthlyCoverageReportItem[]> {
    const params = new HttpParams().set('months', months.toString());
    return this.http.get<MonthlyCoverageReportItem[]>(`${this.baseUrl}/monthly-coverage-report`, { params });
  }

  getFixedCostsAging(): Observable<FixedCostsAgingResponse> {
    return this.http.get<FixedCostsAgingResponse>(`${this.baseUrl}/fixed-costs-aging`);
  }

  getCommittedExpensesProjection(): Observable<CommittedExpensesProjectionResponse> {
    return this.http.get<CommittedExpensesProjectionResponse>(`${this.baseUrl}/committed-expenses-projection`);
  }

  getProfitability(startDate?: string, endDate?: string): Observable<ServiceOrdersProfitabilityResponse> {
    let params = new HttpParams();
    if (startDate) params = params.set('startDate', startDate);
    if (endDate) params = params.set('endDate', endDate);
    return this.http.get<ServiceOrdersProfitabilityResponse>(`${this.baseUrl}/service-orders-profitability`, { params });
  }

  getDistributionSummary(startDate?: string, endDate?: string): Observable<DistributionSummaryResponse> {
    let params = new HttpParams();
    if (startDate) params = params.set('startDate', startDate);
    if (endDate) params = params.set('endDate', endDate);
    return this.http.get<DistributionSummaryResponse>(`${this.baseUrl}/distribution-summary`, { params });
  }

  getDirectCostsBreakdown(startDate?: string, endDate?: string): Observable<DirectCostsBreakdownResponse> {
    let params = new HttpParams();
    if (startDate) params = params.set('startDate', startDate);
    if (endDate) params = params.set('endDate', endDate);
    return this.http.get<DirectCostsBreakdownResponse>(`${this.baseUrl}/direct-costs-breakdown`, { params });
  }

  getFixedCostsEvolution(months: number = 12): Observable<FixedCostEvolutionItem[]> {
    const params = new HttpParams().set('months', months.toString());
    return this.http.get<FixedCostEvolutionItem[]>(`${this.baseUrl}/fixed-costs-evolution`, { params });
  }

  getAssetsValuation(startDate?: string, endDate?: string): Observable<AssetsValuationResponse> {
    let params = new HttpParams();
    if (startDate) params = params.set('startDate', startDate);
    if (endDate) params = params.set('endDate', endDate);
    return this.http.get<AssetsValuationResponse>(`${this.baseUrl}/assets-valuation`, { params });
  }
}
