import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import {
  OperationalKpisResponse,
  TeamCapacityResponse,
  DeadlineComplianceResponse,
  OrderByServiceType,
  WorkloadByResponsible,
  StagnantOrdersResponse,
  AgingUncollectedOrdersResponse,
  InventoryAlertsResponse,
  UpcomingFixedCost,
  UpcomingDeliveriesResponse,
  UpcomingDeliveriesDetailsResponse
} from '../models/operational-dashboard.model';

@Injectable({
  providedIn: 'root'
})
export class OperationalDashboardService {
  private baseUrl = `${environment.apiUrl}/dashboard/operational`;

  constructor(private http: HttpClient) {}

  getKpis(periods: number = 6): Observable<OperationalKpisResponse> {
    const params = new HttpParams().set('periods', periods.toString());
    return this.http.get<OperationalKpisResponse>(`${this.baseUrl}/kpis`, { params });
  }

  getTeamCapacity(): Observable<TeamCapacityResponse> {
    return this.http.get<TeamCapacityResponse>(`${this.baseUrl}/team-capacity`);
  }

  getDeadlineCompliance(): Observable<DeadlineComplianceResponse> {
    return this.http.get<DeadlineComplianceResponse>(`${this.baseUrl}/deadline-compliance`);
  }

  getOrdersByServiceType(): Observable<OrderByServiceType[]> {
    return this.http.get<OrderByServiceType[]>(`${this.baseUrl}/orders-by-service-type`);
  }

  getWorkloadByResponsible(): Observable<WorkloadByResponsible[]> {
    return this.http.get<WorkloadByResponsible[]>(`${this.baseUrl}/workload-by-responsible`);
  }

  getStagnantOrders(page: number = 1, pageSize: number = 5): Observable<StagnantOrdersResponse> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());
    return this.http.get<StagnantOrdersResponse>(`${this.baseUrl}/stagnant-orders`, { params });
  }

  getAgingUncollectedOrders(page: number = 1, pageSize: number = 5): Observable<AgingUncollectedOrdersResponse> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());
    return this.http.get<AgingUncollectedOrdersResponse>(`${this.baseUrl}/aging-uncollected-orders`, { params });
  }

  getUpcomingDeliveries(): Observable<UpcomingDeliveriesResponse> {
    return this.http.get<UpcomingDeliveriesResponse>(`${this.baseUrl}/upcoming-deliveries`);
  }

  getUpcomingDeliveriesDetails(rangeKey?: string, page: number = 1, pageSize: number = 10): Observable<UpcomingDeliveriesDetailsResponse> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());
    if (rangeKey) {
      params = params.set('rangeKey', rangeKey);
    }
    return this.http.get<UpcomingDeliveriesDetailsResponse>(`${this.baseUrl}/upcoming-deliveries/details`, { params });
  }

  getInventoryAlerts(): Observable<InventoryAlertsResponse> {
    return this.http.get<InventoryAlertsResponse>(`${this.baseUrl}/inventory-alerts`);
  }

  getUpcomingFixedCosts(daysAhead: number = 15): Observable<UpcomingFixedCost[]> {
    const params = new HttpParams().set('daysAhead', daysAhead.toString());
    return this.http.get<UpcomingFixedCost[]>(`${this.baseUrl}/upcoming-fixed-costs`, { params });
  }
}
