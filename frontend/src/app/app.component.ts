import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoadingSpinnerComponent } from './core/components/loading-spinner/loading-spinner.component';
import { environment } from '../environments/environment';
import { VersionCheckService } from './core/services/version-check.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, LoadingSpinnerComponent],
  template: `
    <router-outlet></router-outlet>
    <app-loading-spinner></app-loading-spinner>
  `,
  styles: []
})
export class AppComponent {
  title = 'geoserv-web';

  private versionCheck = inject(VersionCheckService);

  constructor() {
    this.loadGoogleMapsApi();
    this.versionCheck.start();
  }

  private loadGoogleMapsApi() {
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${environment.googleMapsApiKey}&libraries=places&loading=async`;
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);
  }
}
