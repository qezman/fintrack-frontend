import { Plus, Menu } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/Button'

interface TopBarProps {
  onAddTransaction: () => void
  onToggleSidebar?: () => void
  pageTitle: string
}

export const TopBar = ({ onAddTransaction, onToggleSidebar, pageTitle }: TopBarProps) => {
  const { user } = useAuth()

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between px-6 py-4 glass-panel border-l-0 border-t-0 border-r-0">
      <div className="flex items-center gap-4">
        <button
          className="md:hidden w-10 h-10 flex items-center justify-center rounded-xl text-[var(--text-secondary)] hover:bg-[var(--bg-input)] hover:text-white transition-colors"
          onClick={onToggleSidebar}
        >
          <Menu size={20} />
        </button>
        <h1 className="text-xl font-heading font-semibold text-white tracking-tight">
          {pageTitle}
        </h1>
      </div>

      <div className="flex items-center gap-4">
        {user && (
          <span className="hidden sm:block text-sm font-medium text-[var(--text-secondary)]">
            Hi, {user.name.split(' ')[0]}
          </span>
        )}
        <Button variant="primary" onClick={onAddTransaction} className="gap-2 shadow-lg">
          <Plus size={18} strokeWidth={2.5} />
          <span className="hidden sm:inline">Add Transaction</span>
          <span className="sm:hidden">Add</span>
        </Button>
      </div>
    </header>
  )
}
