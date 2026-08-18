import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, MatListModule, MatIconModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  links = [
    { name: 'Dashboard', path: '/dashboard', icon: 'dashboard' },
    { name: 'Órdenes de Servicio', path: '/ordenes', icon: 'build' },
    { name: 'Finanzas', path: '/finanzas', icon: 'attach_money' },
    { name: 'Clientes', path: '/clientes', icon: 'people' },
    { name: 'Inventario', path: '/inventario', icon: 'inventory' }
  ];
}
