import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { of, Subject } from 'rxjs';
import { provideNoopAnimations } from '@angular/platform-browser/animations';

import { ServiceOrderFormComponent } from './service-order-form.component';
import { ServiceOrderService } from '../../services/service-order.service';
import { ClientService } from '../../../clients/services/client.service';
import { ServiceTypeService } from '../../../service-types/services/service-type.service';
import { UserService } from '../../../users/services/user.service';
import { DirectCostService } from '../../services/direct-cost.service';
import { EmpresaConfigService } from '../../../empresa-config/empresa-config.service';
import { UnitService } from '../../../units/services/unit.service';

describe('ServiceOrderFormComponent - Currency & Budget Editability', () => {
  let component: ServiceOrderFormComponent;
  let fixture: ComponentFixture<ServiceOrderFormComponent>;

  let serviceOrderServiceSpy: jasmine.SpyObj<ServiceOrderService>;
  let clientServiceSpy: jasmine.SpyObj<ClientService>;
  let serviceTypeServiceSpy: jasmine.SpyObj<ServiceTypeService>;
  let userServiceSpy: jasmine.SpyObj<UserService>;
  let directCostServiceSpy: jasmine.SpyObj<DirectCostService>;
  let empresaConfigServiceSpy: jasmine.SpyObj<EmpresaConfigService>;
  let unitServiceSpy: jasmine.SpyObj<UnitService>;
  let snackBarSpy: jasmine.SpyObj<MatSnackBar>;
  let dialogSpy: jasmine.SpyObj<MatDialog>;
  let routerSpy: jasmine.SpyObj<Router>;

  let currenciesSubject: Subject<any[]>;

  beforeEach(async () => {
    currenciesSubject = new Subject<any[]>();
    serviceOrderServiceSpy = jasmine.createSpyObj('ServiceOrderService', [
      'getStatuses', 'getProjects', 'getDistributionConcepts', 'getCurrencies',
      'getResponsiblesCatalog', 'getServiceOrderById', 'getMovements'
    ]);
    clientServiceSpy = jasmine.createSpyObj('ClientService', ['getClients']);
    serviceTypeServiceSpy = jasmine.createSpyObj('ServiceTypeService', ['getServiceTypes']);
    userServiceSpy = jasmine.createSpyObj('UserService', ['getUsers']);
    directCostServiceSpy = jasmine.createSpyObj('DirectCostService', ['getCostsByOrder']);
    empresaConfigServiceSpy = jasmine.createSpyObj('EmpresaConfigService', ['getSettings']);
    unitServiceSpy = jasmine.createSpyObj('UnitService', ['getUnits']);
    snackBarSpy = jasmine.createSpyObj('MatSnackBar', ['open']);
    dialogSpy = jasmine.createSpyObj('MatDialog', ['open']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    clientServiceSpy.getClients.and.returnValue(of([]));
    serviceTypeServiceSpy.getServiceTypes.and.returnValue(of([]));
    userServiceSpy.getUsers.and.returnValue(of([]));
    serviceOrderServiceSpy.getStatuses.and.returnValue(of([]));
    serviceOrderServiceSpy.getProjects.and.returnValue(of([]));
    serviceOrderServiceSpy.getDistributionConcepts.and.returnValue(of([]));
    serviceOrderServiceSpy.getResponsiblesCatalog.and.returnValue(of([]));
    serviceOrderServiceSpy.getMovements.and.returnValue(of({ items: [], total: 0 }));
    directCostServiceSpy.getCostsByOrder.and.returnValue(of([]));
    empresaConfigServiceSpy.getSettings.and.returnValue(of({}));
    unitServiceSpy.getUnits.and.returnValue(of([]));

    // Currencies mock via Subject to test race condition / delayed resolution
    serviceOrderServiceSpy.getCurrencies.and.returnValue(currenciesSubject.asObservable());

    await TestBed.configureTestingModule({
      imports: [ServiceOrderFormComponent],
      providers: [
        provideNoopAnimations(),
        { provide: ServiceOrderService, useValue: serviceOrderServiceSpy },
        { provide: ClientService, useValue: clientServiceSpy },
        { provide: ServiceTypeService, useValue: serviceTypeServiceSpy },
        { provide: UserService, useValue: userServiceSpy },
        { provide: DirectCostService, useValue: directCostServiceSpy },
        { provide: EmpresaConfigService, useValue: empresaConfigServiceSpy },
        { provide: UnitService, useValue: unitServiceSpy },
        { provide: MatSnackBar, useValue: snackBarSpy },
        { provide: MatDialog, useValue: dialogSpy },
        { provide: Router, useValue: routerSpy },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { paramMap: { get: () => 'order-123' } }
          }
        }
      ]
    }).compileComponents();
  });

  it('debe inicializar selectedCurrencyCode inmediatamente como ARS al cargar orden con currencyCode ARS, aun si el catálogo de monedas no ha respondido', () => {
    serviceOrderServiceSpy.getServiceOrderById.and.returnValue(of({
      id: 'order-123',
      orderNumber: 'OS-001',
      currencyId: 'curr-ars-id',
      currencyCode: 'ARS',
      budgetedAmount: 50000,
      totalAmount: 50000,
      requestDate: '2026-09-01',
      estimatedStartDate: '2026-09-01',
      estimatedEndDate: '2026-09-02'
    } as any));

    fixture = TestBed.createComponent(ServiceOrderFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    // En este punto, getServiceOrderById ya respondió pero currenciesSubject NO ha emitido
    expect(component.selectedCurrencyCode).toBe('ARS');

    // Ahora simular que el catálogo de monedas termina de responder más tarde
    currenciesSubject.next([
      { id: 'curr-ars-id', code: 'ARS', name: 'Peso Argentino', symbol: '$' },
      { id: 'curr-usd-id', code: 'USD', name: 'Dólar', symbol: 'US$' }
    ]);
    currenciesSubject.complete();

    expect(component.selectedCurrencyCode).toBe('ARS');
  });

  it('debe sincronizar selectedCurrencyCode si el catálogo de monedas responde después en modo edición', () => {
    serviceOrderServiceSpy.getServiceOrderById.and.returnValue(of({
      id: 'order-123',
      orderNumber: 'OS-001',
      currencyId: 'curr-usd-id',
      currencyCode: undefined, // Simular caso donde currencyCode no vino en DTO directo
      budgetedAmount: 100,
      totalAmount: 100
    } as any));

    fixture = TestBed.createComponent(ServiceOrderFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    // Emitir catálogos
    currenciesSubject.next([
      { id: 'curr-ars-id', code: 'ARS', name: 'Peso Argentino', symbol: '$' },
      { id: 'curr-usd-id', code: 'USD', name: 'Dólar', symbol: 'US$' }
    ]);
    currenciesSubject.complete();

    expect(component.selectedCurrencyCode).toBe('USD');
  });
});
