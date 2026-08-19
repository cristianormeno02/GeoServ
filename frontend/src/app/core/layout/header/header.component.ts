import { Component, Output, EventEmitter, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { EmpresaConfigService } from '../../services/empresa-config.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, MatToolbarModule, MatIconModule, MatButtonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  @Output() toggleSidebar = new EventEmitter<void>();

  safeLogoSvg = computed(() => {
    const svg = this.empresaConfig.empresaActual()?.logoSvg;
    return svg ? this.sanitizer.bypassSecurityTrustHtml(svg) : null;
  });

  constructor(
    public empresaConfig: EmpresaConfigService,
    private sanitizer: DomSanitizer
  ) {}
}
