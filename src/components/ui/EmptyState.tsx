import { Inbox, AlertCircle } from 'lucide-react'

interface EmptyStateProps {
  icon?: 'inbox' | 'alert'
  message: string
  description?: string
  action?: React.ReactNode
}

export const EmptyState = ({ icon = 'inbox', message, description, action }: EmptyStateProps) => {
  const Icon = icon === 'alert' ? AlertCircle : Inbox
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
      <Icon className="w-10 h-10 text-[var(--text-tertiary)]" strokeWidth={1.5} />
      <p className="text-[var(--text-secondary)] font-medium text-sm">{message}</p>
      {description && <p className="text-[var(--text-tertiary)] text-xs max-w-xs">{description}</p>}
      {action && <div className="mt-2">{action}</div>}
    </div>
  )
}
