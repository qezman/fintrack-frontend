import { Card } from '@/components/ui/Card'
import { CounterValue } from '@/components/ui/CounterValue'
import { Skeleton } from '@/components/ui/Skeleton'

interface SummaryCardProps {
  label: string
  value: number
  variant: 'income' | 'expense' | 'neutral'
  isLoading?: boolean
}

const variantStyles: Record<'income' | 'expense' | 'neutral', string> = {
  income: 'border-l-[3px] border-l-[var(--income)]',
  expense: 'border-l-[3px] border-l-[var(--expense)]',
  neutral: 'border-l-[3px] border-l-[var(--neutral)]',
}

const valueColors: Record<'income' | 'expense' | 'neutral', string> = {
  income: 'text-[var(--income)]',
  expense: 'text-[var(--expense)]',
  neutral: 'text-[var(--neutral)]',
}

export const SummaryCard = ({ label, value, variant, isLoading }: SummaryCardProps) => {
  const isNegativeBalance = variant === 'neutral' && value < 0
  const valueColorClass = isNegativeBalance ? 'text-[var(--expense)]' : valueColors[variant]

  return (
    <Card className={`p-5 ${variantStyles[variant]}`}>
      {isLoading ? (
        <div className="space-y-3">
          <Skeleton rows={1} className="w-2/5 h-3" />
          <Skeleton rows={1} className="w-3/4 h-8" />
        </div>
      ) : (
        <div className="space-y-2">
          <p className="text-[11px] font-medium uppercase tracking-[0.06em] text-[var(--text-secondary)]">
            {label}
          </p>
          <div className={`font-mono text-2xl font-medium ${valueColorClass}`}>
            <CounterValue value={value} duration={1000} />
          </div>
        </div>
      )}
    </Card>
  )
}
