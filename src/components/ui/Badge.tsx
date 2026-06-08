import { cn } from '@/utils/cn'
import type { BadgeVariant } from '@/types'

interface BadgeProps {
  variant: BadgeVariant
  children: React.ReactNode
  className?: string
}

const variantMap: Record<BadgeVariant, string> = {
  income: 'bg-[var(--income-dim)] text-[var(--income)]',
  expense: 'bg-[var(--expense-dim)] text-[var(--expense)]',
  neutral: 'bg-[var(--neutral-dim)] text-[var(--neutral)]',
}

export const Badge = ({ variant, children, className }: BadgeProps) => (
  <span
    className={cn(
      'inline-flex items-center rounded px-2 py-0.5 text-[11px] font-medium uppercase tracking-[0.06em]',
      variantMap[variant],
      className
    )}
  >
    {children}
  </span>
)
