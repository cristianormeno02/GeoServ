import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { SidebarComponent } from './sidebar.component';
import { AuthService } from '../../services/auth.service';

describe('SidebarComponent', () => {
  let component: SidebarComponent;
  let fixture: ComponentFixture<SidebarComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['getUserName', 'getUserRole', 'logout']);
    authServiceSpy.getUserName.and.returnValue('Test User');
    authServiceSpy.getUserRole.and.returnValue('Administrador');

    await TestBed.configureTestingModule({
      imports: [SidebarComponent, NoopAnimationsModule],
      providers: [
        provideRouter([]),
        { provide: AuthService, useValue: authServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debe contener Dashboard Cliente apuntando a /dashboard/cliente', () => {
    const inicioGroup = component.menuGroups.find(g => g.name === 'Inicio');
    expect(inicioGroup).toBeDefined();

    const clientDash = inicioGroup?.children?.find(c => c.name === 'Dashboard Cliente');
    expect(clientDash).toBeDefined();
    expect(clientDash?.path).toBe('/dashboard/cliente');
  });

  it('debe filtrar solo Dashboard Cliente en Inicio para el rol Cliente', () => {
    component.userRole = 'Cliente';
    const inicioGroup = component.menuGroups.find(g => g.name === 'Inicio')!;
    const filtered = component.getFilteredChildren(inicioGroup.children);

    expect(filtered.length).toBe(1);
    expect(filtered[0].name).toBe('Dashboard Cliente');
    expect(filtered[0].path).toBe('/dashboard/cliente');
  });

  it('debe filtrar Mi Dashboard en Inicio para el rol Operador', () => {
    component.userRole = 'Operador';
    const inicioGroup = component.menuGroups.find(g => g.name === 'Inicio')!;
    const filtered = component.getFilteredChildren(inicioGroup.children);

    expect(filtered.length).toBe(1);
    expect(filtered[0].name).toBe('Mi Dashboard');
    expect(filtered[0].path).toBe('/dashboard');
  });

  it('debe mostrar todos los dashboards para el rol Administrador', () => {
    component.userRole = 'Administrador';
    const inicioGroup = component.menuGroups.find(g => g.name === 'Inicio')!;
    const filtered = component.getFilteredChildren(inicioGroup.children);

    expect(filtered.some(c => c.name === 'Mi Dashboard')).toBeTrue();
    expect(filtered.some(c => c.name === 'Dashboard Operativo')).toBeTrue();
    expect(filtered.some(c => c.name === 'Dashboard Financiero')).toBeTrue();
    expect(filtered.some(c => c.name === 'Dashboard Cliente')).toBeTrue();
  });
});
