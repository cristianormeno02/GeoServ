import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import {
  UserProfileResponse,
  GeneralKpisResponse,
  ActiveOrderItem,
  PendingActivityItem,
  RecentObservationItem
} from '../models/general-dashboard.model';

@Injectable({
  providedIn: 'root'
})
export class GeneralDashboardService {
  private baseUrl = `${environment.apiUrl}/dashboard/general`;

  constructor(private http: HttpClient) {}

  getProfile(): Observable<UserProfileResponse> {
    return this.http.get<UserProfileResponse>(`${this.baseUrl}/profile`);
  }

  getKpis(): Observable<GeneralKpisResponse> {
    return this.http.get<GeneralKpisResponse>(`${this.baseUrl}/kpis`);
  }

  getActiveOrders(): Observable<ActiveOrderItem[]> {
    return this.http.get<ActiveOrderItem[]>(`${this.baseUrl}/active-orders`);
  }

  getPendingActivities(): Observable<PendingActivityItem[]> {
    return this.http.get<PendingActivityItem[]>(`${this.baseUrl}/pending-activities`);
  }

  getRecentObservations(): Observable<RecentObservationItem[]> {
    return this.http.get<RecentObservationItem[]>(`${this.baseUrl}/recent-observations`);
  }
}
