import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { catchError, of } from 'rxjs';
import { EmpresaConfigService } from '../../core/services/empresa-config.service';
import { VersionCheckService, VersionInfo } from '../../core/services/version-check.service';

interface RawChangelogEntry {
  header: string;
  body: string;
}

interface ChangelogSection {
  title: string;
  items: string[];
}

interface ChangelogEntry {
  header: string;
  sections: ChangelogSection[];
}

/** Quita el énfasis y los enlaces a commits que agrega commit-and-tag-version. */
function cleanMarkdown(text: string): string {
  return text
    .replace(/\s*\(\[[0-9a-f]{7,}\]\([^)]*\)\)\s*$/, '')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .trim();
}

/** Convierte el cuerpo Markdown de una entrada del CHANGELOG en secciones con viñetas. */
function parseChangelogBody(body: string): ChangelogSection[] {
  const sections: ChangelogSection[] = [];
  let current: ChangelogSection | null = null;

  for (const rawLine of body.split('\n')) {
    const line = rawLine.trim();
    if (!line) continue;

    if (line.startsWith('### ')) {
      current = { title: line.replace(/^###\s*/, ''), items: [] };
      sections.push(current);
    } else if (/^[-*]\s/.test(line)) {
      if (!current) {
        current = { title: '', items: [] };
        sections.push(current);
      }
      current.items.push(cleanMarkdown(line.replace(/^[-*]\s*/, '')));
    }
  }

  return sections;
}

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatDividerModule],
  templateUrl: './about.component.html',
  styleUrl: './about.component.css'
})
export class AboutComponent implements OnInit {
  private http = inject(HttpClient);
  private versionCheck = inject(VersionCheckService);
  public empresaConfig = inject(EmpresaConfigService);

  readonly appDescription = 'Gestión inteligente de órdenes de servicio y finanzas para consultoras geológicas.';

  frontendVersion: VersionInfo | null = null;
  changelog = signal<ChangelogEntry[]>([]);

  ngOnInit(): void {
    this.frontendVersion = this.versionCheck.currentVersion();

    this.http
      .get<RawChangelogEntry[]>('assets/changelog.json')
      .pipe(catchError(() => of([])))
      .subscribe(entries => {
        this.changelog.set(
          entries.map(entry => ({
            header: entry.header.replace(/\[([^\]]+)\]\([^)]*\)/g, '$1'),
            sections: parseChangelogBody(entry.body)
          }))
        );
      });
  }
}
