import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MasterDataService } from '../../core/master-data.service';
import { Supplier } from '../../core/models';

type SupplierForm = Omit<Supplier, 'id'>;
const EMPTY_FORM: SupplierForm = { name: '', contactPhone: '', notes: '' };

@Component({
  selector: 'app-suppliers',
  imports: [CommonModule, FormsModule],
  templateUrl: './suppliers.component.html',
  styleUrl: './suppliers.component.css'
})
export class SuppliersComponent implements OnInit {
  suppliers: Supplier[] = [];
  loading = true;
  error = '';

  showModal = false;
  editingId: number | null = null;
  form: SupplierForm = { ...EMPTY_FORM };

  constructor(private masterData: MasterDataService) {}

  ngOnInit(): void {
    this.load();
  }

  load() {
    this.loading = true;
    this.masterData.getSuppliers().subscribe({
      next: (data) => { this.suppliers = data; this.loading = false; },
      error: () => { this.error = 'Could not load suppliers. Is the API running?'; this.loading = false; }
    });
  }

  openAdd() {
    this.editingId = null;
    this.form = { ...EMPTY_FORM };
    this.showModal = true;
  }

  openEdit(supplier: Supplier) {
    this.editingId = supplier.id;
    this.form = { name: supplier.name, contactPhone: supplier.contactPhone, notes: supplier.notes };
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  save() {
    if (!this.form.name.trim()) return;
    if (this.editingId === null) {
      this.masterData.createSupplier(this.form).subscribe(() => { this.closeModal(); this.load(); });
    } else {
      this.masterData.updateSupplier(this.editingId, this.form).subscribe(() => { this.closeModal(); this.load(); });
    }
  }

  remove(supplier: Supplier) {
    if (!confirm(`Delete supplier "${supplier.name}"?`)) return;
    this.masterData.deleteSupplier(supplier.id).subscribe(() => this.load());
  }
}
