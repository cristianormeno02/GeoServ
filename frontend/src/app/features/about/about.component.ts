import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { catchError, of } from 'rxjs';
import { environment } from '../../../environments/environment';
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

interface BackendVersionInfo {
  version: string;
  buildDate: string;
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
    } else if (line.startsWith('- ')) {
      if (!current) {
        current = { title: '', items: [] };
        sections.push(current);
      }
      current.items.push(line.replace(/^-\s*/, ''));
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

  frontendVersion: VersionInfo | null = null;
  backendVersion: BackendVersionInfo | null = null;
  backendUnreachable = false;
  changelog: ChangelogEntry[] = [];

  ngOnInit(): void {
    this.frontendVersion = this.versionCheck.currentVersion();

    this.http
      .get<BackendVersionInfo>(`${environment.apiUrl}/system/version`)
      .pipe(catchError(() => { this.backendUnreachable = true; return of(null); }))
      .subscribe(info => { if (info) this.backendVersion = info; });

    this.http
      .get<RawChangelogEntry[]>('assets/changelog.json')
      .pipe(catchError(() => of([])))
      .subscribe(entries => {
        this.changelog = entries.map(entry => ({
          header: entry.header,
          sections: parseChangelogBody(entry.body)
        }));
      });
  }
}
