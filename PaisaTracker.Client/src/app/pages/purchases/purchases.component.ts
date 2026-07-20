import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FactoryTransactionsService } from '../../core/factory-transactions.service';
import { Purchase } from '../../core/models';
import { todayIso } from '../../core/date-utils';

type PurchaseForm = Omit<Purchase, 'id'>;

const EMPTY_FORM: PurchaseForm = {
  date: todayIso(), supplierName: '', materialName: '', quantity: 1, amount: 0, notes: ''
};

@Component({
  selector: 'app-purchases',
  imports: [CommonModule, FormsModule],
  templateUrl: './purchases.component.html',
  styleUrl: './purchases.component.css'
})
export class PurchasesComponent implements OnInit {
  purchases: Purchase[] = [];
  loading = true;
  error = '';

  showModal = false;
  editingId: number | null = null;
  form: PurchaseForm = { ...EMPTY_FORM };

  constructor(private transactions: FactoryTransactionsService) {}

  ngOnInit(): void {
    this.load();
  }

  load() {
    this.loading = true;
    this.transactions.getPurchases().subscribe({
      next: (data) => { this.purchases = data; this.loading = false; },
      error: () => { this.error = 'Could not load purchases. Is the API running?'; this.loading = false; }
    });
  }

  get totalAmount(): number {
    return this.purchases.reduce((sum, p) => sum + p.amount, 0);
  }

  get supplierSuggestions(): string[] {
    return [...new Set(this.purchases.map(p => p.supplierName))];
  }

  get materialSuggestions(): string[] {
    return [...new Set(this.purchases.map(p => p.materialName))];
  }

  openAdd() {
    this.editingId = null;
    this.form = { ...EMPTY_FORM, date: todayIso() };
    this.showModal = true;
  }

  openEdit(purchase: Purchase) {
    this.editingId = purchase.id;
    this.form = {
      date: purchase.date.slice(0, 10),
      supplierName: purchase.supplierName,
      materialName: purchase.materialName,
      quantity: purchase.quantity,
      amount: purchase.amount,
      notes: purchase.notes,
    };
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  save() {
    if (!this.form.supplierName.trim() || !this.form.materialName.trim()) return;

    if (this.editingId === null) {
      this.transactions.createPurchase(this.form).subscribe(() => { this.closeModal(); this.load(); });
    } else {
      this.transactions.updatePurchase(this.editingId, this.form).subscribe(() => { this.closeModal(); this.load(); });
    }
  }

  remove(purchase: Purchase) {
    if (!confirm(`Delete this purchase from "${purchase.supplierName}"?`)) return;
    this.transactions.deletePurchase(purchase.id).subscribe(() => this.load());
  }
}
