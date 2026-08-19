import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmpresaConfig } from './empresa-config';

describe('EmpresaConfig', () => {
  let component: EmpresaConfig;
  let fixture: ComponentFixture<EmpresaConfig>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmpresaConfig]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmpresaConfig);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
