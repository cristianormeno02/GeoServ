import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

export interface Asset {
  id?: string;
  name: string;
  description: string;
  purchasePrice: number;
  purchaseDate: string;
  providerId?: string;
  providerName?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AssetService {
  private apiUrl = `${environment.apiUrl}/assets`;

  constructor(private http: HttpClient) {}

  getAssets(): Observable<Asset[]> {
    return this.http.get<Asset[]>(this.apiUrl);
  }

  createAsset(asset: Asset): Observable<Asset> {
    return this.http.post<Asset>(this.apiUrl, asset);
  }

  updateAsset(id: string, asset: Asset): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, asset);
  }

  deleteAsset(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
