export type AccountType = 'Savings' | 'Current' | 'Cash';

export interface Account {
  id: number;
  name: string;
  bankName?: string;
  accountNumber?: string;
  type: AccountType;
  balance: number;
  notes?: string;
}

export type CreditCardStatus = 'Paid' | 'Unpaid' | 'DueSoon';

export interface CreditCard {
  id: number;
  name: string;
  bankName?: string;
  cardNumberLast4?: string;
  creditLimit: number;
  currentOutstanding: number;
  minimumDue: number;
  statementDate: string;
  dueDate: string;
  status: CreditCardStatus;
  notes?: string;
}
