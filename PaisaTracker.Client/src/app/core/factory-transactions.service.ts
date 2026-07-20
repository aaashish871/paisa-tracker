import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Sale, Purchase } from './models';
import { environment } from '../../environments/environment';

const BASE_URL = environment.apiUrl;

@Injectable({ providedIn: 'root' })
export class FactoryTransactionsService {
  constructor(private http: HttpClient) {}

  getSales(): Observable<Sale[]> {
    return this.http.get<Sale[]>(`${BASE_URL}/sales`);
  }
  createSale(payload: Omit<Sale, 'id'>): Observable<Sale> {
    return this.http.post<Sale>(`${BASE_URL}/sales`, payload);
  }
  updateSale(id: number, payload: Omit<Sale, 'id'>): Observable<void> {
    return this.http.put<void>(`${BASE_URL}/sales/${id}`, payload);
  }
  deleteSale(id: number): Observable<void> {
    return this.http.delete<void>(`${BASE_URL}/sales/${id}`);
  }

  getPurchases(): Observable<Purchase[]> {
    return this.http.get<Purchase[]>(`${BASE_URL}/purchases`);
  }
  createPurchase(payload: Omit<Purchase, 'id'>): Observable<Purchase> {
    return this.http.post<Purchase>(`${BASE_URL}/purchases`, payload);
  }
  updatePurchase(id: number, payload: Omit<Purchase, 'id'>): Observable<void> {
    return this.http.put<void>(`${BASE_URL}/purchases/${id}`, payload);
  }
  deletePurchase(id: number): Observable<void> {
    return this.http.delete<void>(`${BASE_URL}/purchases/${id}`);
  }
}
