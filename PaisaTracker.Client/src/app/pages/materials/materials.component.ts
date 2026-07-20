import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MasterDataService } from '../../core/master-data.service';
import { Material } from '../../core/models';

type MaterialForm = Omit<Material, 'id'>;
const EMPTY_FORM: MaterialForm = { name: '', unit: 'kg', stockQty: 0, reorderLevel: 0, supplierName: '' };

@Component({
  selector: 'app-materials',
  imports: [CommonModule, FormsModule],
  templateUrl: './materials.component.html',
  styleUrl: './materials.component.css'
})
export class MaterialsComponent implements OnInit {
  materials: Material[] = [];
  loading = true;
  error = '';

  showModal = false;
  editingId: number | null = null;
  form: MaterialForm = { ...EMPTY_FORM };

  constructor(private masterData: MasterDataService) {}

  ngOnInit(): void {
    this.load();
  }

  load() {
    this.loading = true;
    this.masterData.getMaterials().subscribe({
      next: (data) => { this.materials = data; this.loading = false; },
      error: () => { this.error = 'Could not load materials. Is the API running?'; this.loading = false; }
    });
  }

  isLow(m: Material): boolean {
    return m.stockQty <= m.reorderLevel;
  }

  get lowStockCount(): number {
    return this.materials.filter(m => this.isLow(m)).length;
  }

  openAdd() {
    this.editingId = null;
    this.form = { ...EMPTY_FORM };
    this.showModal = true;
  }

  openEdit(material: Material) {
    this.editingId = material.id;
    this.form = { name: material.name, unit: material.unit, stockQty: material.stockQty, reorderLevel: material.reorderLevel, supplierName: material.supplierName };
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  save() {
    if (!this.form.name.trim()) return;
    if (this.editingId === null) {
      this.masterData.createMaterial(this.form).subscribe(() => { this.closeModal(); this.load(); });
    } else {
      this.masterData.updateMaterial(this.editingId, this.form).subscribe(() => { this.closeModal(); this.load(); });
    }
  }

  remove(material: Material) {
    if (!confirm(`Delete material "${material.name}"?`)) return;
    this.masterData.deleteMaterial(material.id).subscribe(() => this.load());
  }
}
