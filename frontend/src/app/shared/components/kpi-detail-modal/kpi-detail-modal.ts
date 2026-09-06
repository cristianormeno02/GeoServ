import { Component, Inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpParams } from '@angular/common/http';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { environment } from '../../../../environments/environment';

export interface KpiDetailModalData {
  dashboardType: 'operational' | 'general';
  kpiId: string;
  kpiTitle: string;
}

@Component({
  selector: 'app-kpi-detail-modal',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatTableModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatIconModule
  ],
  templateUrl: './kpi-detail-modal.html',
  styleUrl: './kpi-detail-modal.css',
})
export class KpiDetailModal implements OnInit {
  loading = false;
  items: any[] = [];
  entityType: 'orders' | 'consumables' = 'orders';
  totalCount = 0;
  page = 1;
  pageSize = 10;
  displayedColumns: string[] = [];

  constructor(
    private dialogRef: MatDialogRef<KpiDetailModal>,
    @Inject(MAT_DIALOG_DATA) public data: KpiDetailModalData,
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.loading = true;
    const url = `${environment.apiUrl}/dashboard/${this.data.dashboardType}/kpis/${this.data.kpiId}/details`;
    
    let params = new HttpParams()
      .set('page', this.page.toString())
      .set('pageSize', this.pageSize.toString());

    this.http.get<any>(url, { params }).subscribe({
      next: (res) => {
        this.entityType = res.entityType;
        this.items = res.items;
        this.totalCount = res.totalCount;
        this.page = res.page;
        this.pageSize = res.pageSize;
        
        if (this.entityType === 'orders') {
          this.displayedColumns = ['orderNumber', 'clientName', 'statusName', 'date'];
        } else if (this.entityType === 'consumables') {
          this.displayedColumns = ['description', 'currentStock', 'minimumStock', 'deficit'];
        }
        
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Error loading KPI details', err);
        this.loading = false;
        this.cdr.markForCheck();
      }
    });
  }

  onPageChange(event: PageEvent) {
    this.page = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.loadData();
  }
}
