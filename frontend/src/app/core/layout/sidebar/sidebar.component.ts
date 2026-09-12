import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../services/auth.service';
import { MenuFavoritesService } from '../../services/menu-favorites.service';
import { NavItem, NavGroup } from '../nav-item.model';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    MatListModule,
    MatIconModule,
    MatDividerModule,
    MatExpansionModule,
    MatTooltipModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent implements OnInit {
  userName = 'Usuario';
  userRole: any = '';

  /** Texto de búsqueda ingresado por el usuario */
  searchText = signal('');

  /** Definición estática de grupos y sus ítems de menú */
  readonly menuGroups: NavGroup[] = [
    {
      name: 'Inicio', icon: 'home', children: [
        { name: 'Mi Dashboard', path: '/dashboard', icon: 'dashboard', roles: ['Administrador', 'Operador'], description: 'Vista general del estado de operaciones y métricas principales' },
        { name: 'Dashboard Operativo', path: '/dashboard/operativo', icon: 'insights', roles: ['Administrador'], description: 'Seguimiento en tiempo real de órdenes de servicio activas' },
        { name: 'Dashboard Financiero', path: '/dashboard/financiero', icon: 'query_stats', roles: ['Administrador'], description: 'Resumen financiero: ingresos, costos y resultados del período' },
        { name: 'Dashboard Cliente', path: '/dashboard/cliente', icon: 'person', roles: ['Administrador', 'Cliente'], description: 'Vista personalizada del estado de servicios para el cliente' }
      ]
    },
    {
      name: 'Operaciones', icon: 'work', children: [
        { name: 'Órdenes de Servicio', path: '/ordenes-servicio', icon: 'build', roles: ['Administrador'], description: 'Gestión completa de órdenes de servicio: creación, seguimiento y cierre' },
        { name: 'Tipos de Servicio', path: '/tipos-servicio', icon: 'miscellaneous_services', roles: ['Administrador'], description: 'Configuración de categorías y tipos de servicio disponibles' },
        { isSeparator: true },
        { name: 'Proyectos', path: '/proyectos', icon: 'folder', roles: ['Administrador'], description: 'Administración de proyectos y su geolocalización en el mapa' }
      ]
    },
    {
      name: 'Contactos', icon: 'contacts', children: [
        { name: 'Clientes', path: '/clientes', icon: 'people', roles: ['Administrador'], description: 'Registro y gestión de clientes de la empresa' },
        { name: 'Tipos de Compañía', path: '/tipos-compania', icon: 'category', roles: ['Administrador'], description: 'Clasificación de tipos de empresa y compañías asociadas' },
        { isSeparator: true },
        { name: 'Proveedores', path: '/proveedores', icon: 'local_shipping', roles: ['Administrador'], description: 'Gestión de proveedores de insumos y servicios externos' },
        { name: 'Responsables', path: '/responsibles', icon: 'badge', roles: ['Administrador'], description: 'Técnicos y responsables asignables a órdenes de servicio' }
      ]
    },
    {
      name: 'Recursos', icon: 'inventory_2', children: [
        { name: 'Inventario', path: '/inventario', icon: 'inventory', roles: ['Administrador'], description: 'Control de stock de materiales e insumos disponibles' },
        { name: 'Activos', path: '/activos', icon: 'precision_manufacturing', roles: ['Administrador'], description: 'Registro de activos físicos de la empresa (equipos, vehículos)' },
        { isSeparator: true },
        { name: 'Insumos', path: '/insumos', icon: 'shopping_cart', roles: ['Administrador'], description: 'Catálogo de insumos y materiales utilizados en los servicios' },
        { name: 'Tipos de Insumo', path: '/tipos-insumo', icon: 'category', roles: ['Administrador'], description: 'Clasificación de tipos de insumo para organizar el catálogo' },
        { name: 'Clases de Insumo', path: '/clases-insumo', icon: 'category', roles: ['Administrador'], description: 'Agrupación de insumos por clase para reportes y búsquedas' },
        { isSeparator: true },
        { name: 'Unidades', path: '/unidades', icon: 'square_foot', roles: ['Administrador'], description: 'Unidades de medida utilizadas en insumos y materiales' }
      ]
    },
    {
      name: 'Finanzas', icon: 'account_balance', children: [
        { name: 'Resumen', path: '/finanzas/resumen', icon: 'attach_money', roles: ['Administrador'], description: 'Resumen financiero consolidado del período seleccionado' },
        { isSeparator: true },
        { name: 'Movimientos', path: '/movimientos', icon: 'swap_horiz', roles: ['Administrador'], description: 'Registro de ingresos y egresos monetarios de la empresa' },
        { name: 'Categorías de Movimiento', path: '/categorias-movimiento', icon: 'category', roles: ['Administrador'], description: 'Clasificación de movimientos financieros por categoría' },
        { name: 'Cheques', path: '/cheques', icon: 'receipt_long', roles: ['Administrador'], description: 'Gestión y seguimiento de cheques emitidos y recibidos' },
        { name: 'Cuentas Bancarias', path: '/cuentas-financieras', icon: 'account_balance_wallet', roles: ['Administrador'], description: 'Administración de cuentas bancarias de la empresa' },
        { name: 'Medios de Pago', path: '/medios-pago', icon: 'payment', roles: ['Administrador'], description: 'Configuración de los medios de pago aceptados y disponibles' },
        { isSeparator: true },
        { name: 'Gastos Fijos', path: '/gastos-fijos', icon: 'event_repeat', roles: ['Administrador'], description: 'Registro y seguimiento de gastos fijos y recurrentes' },
        { name: 'Categorías Gastos Fijos', path: '/categorias-gastos-fijos', icon: 'category', roles: ['Administrador'], description: 'Clasificación de gastos fijos por categoría contable' },
        { isSeparator: true },
        { name: 'Categorías de Costos', path: '/categorias-costos', icon: 'monetization_on', roles: ['Administrador'], description: 'Tipos de costo directo aplicables en órdenes de servicio' }
      ]
    },
    {
      name: 'Administración', icon: 'admin_panel_settings', children: [
        { name: 'Configuración', path: '/configuracion', icon: 'settings', roles: ['Administrador'], description: 'Parámetros generales de la empresa y del sistema' },
        { name: 'Usuarios', path: '/usuarios', icon: 'manage_accounts', roles: ['Administrador'], description: 'Gestión de usuarios: roles, permisos y accesos al sistema' }
      ]
    }
  ];

  /** Signal con los grupos filtrados según el texto de búsqueda */
  readonly filteredGroups = computed(() => {
    const query = this.searchText().trim().toLowerCase();
    if (!query) return this.menuGroups;

    const result: NavGroup[] = [];
    for (const group of this.menuGroups) {
      const matchingChildren = group.children.filter(child => {
        if (child.isSeparator) return false;
        const nameMatch = child.name?.toLowerCase().includes(query) ?? false;
        const descMatch = child.description?.toLowerCase().includes(query) ?? false;
        return nameMatch || descMatch;
      });
      if (matchingChildren.length > 0) {
        result.push({ ...group, children: matchingChildren });
      }
    }
    return result;
  });

  /** True si hay texto de búsqueda y no hay resultados */
  readonly noSearchResults = computed(() =>
    this.searchText().trim().length > 0 && this.filteredGroups().length === 0
  );

  constructor(
    private authService: AuthService,
    private router: Router,
    public favoritesService: MenuFavoritesService
  ) {}

  ngOnInit() {
    this.userName = this.authService.getUserName();
    this.userRole = this.authService.getUserRole();
  }

  /** Retorna el userId del token JWT para namespacing de favoritos */
  get userId(): string {
    return this.authService.getUserId();
  }

  /** Indica si un ítem de menú está marcado como favorito */
  isFavorite(item: NavItem): boolean {
    return this.favoritesService.isFavorite(this.userId, item);
  }

  /** Alterna el estado de favorito de un ítem */
  toggleFavorite(event: Event, item: NavItem): void {
    event.preventDefault();
    event.stopPropagation();
    if (this.isFavorite(item)) {
      this.favoritesService.removeFavorite(this.userId, item);
    } else {
      this.favoritesService.addFavorite(this.userId, item);
    }
  }

  /** Construye el texto del tooltip: nombre + descripción para menú colapsado */
  getTooltip(item: NavItem): string {
    return item.description ?? '';
  }

  hasAccess(roles: string[] | undefined): boolean {
    if (!roles) return true;
    if (Array.isArray(this.userRole)) {
      return this.userRole.some((r: string) => roles.includes(r));
    }
    return roles.includes(this.userRole);
  }

  getFilteredChildren(children: NavItem[]) {
    return children.filter(child => {
      if (child.isSeparator) return true;
      return this.hasAccess(child.roles);
    });
  }

  hasVisibleChildren(group: NavGroup): boolean {
    return this.getFilteredChildren(group.children).some(child => !child.isSeparator);
  }

  /** Limpia el campo de búsqueda */
  clearSearch(): void {
    this.searchText.set('');
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
