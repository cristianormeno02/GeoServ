import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoriasMovimiento } from './categorias-movimiento';

describe('CategoriasMovimiento', () => {
  let component: CategoriasMovimiento;
  let fixture: ComponentFixture<CategoriasMovimiento>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategoriasMovimiento]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CategoriasMovimiento);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
