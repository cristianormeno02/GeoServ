import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsumableDialog } from './consumable-dialog';

describe('ConsumableDialog', () => {
  let component: ConsumableDialog;
  let fixture: ComponentFixture<ConsumableDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConsumableDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConsumableDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
