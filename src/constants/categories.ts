import type { Category, IncomeCategory, ExpenseCategory } from '@/types'

export const INCOME_CATEGORIES: IncomeCategory[] = [
  'Salary',
  'Freelance',
  'Investment',
  'Gift',
  'Other',
]

export const EXPENSE_CATEGORIES: ExpenseCategory[] = [
  'Food & Drink',
  'Transport',
  'Shopping',
  'Bills',
  'Health',
  'Entertainment',
  'Other',
]

export const CATEGORY_COLORS: Record<Category, string> = {
  'Food & Drink': '#58a6ff',
  'Transport': '#3fb950',
  'Shopping': '#d29922',
  'Bills': '#bc8cff',
  'Health': '#f0883e',
  'Entertainment': '#ec6547',
  'Salary': '#3fb950',
  'Freelance': '#58a6ff',
  'Investment': '#d29922',
  'Gift': '#bc8cff',
  'Other': '#8b949e',
}
