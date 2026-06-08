import { useState } from 'react'
import type { ReactNode } from 'react'
import { Sidebar } from './Sidebar'
import { TopBar } from './TopBar'
import { cn } from '@/utils/cn'

interface AppShellProps {
  children: ReactNode
  pageTitle: string
  onAddTransaction: () => void
}

export const AppShell = ({ children, pageTitle, onAddTransaction }: AppShellProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-[var(--bg-base)]">
      <div className="hidden md:block">
        <Sidebar />
      </div>

      {sidebarOpen && (
        <div className="md:hidden">
          <div
            className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
          <Sidebar />
        </div>
      )}

      <div
        className={cn(
          'flex flex-col min-h-screen transition-all duration-300',
          'md:ml-[var(--sidebar-width)]'
        )}
      >
        <TopBar
          pageTitle={pageTitle}
          onAddTransaction={onAddTransaction}
          onToggleSidebar={() => setSidebarOpen((v) => !v)}
        />
        <main className="flex-1 p-6 animate-page-entry">{children}</main>
      </div>
    </div>
  )
}
