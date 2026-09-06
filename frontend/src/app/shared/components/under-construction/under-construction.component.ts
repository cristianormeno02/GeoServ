import { Component, computed, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { EmpresaConfigService } from '../../../core/services/empresa-config.service';

@Component({
  selector: 'app-under-construction',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './under-construction.component.html',
  styleUrl: './under-construction.component.css'
})
export class UnderConstructionComponent {
  @Input() title = 'Página en Construcción';
  @Input() subtitle = 'Esta página se encuentra en construcción. Estamos trabajando para tenerla lista muy pronto.';

  safeLogoSvg = computed<SafeResourceUrl | null>(() => {
    try {
      const svg = this.empresaConfig.empresaActual()?.logoSvg;
      if (!svg) return null;
      if (svg.startsWith('data:') || svg.startsWith('http') || svg.startsWith('/')) {
        return this.sanitizer.bypassSecurityTrustResourceUrl(svg);
      }
      const base64 = btoa(unescape(encodeURIComponent(svg)));
      return this.sanitizer.bypassSecurityTrustResourceUrl(`data:image/svg+xml;base64,${base64}`);
    } catch (e) {
      console.warn('Error sanitizing logo SVG', e);
      return null;
    }
  });

  constructor(
    public empresaConfig: EmpresaConfigService,
    private sanitizer: DomSanitizer
  ) {}
}
