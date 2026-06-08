import { Link } from 'react-router-dom'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Skeleton } from '@/components/ui/Skeleton'
import { EmptyState } from '@/components/ui/EmptyState'
import { formatCurrency } from '@/utils/formatCurrency'
import { formatDate } from '@/utils/formatDate'
import type { Transaction } from '@/types'

interface RecentTransactionsProps {
  transactions: Transaction[]
  isLoading: boolean
}

export const RecentTransactions = ({ transactions, isLoading }: RecentTransactionsProps) => {
  const recent = [...transactions]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5)

  return (
    <Card className="flex flex-col h-full col-span-1 lg:col-span-2">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-[var(--text-primary)]">Recent Transactions</h2>
        <Link
          to="/transactions"
          className="text-sm font-medium text-[var(--neutral)] hover:underline"
        >
          View all &rarr;
        </Link>
      </div>

      <div className="flex-1">
        {isLoading ? (
          <Skeleton rows={5} />
        ) : recent.length === 0 ? (
          <EmptyState
            icon="inbox"
            message="No transactions yet"
            description="Add your first transaction to see it here."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[var(--border)]">
                  <th className="pb-3 text-xs font-medium uppercase tracking-widest text-[var(--text-secondary)]">
                    Category
                  </th>
                  <th className="pb-3 text-xs font-medium uppercase tracking-widest text-[var(--text-secondary)]">
                    Note
                  </th>
                  <th className="pb-3 text-xs font-medium uppercase tracking-widest text-[var(--text-secondary)]">
                    Date
                  </th>
                  <th className="pb-3 text-xs font-medium uppercase tracking-widest text-[var(--text-secondary)] text-right">
                    Amount
                  </th>
                  <th className="pb-3 text-xs font-medium uppercase tracking-widest text-[var(--text-secondary)] text-right">
                    Type
                  </th>
                </tr>
              </thead>
              <tbody>
                {recent.map((txn) => {
                  const isIncome = txn.type === 'income'
                  return (
                    <tr
                      key={txn.id}
                      className="border-b border-[var(--border)] hover:bg-[var(--bg-elevated)] transition-colors group"
                    >
                      <td className="py-3.5 pr-4 text-sm text-[var(--text-primary)] font-medium">
                        {txn.category}
                      </td>
                      <td className="py-3.5 pr-4 text-sm text-[var(--text-secondary)] max-w-[150px] truncate">
                        {txn.note || '—'}
                      </td>
                      <td className="py-3.5 pr-4 text-sm text-[var(--text-secondary)]">
                        {formatDate(txn.date)}
                      </td>
                      <td
                        className={`py-3.5 pr-4 text-right font-mono text-sm ${
                          isIncome ? 'text-[var(--income)]' : 'text-[var(--expense)]'
                        }`}
                      >
                        {isIncome ? '+' : '−'}
                        {formatCurrency(txn.amount)}
                      </td>
                      <td className="py-3.5 text-right">
                        <Badge variant={isIncome ? 'income' : 'expense'}>{txn.type}</Badge>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Card>
  )
}
