import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FixedCostPaymentDialog } from './fixed-cost-payment-dialog';

describe('FixedCostPaymentDialog', () => {
  let component: FixedCostPaymentDialog;
  let fixture: ComponentFixture<FixedCostPaymentDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FixedCostPaymentDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FixedCostPaymentDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
