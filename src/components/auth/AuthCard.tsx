import { Wallet } from 'lucide-react'
import type { ReactNode } from 'react'

interface AuthCardProps {
  title: string
  subtitle: string
  children: ReactNode
}

export const AuthCard = ({ title, subtitle, children }: AuthCardProps) => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 animate-page-entry relative">
      <div className="w-full max-w-[420px] glass-panel rounded-2xl p-6 sm:p-8 relative overflow-hidden">
        
        {/* Subtle inner top glow for the glass card */}
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[rgba(255,255,255,0.2)] to-transparent" />
        
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 bg-[var(--bg-input)] rounded-2xl flex items-center justify-center mb-5 border border-[var(--border)]">
            <Wallet size={28} className="text-[var(--neutral)]" />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight text-white mb-1.5 text-center">
            {title}
          </h1>
          <p className="text-[15px] text-[var(--text-secondary)] text-center">
            {subtitle}
          </p>
        </div>
        {children}
      </div>
    </div>
  )
}
