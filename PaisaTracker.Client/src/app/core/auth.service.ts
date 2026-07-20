import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { LoginRequest, LoginResponse } from './auth.models';

const BASE_URL = 'http://localhost:5015/api';
const STORAGE_KEY = 'paisa_auth';

interface StoredAuth {
  token: string;
  username: string;
  displayName?: string;
  roles: string[];
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private state = signal<StoredAuth | null>(this.readStorage());

  constructor(private http: HttpClient) {}

  private readStorage(): StoredAuth | null {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    try { return JSON.parse(raw) as StoredAuth; } catch { return null; }
  }

  login(payload: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${BASE_URL}/auth/login`, payload).pipe(
      tap((res) => {
        const stored: StoredAuth = { token: res.token, username: res.username, displayName: res.displayName, roles: res.roles };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
        this.state.set(stored);
      })
    );
  }

  logout(): void {
    localStorage.removeItem(STORAGE_KEY);
    this.state.set(null);
  }

  get token(): string | null {
    return this.state()?.token ?? null;
  }

  get username(): string | null {
    return this.state()?.username ?? null;
  }

  get displayName(): string | null {
    return this.state()?.displayName ?? this.state()?.username ?? null;
  }

  get roles(): string[] {
    return this.state()?.roles ?? [];
  }

  get isLoggedIn(): boolean {
    return !!this.state()?.token;
  }

  hasRole(role: string): boolean {
    return this.roles.includes(role);
  }
}
