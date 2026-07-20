import { Routes } from '@angular/router';
import { AppShellComponent } from './layout/app-shell/app-shell.component';
import { LoginComponent } from './pages/login/login.component';
import { HomeDashboardComponent } from './pages/home-dashboard/home-dashboard.component';
import { AccountsComponent } from './pages/accounts/accounts.component';
import { CreditCardsComponent } from './pages/credit-cards/credit-cards.component';
import { DailyExpensesComponent } from './pages/daily-expenses/daily-expenses.component';
import { WorkersComponent } from './pages/workers/workers.component';
import { AttendanceComponent } from './pages/attendance/attendance.component';
import { SalesComponent } from './pages/sales/sales.component';
import { PurchasesComponent } from './pages/purchases/purchases.component';
import { PlaceholderComponent } from './pages/placeholder/placeholder.component';
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
      { path: 'home/emis', component: PlaceholderComponent, data: { title: 'EMIs' } },
      { path: 'home/bills', component: PlaceholderComponent, data: { title: 'Bills' } },
      { path: 'home/expenses', component: DailyExpensesComponent },

      { path: 'factory/dashboard', component: PlaceholderComponent, data: { title: 'Factory Dashboard' } },
      { path: 'factory/customers', component: PlaceholderComponent, data: { title: 'Customers' } },
      { path: 'factory/suppliers', component: PlaceholderComponent, data: { title: 'Suppliers' } },
      { path: 'factory/products', component: PlaceholderComponent, data: { title: 'Products' } },
      { path: 'factory/materials', component: PlaceholderComponent, data: { title: 'Materials' } },
      { path: 'factory/sales', component: SalesComponent },
      { path: 'factory/purchases', component: PurchasesComponent },
      { path: 'factory/workers', component: WorkersComponent },
      { path: 'factory/attendance', component: AttendanceComponent },

      { path: 'admin/users', component: AdminComponent, canActivate: [adminGuard] },
    ]
  },

  { path: '**', redirectTo: 'login' },
];
