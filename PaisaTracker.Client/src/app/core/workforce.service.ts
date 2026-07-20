import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Worker, AttendanceRecord, AttendanceStatus, Advance, PayrollRow } from './models';
import { environment } from '../../environments/environment';

const BASE_URL = environment.apiUrl;

@Injectable({ providedIn: 'root' })
export class WorkforceService {
  constructor(private http: HttpClient) {}

  getWorkers(): Observable<Worker[]> {
    return this.http.get<Worker[]>(`${BASE_URL}/workers`);
  }
  createWorker(payload: Omit<Worker, 'id'>): Observable<Worker> {
    return this.http.post<Worker>(`${BASE_URL}/workers`, payload);
  }
  updateWorker(id: number, payload: Omit<Worker, 'id'>): Observable<void> {
    return this.http.put<void>(`${BASE_URL}/workers/${id}`, payload);
  }
  deleteWorker(id: number): Observable<void> {
    return this.http.delete<void>(`${BASE_URL}/workers/${id}`);
  }

  getAttendance(from: string, to: string): Observable<AttendanceRecord[]> {
    return this.http.get<AttendanceRecord[]>(`${BASE_URL}/attendance`, { params: { from, to } });
  }
  markAttendance(workerId: number, date: string, status: AttendanceStatus): Observable<AttendanceRecord> {
    return this.http.put<AttendanceRecord>(`${BASE_URL}/attendance`, { workerId, date, status });
  }

  getAdvances(year?: number, month?: number): Observable<Advance[]> {
    const params: Record<string, string> = {};
    if (year && month) { params['year'] = String(year); params['month'] = String(month); }
    return this.http.get<Advance[]>(`${BASE_URL}/advances`, { params });
  }
  createAdvance(payload: Omit<Advance, 'id'>): Observable<Advance> {
    return this.http.post<Advance>(`${BASE_URL}/advances`, payload);
  }
  deleteAdvance(id: number): Observable<void> {
    return this.http.delete<void>(`${BASE_URL}/advances/${id}`);
  }

  getPayrollReport(year: number, month: number): Observable<PayrollRow[]> {
    return this.http.get<PayrollRow[]>(`${BASE_URL}/payroll/report`, { params: { year: String(year), month: String(month) } });
  }
}
