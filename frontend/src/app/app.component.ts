import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoadingSpinnerComponent } from './core/components/loading-spinner/loading-spinner.component';
import { environment } from '../environments/environment';

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

  constructor() {
    this.loadGoogleMapsApi();
  }

  private loadGoogleMapsApi() {
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${environment.googleMapsApiKey}&libraries=places&loading=async`;
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);
  }
}
