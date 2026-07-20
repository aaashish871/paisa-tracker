import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MasterDataService } from '../../core/master-data.service';
import { Product } from '../../core/models';

type ProductForm = Omit<Product, 'id'>;
const EMPTY_FORM: ProductForm = { name: '', category: '', unit: 'pcs', unitPrice: 0, stockQty: 0 };

@Component({
  selector: 'app-products',
  imports: [CommonModule, FormsModule],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css'
})
export class ProductsComponent implements OnInit {
  products: Product[] = [];
  loading = true;
  error = '';

  showModal = false;
  editingId: number | null = null;
  form: ProductForm = { ...EMPTY_FORM };

  constructor(private masterData: MasterDataService) {}

  ngOnInit(): void {
    this.load();
  }

  load() {
    this.loading = true;
    this.masterData.getProducts().subscribe({
      next: (data) => { this.products = data; this.loading = false; },
      error: () => { this.error = 'Could not load products. Is the API running?'; this.loading = false; }
    });
  }

  get totalStockValue(): number {
    return this.products.reduce((sum, p) => sum + p.unitPrice * p.stockQty, 0);
  }

  openAdd() {
    this.editingId = null;
    this.form = { ...EMPTY_FORM };
    this.showModal = true;
  }

  openEdit(product: Product) {
    this.editingId = product.id;
    this.form = { name: product.name, category: product.category, unit: product.unit, unitPrice: product.unitPrice, stockQty: product.stockQty };
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  save() {
    if (!this.form.name.trim()) return;
    if (this.editingId === null) {
      this.masterData.createProduct(this.form).subscribe(() => { this.closeModal(); this.load(); });
    } else {
      this.masterData.updateProduct(this.editingId, this.form).subscribe(() => { this.closeModal(); this.load(); });
    }
  }

  remove(product: Product) {
    if (!confirm(`Delete product "${product.name}"?`)) return;
    this.masterData.deleteProduct(product.id).subscribe(() => this.load());
  }
}
