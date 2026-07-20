import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../core/api.service';
import { Account, CreditCard } from '../../core/models';

@Component({
  selector: 'app-home-dashboard',
  imports: [CommonModule, RouterLink],
  templateUrl: './home-dashboard.component.html',
  styleUrl: './home-dashboard.component.css'
})
export class HomeDashboardComponent implements OnInit {
  accounts: Account[] = [];
  cards: CreditCard[] = [];
  loading = true;

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.api.getAccounts().subscribe(data => { this.accounts = data; this.loading = false; });
    this.api.getCreditCards().subscribe(data => this.cards = data);
  }

  get totalBalance(): number {
    return this.accounts.reduce((sum, a) => sum + a.balance, 0);
  }

  get totalCardDue(): number {
    return this.cards.reduce((sum, c) => sum + (c.status !== 'Paid' ? c.currentOutstanding : 0), 0);
  }

  get unpaidCards(): CreditCard[] {
    return this.cards.filter(c => c.status !== 'Paid');
  }

  tagClass(status: string): string {
    return status === 'Paid' ? 'good' : status === 'DueSoon' ? 'warn' : 'bad';
  }
}
