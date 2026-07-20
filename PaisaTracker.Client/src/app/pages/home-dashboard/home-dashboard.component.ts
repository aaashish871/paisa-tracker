import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/api.service';
import { Account, CreditCard, Expense } from '../../core/models';

function addDays(iso: string, days: number): string {
  const d = new Date(iso + 'T00:00:00');
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

@Component({
  selector: 'app-home-dashboard',
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './home-dashboard.component.html',
  styleUrl: './home-dashboard.component.css'
})
export class HomeDashboardComponent implements OnInit {
  accounts: Account[] = [];
  cards: CreditCard[] = [];
  expenses: Expense[] = [];
  loading = true;

  expenseForm = { date: todayIso(), amount: 0, category: '', note: '' };
  saving = false;

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.api.getAccounts().subscribe(data => { this.accounts = data; this.loading = false; });
    this.api.getCreditCards().subscribe(data => this.cards = data);
    this.api.getExpenses().subscribe(data => this.expenses = data);
  }

  get totalBalance(): number {
    return this.accounts.reduce((sum, a) => sum + a.balance, 0);
  }

  get totalCardDue(): number {
    return this.cards.reduce((sum, c) => sum + (c.status !== 'Paid' ? c.currentOutstanding : 0), 0);
  }

  get unpaidCards(): CreditCard[] {
    return this.cards.filter(c => c.status !== 'Paid');
  }

  tagClass(status: string): string {
    return status === 'Paid' ? 'good' : status === 'DueSoon' ? 'warn' : 'bad';
  }

  get categorySuggestions(): string[] {
    return [...new Set(this.expenses.map(e => e.category))].sort();
  }

  get isYesterday(): boolean { return this.expenseForm.date === addDays(todayIso(), -1); }
  get isToday(): boolean { return this.expenseForm.date === todayIso(); }
  get isTomorrow(): boolean { return this.expenseForm.date === addDays(todayIso(), 1); }

  setDate(which: 'yesterday' | 'today' | 'tomorrow') {
    const offset = which === 'yesterday' ? -1 : which === 'tomorrow' ? 1 : 0;
    this.expenseForm.date = addDays(todayIso(), offset);
  }

  addExpense() {
    if (!this.expenseForm.category.trim() || this.expenseForm.amount <= 0) return;
    this.saving = true;
    this.api.createExpense({ ...this.expenseForm, paymentMethod: 'UPI' }).subscribe(() => {
      this.expenseForm = { date: todayIso(), amount: 0, category: '', note: '' };
      this.saving = false;
      this.api.getExpenses().subscribe(data => this.expenses = data);
    });
  }
}
