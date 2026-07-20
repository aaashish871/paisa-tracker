import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WorkforceService } from '../../core/workforce.service';
import { Worker, AttendanceStatus, Advance, PayrollRow } from '../../core/models';
import { toIsoDate as toIso } from '../../core/date-utils';

function startOfWeek(d: Date): Date {
  const copy = new Date(d);
  const day = copy.getDay(); // 0=Sun..6=Sat
  const diff = day === 0 ? -6 : 1 - day; // move back to Monday
  copy.setDate(copy.getDate() + diff);
  copy.setHours(0, 0, 0, 0);
  return copy;
}

const STATUS_CYCLE: AttendanceStatus[] = ['Present', 'HalfDay', 'Absent'];
const STATUS_LABEL: Record<AttendanceStatus, string> = { Present: 'P', HalfDay: 'H', Absent: 'A' };

@Component({
  selector: 'app-attendance',
  imports: [CommonModule, FormsModule],
  templateUrl: './attendance.component.html',
  styleUrl: './attendance.component.css'
})
export class AttendanceComponent implements OnInit {
  workers: Worker[] = [];
  loading = true;

  weekStart = startOfWeek(new Date());
  weekDays: Date[] = [];
  attendanceMap = new Map<string, AttendanceStatus>(); // key: `${workerId}|${iso}`

  selectedYear = new Date().getFullYear();
  selectedMonth = new Date().getMonth() + 1;
  payrollRows: PayrollRow[] = [];
  payrollLoading = true;

  advances: Advance[] = [];
  showAdvanceModal = false;
  advanceForm = { workerId: 0, date: toIso(new Date()), amount: 0, notes: '' };

  statusLabel = STATUS_LABEL;

  constructor(private workforce: WorkforceService) {}

  ngOnInit(): void {
    this.buildWeekDays();
    this.workforce.getWorkers().subscribe(data => {
      this.workers = data;
      this.loading = false;
      this.loadAttendance();
    });
    this.loadPayroll();
    this.loadAdvances();
  }

  private buildWeekDays() {
    this.weekDays = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(this.weekStart);
      d.setDate(d.getDate() + i);
      return d;
    });
  }

  get weekLabel(): string {
    const start = this.weekDays[0];
    const end = this.weekDays[6];
    return `${start.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })} – ${end.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}`;
  }

  dayLabel(d: Date): string {
    return d.toLocaleDateString('en-IN', { weekday: 'short', day: '2-digit' });
  }

  loadAttendance() {
    const from = toIso(this.weekDays[0]);
    const to = toIso(this.weekDays[6]);
    this.workforce.getAttendance(from, to).subscribe(records => {
      this.attendanceMap.clear();
      for (const r of records) {
        this.attendanceMap.set(`${r.workerId}|${r.date.slice(0, 10)}`, r.status);
      }
    });
  }

  prevWeek() {
    this.weekStart.setDate(this.weekStart.getDate() - 7);
    this.buildWeekDays();
    this.loadAttendance();
  }

  nextWeek() {
    this.weekStart.setDate(this.weekStart.getDate() + 7);
    this.buildWeekDays();
    this.loadAttendance();
  }

  status(workerId: number, day: Date): AttendanceStatus | undefined {
    return this.attendanceMap.get(`${workerId}|${toIso(day)}`);
  }

  cycle(workerId: number, day: Date) {
    const current = this.status(workerId, day);
    const nextIndex = current ? (STATUS_CYCLE.indexOf(current) + 1) % STATUS_CYCLE.length : 0;
    const next = STATUS_CYCLE[nextIndex];
    const iso = toIso(day);
    this.attendanceMap.set(`${workerId}|${iso}`, next);
    this.workforce.markAttendance(workerId, iso, next).subscribe({
      error: () => this.loadAttendance()
    });
  }

  loadPayroll() {
    this.payrollLoading = true;
    this.workforce.getPayrollReport(this.selectedYear, this.selectedMonth).subscribe({
      next: (rows) => { this.payrollRows = rows; this.payrollLoading = false; },
      error: () => { this.payrollLoading = false; }
    });
  }

  changeMonth(delta: number) {
    let m = this.selectedMonth + delta;
    let y = this.selectedYear;
    if (m < 1) { m = 12; y--; }
    if (m > 12) { m = 1; y++; }
    this.selectedMonth = m;
    this.selectedYear = y;
    this.loadPayroll();
    this.loadAdvances();
  }

  get monthLabel(): string {
    return new Date(this.selectedYear, this.selectedMonth - 1, 1).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });
  }

  loadAdvances() {
    this.workforce.getAdvances(this.selectedYear, this.selectedMonth).subscribe(data => this.advances = data);
  }

  workerName(workerId: number): string {
    return this.workers.find(w => w.id === workerId)?.name ?? '—';
  }

  openAddAdvance() {
    this.advanceForm = { workerId: this.workers[0]?.id ?? 0, date: toIso(new Date()), amount: 0, notes: '' };
    this.showAdvanceModal = true;
  }

  closeAdvanceModal() {
    this.showAdvanceModal = false;
  }

  saveAdvance() {
    if (!this.advanceForm.workerId || this.advanceForm.amount <= 0) return;
    this.workforce.createAdvance(this.advanceForm).subscribe(() => {
      this.closeAdvanceModal();
      this.loadAdvances();
      this.loadPayroll();
    });
  }

  removeAdvance(advance: Advance) {
    if (!confirm('Delete this advance record?')) return;
    this.workforce.deleteAdvance(advance.id).subscribe(() => {
      this.loadAdvances();
      this.loadPayroll();
    });
  }
}
