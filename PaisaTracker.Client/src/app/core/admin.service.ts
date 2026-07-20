import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppUser } from './auth.models';

const BASE_URL = 'http://localhost:5015/api/admin/users';

export interface CreateUserPayload {
  username: string;
  password: string;
  displayName?: string;
  role: 'Admin' | 'SuperUser';
}

@Injectable({ providedIn: 'root' })
export class AdminService {
  constructor(private http: HttpClient) {}

  getUsers(): Observable<AppUser[]> {
    return this.http.get<AppUser[]>(BASE_URL);
  }

  createUser(payload: CreateUserPayload): Observable<AppUser> {
    return this.http.post<AppUser>(BASE_URL, payload);
  }

  resetPassword(id: string, newPassword: string): Observable<void> {
    return this.http.put<void>(`${BASE_URL}/${id}/reset-password`, { newPassword });
  }

  changeRole(id: string, role: 'Admin' | 'SuperUser'): Observable<void> {
    return this.http.put<void>(`${BASE_URL}/${id}/role`, { role });
  }

  deleteUser(id: string): Observable<void> {
    return this.http.delete<void>(`${BASE_URL}/${id}`);
  }
}
