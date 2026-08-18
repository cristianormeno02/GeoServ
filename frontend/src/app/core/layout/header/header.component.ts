import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { EmpresaConfigService } from '../../services/empresa-config.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { computed } from '@angular/core';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, MatToolbarModule, MatIconModule, MatButtonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  safeLogoSvg = computed(() => {
    const svg = this.empresaConfig.empresaActual()?.logoSvg;
    return svg ? this.sanitizer.bypassSecurityTrustHtml(svg) : null;
  });

  constructor(
    private router: Router,
    public empresaConfig: EmpresaConfigService,
    private sanitizer: DomSanitizer
  ) {}

  logout() {
    localStorage.removeItem('jwt_token');
    this.router.navigate(['/login']);
  }
}
