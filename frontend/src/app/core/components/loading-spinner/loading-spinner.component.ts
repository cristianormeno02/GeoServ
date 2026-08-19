import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { LoadingService } from '../../services/loading.service';
import { delay } from 'rxjs';

@Component({
  selector: 'app-loading-spinner',
  standalone: true,
  imports: [CommonModule, MatProgressSpinnerModule],
  template: `
    <div class="overlay" *ngIf="isLoading$ | async">
      <mat-spinner diameter="60" color="primary"></mat-spinner>
    </div>
  `,
  styles: [`
    .overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background-color: rgba(0, 0, 0, 0.3); /* Un fondo semitransparente oscuro */
      z-index: 9999; /* Asegurar que esté por encima de TODO (incluyendo modales de material) */
      display: flex;
      justify-content: center;
      align-items: center;
    }
  `]
})
export class LoadingSpinnerComponent {
  private loadingService = inject(LoadingService);
  public isLoading$ = this.loadingService.loading$.pipe(delay(0));
}
