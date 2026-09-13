import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppSettings, Budget, Category, Transaction } from '../types';
import { DEFAULT_CATEGORIES } from '../constants/categories';

const KEYS = {
  transactions: '@mon_budget/transactions',
  categories: '@mon_budget/categories',
  budgets: '@mon_budget/budgets',
  settings: '@mon_budget/settings',
};

export const DEFAULT_SETTINGS: AppSettings = {
  currency: 'EUR',
  currencySymbol: '€',
};

export interface PersistedState {
  transactions: Transaction[];
  categories: Category[];
  budgets: Budget[];
  settings: AppSettings;
}

export async function loadState(): Promise<PersistedState> {
  const entries = await AsyncStorage.multiGet([
    KEYS.transactions,
    KEYS.categories,
    KEYS.budgets,
    KEYS.settings,
  ]);
  const map = Object.fromEntries(entries);

  return {
    transactions: map[KEYS.transactions] ? JSON.parse(map[KEYS.transactions] as string) : [],
    categories: map[KEYS.categories] ? JSON.parse(map[KEYS.categories] as string) : DEFAULT_CATEGORIES,
    budgets: map[KEYS.budgets] ? JSON.parse(map[KEYS.budgets] as string) : [],
    settings: map[KEYS.settings] ? JSON.parse(map[KEYS.settings] as string) : DEFAULT_SETTINGS,
  };
}

export async function saveState(state: PersistedState): Promise<void> {
  await AsyncStorage.multiSet([
    [KEYS.transactions, JSON.stringify(state.transactions)],
    [KEYS.categories, JSON.stringify(state.categories)],
    [KEYS.budgets, JSON.stringify(state.budgets)],
    [KEYS.settings, JSON.stringify(state.settings)],
  ]);
}

export async function clearState(): Promise<void> {
  await AsyncStorage.multiRemove(Object.values(KEYS));
}
