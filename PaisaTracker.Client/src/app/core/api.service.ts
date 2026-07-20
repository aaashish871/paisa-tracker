import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Account, CreditCard, Expense } from './models';
import { environment } from '../../environments/environment';

const BASE_URL = environment.apiUrl;

@Injectable({ providedIn: 'root' })
export class ApiService {
  constructor(private http: HttpClient) {}

  getAccounts(): Observable<Account[]> {
    return this.http.get<Account[]>(`${BASE_URL}/accounts`);
  }
  createAccount(payload: Omit<Account, 'id'>): Observable<Account> {
    return this.http.post<Account>(`${BASE_URL}/accounts`, payload);
  }
  updateAccount(id: number, payload: Omit<Account, 'id'>): Observable<void> {
    return this.http.put<void>(`${BASE_URL}/accounts/${id}`, payload);
  }
  deleteAccount(id: number): Observable<void> {
    return this.http.delete<void>(`${BASE_URL}/accounts/${id}`);
  }

  getCreditCards(): Observable<CreditCard[]> {
    return this.http.get<CreditCard[]>(`${BASE_URL}/creditcards`);
  }
  createCreditCard(payload: Omit<CreditCard, 'id'>): Observable<CreditCard> {
    return this.http.post<CreditCard>(`${BASE_URL}/creditcards`, payload);
  }
  updateCreditCard(id: number, payload: Omit<CreditCard, 'id'>): Observable<void> {
    return this.http.put<void>(`${BASE_URL}/creditcards/${id}`, payload);
  }
  deleteCreditCard(id: number): Observable<void> {
    return this.http.delete<void>(`${BASE_URL}/creditcards/${id}`);
  }

  getExpenses(): Observable<Expense[]> {
    return this.http.get<Expense[]>(`${BASE_URL}/expenses`);
  }
  createExpense(payload: Omit<Expense, 'id'>): Observable<Expense> {
    return this.http.post<Expense>(`${BASE_URL}/expenses`, payload);
  }
  deleteExpense(id: number): Observable<void> {
    return this.http.delete<void>(`${BASE_URL}/expenses/${id}`);
  }
}
