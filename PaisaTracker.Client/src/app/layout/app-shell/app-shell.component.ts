import { Component } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { AuthService } from '../../core/auth.service';

interface NavItem { path: string; icon: string; label: string; }
interface NavGroup { group: string; items: NavItem[]; }

const NAV: Record<'home' | 'factory', NavGroup[]> = {
  home: [
    { group: 'Overview', items: [
      { path: '/home/dashboard', icon: '📊', label: 'Dashboard' },
    ]},
    { group: 'Money', items: [
      { path: '/home/accounts', icon: '🏦', label: 'Bank Accounts' },
      { path: '/home/credit-cards', icon: '💳', label: 'Credit Cards' },
      { path: '/home/emis', icon: '📆', label: 'EMIs' },
      { path: '/home/bills', icon: '🧾', label: 'Bills' },
    ]},
    { group: 'Daily', items: [
      { path: '/home/expenses', icon: '✏️', label: 'Daily Expenses' },
    ]},
  ],
  factory: [
    { group: 'Overview', items: [
      { path: '/factory/dashboard', icon: '📊', label: 'Dashboard' },
    ]},
    { group: 'Directory', items: [
      { path: '/factory/customers', icon: '👥', label: 'Customers' },
      { path: '/factory/suppliers', icon: '🚚', label: 'Suppliers' },
    ]},
    { group: 'Inventory', items: [
      { path: '/factory/products', icon: '📦', label: 'Products' },
      { path: '/factory/materials', icon: '🧱', label: 'Materials' },
    ]},
    { group: 'Transactions', items: [
      { path: '/factory/sales', icon: '💰', label: 'Sales' },
      { path: '/factory/purchases', icon: '🛒', label: 'Purchases' },
    ]},
    { group: 'Workforce', items: [
      { path: '/factory/workers', icon: '🧑‍🏭', label: 'Workers' },
      { path: '/factory/attendance', icon: '✅', label: 'Attendance' },
    ]},
  ],
};

@Component({
  selector: 'app-shell',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app-shell.component.html',
  styleUrl: './app-shell.component.css'
})
export class AppShellComponent {
  mode: 'home' | 'factory' = 'home';
  mobileNavOpen = false;
  navConfig = NAV;

  constructor(private router: Router, public auth: AuthService) {
    this.mode = this.router.url.startsWith('/factory') ? 'factory' : 'home';
    this.applyModeClass();
    this.router.events.pipe(filter(e => e instanceof NavigationEnd)).subscribe((e) => {
      const url = (e as NavigationEnd).urlAfterRedirects;
      this.mode = url.startsWith('/factory') ? 'factory' : 'home';
      this.mobileNavOpen = false;
      this.applyModeClass();
    });
  }

  get isSuperUser(): boolean {
    return this.auth.hasRole('SuperUser');
  }

  get isAdmin(): boolean {
    return this.auth.hasRole('Admin');
  }

  private applyModeClass() {
    document.body.classList.toggle('factory-mode', this.mode === 'factory');
  }

  get navGroups(): NavGroup[] {
    return this.navConfig[this.mode];
  }

  get initials(): string {
    const name = this.auth.displayName ?? '?';
    return name.slice(0, 2).toUpperCase();
  }

  setMode(m: 'home' | 'factory') {
    if (m === this.mode) return;
    this.router.navigateByUrl(m === 'home' ? '/home/dashboard' : '/factory/dashboard');
  }

  toggleMobileNav() {
    this.mobileNavOpen = !this.mobileNavOpen;
  }

  toggleTheme() {
    const root = document.documentElement;
    const cur = root.getAttribute('data-theme');
    if (cur === 'dark') root.setAttribute('data-theme', 'light');
    else if (cur === 'light') root.setAttribute('data-theme', 'dark');
    else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      root.setAttribute('data-theme', prefersDark ? 'light' : 'dark');
    }
  }

  logout() {
    this.auth.logout();
    this.router.navigateByUrl('/login');
  }
}
