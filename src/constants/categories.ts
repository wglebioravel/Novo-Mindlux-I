import { CategoryInfo } from '../types';

export const INCOME_CATEGORIES: CategoryInfo[] = [
  { key: 'salary', label: 'Salario', icon: 'briefcase', color: '#4CAF50' },
  { key: 'freelance', label: 'Freelance', icon: 'laptop', color: '#66BB6A' },
  { key: 'investments', label: 'Investimentos', icon: 'trending-up', color: '#43A047' },
  { key: 'gift', label: 'Presente', icon: 'gift', color: '#81C784' },
  { key: 'other_income', label: 'Outros', icon: 'plus-circle', color: '#A5D6A7' },
];

export const EXPENSE_CATEGORIES: CategoryInfo[] = [
  { key: 'food', label: 'Alimentacao', icon: 'coffee', color: '#FF7043' },
  { key: 'transport', label: 'Transporte', icon: 'truck', color: '#42A5F5' },
  { key: 'housing', label: 'Moradia', icon: 'home', color: '#AB47BC' },
  { key: 'health', label: 'Saude', icon: 'heart', color: '#EF5350' },
  { key: 'education', label: 'Educacao', icon: 'book', color: '#5C6BC0' },
  { key: 'entertainment', label: 'Lazer', icon: 'film', color: '#FFA726' },
  { key: 'shopping', label: 'Compras', icon: 'shopping-bag', color: '#EC407A' },
  { key: 'bills', label: 'Contas', icon: 'file-text', color: '#78909C' },
  { key: 'other_expense', label: 'Outros', icon: 'more-horizontal', color: '#BDBDBD' },
];

export const ALL_CATEGORIES: CategoryInfo[] = [...INCOME_CATEGORIES, ...EXPENSE_CATEGORIES];

export function getCategoryInfo(key: string): CategoryInfo {
  return ALL_CATEGORIES.find(c => c.key === key) || {
    key: 'unknown',
    label: 'Desconhecido',
    icon: 'help-circle',
    color: '#9E9E9E',
  };
}
