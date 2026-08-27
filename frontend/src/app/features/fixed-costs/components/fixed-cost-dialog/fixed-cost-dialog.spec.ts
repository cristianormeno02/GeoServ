import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FixedCostDialog } from './fixed-cost-dialog';

describe('FixedCostDialog', () => {
  let component: FixedCostDialog;
  let fixture: ComponentFixture<FixedCostDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FixedCostDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FixedCostDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
