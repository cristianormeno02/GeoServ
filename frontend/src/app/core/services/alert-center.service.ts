import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, BehaviorSubject, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  AlertCenterResponse,
  AlertCenterSummaryDto,
  AlertCenterQuery,
  UpdateAlertStateRequest,
  AlertItemDto
} from '../models/alert-center.model';

@Injectable({
  providedIn: 'root'
})
export class AlertCenterService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/alert-center`;

  private summarySubject = new BehaviorSubject<AlertCenterSummaryDto | null>(null);
  public summary$ = this.summarySubject.asObservable();

  getAlerts(query: AlertCenterQuery): Observable<AlertCenterResponse> {
    let params = new HttpParams();
    if (query.type) params = params.set('type', query.type);
    if (query.priority) params = params.set('priority', query.priority);
    if (query.state) params = params.set('state', query.state);
    if (query.search) params = params.set('search', query.search);
    if (query.page) params = params.set('page', query.page.toString());
    if (query.pageSize) params = params.set('pageSize', query.pageSize.toString());

    return this.http.get<AlertCenterResponse>(this.apiUrl, { params }).pipe(
      tap(res => this.summarySubject.next(res.summary))
    );
  }

  getSummary(): Observable<AlertCenterSummaryDto> {
    return this.http.get<AlertCenterSummaryDto>(`${this.apiUrl}/summary`).pipe(
      tap(summary => this.summarySubject.next(summary))
    );
  }

  updateState(alertKey: string, request: UpdateAlertStateRequest): Observable<AlertItemDto> {
    const encodedKey = encodeURIComponent(alertKey);
    return this.http.patch<AlertItemDto>(`${this.apiUrl}/${encodedKey}`, request).pipe(
      tap(() => this.getSummary().subscribe()) // Refresh summary on update
    );
  }

  refreshSummary(): void {
    this.getSummary().subscribe();
  }
}
