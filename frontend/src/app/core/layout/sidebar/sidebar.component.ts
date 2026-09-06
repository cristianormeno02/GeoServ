import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, MatListModule, MatIconModule, MatDividerModule, MatExpansionModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent implements OnInit {
  userName = 'Usuario';
  userRole: any = '';

  menuGroups = [
    {
      name: 'Inicio', icon: 'home', children: [
        { name: 'Mi Dashboard', path: '/dashboard', icon: 'dashboard', roles: ['Administrador', 'Operador'] },
        { name: 'Dashboard Operativo', path: '/dashboard/operativo', icon: 'insights', roles: ['Administrador'] },
        { name: 'Dashboard Financiero', path: '/dashboard/financiero', icon: 'query_stats', roles: ['Administrador'] },
        { name: 'Dashboard Cliente', path: '/dashboard/cliente', icon: 'person', roles: ['Administrador', 'Cliente'] }
      ]
    },
    {
      name: 'Operaciones', icon: 'work', children: [
        { name: 'Órdenes de Servicio', path: '/ordenes-servicio', icon: 'build', roles: ['Administrador'] },
        { name: 'Tipos de Servicio', path: '/tipos-servicio', icon: 'miscellaneous_services', roles: ['Administrador'] },
        { isSeparator: true },
        { name: 'Proyectos', path: '/proyectos', icon: 'folder', roles: ['Administrador'] }
      ]
    },
    {
      name: 'Contactos', icon: 'contacts', children: [
        { name: 'Clientes', path: '/clientes', icon: 'people', roles: ['Administrador'] },
        { name: 'Tipos de Compañía', path: '/tipos-compania', icon: 'category', roles: ['Administrador'] },
        { isSeparator: true },
        { name: 'Proveedores', path: '/proveedores', icon: 'local_shipping', roles: ['Administrador'] },
        { name: 'Responsables', path: '/responsibles', icon: 'badge', roles: ['Administrador'] }
      ]
    },
    {
      name: 'Recursos', icon: 'inventory_2', children: [
        { name: 'Inventario', path: '/inventario', icon: 'inventory', roles: ['Administrador'] },
        { name: 'Activos', path: '/activos', icon: 'precision_manufacturing', roles: ['Administrador'] },
        { isSeparator: true },
        { name: 'Insumos', path: '/insumos', icon: 'shopping_cart', roles: ['Administrador'] },
        { name: 'Tipos de Insumo', path: '/tipos-insumo', icon: 'category', roles: ['Administrador'] },
        { name: 'Clases de Insumo', path: '/clases-insumo', icon: 'category', roles: ['Administrador'] },
        { isSeparator: true },
        { name: 'Unidades', path: '/unidades', icon: 'square_foot', roles: ['Administrador'] }
      ]
    },
    {
      name: 'Finanzas', icon: 'account_balance', children: [
        { name: 'Resumen', path: '/finanzas/resumen', icon: 'attach_money', roles: ['Administrador'] },
        { isSeparator: true },
        { name: 'Movimientos', path: '/movimientos', icon: 'swap_horiz', roles: ['Administrador'] },
        { name: 'Categorías de Movimiento', path: '/categorias-movimiento', icon: 'category', roles: ['Administrador'] },
        { name: 'Cheques', path: '/cheques', icon: 'receipt_long', roles: ['Administrador'] },
        { name: 'Cuentas Bancarias', path: '/cuentas-financieras', icon: 'account_balance_wallet', roles: ['Administrador'] },
        { name: 'Medios de Pago', path: '/medios-pago', icon: 'payment', roles: ['Administrador'] },
        { isSeparator: true },
        { name: 'Gastos Fijos', path: '/gastos-fijos', icon: 'event_repeat', roles: ['Administrador'] },
        { name: 'Categorías Gastos Fijos', path: '/categorias-gastos-fijos', icon: 'category', roles: ['Administrador'] },
        { isSeparator: true },
        { name: 'Categorías de Costos', path: '/categorias-costos', icon: 'monetization_on', roles: ['Administrador'] }
      ]
    },
    {
      name: 'Administración', icon: 'admin_panel_settings', children: [
        { name: 'Configuración', path: '/configuracion', icon: 'settings', roles: ['Administrador'] },
        { name: 'Usuarios', path: '/usuarios', icon: 'manage_accounts', roles: ['Administrador'] }
      ]
    }
  ];

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.userName = this.authService.getUserName();
    this.userRole = this.authService.getUserRole();
  }

  hasAccess(roles: string[] | undefined): boolean {
    if (!roles) return true;
    if (Array.isArray(this.userRole)) {
      return this.userRole.some(r => roles.includes(r));
    }
    return roles.includes(this.userRole);
  }

  getFilteredChildren(children: any[]) {
    return children.filter(child => {
      if (child.isSeparator) return true; // Let the template handle separators
      return this.hasAccess(child.roles);
    });
  }

  hasVisibleChildren(group: any): boolean {
    return this.getFilteredChildren(group.children).some(child => !child.isSeparator);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
