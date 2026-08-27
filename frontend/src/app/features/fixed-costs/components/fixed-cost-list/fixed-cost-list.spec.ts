import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FixedCostList } from './fixed-cost-list';

describe('FixedCostList', () => {
  let component: FixedCostList;
  let fixture: ComponentFixture<FixedCostList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FixedCostList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FixedCostList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
