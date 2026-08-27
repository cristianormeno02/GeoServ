import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsumableClassList } from './consumable-class-list';

describe('ConsumableClassList', () => {
  let component: ConsumableClassList;
  let fixture: ComponentFixture<ConsumableClassList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConsumableClassList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConsumableClassList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
