import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: 'login', loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent) },
  { 
    path: '', 
    loadComponent: () => import('./core/layout/main-layout/main-layout.component').then(m => m.MainLayoutComponent),
    children: [
      { path: 'dashboard', loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent) },
      { path: 'clientes', loadComponent: () => import('./features/clients/components/client-list/client-list.component').then(m => m.ClientListComponent) },
      { path: 'tipos-compania', loadComponent: () => import('./features/company-types/components/company-type-list/company-type-list.component').then(m => m.CompanyTypeListComponent) },
      { path: 'tipos-servicio', loadComponent: () => import('./features/service-types/components/service-type-list/service-type-list.component').then(m => m.ServiceTypeListComponent) },
      { path: 'usuarios', loadComponent: () => import('./features/users/components/user-list/user-list.component').then(m => m.UserListComponent) },
      { path: 'configuracion', loadComponent: () => import('./features/empresa-config/empresa-config.component').then(m => m.EmpresaConfigComponent) },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },
  { path: '**', redirectTo: '' }
];
