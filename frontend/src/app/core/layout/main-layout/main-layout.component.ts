import { Component, OnInit, ViewChild, inject, signal, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { BreakpointObserver } from '@angular/cdk/layout';
import { filter } from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { HeaderComponent } from '../header/header.component';
import { SidebarComponent } from '../sidebar/sidebar.component';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, MatSidenavModule, HeaderComponent, SidebarComponent],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.css'
})
export class MainLayoutComponent implements OnInit {
  @ViewChild('sidenav') sidenav!: MatSidenav;

  private breakpointObserver = inject(BreakpointObserver);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);

  isMobile = signal(false);

  ngOnInit(): void {
    this.breakpointObserver
      .observe(['(max-width: 960px)'])
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(result => {
        const mobile = result.matches;
        this.isMobile.set(mobile);
        if (this.sidenav) {
          if (mobile) {
            this.sidenav.close();
          } else {
            this.sidenav.open();
          }
        }
      });

    this.router.events
      .pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(() => {
        if (this.isMobile() && this.sidenav) {
          this.sidenav.close();
        }
      });
  }
}
