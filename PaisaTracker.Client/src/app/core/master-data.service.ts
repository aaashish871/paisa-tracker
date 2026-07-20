import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Customer, Supplier, Product, Material } from './models';
import { environment } from '../../environments/environment';

const BASE_URL = environment.apiUrl;

@Injectable({ providedIn: 'root' })
export class MasterDataService {
  constructor(private http: HttpClient) {}

  getCustomers(): Observable<Customer[]> {
    return this.http.get<Customer[]>(`${BASE_URL}/customers`);
  }
  createCustomer(payload: Omit<Customer, 'id'>): Observable<Customer> {
    return this.http.post<Customer>(`${BASE_URL}/customers`, payload);
  }
  updateCustomer(id: number, payload: Omit<Customer, 'id'>): Observable<void> {
    return this.http.put<void>(`${BASE_URL}/customers/${id}`, payload);
  }
  deleteCustomer(id: number): Observable<void> {
    return this.http.delete<void>(`${BASE_URL}/customers/${id}`);
  }

  getSuppliers(): Observable<Supplier[]> {
    return this.http.get<Supplier[]>(`${BASE_URL}/suppliers`);
  }
  createSupplier(payload: Omit<Supplier, 'id'>): Observable<Supplier> {
    return this.http.post<Supplier>(`${BASE_URL}/suppliers`, payload);
  }
  updateSupplier(id: number, payload: Omit<Supplier, 'id'>): Observable<void> {
    return this.http.put<void>(`${BASE_URL}/suppliers/${id}`, payload);
  }
  deleteSupplier(id: number): Observable<void> {
    return this.http.delete<void>(`${BASE_URL}/suppliers/${id}`);
  }

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${BASE_URL}/products`);
  }
  createProduct(payload: Omit<Product, 'id'>): Observable<Product> {
    return this.http.post<Product>(`${BASE_URL}/products`, payload);
  }
  updateProduct(id: number, payload: Omit<Product, 'id'>): Observable<void> {
    return this.http.put<void>(`${BASE_URL}/products/${id}`, payload);
  }
  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${BASE_URL}/products/${id}`);
  }

  getMaterials(): Observable<Material[]> {
    return this.http.get<Material[]>(`${BASE_URL}/materials`);
  }
  createMaterial(payload: Omit<Material, 'id'>): Observable<Material> {
    return this.http.post<Material>(`${BASE_URL}/materials`, payload);
  }
  updateMaterial(id: number, payload: Omit<Material, 'id'>): Observable<void> {
    return this.http.put<void>(`${BASE_URL}/materials/${id}`, payload);
  }
  deleteMaterial(id: number): Observable<void> {
    return this.http.delete<void>(`${BASE_URL}/materials/${id}`);
  }
}
