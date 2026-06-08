export type TransactionType = 'income' | 'expense'

export type IncomeCategory =
  | 'Salary'
  | 'Freelance'
  | 'Investment'
  | 'Gift'
  | 'Other'

export type ExpenseCategory =
  | 'Food & Drink'
  | 'Transport'
  | 'Shopping'
  | 'Bills'
  | 'Health'
  | 'Entertainment'
  | 'Other'

export type Category = IncomeCategory | ExpenseCategory

export interface Transaction {
  id: string
  userId: string
  amount: number
  type: TransactionType
  category: Category
  date: string
  note: string | null
  receiptKey: string | null
  createdAt: string
}

export interface CreateTransactionPayload {
  amount: number
  type: TransactionType
  category: Category
  date: string
  note?: string
  receiptKey?: string
}

export interface Summary {
  totalIncome: number
  totalExpenses: number
  balance: number
}

export interface ChartDataPoint {
  date: string
  income: number
  expenses: number
}
