import { TransactionType } from '../types';

export type RootStackParamList = {
  Tabs: undefined;
  AddTransaction: { transactionId?: string; type?: TransactionType } | undefined;
  ManageCategories: undefined;
};

export type TabParamList = {
  Dashboard: undefined;
  Transactions: undefined;
  Statistics: undefined;
  Budgets: undefined;
  Settings: undefined;
};
