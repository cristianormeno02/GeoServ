import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { HeaderComponent } from '../header/header.component';
import { SidebarComponent } from '../sidebar/sidebar.component';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, MatSidenavModule, HeaderComponent, SidebarComponent],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.css'
})
export class MainLayoutComponent {
  menuItems = [
    { icon: 'business', label: 'Clientes', route: '/clientes' },
    { icon: 'engineering', label: 'Proyectos', route: '/proyectos' },
    { icon: 'category', label: 'Tipos de Servicio', route: '/tipos-servicio' },
    { icon: 'assignment', label: 'Órdenes de Servicio', route: '/ordenes-servicio' },
    { icon: 'groups', label: 'Responsables', route: '/responsibles' },
    { icon: 'account_tree', label: 'Tipos de Compañía', route: '/tipos-compania' },
    { icon: 'monetization_on', label: 'Categorías Costos', route: '/categorias-costos' },
    { icon: 'local_shipping', label: 'Proveedores', route: '/proveedores' },
    { icon: 'square_foot', label: 'Unidades', route: '/unidades' },
    { icon: 'payment', label: 'Medios de Pago', route: '/medios-pago' },
    { icon: 'people', label: 'Usuarios', route: '/usuarios' },
    { icon: 'settings', label: 'Configuración', route: '/configuracion' }
  ];
}
