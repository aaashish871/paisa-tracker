import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MasterDataService } from '../../core/master-data.service';
import { Customer } from '../../core/models';

type CustomerForm = Omit<Customer, 'id'>;
const EMPTY_FORM: CustomerForm = { name: '', contactPhone: '', notes: '' };

@Component({
  selector: 'app-customers',
  imports: [CommonModule, FormsModule],
  templateUrl: './customers.component.html',
  styleUrl: './customers.component.css'
})
export class CustomersComponent implements OnInit {
  customers: Customer[] = [];
  loading = true;
  error = '';

  showModal = false;
  editingId: number | null = null;
  form: CustomerForm = { ...EMPTY_FORM };

  constructor(private masterData: MasterDataService) {}

  ngOnInit(): void {
    this.load();
  }

  load() {
    this.loading = true;
    this.masterData.getCustomers().subscribe({
      next: (data) => { this.customers = data; this.loading = false; },
      error: () => { this.error = 'Could not load customers. Is the API running?'; this.loading = false; }
    });
  }

  openAdd() {
    this.editingId = null;
    this.form = { ...EMPTY_FORM };
    this.showModal = true;
  }

  openEdit(customer: Customer) {
    this.editingId = customer.id;
    this.form = { name: customer.name, contactPhone: customer.contactPhone, notes: customer.notes };
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  save() {
    if (!this.form.name.trim()) return;
    if (this.editingId === null) {
      this.masterData.createCustomer(this.form).subscribe(() => { this.closeModal(); this.load(); });
    } else {
      this.masterData.updateCustomer(this.editingId, this.form).subscribe(() => { this.closeModal(); this.load(); });
    }
  }

  remove(customer: Customer) {
    if (!confirm(`Delete customer "${customer.name}"?`)) return;
    this.masterData.deleteCustomer(customer.id).subscribe(() => this.load());
  }
}
