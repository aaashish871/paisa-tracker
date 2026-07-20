import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WorkforceService } from '../../core/workforce.service';
import { Worker } from '../../core/models';
import { todayIso } from '../../core/date-utils';

type WorkerForm = Omit<Worker, 'id'>;

const EMPTY_FORM: WorkerForm = {
  name: '', role: '', phone: '', monthlySalary: 0, joinedDate: todayIso(), active: true
};

@Component({
  selector: 'app-workers',
  imports: [CommonModule, FormsModule],
  templateUrl: './workers.component.html',
  styleUrl: './workers.component.css'
})
export class WorkersComponent implements OnInit {
  workers: Worker[] = [];
  loading = true;
  error = '';

  showModal = false;
  editingId: number | null = null;
  form: WorkerForm = { ...EMPTY_FORM };

  constructor(private workforce: WorkforceService) {}

  ngOnInit(): void {
    this.load();
  }

  load() {
    this.loading = true;
    this.workforce.getWorkers().subscribe({
      next: (data) => { this.workers = data; this.loading = false; },
      error: () => { this.error = 'Could not load workers. Is the API running?'; this.loading = false; }
    });
  }

  get activeCount(): number {
    return this.workers.filter(w => w.active).length;
  }

  get totalMonthlyWages(): number {
    return this.workers.filter(w => w.active).reduce((sum, w) => sum + w.monthlySalary, 0);
  }

  openAdd() {
    this.editingId = null;
    this.form = { ...EMPTY_FORM, joinedDate: todayIso() };
    this.showModal = true;
  }

  openEdit(worker: Worker) {
    this.editingId = worker.id;
    this.form = {
      name: worker.name,
      role: worker.role,
      phone: worker.phone,
      monthlySalary: worker.monthlySalary,
      joinedDate: worker.joinedDate.slice(0, 10),
      active: worker.active,
    };
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  save() {
    if (!this.form.name.trim()) return;

    if (this.editingId === null) {
      this.workforce.createWorker(this.form).subscribe(() => { this.closeModal(); this.load(); });
    } else {
      this.workforce.updateWorker(this.editingId, this.form).subscribe(() => { this.closeModal(); this.load(); });
    }
  }

  remove(worker: Worker) {
    if (!confirm(`Delete worker "${worker.name}"? This also deletes their attendance and advance history.`)) return;
    this.workforce.deleteWorker(worker.id).subscribe(() => this.load());
  }
}
