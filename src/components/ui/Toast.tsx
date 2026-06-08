import { CheckCircle2, XCircle, Info, X } from 'lucide-react'
import type { Toast as ToastType } from '@/types'
import { cn } from '@/utils/cn'

interface ToastItemProps {
  toast: ToastType
  onDismiss: (id: string) => void
}

const iconMap = {
  success: CheckCircle2,
  error: XCircle,
  info: Info,
}

const colorMap = {
  success: 'border-[var(--income)] text-[var(--income)]',
  error: 'border-[var(--expense)] text-[var(--expense)]',
  info: 'border-[var(--neutral)] text-[var(--neutral)]',
}

const ToastItem = ({ toast, onDismiss }: ToastItemProps) => {
  const Icon = iconMap[toast.variant]
  return (
    <div
      className={cn(
        'flex items-center gap-3 min-w-[280px] max-w-sm bg-[var(--bg-elevated)] border rounded-xl px-4 py-3 shadow-xl animate-toast-entry',
        colorMap[toast.variant]
      )}
    >
      <Icon size={16} className="shrink-0" />
      <p className="flex-1 text-sm text-[var(--text-primary)] font-medium">{toast.message}</p>
      <button
        onClick={() => onDismiss(toast.id)}
        className="text-[var(--text-tertiary)] hover:text-[var(--text-secondary)] transition-colors"
      >
        <X size={14} />
      </button>
    </div>
  )
}

interface ToastContainerProps {
  toasts: ToastType[]
  onDismiss: (id: string) => void
}

export const ToastContainer = ({ toasts, onDismiss }: ToastContainerProps) => (
  <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-2">
    {toasts.map((t) => (
      <ToastItem key={t.id} toast={t} onDismiss={onDismiss} />
    ))}
  </div>
)
