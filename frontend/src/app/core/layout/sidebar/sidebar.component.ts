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
import { VersionCheckService } from '../../services/version-check.service';
import { NavItem, NavGroup } from '../nav-item.model';
import { MENU_GROUPS } from '../../config/menu.config';

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
  readonly menuGroups: NavGroup[] = MENU_GROUPS;

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
    public favoritesService: MenuFavoritesService,
    private versionCheck: VersionCheckService
  ) {}

  /** Versión del frontend actualmente cargada, para mostrarla al pie del menú */
  readonly appVersion = this.versionCheck.currentVersion;

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
