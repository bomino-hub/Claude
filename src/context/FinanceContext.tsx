import React, { createContext, useCallback, useContext, useEffect, useMemo, useReducer } from 'react';
import { AppSettings, Budget, Category, Transaction } from '../types';
import { DEFAULT_CATEGORIES } from '../constants/categories';
import { DEFAULT_SETTINGS, clearState, loadState, saveState } from '../services/storage';

interface State {
  transactions: Transaction[];
  categories: Category[];
  budgets: Budget[];
  settings: AppSettings;
  isLoading: boolean;
}

type Action =
  | { type: 'LOADED'; payload: Omit<State, 'isLoading'> }
  | { type: 'ADD_TRANSACTION'; payload: Transaction }
  | { type: 'UPDATE_TRANSACTION'; payload: Transaction }
  | { type: 'DELETE_TRANSACTION'; payload: { id: string } }
  | { type: 'ADD_CATEGORY'; payload: Category }
  | { type: 'SET_BUDGET'; payload: Budget }
  | { type: 'DELETE_BUDGET'; payload: { id: string } }
  | { type: 'UPDATE_SETTINGS'; payload: Partial<AppSettings> }
  | { type: 'RESET_ALL' };

const initialState: State = {
  transactions: [],
  categories: DEFAULT_CATEGORIES,
  budgets: [],
  settings: DEFAULT_SETTINGS,
  isLoading: true,
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'LOADED':
      return { ...state, ...action.payload, isLoading: false };
    case 'ADD_TRANSACTION':
      return { ...state, transactions: [action.payload, ...state.transactions] };
    case 'UPDATE_TRANSACTION':
      return {
        ...state,
        transactions: state.transactions.map((t) => (t.id === action.payload.id ? action.payload : t)),
      };
    case 'DELETE_TRANSACTION':
      return { ...state, transactions: state.transactions.filter((t) => t.id !== action.payload.id) };
    case 'ADD_CATEGORY':
      return { ...state, categories: [...state.categories, action.payload] };
    case 'SET_BUDGET': {
      const exists = state.budgets.some((b) => b.id === action.payload.id);
      const budgets = exists
        ? state.budgets.map((b) => (b.id === action.payload.id ? action.payload : b))
        : [...state.budgets, action.payload];
      return { ...state, budgets };
    }
    case 'DELETE_BUDGET':
      return { ...state, budgets: state.budgets.filter((b) => b.id !== action.payload.id) };
    case 'UPDATE_SETTINGS':
      return { ...state, settings: { ...state.settings, ...action.payload } };
    case 'RESET_ALL':
      return { ...initialState, isLoading: false };
    default:
      return state;
  }
}

interface FinanceContextValue extends State {
  addTransaction: (t: Omit<Transaction, 'id'>) => void;
  updateTransaction: (t: Transaction) => void;
  deleteTransaction: (id: string) => void;
  addCategory: (c: Omit<Category, 'id'>) => void;
  setBudget: (categoryId: string, limit: number) => void;
  deleteBudget: (id: string) => void;
  updateSettings: (settings: Partial<AppSettings>) => void;
  resetAll: () => Promise<void>;
}

const FinanceContext = createContext<FinanceContextValue | undefined>(undefined);

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function FinanceProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    loadState().then((payload) => dispatch({ type: 'LOADED', payload }));
  }, []);

  useEffect(() => {
    if (state.isLoading) return;
    saveState({
      transactions: state.transactions,
      categories: state.categories,
      budgets: state.budgets,
      settings: state.settings,
    });
  }, [state.transactions, state.categories, state.budgets, state.settings, state.isLoading]);

  const addTransaction = useCallback((t: Omit<Transaction, 'id'>) => {
    dispatch({ type: 'ADD_TRANSACTION', payload: { ...t, id: generateId() } });
  }, []);

  const updateTransaction = useCallback((t: Transaction) => {
    dispatch({ type: 'UPDATE_TRANSACTION', payload: t });
  }, []);

  const deleteTransaction = useCallback((id: string) => {
    dispatch({ type: 'DELETE_TRANSACTION', payload: { id } });
  }, []);

  const addCategory = useCallback((c: Omit<Category, 'id'>) => {
    dispatch({ type: 'ADD_CATEGORY', payload: { ...c, id: generateId() } });
  }, []);

  const setBudget = useCallback((categoryId: string, limit: number) => {
    dispatch({ type: 'SET_BUDGET', payload: { id: `budget-${categoryId}`, categoryId, limit } });
  }, []);

  const deleteBudget = useCallback((id: string) => {
    dispatch({ type: 'DELETE_BUDGET', payload: { id } });
  }, []);

  const updateSettings = useCallback((settings: Partial<AppSettings>) => {
    dispatch({ type: 'UPDATE_SETTINGS', payload: settings });
  }, []);

  const resetAll = useCallback(async () => {
    await clearState();
    dispatch({ type: 'RESET_ALL' });
  }, []);

  const value = useMemo<FinanceContextValue>(
    () => ({
      ...state,
      addTransaction,
      updateTransaction,
      deleteTransaction,
      addCategory,
      setBudget,
      deleteBudget,
      updateSettings,
      resetAll,
    }),
    [
      state,
      addTransaction,
      updateTransaction,
      deleteTransaction,
      addCategory,
      setBudget,
      deleteBudget,
      updateSettings,
      resetAll,
    ]
  );

  return <FinanceContext.Provider value={value}>{children}</FinanceContext.Provider>;
}

export function useFinance(): FinanceContextValue {
  const ctx = useContext(FinanceContext);
  if (!ctx) throw new Error('useFinance must be used within a FinanceProvider');
  return ctx;
}
