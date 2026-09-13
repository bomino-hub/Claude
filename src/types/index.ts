export type TransactionType = 'income' | 'expense';

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  type: TransactionType;
}

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  categoryId: string;
  date: string; // ISO 8601
  note?: string;
}

export interface Budget {
  id: string;
  categoryId: string;
  limit: number;
}

export interface AppSettings {
  currency: string;
  currencySymbol: string;
}
