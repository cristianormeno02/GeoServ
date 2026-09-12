import { Component, Output, EventEmitter, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatBadgeModule } from '@angular/material/badge';
import { AsyncPipe } from '@angular/common';
import { EmpresaConfigService } from '../../services/empresa-config.service';
import { DomSanitizer } from '@angular/platform-browser';
import { AuthService } from '../../services/auth.service';
import { MenuFavoritesService } from '../../services/menu-favorites.service';
import { NavItem } from '../nav-item.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    AsyncPipe,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatTooltipModule,
    MatBadgeModule,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  @Output() toggleSidebar = new EventEmitter<void>();

  private authService = inject(AuthService);
  private sanitizer = inject(DomSanitizer);
  private router = inject(Router);
  public empresaConfig = inject(EmpresaConfigService);
  public favoritesService = inject(MenuFavoritesService);

  safeLogoSvg = computed(() => {
    const svg = this.empresaConfig.empresaActual()?.logoSvg;
    if (!svg) return null;
    const base64 = btoa(unescape(encodeURIComponent(svg)));
    return this.sanitizer.bypassSecurityTrustResourceUrl(`data:image/svg+xml;base64,${base64}`);
  });

  /** ID del usuario autenticado (para namespacing de favoritos) */
  get userId(): string {
    return this.authService.getUserId();
  }

  /** Lista reactiva de favoritos del usuario actual */
  get favorites$() {
    return this.favoritesService.getFavorites$(this.userId);
  }

  /** Quita un ítem de los favoritos del usuario */
  removeFavorite(item: NavItem): void {
    this.favoritesService.removeFavorite(this.userId, item);
  }

  /** Navega al ítem favorito seleccionado */
  navigateTo(item: NavItem): void {
    if (item.path) {
      this.router.navigate([item.path]);
    }
  }
}
