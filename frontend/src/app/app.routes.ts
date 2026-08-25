import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: 'login', loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent) },
  { 
    path: '', 
    loadComponent: () => import('./core/layout/main-layout/main-layout.component').then(m => m.MainLayoutComponent),
    canActivate: [authGuard],
    children: [
      { path: 'dashboard', loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent) },
      { path: 'clientes', loadComponent: () => import('./features/clients/components/client-list/client-list.component').then(m => m.ClientListComponent) },
      { path: 'tipos-compania', loadComponent: () => import('./features/company-types/components/company-type-list/company-type-list.component').then(m => m.CompanyTypeListComponent) },
      { path: 'tipos-servicio', loadComponent: () => import('./features/service-types/components/service-type-list/service-type-list.component').then(m => m.ServiceTypeListComponent) },
      { path: 'proyectos', loadComponent: () => import('./features/projects/components/project-list/project-list.component').then(m => m.ProjectListComponent) },
      { path: 'usuarios', loadComponent: () => import('./features/users/components/user-list/user-list.component').then(m => m.UserListComponent) },
      { path: 'configuracion', loadComponent: () => import('./features/empresa-config/empresa-config.component').then(m => m.EmpresaConfigComponent) },
      { path: 'ordenes-servicio', loadComponent: () => import('./features/service-orders/components/service-order-list/service-order-list.component').then(m => m.ServiceOrderListComponent) },
      { path: 'ordenes-servicio/nuevo', loadComponent: () => import('./features/service-orders/components/service-order-form/service-order-form.component').then(m => m.ServiceOrderFormComponent) },
      { path: 'ordenes-servicio/editar/:id', loadComponent: () => import('./features/service-orders/components/service-order-form/service-order-form.component').then(m => m.ServiceOrderFormComponent) },
      { path: 'ordenes-servicio/:id', loadComponent: () => import('./features/service-orders/components/service-order-detail/service-order-detail.component').then(m => m.ServiceOrderDetailComponent) },
      { path: 'responsibles', loadComponent: () => import('./features/responsibles/components/responsible-list/responsible-list.component').then(m => m.ResponsibleListComponent) },
      { path: 'responsibles/nuevo', loadComponent: () => import('./features/responsibles/components/responsible-form/responsible-form.component').then(m => m.ResponsibleFormComponent) },
      { path: 'responsibles/editar/:id', loadComponent: () => import('./features/responsibles/components/responsible-form/responsible-form.component').then(m => m.ResponsibleFormComponent) },
      { path: 'categorias-costos', loadComponent: () => import('./features/direct-cost-categories/components/direct-cost-category-list/direct-cost-category-list.component').then(m => m.DirectCostCategoryListComponent) },
      { path: 'proveedores', loadComponent: () => import('./features/providers/components/provider-list/provider-list.component').then(m => m.ProviderListComponent) },
      { path: 'unidades', loadComponent: () => import('./features/units/components/unit-list/unit-list.component').then(m => m.UnitListComponent) },
      { path: 'medios-pago', loadComponent: () => import('./features/payment-methods/components/payment-method-list/payment-method-list.component').then(m => m.PaymentMethodListComponent) },
      { path: 'movimientos', loadComponent: () => import('./features/finance/movimientos/movimientos').then(m => m.Movimientos) },
      { path: 'cuentas-financieras', loadComponent: () => import('./features/finance/cuentas-financieras/cuentas-financieras').then(m => m.CuentasFinancieras) },
      { path: 'cheques', loadComponent: () => import('./features/finance/cheques/cheques').then(m => m.Cheques) },
      { path: 'activos', loadComponent: () => import('./features/finance/activos/activos').then(m => m.Activos) },
      { path: 'categorias-movimiento', loadComponent: () => import('./features/finance/categorias-movimiento/categorias-movimiento').then(m => m.CategoriasMovimiento) },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },
  { path: '**', redirectTo: '' }
];
