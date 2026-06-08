import { cn } from '@/utils/cn'

interface SkeletonProps {
  className?: string
}

const SkeletonBlock = ({ className }: SkeletonProps) => (
  <div className={cn('animate-shimmer rounded-md h-4', className)} />
)

export const Skeleton = ({ rows = 3, className }: { rows?: number; className?: string }) => (
  <div className={cn('space-y-3', className)}>
    {Array.from({ length: rows }).map((_, i) => (
      <div key={i} className="space-y-2">
        <SkeletonBlock className={i % 2 === 0 ? 'w-3/4' : 'w-1/2'} />
      </div>
    ))}
  </div>
)

export const SkeletonCard = ({ className }: SkeletonProps) => (
  <div className={cn('rounded-xl border border-[var(--border)] bg-[var(--bg-surface)] p-6 space-y-4', className)}>
    <SkeletonBlock className="w-1/3 h-3" />
    <SkeletonBlock className="w-2/3 h-8" />
  </div>
)
