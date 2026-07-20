import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/api.service';
import { Emi } from '../../core/models';

type EmiForm = Omit<Emi, 'id'>;

function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

const EMPTY_FORM: EmiForm = {
  name: '', principal: 0, monthlyAmount: 0, tenureMonths: 12, remainingMonths: 12, nextDueDate: todayIso(), notes: ''
};

@Component({
  selector: 'app-emis',
  imports: [CommonModule, FormsModule],
  templateUrl: './emis.component.html',
  styleUrl: './emis.component.css'
})
export class EmisComponent implements OnInit {
  emis: Emi[] = [];
  loading = true;
  error = '';

  showModal = false;
  editingId: number | null = null;
  form: EmiForm = { ...EMPTY_FORM };

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.load();
  }

  load() {
    this.loading = true;
    this.api.getEmis().subscribe({
      next: (data) => { this.emis = data; this.loading = false; },
      error: () => { this.error = 'Could not load EMIs. Is the API running?'; this.loading = false; }
    });
  }

  get totalMonthlyOutgo(): number {
    return this.emis.reduce((sum, e) => sum + e.monthlyAmount, 0);
  }

  openAdd() {
    this.editingId = null;
    this.form = { ...EMPTY_FORM, nextDueDate: todayIso() };
    this.showModal = true;
  }

  openEdit(emi: Emi) {
    this.editingId = emi.id;
    this.form = {
      name: emi.name,
      principal: emi.principal,
      monthlyAmount: emi.monthlyAmount,
      tenureMonths: emi.tenureMonths,
      remainingMonths: emi.remainingMonths,
      nextDueDate: emi.nextDueDate.slice(0, 10),
      notes: emi.notes,
    };
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  save() {
    if (!this.form.name.trim()) return;

    if (this.editingId === null) {
      this.api.createEmi(this.form).subscribe(() => { this.closeModal(); this.load(); });
    } else {
      this.api.updateEmi(this.editingId, this.form).subscribe(() => { this.closeModal(); this.load(); });
    }
  }

  remove(emi: Emi) {
    if (!confirm(`Delete EMI "${emi.name}"?`)) return;
    this.api.deleteEmi(emi.id).subscribe(() => this.load());
  }
}
