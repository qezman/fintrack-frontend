import { AppShell } from '@/components/layout/AppShell'
import { SummaryCard } from '@/components/dashboard/SummaryCard'
import { OverviewChart } from '@/components/dashboard/OverviewChart'
import { RecentTransactions } from '@/components/dashboard/RecentTransactions'
import { CategoryBreakdown } from '@/components/dashboard/CategoryBreakdown'
import { TransactionForm } from '@/components/transactions/TransactionForm'
import { Modal } from '@/components/ui/Modal'
import { useModal } from '@/hooks/useModal'
import { useSummary } from '@/hooks/useSummary'
import { useTransactions } from '@/hooks/useTransactions'

export const Dashboard = () => {
  const { summary, isLoading: summaryLoading, fetchSummary } = useSummary()
  const { transactions, isLoading: txnsLoading, fetchTransactions } = useTransactions()
  const { isOpen, open, close } = useModal()

  const handleTransactionSuccess = () => {
    close()
    void fetchTransactions()
    void fetchSummary()
  }

  return (
    <AppShell pageTitle="Dashboard" onAddTransaction={open}>
      <div className="max-w-[1200px] mx-auto space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <SummaryCard
            label="Total Balance"
            value={summary?.balance ?? 0}
            variant="neutral"
            isLoading={summaryLoading}
          />
          <SummaryCard
            label="Total Income"
            value={summary?.totalIncome ?? 0}
            variant="income"
            isLoading={summaryLoading}
          />
          <SummaryCard
            label="Total Expenses"
            value={summary?.totalExpenses ?? 0}
            variant="expense"
            isLoading={summaryLoading}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <OverviewChart transactions={transactions} />
          <CategoryBreakdown transactions={transactions} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <RecentTransactions transactions={transactions} isLoading={txnsLoading} />
        </div>
      </div>

      <Modal isOpen={isOpen} onClose={close} title="New Transaction">
        <TransactionForm onSuccess={handleTransactionSuccess} />
      </Modal>
    </AppShell>
  )
}
