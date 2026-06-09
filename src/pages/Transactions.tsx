import { useState, useMemo, useEffect } from 'react'
import { Filter, Trash2, Receipt } from 'lucide-react'
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
  const [previewReceiptKey, setPreviewReceiptKey] = useState<string | null>(null)
  const { showToast } = useToast()

  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS)
  const [page, setPage] = useState(1)

  const filtered = useMemo(
    () => filterTransactions(transactions, filters).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
    [transactions, filters]
  )

  const itemsPerPage = 20
  const totalPages = Math.ceil(filtered.length / itemsPerPage)
  const paginated = useMemo(
    () => filtered.slice((page - 1) * itemsPerPage, page * itemsPerPage),
    [filtered, page]
  )

  useEffect(() => {
    setPage(1)
  }, [filters])

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
          <div className="flex flex-col md:flex-row gap-4 items-end">
            <div className="flex-1 w-full">
              <Input
                placeholder="Search notes or categories..."
                value={filters.search}
                onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value }))}
                leftAddon="⌕"
              />
            </div>
            
            <div className="w-full md:w-48">
              <Select
                options={[
                  { value: 'all', label: 'All Types' },
                  { value: 'income', label: 'Income' },
                  { value: 'expense', label: 'Expense' },
                ]}
                value={filters.type}
                onValueChange={(v) => setFilters((prev) => ({ ...prev, type: v as TransactionType | 'all' }))}
              />
            </div>

            <div className="w-full md:w-48">
              <Select
                options={[
                  { value: 'all', label: 'All Categories' },
                  ...ALL_CATEGORIES.map((c) => ({ value: c, label: c })),
                ]}
                value={filters.category}
                onValueChange={(v) => setFilters((prev) => ({ ...prev, category: v as Category | 'all' }))}
              />
            </div>

            <Button
              variant="ghost"
              className="w-full md:w-auto h-[42px]"
              onClick={() => setFilters(DEFAULT_FILTERS)}
            >
              <Filter size={16} />
              Reset
            </Button>
          </div>
        </Card>

        <Card className="p-0 overflow-hidden">
          {isLoading ? (
            <div className="p-8 animate-pulse space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-12 bg-[var(--bg-elevated)] rounded-lg" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <EmptyState
              icon="inbox"
              message="No transactions found"
              description="Try adjusting your filters or add a new transaction."
            />
          ) : (
            <div className="flex flex-col">
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-[var(--bg-elevated)]">
                    <tr>
                      <th className="px-5 py-4 text-xs font-medium uppercase tracking-widest text-[var(--text-secondary)] border-b border-[var(--border)]">Date</th>
                      <th className="px-5 py-4 text-xs font-medium uppercase tracking-widest text-[var(--text-secondary)] border-b border-[var(--border)]">Category</th>
                      <th className="px-5 py-4 text-xs font-medium uppercase tracking-widest text-[var(--text-secondary)] border-b border-[var(--border)]">Note</th>
                      <th className="px-5 py-4 text-xs font-medium uppercase tracking-widest text-[var(--text-secondary)] border-b border-[var(--border)] text-right">Type</th>
                      <th className="px-5 py-4 text-xs font-medium uppercase tracking-widest text-[var(--text-secondary)] border-b border-[var(--border)] text-right">Amount</th>
                      <th className="px-5 py-4 text-xs font-medium uppercase tracking-widest text-[var(--text-secondary)] border-b border-[var(--border)] w-16"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--border)]">
                    {paginated.map((txn) => {
                      const isIncome = txn.type === 'income'
                      return (
                        <tr key={txn.id} className="hover:bg-[var(--bg-elevated)] transition-colors group">
                          <td className="px-5 py-4 text-sm text-[var(--text-secondary)] whitespace-nowrap">{formatDate(txn.date)}</td>
                          <td className="px-5 py-4 text-sm font-medium text-[var(--text-primary)]">{txn.category}</td>
                          <td className="px-5 py-4 text-sm text-[var(--text-secondary)] max-w-[200px] truncate">{txn.note || '—'}</td>
                          <td className="px-5 py-4 text-right whitespace-nowrap"><Badge variant={isIncome ? 'income' : 'expense'}>{txn.type}</Badge></td>
                          <td className={`px-5 py-4 text-right font-mono text-sm whitespace-nowrap ${isIncome ? 'text-[var(--income)]' : 'text-[var(--expense)]'}`}>
                            {isIncome ? '+' : '−'}{formatCurrency(txn.amount)}
                          </td>
                          <td className="px-5 py-4 text-right whitespace-nowrap">
                            <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              {txn.receiptKey && (
                                <button onClick={() => setPreviewReceiptKey(txn.receiptKey!)} className="w-8 h-8 flex items-center justify-center rounded-lg text-[var(--neutral)] hover:bg-[var(--neutral-dim)] transition-colors" title="View Receipt">
                                  <Receipt size={14} />
                                </button>
                              )}
                              <button onClick={() => setDeleteId(txn.id)} className="w-8 h-8 flex items-center justify-center rounded-lg text-[var(--text-tertiary)] hover:bg-[var(--expense-dim)] hover:text-[var(--expense)] transition-colors" title="Delete">
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

              <div className="md:hidden flex flex-col divide-y divide-[var(--border)]">
                {paginated.map((txn) => {
                  const isIncome = txn.type === 'income'
                  return (
                    <div key={txn.id} className="flex items-center justify-between p-4 hover:bg-[var(--bg-elevated)] transition-colors">
                      <div className="flex flex-col gap-1 overflow-hidden">
                        <span className="text-sm font-medium text-[var(--text-primary)]">{txn.category}</span>
                        <span className="text-xs text-[var(--text-secondary)] truncate">{txn.note || '—'}</span>
                      </div>
                      <div className="flex flex-col items-end gap-1 shrink-0 ml-4">
                        <span className={`font-mono text-sm ${isIncome ? 'text-[var(--income)]' : 'text-[var(--expense)]'}`}>
                          {isIncome ? '+' : '−'}{formatCurrency(txn.amount)}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-[var(--text-tertiary)]">{formatDate(txn.date)}</span>
                          {txn.receiptKey && (
                            <button onClick={() => setPreviewReceiptKey(txn.receiptKey!)} className="text-[var(--neutral)] p-1 -m-1">
                              <Receipt size={12} />
                            </button>
                          )}
                          <button onClick={() => setDeleteId(txn.id)} className="text-[var(--expense)] p-1 -m-1">
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>

              {totalPages > 1 && (
                <div className="flex items-center justify-between px-5 py-4 border-t border-[var(--border)] bg-[var(--bg-surface)]">
                  <span className="text-sm text-[var(--text-secondary)]">
                    Showing {(page - 1) * itemsPerPage + 1} to {Math.min(page * itemsPerPage, filtered.length)} of {filtered.length}
                  </span>
                  <div className="flex gap-2">
                    <Button variant="ghost" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="py-1 px-3 h-auto">
                      Prev
                    </Button>
                    <Button variant="ghost" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="py-1 px-3 h-auto">
                      Next
                    </Button>
                  </div>
                </div>
              )}
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

      <Modal isOpen={!!previewReceiptKey} onClose={() => setPreviewReceiptKey(null)} title="Receipt Preview">
        <div className="p-4 flex items-center justify-center bg-[var(--bg-base)]">
          {previewReceiptKey && (
            <img 
              src={`${import.meta.env.VITE_API_URL}/uploads/${previewReceiptKey}`} 
              alt="Receipt Preview" 
              className="max-w-full max-h-[70vh] object-contain rounded-lg border border-[var(--border)] shadow-lg"
            />
          )}
        </div>
      </Modal>
    </AppShell>
  )
}
