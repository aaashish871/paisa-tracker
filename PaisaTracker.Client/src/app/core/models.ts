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

export interface Worker {
  id: number;
  name: string;
  role?: string;
  phone?: string;
  monthlySalary: number;
  joinedDate: string;
  active: boolean;
}

export type AttendanceStatus = 'Present' | 'Absent' | 'HalfDay';

export interface AttendanceRecord {
  id: number;
  workerId: number;
  date: string;
  status: AttendanceStatus;
}

export interface Advance {
  id: number;
  workerId: number;
  date: string;
  amount: number;
  notes?: string;
}

export interface PayrollRow {
  workerId: number;
  name: string;
  monthlySalary: number;
  presentDays: number;
  halfDays: number;
  absentDays: number;
  perDayWage: number;
  grossEarned: number;
  advancesTaken: number;
  netPayable: number;
}

export interface Sale {
  id: number;
  date: string;
  customerName: string;
  productName: string;
  quantity: number;
  amount: number;
  notes?: string;
}

export interface Purchase {
  id: number;
  date: string;
  supplierName: string;
  materialName: string;
  quantity: number;
  amount: number;
  notes?: string;
}

export interface Expense {
  id: number;
  date: string;
  category: string;
  paymentMethod: string;
  note?: string;
  amount: number;
}

export interface Emi {
  id: number;
  name: string;
  principal: number;
  monthlyAmount: number;
  tenureMonths: number;
  remainingMonths: number;
  nextDueDate: string;
  notes?: string;
}

export type BillStatus = 'Upcoming' | 'DueSoon' | 'Unpaid' | 'Paid';

export interface Bill {
  id: number;
  name: string;
  category: string;
  dueDate: string;
  amount: number;
  status: BillStatus;
  notes?: string;
}

export interface Customer {
  id: number;
  name: string;
  contactPhone?: string;
  notes?: string;
}

export interface Supplier {
  id: number;
  name: string;
  contactPhone?: string;
  notes?: string;
}

export interface Product {
  id: number;
  name: string;
  category?: string;
  unit: string;
  unitPrice: number;
  stockQty: number;
}

export interface Material {
  id: number;
  name: string;
  unit: string;
  stockQty: number;
  reorderLevel: number;
  supplierName?: string;
}
