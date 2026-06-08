import { Plus, Menu } from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/Button'

interface TopBarProps {
  onAddTransaction: () => void
  onToggleSidebar?: () => void
  pageTitle: string
}

export const TopBar = ({ onAddTransaction, onToggleSidebar, pageTitle }: TopBarProps) => {
  const { user } = useAuth()
  const [_menuOpen, _setMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between px-6 py-4 border-b border-[var(--border)] bg-[var(--bg-base)]/80 backdrop-blur-sm">
      <div className="flex items-center gap-3">
        {/* Mobile hamburger */}
        <button
          className="md:hidden w-9 h-9 flex items-center justify-center rounded-lg text-[var(--text-secondary)] hover:bg-[var(--bg-elevated)] transition-colors"
          onClick={onToggleSidebar}
        >
          <Menu size={18} />
        </button>
        <h1 className="text-lg font-semibold text-[var(--text-primary)] tracking-tight">
          {pageTitle}
        </h1>
      </div>

      <div className="flex items-center gap-3">
        {user && (
          <span className="hidden sm:block text-sm text-[var(--text-secondary)]">
            Hi, {user.name.split(' ')[0]}
          </span>
        )}
        <Button variant="primary" onClick={onAddTransaction} className="gap-1.5">
          <Plus size={16} strokeWidth={2.5} />
          <span>Add Transaction</span>
        </Button>
      </div>
    </header>
  )
}
