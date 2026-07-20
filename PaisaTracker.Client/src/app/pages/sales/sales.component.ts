import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FactoryTransactionsService } from '../../core/factory-transactions.service';
import { Sale } from '../../core/models';
import { todayIso } from '../../core/date-utils';

type SaleForm = Omit<Sale, 'id'>;

const EMPTY_FORM: SaleForm = {
  date: todayIso(), customerName: '', productName: '', quantity: 1, amount: 0, notes: ''
};

@Component({
  selector: 'app-sales',
  imports: [CommonModule, FormsModule],
  templateUrl: './sales.component.html',
  styleUrl: './sales.component.css'
})
export class SalesComponent implements OnInit {
  sales: Sale[] = [];
  loading = true;
  error = '';

  showModal = false;
  editingId: number | null = null;
  form: SaleForm = { ...EMPTY_FORM };

  constructor(private transactions: FactoryTransactionsService) {}

  ngOnInit(): void {
    this.load();
  }

  load() {
    this.loading = true;
    this.transactions.getSales().subscribe({
      next: (data) => { this.sales = data; this.loading = false; },
      error: () => { this.error = 'Could not load sales. Is the API running?'; this.loading = false; }
    });
  }

  get totalAmount(): number {
    return this.sales.reduce((sum, s) => sum + s.amount, 0);
  }

  get customerSuggestions(): string[] {
    return [...new Set(this.sales.map(s => s.customerName))];
  }

  get productSuggestions(): string[] {
    return [...new Set(this.sales.map(s => s.productName))];
  }

  openAdd() {
    this.editingId = null;
    this.form = { ...EMPTY_FORM, date: todayIso() };
    this.showModal = true;
  }

  openEdit(sale: Sale) {
    this.editingId = sale.id;
    this.form = {
      date: sale.date.slice(0, 10),
      customerName: sale.customerName,
      productName: sale.productName,
      quantity: sale.quantity,
      amount: sale.amount,
      notes: sale.notes,
    };
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  save() {
    if (!this.form.customerName.trim() || !this.form.productName.trim()) return;

    if (this.editingId === null) {
      this.transactions.createSale(this.form).subscribe(() => { this.closeModal(); this.load(); });
    } else {
      this.transactions.updateSale(this.editingId, this.form).subscribe(() => { this.closeModal(); this.load(); });
    }
  }

  remove(sale: Sale) {
    if (!confirm(`Delete this sale to "${sale.customerName}"?`)) return;
    this.transactions.deleteSale(sale.id).subscribe(() => this.load());
  }
}
