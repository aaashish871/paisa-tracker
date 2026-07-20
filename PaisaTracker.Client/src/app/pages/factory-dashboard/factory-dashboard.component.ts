import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { FactoryTransactionsService } from '../../core/factory-transactions.service';
import { MasterDataService } from '../../core/master-data.service';
import { WorkforceService } from '../../core/workforce.service';
import { Sale, Purchase, Product, Material, PayrollRow } from '../../core/models';

function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

@Component({
  selector: 'app-factory-dashboard',
  imports: [CommonModule, RouterLink],
  templateUrl: './factory-dashboard.component.html',
  styleUrl: './factory-dashboard.component.css'
})
export class FactoryDashboardComponent implements OnInit {
  loading = true;

  sales: Sale[] = [];
  purchases: Purchase[] = [];
  products: Product[] = [];
  materials: Material[] = [];
  payroll: PayrollRow[] = [];
  workersPresentToday = 0;
  totalWorkers = 0;

  constructor(
    private transactions: FactoryTransactionsService,
    private masterData: MasterDataService,
    private workforce: WorkforceService,
  ) {}

  ngOnInit(): void {
    const now = new Date();
    forkJoin({
      sales: this.transactions.getSales(),
      purchases: this.transactions.getPurchases(),
      products: this.masterData.getProducts(),
      materials: this.masterData.getMaterials(),
      payroll: this.workforce.getPayrollReport(now.getFullYear(), now.getMonth() + 1),
      workers: this.workforce.getWorkers(),
      attendanceToday: this.workforce.getAttendance(todayIso(), todayIso()),
    }).subscribe(({ sales, purchases, products, materials, payroll, workers, attendanceToday }) => {
      this.sales = sales;
      this.purchases = purchases;
      this.products = products;
      this.materials = materials;
      this.payroll = payroll;
      this.totalWorkers = workers.length;
      this.workersPresentToday = attendanceToday.filter(a => a.status === 'Present' || a.status === 'HalfDay').length;
      this.loading = false;
    });
  }

  get stockValue(): number {
    return this.products.reduce((sum, p) => sum + p.unitPrice * p.stockQty, 0);
  }

  get todaysSales(): number {
    const today = todayIso();
    return this.sales.filter(s => s.date.slice(0, 10) === today).reduce((sum, s) => sum + s.amount, 0);
  }

  get pendingPayables(): number {
    return this.payroll.filter(r => r.netPayable > 0).reduce((sum, r) => sum + r.netPayable, 0);
  }

  get recentSales(): Sale[] {
    return [...this.sales].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 5);
  }

  get lowStockMaterials(): Material[] {
    return this.materials.filter(m => m.stockQty <= m.reorderLevel);
  }
}
