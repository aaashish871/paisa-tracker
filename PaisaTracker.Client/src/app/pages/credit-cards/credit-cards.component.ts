import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/api.service';
import { CreditCard, CreditCardStatus } from '../../core/models';
import { todayIso } from '../../core/date-utils';

type CardForm = Omit<CreditCard, 'id'>;

const EMPTY_FORM: CardForm = {
  name: '', bankName: '', cardNumberLast4: '', creditLimit: 0, currentOutstanding: 0,
  minimumDue: 0, statementDate: todayIso(), dueDate: todayIso(), status: 'Unpaid', notes: ''
};

@Component({
  selector: 'app-credit-cards',
  imports: [CommonModule, FormsModule],
  templateUrl: './credit-cards.component.html',
  styleUrl: './credit-cards.component.css'
})
export class CreditCardsComponent implements OnInit {
  cards: CreditCard[] = [];
  loading = true;
  error = '';

  showModal = false;
  editingId: number | null = null;
  form: CardForm = { ...EMPTY_FORM };
  statuses: CreditCardStatus[] = ['Unpaid', 'DueSoon', 'Paid'];

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.load();
  }

  load() {
    this.loading = true;
    this.api.getCreditCards().subscribe({
      next: (data) => { this.cards = data; this.loading = false; },
      error: () => { this.error = 'Could not load credit cards. Is the API running?'; this.loading = false; }
    });
  }

  get totalOutstanding(): number {
    return this.cards.reduce((sum, c) => sum + (c.status !== 'Paid' ? c.currentOutstanding : 0), 0);
  }

  tagClass(status: CreditCardStatus): string {
    return status === 'Paid' ? 'good' : status === 'DueSoon' ? 'warn' : 'bad';
  }

  openAdd() {
    this.editingId = null;
    this.form = { ...EMPTY_FORM, statementDate: todayIso(), dueDate: todayIso() };
    this.showModal = true;
  }

  openEdit(card: CreditCard) {
    this.editingId = card.id;
    this.form = {
      name: card.name,
      bankName: card.bankName,
      cardNumberLast4: card.cardNumberLast4,
      creditLimit: card.creditLimit,
      currentOutstanding: card.currentOutstanding,
      minimumDue: card.minimumDue,
      statementDate: card.statementDate.slice(0, 10),
      dueDate: card.dueDate.slice(0, 10),
      status: card.status,
      notes: card.notes,
    };
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  save() {
    if (!this.form.name.trim()) return;

    if (this.editingId === null) {
      this.api.createCreditCard(this.form).subscribe(() => { this.closeModal(); this.load(); });
    } else {
      this.api.updateCreditCard(this.editingId, this.form).subscribe(() => { this.closeModal(); this.load(); });
    }
  }

  remove(card: CreditCard) {
    if (!confirm(`Delete card "${card.name}"? This cannot be undone.`)) return;
    this.api.deleteCreditCard(card.id).subscribe(() => this.load());
  }
}
