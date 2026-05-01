export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: TransactionType;
  category: string;
  date: string; // ISO string
  createdAt: string; // ISO string
}

export interface CategoryInfo {
  key: string;
  label: string;
  icon: string;
  color: string;
}

export interface MonthSummary {
  totalIncome: number;
  totalExpense: number;
  balance: number;
}
