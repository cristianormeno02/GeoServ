import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ChangeDetectorRef } from '@angular/core';
import { of, throwError } from 'rxjs';
import { KpiDetailModal } from './kpi-detail-modal';

describe('KpiDetailModal', () => {
  let component: KpiDetailModal;
  let fixture: ComponentFixture<KpiDetailModal>;
  let httpClientSpy: jasmine.SpyObj<HttpClient>;
  let dialogRefSpy: jasmine.SpyObj<MatDialogRef<KpiDetailModal>>;

  const mockDialogData = {
    dashboardType: 'operational' as const,
    kpiId: 'uncollectedOrders',
    kpiTitle: 'Órdenes entregadas sin cobrar'
  };

  beforeEach(async () => {
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['get']);
    dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);

    httpClientSpy.get.and.returnValue(of({
      entityType: 'orders',
      items: [
        { id: '1', orderNumber: 'OS-001', clientName: 'Cliente A', statusName: 'Entregada', date: '2026-09-01' }
      ],
      totalCount: 1,
      page: 1,
      pageSize: 10
    }));

    await TestBed.configureTestingModule({
      imports: [KpiDetailModal],
      providers: [
        { provide: HttpClient, useValue: httpClientSpy },
        { provide: MatDialogRef, useValue: dialogRefSpy },
        { provide: MAT_DIALOG_DATA, useValue: mockDialogData }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(KpiDetailModal);
    component = fixture.componentInstance;
  });

  it('should create and load data on init', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
    expect(httpClientSpy.get).toHaveBeenCalled();
    expect(component.items.length).toBe(1);
    expect(component.loading).toBeFalse();
  });

  it('should trigger markForCheck on ChangeDetectorRef when data loads successfully', () => {
    const cdr = fixture.debugElement.injector.get(ChangeDetectorRef);
    const markForCheckSpy = spyOn(cdr.constructor.prototype, 'markForCheck').and.callThrough();

    component.loadData();

    expect(markForCheckSpy).toHaveBeenCalled();
    expect(component.loading).toBeFalse();
    expect(component.items.length).toBe(1);
  });

  it('should trigger markForCheck on ChangeDetectorRef when loading fails with error', () => {
    const cdr = fixture.debugElement.injector.get(ChangeDetectorRef);
    const markForCheckSpy = spyOn(cdr.constructor.prototype, 'markForCheck').and.callThrough();

    httpClientSpy.get.and.returnValue(throwError(() => new Error('Network error')));

    component.loadData();

    expect(markForCheckSpy).toHaveBeenCalled();
    expect(component.loading).toBeFalse();
  });
});
