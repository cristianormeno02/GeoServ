import { TestBed } from '@angular/core/testing';
import { ChangeDetectorRef } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { MatDialog } from '@angular/material/dialog';
import { of } from 'rxjs';
import { OperationalDashboardComponent } from './operational-dashboard.component';
import { OperationalDashboardService } from './services/operational-dashboard.service';
import { EmpresaConfigService } from '../../core/services/empresa-config.service';
import { ProjectService } from '../projects/services/project.service';

describe('OperationalDashboardComponent', () => {
  let component: OperationalDashboardComponent;
  let dashboardServiceSpy: jasmine.SpyObj<OperationalDashboardService>;
  let empresaConfigSpy: jasmine.SpyObj<EmpresaConfigService>;
  let projectServiceSpy: jasmine.SpyObj<ProjectService>;
  let dialogSpy: jasmine.SpyObj<MatDialog>;
  let cdrSpy: jasmine.SpyObj<ChangeDetectorRef>;
  let sanitizerSpy: jasmine.SpyObj<DomSanitizer>;

  beforeEach(() => {
    dashboardServiceSpy = jasmine.createSpyObj('OperationalDashboardService', [
      'getKpis', 'getTeamCapacity', 'getDeadlineCompliance', 'getOrdersByServiceType',
      'getWorkloadByResponsible', 'getAgingUncollectedOrders', 'getUpcomingDeliveries',
      'getStagnantOrders', 'getInventoryAlerts', 'getUpcomingFixedCosts'
    ]);
    empresaConfigSpy = jasmine.createSpyObj('EmpresaConfigService', ['empresaActual']);
    projectServiceSpy = jasmine.createSpyObj('ProjectService', ['getProjects']);
    dialogSpy = jasmine.createSpyObj('MatDialog', ['open']);
    cdrSpy = jasmine.createSpyObj('ChangeDetectorRef', ['detectChanges']);
    sanitizerSpy = jasmine.createSpyObj('DomSanitizer', ['bypassSecurityTrustResourceUrl']);

    component = new OperationalDashboardComponent(
      dashboardServiceSpy,
      cdrSpy,
      empresaConfigSpy,
      sanitizerSpy,
      projectServiceSpy,
      dialogSpy
    );
  });

  it('should initialize mapOptions with hybrid mapTypeId by default (satellite with labels)', () => {
    expect(component.mapOptions.mapTypeId).toBe('hybrid');
  });
});
