import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsumableTypeList } from './consumable-type-list';

describe('ConsumableTypeList', () => {
  let component: ConsumableTypeList;
  let fixture: ComponentFixture<ConsumableTypeList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConsumableTypeList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConsumableTypeList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
