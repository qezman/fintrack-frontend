import type { Transaction, TransactionType, Category } from '@/types'

export interface FilterState {
  search: string
  type: TransactionType | 'all'
  category: Category | 'all'
  dateFrom: string
  dateTo: string
}

export const filterTransactions = (
  transactions: Transaction[],
  filters: FilterState
): Transaction[] => {
  return transactions.filter((t) => {
    const searchLower = filters.search.toLowerCase()
    if (
      filters.search &&
      !t.category.toLowerCase().includes(searchLower) &&
      !(t.note ?? '').toLowerCase().includes(searchLower)
    ) {
      return false
    }
    if (filters.type !== 'all' && t.type !== filters.type) return false
    if (filters.category !== 'all' && t.category !== filters.category) return false
    if (filters.dateFrom && t.date < filters.dateFrom) return false
    if (filters.dateTo && t.date > filters.dateTo) return false
    return true
  })
}

export const DEFAULT_FILTERS: FilterState = {
  search: '',
  type: 'all',
  category: 'all',
  dateFrom: '',
  dateTo: '',
}
