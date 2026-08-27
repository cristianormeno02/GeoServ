import { TestBed } from '@angular/core/testing';

import { Consumable } from './consumable';

describe('Consumable', () => {
  let service: Consumable;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Consumable);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
