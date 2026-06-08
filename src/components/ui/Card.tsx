import { cn } from '@/utils/cn'
import type { ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  className?: string
}

export const Card = ({ children, className }: CardProps) => (
  <div
    className={cn(
      'rounded-xl border border-[var(--border)] bg-[var(--bg-surface)] p-6',
      className
    )}
  >
    {children}
  </div>
)
