import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Cheques } from './cheques';

describe('Cheques', () => {
  let component: Cheques;
  let fixture: ComponentFixture<Cheques>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Cheques]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Cheques);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
