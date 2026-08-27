import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsumableTypeDialog } from './consumable-type-dialog';

describe('ConsumableTypeDialog', () => {
  let component: ConsumableTypeDialog;
  let fixture: ComponentFixture<ConsumableTypeDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConsumableTypeDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConsumableTypeDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
