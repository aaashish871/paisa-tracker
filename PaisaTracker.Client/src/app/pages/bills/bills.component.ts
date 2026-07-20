import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/api.service';
import { Bill, BillStatus } from '../../core/models';
import { todayIso } from '../../core/date-utils';

type BillForm = Omit<Bill, 'id'>;

const EMPTY_FORM: BillForm = {
  name: '', category: '', dueDate: todayIso(), amount: 0, status: 'Upcoming', notes: ''
};

@Component({
  selector: 'app-bills',
  imports: [CommonModule, FormsModule],
  templateUrl: './bills.component.html',
  styleUrl: './bills.component.css'
})
export class BillsComponent implements OnInit {
  bills: Bill[] = [];
  loading = true;
  error = '';
  statuses: BillStatus[] = ['Upcoming', 'DueSoon', 'Unpaid', 'Paid'];

  showModal = false;
  editingId: number | null = null;
  form: BillForm = { ...EMPTY_FORM };

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.load();
  }

  load() {
    this.loading = true;
    this.api.getBills().subscribe({
      next: (data) => { this.bills = data; this.loading = false; },
      error: () => { this.error = 'Could not load bills. Is the API running?'; this.loading = false; }
    });
  }

  get pendingTotal(): number {
    return this.bills.filter(b => b.status !== 'Paid').reduce((sum, b) => sum + b.amount, 0);
  }

  tagClass(status: BillStatus): string {
    if (status === 'Paid') return 'good';
    if (status === 'DueSoon') return 'warn';
    if (status === 'Unpaid') return 'bad';
    return 'neutral';
  }

  openAdd() {
    this.editingId = null;
    this.form = { ...EMPTY_FORM, dueDate: todayIso() };
    this.showModal = true;
  }

  openEdit(bill: Bill) {
    this.editingId = bill.id;
    this.form = {
      name: bill.name,
      category: bill.category,
      dueDate: bill.dueDate.slice(0, 10),
      amount: bill.amount,
      status: bill.status,
      notes: bill.notes,
    };
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  save() {
    if (!this.form.name.trim()) return;

    if (this.editingId === null) {
      this.api.createBill(this.form).subscribe(() => { this.closeModal(); this.load(); });
    } else {
      this.api.updateBill(this.editingId, this.form).subscribe(() => { this.closeModal(); this.load(); });
    }
  }

  remove(bill: Bill) {
    if (!confirm(`Delete bill "${bill.name}"?`)) return;
    this.api.deleteBill(bill.id).subscribe(() => this.load());
  }
}
