import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { InventoryMovement } from '../models/inventory-movement.model';

@Injectable({
  providedIn: 'root'
})
export class InventoryMovementService {
  private apiUrl = environment.apiUrl + '/inventory-movements';

  constructor(private http: HttpClient) {}

  getMovementsByConsumableId(consumableId: string): Observable<InventoryMovement[]> {
    return this.http.get<InventoryMovement[]>(this.apiUrl + '/consumable/' + consumableId);
  }

  createMovement(movement: InventoryMovement): Observable<InventoryMovement> {
    return this.http.post<InventoryMovement>(this.apiUrl, movement);
  }
}
