import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private requestCount = 0;
  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading$ = this.loadingSubject.asObservable();

  show() {
    this.requestCount++;
    if (this.requestCount === 1) {
      // Usamos un ligero delay o macrotarea si vemos problemas de "ExpressionChangedAfterItHasBeenCheckedError", 
      // pero por ahora BehaviorSubject directo funciona en la mayoría de casos.
      this.loadingSubject.next(true);
    }
  }

  hide() {
    this.requestCount--;
    if (this.requestCount <= 0) {
      this.requestCount = 0;
      this.loadingSubject.next(false);
    }
  }
}
