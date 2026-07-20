import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/api.service';
import { Expense } from '../../core/models';

function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

const PAYMENT_METHODS = ['UPI', 'Cash', 'Credit Card', 'Debit Card', 'Net Banking'];

@Component({
  selector: 'app-daily-expenses',
  imports: [CommonModule, FormsModule],
  templateUrl: './daily-expenses.component.html',
  styleUrl: './daily-expenses.component.css'
})
export class DailyExpensesComponent implements OnInit {
  expenses: Expense[] = [];
  loading = true;
  error = '';
  search = '';

  paymentMethods = PAYMENT_METHODS;

  form = {
    date: todayIso(),
    amount: 0,
    category: '',
    paymentMethod: 'UPI',
    note: '',
  };

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.load();
  }

  load() {
    this.loading = true;
    this.api.getExpenses().subscribe({
      next: (data) => { this.expenses = data; this.loading = false; },
      error: () => { this.error = 'Could not load expenses. Is the API running?'; this.loading = false; }
    });
  }

  get categorySuggestions(): string[] {
    return [...new Set(this.expenses.map(e => e.category))].sort();
  }

  get totalThisMonth(): number {
    const now = new Date();
    return this.expenses
      .filter(e => {
        const d = new Date(e.date);
        return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
      })
      .reduce((sum, e) => sum + e.amount, 0);
  }

  get filteredExpenses(): Expense[] {
    const q = this.search.trim().toLowerCase();
    if (!q) return this.expenses;
    return this.expenses.filter(e =>
      e.category.toLowerCase().includes(q) ||
      (e.note ?? '').toLowerCase().includes(q) ||
      e.paymentMethod.toLowerCase().includes(q)
    );
  }

  addExpense() {
    if (!this.form.category.trim() || this.form.amount <= 0) return;

    this.api.createExpense({ ...this.form }).subscribe(() => {
      this.form = { date: todayIso(), amount: 0, category: '', paymentMethod: this.form.paymentMethod, note: '' };
      this.load();
    });
  }

  remove(expense: Expense) {
    if (!confirm('Delete this expense?')) return;
    this.api.deleteExpense(expense.id).subscribe(() => this.load());
  }
}
