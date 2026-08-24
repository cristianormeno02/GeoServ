import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, MatListModule, MatIconModule, MatDividerModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent implements OnInit {
  userName = 'Usuario';
  links = [
    { name: 'Dashboard', path: '/dashboard', icon: 'dashboard' },
    { name: 'Órdenes de Servicio', path: '/ordenes-servicio', icon: 'build' },
    { name: 'Finanzas', path: '/finanzas', icon: 'attach_money' },
    { name: 'Movimientos', path: '/movimientos', icon: 'swap_horiz' },
    { name: 'Cuentas Bancarias', path: '/cuentas-financieras', icon: 'account_balance' },
    { name: 'Cheques', path: '/cheques', icon: 'receipt_long' },
    { name: 'Activos', path: '/activos', icon: 'precision_manufacturing' },
    { name: 'Clientes', path: '/clientes', icon: 'people' },
    { name: 'Proyectos', path: '/proyectos', icon: 'folder' },
    { name: 'Tipos de Compañía', path: '/tipos-compania', icon: 'category' },
    { name: 'Tipos de Servicio', path: '/tipos-servicio', icon: 'miscellaneous_services' },
    { name: 'Usuarios', path: '/usuarios', icon: 'manage_accounts' },
    { name: 'Responsables', path: '/responsibles', icon: 'badge' },
    { name: 'Categorías Costos', path: '/categorias-costos', icon: 'monetization_on' },
    { name: 'Proveedores', path: '/proveedores', icon: 'local_shipping' },
    { name: 'Unidades', path: '/unidades', icon: 'square_foot' },
    { name: 'Medios Pago', path: '/medios-pago', icon: 'payment' },
    { name: 'Inventario', path: '/inventario', icon: 'inventory' },
    { name: 'Configuración', path: '/configuracion', icon: 'settings' }
  ];

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.userName = this.authService.getUserName();
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
