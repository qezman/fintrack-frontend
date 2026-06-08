import { useState, useMemo } from 'react'
import { Search, Filter, Trash2, Receipt } from 'lucide-react'
import { AppShell } from '@/components/layout/AppShell'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { EmptyState } from '@/components/ui/EmptyState'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { Modal } from '@/components/ui/Modal'
import { TransactionForm } from '@/components/transactions/TransactionForm'
import { useTransactions } from '@/hooks/useTransactions'
import { useModal } from '@/hooks/useModal'
import { useToast } from '@/hooks/useToast'
import { filterTransactions, DEFAULT_FILTERS } from '@/utils/filterTransactions'
import type { FilterState } from '@/utils/filterTransactions'
import { INCOME_CATEGORIES, EXPENSE_CATEGORIES } from '@/constants/categories'
import { formatCurrency } from '@/utils/formatCurrency'
import { formatDate } from '@/utils/formatDate'
import type { Category, TransactionType } from '@/types'

const ALL_CATEGORIES = [...new Set([...INCOME_CATEGORIES, ...EXPENSE_CATEGORIES])]

export const Transactions = () => {
  const { transactions, isLoading, deleteTransaction, fetchTransactions } = useTransactions()
  const { isOpen: isAddOpen, open: openAdd, close: closeAdd } = useModal()
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const { showToast } = useToast()

  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS)

  const filtered = useMemo(
    () => filterTransactions(transactions, filters).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
    [transactions, filters]
  )

  const handleDelete = async () => {
    if (!deleteId) return
    setIsDeleting(true)
    try {
      await deleteTransaction(deleteId)
      showToast('Transaction deleted', 'success')
    } catch {
      showToast('Failed to delete transaction', 'error')
    } finally {
      setIsDeleting(false)
      setDeleteId(null)
    }
  }

  const handleTransactionSuccess = () => {
    closeAdd()
    void fetchTransactions()
  }

  return (
    <AppShell pageTitle="Transactions" onAddTransaction={openAdd}>
      <div className="max-w-[1200px] mx-auto space-y-6">
        <Card className="p-4">
          <div className="flex flex-col lg:flex-row gap-4 items-end">
            <div className="flex-1 w-full relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-[var(--text-tertiary)]" />
              <Input
                placeholder="Search notes or categories..."
                value={filters.search}
                onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value }))}
                className="pl-9"
              />
            </div>
            
            <div className="w-full lg:w-48">
              <Select
                options={[
                  { value: 'all', label: 'All Types' },
                  { value: 'income', label: 'Income' },
                  { value: 'expense', label: 'Expense' },
                ]}
                value={filters.type}
                onChange={(e) => setFilters((prev) => ({ ...prev, type: e.target.value as TransactionType | 'all' }))}
              />
            </div>

            <div className="w-full lg:w-48">
              <Select
                options={[
                  { value: 'all', label: 'All Categories' },
                  ...ALL_CATEGORIES.map((c) => ({ value: c, label: c })),
                ]}
                value={filters.category}
                onChange={(e) => setFilters((prev) => ({ ...prev, category: e.target.value as Category | 'all' }))}
              />
            </div>

            <Button
              variant="ghost"
              className="w-full lg:w-auto h-[42px]"
              onClick={() => setFilters(DEFAULT_FILTERS)}
            >
              <Filter size={16} />
              Reset
            </Button>
          </div>
        </Card>

        <Card className="p-0 overflow-hidden">
          {isLoading ? (
            <div className="p-8">
              <div className="animate-pulse space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="h-12 bg-[var(--bg-elevated)] rounded-lg" />
                ))}
              </div>
            </div>
          ) : filtered.length === 0 ? (
            <EmptyState
              icon="inbox"
              message="No transactions found"
              description="Try adjusting your filters or add a new transaction."
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-[var(--bg-elevated)]">
                  <tr>
                    <th className="px-5 py-4 text-xs font-medium uppercase tracking-widest text-[var(--text-secondary)] border-b border-[var(--border)]">
                      Date
                    </th>
                    <th className="px-5 py-4 text-xs font-medium uppercase tracking-widest text-[var(--text-secondary)] border-b border-[var(--border)]">
                      Category
                    </th>
                    <th className="px-5 py-4 text-xs font-medium uppercase tracking-widest text-[var(--text-secondary)] border-b border-[var(--border)]">
                      Note
                    </th>
                    <th className="px-5 py-4 text-xs font-medium uppercase tracking-widest text-[var(--text-secondary)] border-b border-[var(--border)] text-right">
                      Type
                    </th>
                    <th className="px-5 py-4 text-xs font-medium uppercase tracking-widest text-[var(--text-secondary)] border-b border-[var(--border)] text-right">
                      Amount
                    </th>
                    <th className="px-5 py-4 text-xs font-medium uppercase tracking-widest text-[var(--text-secondary)] border-b border-[var(--border)] w-16">
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border)]">
                  {filtered.map((txn) => {
                    const isIncome = txn.type === 'income'
                    return (
                      <tr
                        key={txn.id}
                        className="hover:bg-[var(--bg-elevated)] transition-colors group row-actions-trigger"
                      >
                        <td className="px-5 py-4 text-sm text-[var(--text-secondary)] whitespace-nowrap">
                          {formatDate(txn.date)}
                        </td>
                        <td className="px-5 py-4 text-sm font-medium text-[var(--text-primary)]">
                          {txn.category}
                        </td>
                        <td className="px-5 py-4 text-sm text-[var(--text-secondary)] max-w-[200px] truncate">
                          {txn.note || '—'}
                        </td>
                        <td className="px-5 py-4 text-right whitespace-nowrap">
                          <Badge variant={isIncome ? 'income' : 'expense'}>{txn.type}</Badge>
                        </td>
                        <td
                          className={`px-5 py-4 text-right font-mono text-sm whitespace-nowrap ${
                            isIncome ? 'text-[var(--income)]' : 'text-[var(--expense)]'
                          }`}
                        >
                          {isIncome ? '+' : '−'}
                          {formatCurrency(txn.amount)}
                        </td>
                        <td className="px-5 py-4 text-right whitespace-nowrap">
                          <div className="flex justify-end gap-2">
                            {txn.receiptKey && (
                              <button
                                className="w-8 h-8 flex items-center justify-center rounded-lg text-[var(--text-tertiary)] hover:bg-[var(--bg-input)] hover:text-[var(--neutral)] transition-colors row-action-btn"
                                title="Has receipt"
                              >
                                <Receipt size={14} />
                              </button>
                            )}
                            <button
                              onClick={() => setDeleteId(txn.id)}
                              className="w-8 h-8 flex items-center justify-center rounded-lg text-[var(--text-tertiary)] hover:bg-[var(--expense-dim)] hover:text-[var(--expense)] transition-colors row-action-btn"
                              title="Delete"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </Card>

      </div>

      <Modal isOpen={isAddOpen} onClose={closeAdd} title="New Transaction">
        <TransactionForm onSuccess={handleTransactionSuccess} />
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteId}
        title="Delete Transaction"
        message="Are you sure you want to delete this transaction? This action cannot be undone."
        confirmLabel="Delete"
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
        isLoading={isDeleting}
      />
    </AppShell>
  )
}
