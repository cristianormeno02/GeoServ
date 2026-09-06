import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KpiDetailModal } from './kpi-detail-modal';

describe('KpiDetailModal', () => {
  let component: KpiDetailModal;
  let fixture: ComponentFixture<KpiDetailModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KpiDetailModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KpiDetailModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
