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
    { name: 'Órdenes de Servicio', path: '/ordenes', icon: 'build' },
    { name: 'Finanzas', path: '/finanzas', icon: 'attach_money' },
    { name: 'Clientes', path: '/clientes', icon: 'people' },
    { name: 'Tipos de Compañía', path: '/tipos-compania', icon: 'category' },
    { name: 'Inventario', path: '/inventario', icon: 'inventory' }
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
