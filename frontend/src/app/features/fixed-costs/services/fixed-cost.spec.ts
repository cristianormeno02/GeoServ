import { TestBed } from '@angular/core/testing';

import { FixedCost } from './fixed-cost';

describe('FixedCost', () => {
  let service: FixedCost;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FixedCost);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
