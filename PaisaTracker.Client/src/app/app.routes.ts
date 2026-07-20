import { Routes } from '@angular/router';
import { AppShellComponent } from './layout/app-shell/app-shell.component';
import { LoginComponent } from './pages/login/login.component';
import { HomeDashboardComponent } from './pages/home-dashboard/home-dashboard.component';
import { AccountsComponent } from './pages/accounts/accounts.component';
import { CreditCardsComponent } from './pages/credit-cards/credit-cards.component';
import { EmisComponent } from './pages/emis/emis.component';
import { BillsComponent } from './pages/bills/bills.component';
import { DailyExpensesComponent } from './pages/daily-expenses/daily-expenses.component';
import { FactoryDashboardComponent } from './pages/factory-dashboard/factory-dashboard.component';
import { CustomersComponent } from './pages/customers/customers.component';
import { SuppliersComponent } from './pages/suppliers/suppliers.component';
import { ProductsComponent } from './pages/products/products.component';
import { MaterialsComponent } from './pages/materials/materials.component';
import { WorkersComponent } from './pages/workers/workers.component';
import { AttendanceComponent } from './pages/attendance/attendance.component';
import { SalesComponent } from './pages/sales/sales.component';
import { PurchasesComponent } from './pages/purchases/purchases.component';
import { AdminComponent } from './pages/admin/admin.component';
import { authGuard, adminGuard } from './core/auth.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },

  {
    path: '',
    component: AppShellComponent,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'home/dashboard', pathMatch: 'full' },

      { path: 'home/dashboard', component: HomeDashboardComponent },
      { path: 'home/accounts', component: AccountsComponent },
      { path: 'home/credit-cards', component: CreditCardsComponent },
      { path: 'home/emis', component: EmisComponent },
      { path: 'home/bills', component: BillsComponent },
      { path: 'home/expenses', component: DailyExpensesComponent },

      { path: 'factory/dashboard', component: FactoryDashboardComponent },
      { path: 'factory/customers', component: CustomersComponent },
      { path: 'factory/suppliers', component: SuppliersComponent },
      { path: 'factory/products', component: ProductsComponent },
      { path: 'factory/materials', component: MaterialsComponent },
      { path: 'factory/sales', component: SalesComponent },
      { path: 'factory/purchases', component: PurchasesComponent },
      { path: 'factory/workers', component: WorkersComponent },
      { path: 'factory/attendance', component: AttendanceComponent },

      { path: 'admin/users', component: AdminComponent, canActivate: [adminGuard] },
    ]
  },

  { path: '**', redirectTo: 'login' },
];
