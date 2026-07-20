import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/api.service';
import { Account, AccountType } from '../../core/models';

type AccountForm = Omit<Account, 'id'>;

const EMPTY_FORM: AccountForm = {
  name: '', bankName: '', accountNumber: '', type: 'Savings', balance: 0, notes: ''
};

@Component({
  selector: 'app-accounts',
  imports: [CommonModule, FormsModule],
  templateUrl: './accounts.component.html',
  styleUrl: './accounts.component.css'
})
export class AccountsComponent implements OnInit {
  accounts: Account[] = [];
  loading = true;
  error = '';

  showModal = false;
  editingId: number | null = null;
  form: AccountForm = { ...EMPTY_FORM };
  accountTypes: AccountType[] = ['Savings', 'Current', 'Cash'];

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.load();
  }

  load() {
    this.loading = true;
    this.api.getAccounts().subscribe({
      next: (data) => { this.accounts = data; this.loading = false; },
      error: () => { this.error = 'Could not load accounts. Is the API running?'; this.loading = false; }
    });
  }

  get totalBalance(): number {
    return this.accounts.reduce((sum, a) => sum + a.balance, 0);
  }

  openAdd() {
    this.editingId = null;
    this.form = { ...EMPTY_FORM };
    this.showModal = true;
  }

  openEdit(account: Account) {
    this.editingId = account.id;
    this.form = {
      name: account.name,
      bankName: account.bankName,
      accountNumber: account.accountNumber,
      type: account.type,
      balance: account.balance,
      notes: account.notes,
    };
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  save() {
    if (!this.form.name.trim()) return;

    if (this.editingId === null) {
      this.api.createAccount(this.form).subscribe(() => { this.closeModal(); this.load(); });
    } else {
      this.api.updateAccount(this.editingId, this.form).subscribe(() => { this.closeModal(); this.load(); });
    }
  }

  remove(account: Account) {
    if (!confirm(`Delete account "${account.name}"? This cannot be undone.`)) return;
    this.api.deleteAccount(account.id).subscribe(() => this.load());
  }
}
