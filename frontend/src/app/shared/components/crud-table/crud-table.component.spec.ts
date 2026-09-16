import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { BehaviorSubject } from 'rxjs';
import { provideNoopAnimations } from '@angular/platform-browser/animations';

import { CrudTableComponent } from './crud-table.component';
import { LoadingService } from '../../../core/services/loading.service';

describe('CrudTableComponent - Loading Coordination', () => {
  let component: CrudTableComponent;
  let fixture: ComponentFixture<CrudTableComponent>;
  let loadingSubject: BehaviorSubject<boolean>;
  let loadingServiceMock: { loading$: any };

  beforeEach(async () => {
    loadingSubject = new BehaviorSubject<boolean>(false);
    loadingServiceMock = {
      loading$: loadingSubject.asObservable()
    };

    await TestBed.configureTestingModule({
      imports: [CrudTableComponent],
      providers: [
        provideNoopAnimations(),
        { provide: LoadingService, useValue: loadingServiceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CrudTableComponent);
    component = fixture.componentInstance;
    component.columns = [{ key: 'name', label: 'Nombre' }];
    component.displayedColumns = ['name'];
    component.data = [];
  });

  it('debe mostrar el loading-overlay local si isLoading es true y el cargador global NO está activo', () => {
    component.isLoading = true;
    loadingSubject.next(false);
    fixture.detectChanges();

    const overlay = fixture.debugElement.query(By.css('.loading-overlay'));
    expect(overlay).toBeTruthy();
    const spinner = fixture.debugElement.query(By.css('.loading-overlay mat-spinner'));
    expect(spinner).toBeTruthy();
  });

  it('debe suprimir el loading-overlay local si isLoading es true pero el cargador global ESTÁ activo (evitando doble spinner)', () => {
    component.isLoading = true;
    loadingSubject.next(true);
    fixture.detectChanges();

    const overlay = fixture.debugElement.query(By.css('.loading-overlay'));
    expect(overlay).toBeFalsy();
  });
});
