import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsumableClassDialog } from './consumable-class-dialog';

describe('ConsumableClassDialog', () => {
  let component: ConsumableClassDialog;
  let fixture: ComponentFixture<ConsumableClassDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConsumableClassDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConsumableClassDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
