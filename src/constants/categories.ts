import { Category } from '../types';

export const DEFAULT_CATEGORIES: Category[] = [
  { id: 'food', name: 'Alimentation', icon: 'restaurant', color: '#F97316', type: 'expense' },
  { id: 'transport', name: 'Transport', icon: 'car', color: '#0EA5E9', type: 'expense' },
  { id: 'housing', name: 'Logement', icon: 'home', color: '#8B5CF6', type: 'expense' },
  { id: 'leisure', name: 'Loisirs', icon: 'game-controller', color: '#EC4899', type: 'expense' },
  { id: 'health', name: 'Santé', icon: 'medkit', color: '#22C55E', type: 'expense' },
  { id: 'shopping', name: 'Shopping', icon: 'bag', color: '#F43F5E', type: 'expense' },
  { id: 'bills', name: 'Factures', icon: 'receipt', color: '#EAB308', type: 'expense' },
  { id: 'education', name: 'Éducation', icon: 'school', color: '#3B82F6', type: 'expense' },
  { id: 'other-expense', name: 'Autres', icon: 'ellipsis-horizontal-circle', color: '#64748B', type: 'expense' },
  { id: 'salary', name: 'Salaire', icon: 'cash', color: '#34D399', type: 'income' },
  { id: 'freelance', name: 'Freelance', icon: 'briefcase', color: '#38BDF8', type: 'income' },
  { id: 'investment', name: 'Investissement', icon: 'trending-up', color: '#A78BFA', type: 'income' },
  { id: 'gift', name: 'Cadeau', icon: 'gift', color: '#FB923C', type: 'income' },
  { id: 'other-income', name: 'Autres revenus', icon: 'add-circle', color: '#94A3B8', type: 'income' },
];

export function getCategoryById(categories: Category[], id: string): Category {
  return (
    categories.find((c) => c.id === id) ??
    categories[categories.length - 1] ?? {
      id: 'unknown',
      name: 'Autre',
      icon: 'help-circle',
      color: '#64748B',
      type: 'expense',
    }
  );
}
