import { Transaction } from '../types';
import { monthKey } from './format';

export function filterByMonth(transactions: Transaction[], month: string): Transaction[] {
  return transactions.filter((t) => monthKey(t.date) === month);
}

export function sumByType(transactions: Transaction[], type: 'income' | 'expense'): number {
  return transactions.filter((t) => t.type === type).reduce((sum, t) => sum + t.amount, 0);
}

export interface CategoryTotal {
  categoryId: string;
  total: number;
}

export function getCategoryTotals(transactions: Transaction[], type: 'income' | 'expense'): CategoryTotal[] {
  const totals = new Map<string, number>();
  transactions
    .filter((t) => t.type === type)
    .forEach((t) => totals.set(t.categoryId, (totals.get(t.categoryId) ?? 0) + t.amount));
  return Array.from(totals.entries())
    .map(([categoryId, total]) => ({ categoryId, total }))
    .sort((a, b) => b.total - a.total);
}

export function getBudgetSpent(transactions: Transaction[], categoryId: string, month: string): number {
  return transactions
    .filter((t) => t.type === 'expense' && t.categoryId === categoryId && monthKey(t.date) === month)
    .reduce((sum, t) => sum + t.amount, 0);
}

export function sortByDateDesc(transactions: Transaction[]): Transaction[] {
  return [...transactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}
