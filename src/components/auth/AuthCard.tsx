import type { ReactNode } from 'react'
import { TrendingUp } from 'lucide-react'

interface AuthCardProps {
  title: string
  subtitle: string
  children: ReactNode
}

export const AuthCard = ({ title, subtitle, children }: AuthCardProps) => (
  <div className="min-h-screen bg-[var(--bg-base)] bg-dot-grid flex items-center justify-center px-4 py-12">
    <div className="w-full max-w-md">
      {/* Logo */}
      <div className="flex items-center gap-2.5 justify-center mb-8">
        <div className="w-9 h-9 rounded-xl bg-[var(--neutral)] flex items-center justify-center shadow-lg shadow-[rgba(88,166,255,0.25)]">
          <TrendingUp size={18} className="text-black" strokeWidth={2.5} />
        </div>
        <span className="text-xl font-semibold text-[var(--text-primary)] tracking-tight">
          FinTrack
        </span>
      </div>

      {/* Card */}
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-surface)] shadow-xl p-8">
        <div className="mb-7">
          <h1 className="text-2xl font-semibold text-[var(--text-primary)] tracking-tight">
            {title}
          </h1>
          <p className="mt-1.5 text-sm text-[var(--text-secondary)]">{subtitle}</p>
        </div>
        {children}
      </div>
    </div>
  </div>
)
